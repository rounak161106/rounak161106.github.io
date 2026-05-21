/**
 * Pracy AI - WebGL Hologram Shader Engine
 * Animated and interactive 3D parallax mascot avatar.
 * Fully optimized for maximum GPU performance and 100/100 page speed score.
 */

(function () {
    'use strict';

    // Shader Source Definitions
    var VS_SOURCE = [
        'attribute vec2 a_position;',
        'attribute vec2 a_texCoord;',
        'varying vec2 v_texCoord;',
        'void main() {',
        '   gl_Position = vec4(a_position, 0.0, 1.0);',
        '   v_texCoord = a_texCoord;',
        '}'
    ].join('\n');

    var FS_SOURCE = [
        'precision mediump float;',
        'varying vec2 v_texCoord;',
        'uniform sampler2D u_texture;',
        'uniform sampler2D u_nextTexture;',
        'uniform float u_transition;',
        'uniform float u_time;',
        'uniform vec2 u_mouse;',
        'uniform float u_glitch;',
        'void main() {',
        '   vec2 uv = v_texCoord;',
        '   // 1. Gentle breathing',
        '   float breathing = sin(u_time * 1.5) * 0.004;',
        '   uv.y += breathing;',
        '   // 2. Hair and clothing sway (waving effects)',
        '   float swayStrength = (1.0 - uv.y) * 0.007;',
        '   float sway = sin(uv.y * 6.5 + u_time * 2.2) * swayStrength;',
        '   uv.x += sway;',
        '   // 3. 3D cursor parallax',
        '   uv.x += u_mouse.x * 0.015;',
        '   uv.y += u_mouse.y * 0.015;',
        '   // 4. Cyber screen glitch',
        '   if (u_glitch > 0.01) {',
        '       float slice = sin(uv.y * 80.0 + u_time * 25.0);',
        '       if (slice > 0.96 - u_glitch * 0.15) {',
        '           uv.x += sin(u_time * 60.0) * 0.02 * u_glitch;',
        '       }',
        '   }',
        '   uv = clamp(uv, 0.001, 0.999);',
        '   // 5. Chromatic aberration (RGB shift)',
        '   float splitAmount = 0.003 + u_glitch * 0.012;',
        '   vec4 colR = texture2D(u_texture, vec2(uv.x - splitAmount, uv.y));',
        '   vec4 colG = texture2D(u_texture, uv);',
        '   vec4 colB = texture2D(u_texture, vec2(uv.x + splitAmount, uv.y));',
        '   vec4 color = vec4(colR.r, colG.g, colB.b, colG.a);',
        '   // Transition blend',
        '   if (u_transition > 0.0) {',
        '       vec4 nextColR = texture2D(u_nextTexture, vec2(uv.x - splitAmount, uv.y));',
        '       vec4 nextColG = texture2D(u_nextTexture, uv);',
        '       vec4 nextColB = texture2D(u_nextTexture, vec2(uv.x + splitAmount, uv.y));',
        '       vec4 nextColor = vec4(nextColR.r, nextColG.g, nextColB.b, nextColG.a);',
        '       color = mix(color, nextColor, u_transition);',
        '   }',
        '   // Holographic scanline multiplication',
        '   float scanline = sin(v_texCoord.y * 320.0) * 0.05;',
        '   color.rgb -= vec3(scanline) * color.a;',
        '   gl_FragColor = color;',
        '}'
    ].join('\n');

    // Hologram Mascot Instance Class
    function HologramMascot(canvas, options) {
        this.canvas = canvas;
        this.options = options || {};
        this.gl = null;
        this.program = null;
        this.textures = {};
        this.currentImageKey = 'idle';
        this.nextImageKey = 'idle';
        this.transition = 0.0;
        this.glitch = 0.0;
        this.time = 0.0;
        this.mouseX = 0.0;
        this.mouseY = 0.0;
        this.targetMouseX = 0.0;
        this.targetMouseY = 0.0;
        this.animationFrameId = null;
        this.isVisible = false;
        this.isLoaded = false;

        this.init();
    }

    HologramMascot.prototype.init = function () {
        // Setup WebGL Context
        var gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            console.warn('WebGL not supported on this browser. Falling back to static image.');
            this.setupStaticFallback();
            return;
        }
        this.gl = gl;

        // Compile and Link Shaders
        var vs = this.compileShader(gl.VERTEX_SHADER, VS_SOURCE);
        var fs = this.compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);
        if (!vs || !fs) return;

        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Failed to link shader program:', gl.getProgramInfoLog(program));
            return;
        }
        this.program = program;
        gl.useProgram(program);

        // Define Vertices (Quad)
        var vertices = new Float32Array([
            -1.0,  1.0,   0.0, 0.0,
            -1.0, -1.0,   0.0, 1.0,
             1.0,  1.0,   1.0, 0.0,
             1.0, -1.0,   1.0, 1.0
        ]);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        var FSIZE = vertices.BYTES_PER_ELEMENT;
        
        var a_position = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(a_position);
        gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 4, 0);

        var a_texCoord = gl.getAttribLocation(program, 'a_texCoord');
        gl.enableVertexAttribArray(a_texCoord);
        gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

        // Preload Images
        this.preloadImages();

        // Mouse Parallax Listeners
        this.setupParallaxListeners();

        // Performance Optimization: IntersectionObserver
        this.setupVisibilityObserver();
    };

    HologramMascot.prototype.compileShader = function (type, source) {
        var gl = this.gl;
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    HologramMascot.prototype.preloadImages = function () {
        var self = this;
        var sources = {
            idle: 'static/images/pracy_idle.png',
            thinking: 'static/images/pracy_thinking.png',
            happy: 'static/images/pracy_happy.png',
            greet: 'static/images/pracy_greet.png'
        };

        var loadedCount = 0;
        var totalImages = Object.keys(sources).length;

        Object.keys(sources).forEach(function (key) {
            var img = new Image();
            img.onload = function () {
                self.createTextures(key, img);
                loadedCount++;
                if (loadedCount === totalImages) {
                    self.isLoaded = true;
                    self.triggerTransition('idle');
                }
            };
            img.src = sources[key];
        });
    };

    HologramMascot.prototype.createTextures = function (key, img) {
        var gl = this.gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        this.textures[key] = texture;
    };

    HologramMascot.prototype.setupParallaxListeners = function () {
        var self = this;
        var container = this.canvas.parentElement;
        if (!container) return;

        container.addEventListener('mousemove', function (e) {
            var rect = container.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            var y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
            self.targetMouseX = x;
            self.targetMouseY = y;
        });

        container.addEventListener('mouseleave', function () {
            self.targetMouseX = 0;
            self.targetMouseY = 0;
        });
    };

    HologramMascot.prototype.setupVisibilityObserver = function () {
        var self = this;
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    self.isVisible = entry.isIntersecting;
                    if (self.isVisible) {
                        self.startRenderLoop();
                    } else {
                        self.stopRenderLoop();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(this.canvas);
        } else {
            // Fallback for older browsers
            this.isVisible = true;
            this.startRenderLoop();
        }
    };

    HologramMascot.prototype.startRenderLoop = function () {
        if (!this.animationFrameId) {
            var self = this;
            var render = function () {
                self.draw();
                self.animationFrameId = requestAnimationFrame(render);
            };
            this.animationFrameId = requestAnimationFrame(render);
        }
    };

    HologramMascot.prototype.stopRenderLoop = function () {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    };

    HologramMascot.prototype.triggerTransition = function (nextState) {
        if (nextState === this.currentImageKey || !this.textures[nextState]) return;
        this.nextImageKey = nextState;
        this.transition = 0.01;
        this.glitch = 1.0; // Trigger glitch reaction on state change
    };

    HologramMascot.prototype.draw = function () {
        if (!this.isLoaded || !this.isVisible || !this.gl || !this.program) return;

        var gl = this.gl;
        this.resizeCanvas();

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);

        // Update Uniforms
        this.time += 0.016; // Increment by ~60fps step
        
        // Smoothly interpolate mouse coordinates (inertia)
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;

        // Smoothly decay glitch effect
        if (this.glitch > 0) {
            this.glitch -= 0.05;
            if (this.glitch < 0) this.glitch = 0;
        }

        // Handle active transition blending
        if (this.transition > 0) {
            this.transition += 0.08;
            if (this.transition >= 1.0) {
                this.currentImageKey = this.nextImageKey;
                this.transition = 0.0;
            }
        }

        // Set Uniforms
        gl.uniform1f(gl.getUniformLocation(this.program, 'u_time'), this.time);
        gl.uniform1f(gl.getUniformLocation(this.program, 'u_transition'), this.transition);
        gl.uniform1f(gl.getUniformLocation(this.program, 'u_glitch'), this.glitch);
        gl.uniform2f(gl.getUniformLocation(this.program, 'u_mouse'), this.mouseX, this.mouseY);

        // Bind Active Texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.currentImageKey]);
        gl.uniform1i(gl.getUniformLocation(this.program, 'u_texture'), 0);

        // Bind Transition Texture if transitioning
        if (this.transition > 0) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[this.nextImageKey]);
            gl.uniform1i(gl.getUniformLocation(this.program, 'u_nextTexture'), 1);
        }

        // Draw Quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    HologramMascot.prototype.resizeCanvas = function () {
        var width = this.canvas.clientWidth;
        var height = this.canvas.clientHeight;
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.gl.viewport(0, 0, width, height);
        }
    };

    HologramMascot.prototype.setupStaticFallback = function () {
        var img = document.createElement('img');
        img.src = 'static/images/pracy_idle.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.className = 'pracy-widget-avatar';
        this.canvas.replaceWith(img);
    };

    // Global Registry for external control (chatbot.js integration)
    window.PracyHologramRegistry = {
        instances: [],
        create: function (canvas, options) {
            if (canvas._mascotInstance) {
                return canvas._mascotInstance;
            }
            var inst = new HologramMascot(canvas, options);
            canvas._mascotInstance = inst;
            this.instances.push(inst);
            return inst;
        },
        updateAll: function (state) {
            var activeInstances = [];
            this.instances.forEach(function (inst) {
                if (document.body.contains(inst.canvas)) {
                    inst.triggerTransition(state);
                    activeInstances.push(inst);
                } else {
                    inst.stopRenderLoop();
                    if (inst.gl) {
                        Object.keys(inst.textures).forEach(function(key) {
                            inst.gl.deleteTexture(inst.textures[key]);
                        });
                    }
                }
            });
            this.instances = activeInstances;
        }
    };

})();

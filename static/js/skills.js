/* ================================================================
   SKILLS SECTION — Bento Grid Interactive JS v3
   Includes:
   1. Interactive 3D tilt and boundary spotlight on Bento cards
   2. Neural Network Canvas animation inside the ML hero card
   ================================================================ */
(function () {
    'use strict';

    /* ── 1. Bento Card Hover Spotlight & Tilt ── */
    function initBentoInteractions() {
        var cards = document.querySelectorAll('.bento-card');
        
        cards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                
                // Update CSS variables for the radial spotlight pseudo-element
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
                
                // Subtle 3D tilt effect
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -3; // max 3 deg
                var rotateY = ((x - centerX) / centerX) * 3;
                
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    /* ── 2. Neural Net Canvas (AI & ML Hero Card) ── */
    function initNeuralCanvas() {
        var canvas = document.getElementById('bentoMlCanvas');
        if (!canvas) return;
        
        var ctx = canvas.getContext('2d');
        var parent = canvas.parentElement;
        var particles = [];
        var maxDistance = 110;
        var animFrame;
        var isVisible = false;

        function resize() {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }

        // Init observer to pause animation when offscreen
        var io = new IntersectionObserver(function(entries) {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animFrame) {
                tick();
            } else if (!isVisible && animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
        });
        io.observe(parent);

        function rand(min, max) { return Math.random() * (max - min) + min; }

        function createParticle() {
            return {
                x: rand(0, canvas.width),
                y: rand(0, canvas.height),
                vx: rand(-0.4, 0.4),
                vy: rand(-0.4, 0.4),
                r: rand(1.5, 3)
            };
        }

        function initParticles() {
            resize();
            particles = [];
            var count = Math.min(45, (canvas.width * canvas.height) / 8000);
            for (var i = 0; i < count; i++) {
                particles.push(createParticle());
            }
        }

        var mouse = { x: -999, y: -999 };
        parent.addEventListener('mousemove', function(e) {
            var rect = parent.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        parent.addEventListener('mouseleave', function() {
            mouse.x = -999; 
            mouse.y = -999;
        });

        function tick() {
            if (!isVisible) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw lines
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        var alpha = (1 - dist / maxDistance) * 0.25;
                        ctx.strokeStyle = 'rgba(167, 139, 250, ' + alpha + ')'; // a78bfa
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw and update particles
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                
                // Mouse interaction
                if (mouse.x !== -999) {
                    var mdx = p.x - mouse.x;
                    var mdy = p.y - mouse.y;
                    var md = Math.sqrt(mdx*mdx + mdy*mdy);
                    if (md < 100) {
                        var thrust = (100 - md) / 100 * 0.05;
                        p.vx += (mdx / md) * thrust;
                        p.vy += (mdy / md) * thrust;
                    }
                }

                // Friction
                p.vx *= 0.99;
                p.vy *= 0.99;
                
                // Speed limit
                var speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                if (speed > 1.5) {
                    p.vx = (p.vx / speed) * 1.5;
                    p.vy = (p.vy / speed) * 1.5;
                } else if (speed < 0.2) {
                    p.vx += (Math.random() - 0.5) * 0.1;
                    p.vy += (Math.random() - 0.5) * 0.1;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                p.x = Math.max(0, Math.min(canvas.width, p.x));
                p.y = Math.max(0, Math.min(canvas.height, p.y));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(192, 132, 252, 0.7)'; // c084fc
                ctx.fill();
            }
            
            animFrame = requestAnimationFrame(tick);
        }

        window.addEventListener('resize', initParticles);
        initParticles();
    }

    /* ── Init ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initBentoInteractions();
            initNeuralCanvas();
        });
    } else {
        initBentoInteractions();
        initNeuralCanvas();
    }

})();

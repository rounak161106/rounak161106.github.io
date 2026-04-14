/* ================================================================
   SKILLS SECTION — World-Class JS
   Live canvas particle field, chip entrance animations,
   per-chip aurora glow tracking, magnetic hover, spin rings.
   ================================================================ */
(function () {
    'use strict';

    // ── Wait for DOM ─────────────────────────────────────────────
    function init() {
        setupTabs();
        setupChipGlow();
        spawnSkillCanvas();
        enterChips(document.querySelector('.sk-panel.active'));
        setupAuroraTracking();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ── Tab switching ────────────────────────────────────────────
    function setupTabs() {
        var tabs   = document.querySelectorAll('.sk-tab');
        var panels = document.querySelectorAll('.sk-panel');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var cat = tab.getAttribute('data-cat');

                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');

                panels.forEach(function (p) {
                    p.classList.remove('active');
                    // reset chip entrance state when hiding
                    p.querySelectorAll('.sk-chip').forEach(function (c) {
                        c.classList.remove('entered');
                    });
                });

                var target = document.querySelector('.sk-panel[data-cat="' + cat + '"]');
                if (target) {
                    target.classList.add('active');
                    enterChips(target);
                }

                if (typeof AOS !== 'undefined') AOS.refresh();
            });
        });
    }

    // ── Staggered entrance animation per panel ───────────────────
    function enterChips(panel) {
        if (!panel) return;
        var chips = panel.querySelectorAll('.sk-chip');
        chips.forEach(function (chip, i) {
            chip.style.transitionDelay = (i * 40) + 'ms';
            // Force reflow so the transform/opacity reset takes effect
            chip.classList.remove('entered');
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    chip.classList.add('entered');
                });
            });
        });
    }

    // ── Per-chip color variables (from data-glow attribute) ──────
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);
        return r + ',' + g + ',' + b;
    }

    function setupChipGlow() {
        document.querySelectorAll('.sk-chip').forEach(function (chip) {
            var hex = chip.getAttribute('data-glow') || '#667eea';
            var rgb = hexToRgb(hex);

            chip.style.setProperty('--chip-glow',         'rgba(' + rgb + ',0.16)');
            chip.style.setProperty('--chip-glow-border',  'rgba(' + rgb + ',0.42)');
            chip.style.setProperty('--chip-glow-shadow',  'rgba(' + rgb + ',0.28)');
            chip.style.setProperty('--chip-glow-color',   hex);
            chip.style.setProperty('--chip-glow-icon-bg', 'rgba(' + rgb + ',0.18)');

            // Add spinning ring to icon element
            var iconEl = chip.querySelector('.sk-icon');
            if (iconEl && !iconEl.querySelector('.sk-icon-ring')) {
                var ring = document.createElement('span');
                ring.className = 'sk-icon-ring';
                iconEl.appendChild(ring);
            }

            // Add pulsing activity dot
            if (!chip.querySelector('.sk-pulse')) {
                var dot = document.createElement('span');
                dot.className = 'sk-pulse';
                chip.appendChild(dot);
            }

            // Add tiny orb behind the chip
            var orb = document.createElement('span');
            orb.className = 'sk-chip-orb';
            orb.style.cssText =
                'width:50px;height:50px;' +
                'background:radial-gradient(circle,rgba(' + rgb + ',0.3) 0%,transparent 70%);' +
                'top:-10px;right:-10px;' +
                'animation-delay:' + (Math.random() * 2) + 's;';
            chip.appendChild(orb);
        });
    }

    // ── Aurora: track mouse inside each chip → update radial pos ─
    function setupAuroraTracking() {
        document.querySelectorAll('.sk-chip').forEach(function (chip) {
            chip.addEventListener('mousemove', function (e) {
                var rect = chip.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
                var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
                chip.style.setProperty('--mx', x + '%');
                chip.style.setProperty('--my', y + '%');

                // Magnetic 3-D tilt
                var dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
                var dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
                chip.style.transform =
                    'scale(1) translateY(0) ' +
                    'rotateX(' + (-dy * 10).toFixed(1) + 'deg) ' +
                    'rotateY(' + ( dx * 10).toFixed(1) + 'deg)';
            });

            chip.addEventListener('mouseleave', function () {
                chip.style.transform = '';
                chip.style.setProperty('--mx', '50%');
                chip.style.setProperty('--my', '50%');
            });
        });
    }

    // ── Live Canvas Particle Field ───────────────────────────────
    function spawnSkillCanvas() {
        var section = document.querySelector('.skills');
        if (!section) return;

        // Create canvas
        var canvas = document.createElement('canvas');
        canvas.id = 'skillCanvas';
        section.insertBefore(canvas, section.firstChild);
        var ctx = canvas.getContext('2d');

        // Resize
        function resize() {
            canvas.width  = section.offsetWidth;
            canvas.height = section.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Particle data
        var COUNT = Math.min(55, Math.floor(canvas.width / 22));
        var particles = [];
        var mouse = { x: -999, y: -999 };

        // Track mouse globally but only react in the section
        section.addEventListener('mousemove', function (e) {
            var r = section.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        section.addEventListener('mouseleave', function () {
            mouse.x = -999; mouse.y = -999;
        });

        // Colour palette matching site theme
        var cols = [
            [102, 126, 234],   // primary
            [118,  75, 162],   // secondary
            [240, 147, 251],   // accent
            [ 79, 172, 254],   // cyan
        ];

        function rand(a, b) { return Math.random() * (b - a) + a; }

        function createParticle() {
            var c = cols[Math.floor(Math.random() * cols.length)];
            return {
                x:  rand(0, canvas.width),
                y:  rand(0, canvas.height),
                vx: rand(-0.3, 0.3),
                vy: rand(-0.3, 0.3),
                r:  rand(1.2, 3),
                c:  c,
                a:  rand(0.15, 0.55),
                phase: rand(0, Math.PI * 2),
                spd:   rand(0.012, 0.03),
            };
        }

        for (var i = 0; i < COUNT; i++) {
            particles.push(createParticle());
        }

        var MAX_DIST = 130;
        var animRunning = true;

        // Stop canvas when not visible (IntersectionObserver)
        var io = new IntersectionObserver(function (ents) {
            animRunning = ents[0].isIntersecting;
        }, { threshold: 0.05 });
        io.observe(section);

        function tick() {
            requestAnimationFrame(tick);
            if (!animRunning) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.phase += p.spd;

                // Mouse repulsion
                var mdx = p.x - mouse.x;
                var mdy = p.y - mouse.y;
                var md  = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < 90 && md > 0) {
                    var force = (90 - md) / 90 * 0.6;
                    p.vx += (mdx / md) * force;
                    p.vy += (mdy / md) * force;
                }

                // Damping
                p.vx *= 0.98;
                p.vy *= 0.98;

                // Speed cap
                var spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                if (spd > 1.2) { p.vx = (p.vx/spd)*1.2; p.vy = (p.vy/spd)*1.2; }

                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if (p.x < -5) p.x = canvas.width  + 5;
                if (p.x > canvas.width  + 5) p.x = -5;
                if (p.y < -5) p.y = canvas.height + 5;
                if (p.y > canvas.height + 5) p.y = -5;

                // Draw
                var a = (p.a + 0.12 * Math.sin(p.phase)) * Math.min(1, canvas.height / 400);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * (0.85 + 0.15 * Math.sin(p.phase + 1)), 0, 6.2832);
                ctx.fillStyle = 'rgba(' + p.c.join(',') + ',' + a + ')';
                ctx.fill();
            }

            // Connections
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx  = particles[i].x - particles[j].x;
                    var dy  = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < MAX_DIST) {
                        var alpha = ((1 - dist / MAX_DIST) * 0.18) *
                                    Math.min(1, canvas.height / 400);
                        // Use average color of the two particles
                        var rc = [
                            (particles[i].c[0] + particles[j].c[0]) >> 1,
                            (particles[i].c[1] + particles[j].c[1]) >> 1,
                            (particles[i].c[2] + particles[j].c[2]) >> 1,
                        ];
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(' + rc.join(',') + ',' + alpha + ')';
                        ctx.lineWidth = 0.9;
                        ctx.stroke();
                    }
                }
            }
        }

        tick();
    }

}());

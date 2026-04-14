/* ================================================================
   CINEMATIC NEURAL-NETWORK PRELOADER
   Canvas particle system that pulses like a neural net, then
   the monogram + text reveal, progress bar sweeps, then exit.
   ================================================================ */
(function () {
    'use strict';

    var canvas  = document.getElementById('plCanvas');
    var ctx     = canvas ? canvas.getContext('2d') : null;
    var pl      = document.getElementById('preloader');
    var mono    = document.getElementById('plMonogram');
    var nameEl  = document.getElementById('plName');
    var roleEl  = document.getElementById('plRole');
    var barWrap = document.getElementById('plBarWrap');
    var bar     = document.getElementById('plBar');
    var status  = document.getElementById('plStatus');

    if (!canvas || !ctx || !pl) return;

    // ── Canvas sizing ──────────────────────────────────────────
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Particles ─────────────────────────────────────────────
    var PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 16));
    var particles = [];
    var connections = [];
    var MAX_DIST = 160;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticles() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x:  rand(0, canvas.width),
                y:  rand(0, canvas.height),
                vx: rand(-0.35, 0.35),
                vy: rand(-0.35, 0.35),
                r:  rand(1.5, 3.5),
                alpha: rand(0.3, 0.9),
                pulse: rand(0, Math.PI * 2),
                speed: rand(0.015, 0.04)
            });
        }
    }
    createParticles();

    // Primary colour cycling (matches site theme)
    var colours = ['102,126,234', '118,75,162', '240,147,251', '79,172,254'];
    var colIdx  = 0;
    var colTimer = 0;

    // ── RAF loop ───────────────────────────────────────────────
    var animId = null;
    var running = true;

    function draw() {
        if (!running) return;
        animId = requestAnimationFrame(draw);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        colTimer++;
        if (colTimer > 120) { colTimer = 0; colIdx = (colIdx + 1) % colours.length; }

        var col = colours[colIdx];

        // move + draw particles
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += p.speed;

            // wrap
            if (p.x < -10) p.x = canvas.width  + 10;
            if (p.x > canvas.width  + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;

            var a = (0.4 + 0.4 * Math.sin(p.pulse)) * p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * (0.8 + 0.2 * Math.sin(p.pulse)), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + col + ',' + a + ')';
            ctx.fill();
        }

        // connections
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    var opacity = (1 - dist / MAX_DIST) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(' + col + ',' + opacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    draw();

    // ── Status messages ────────────────────────────────────────
    var msgs = [
        'Initializing neural net...',
        'Loading model weights...',
        'Calibrating tensors...',
        'Warming up inference...',
        'Almost ready...'
    ];

    function setStatus(i) {
        if (status) status.textContent = msgs[Math.min(i, msgs.length - 1)];
    }

    // ── Progress bar sweep ─────────────────────────────────────
    var pct = 0;
    var pctTarget = 0;
    var pctInterval = null;

    function startProgress() {
        if (bar && barWrap) {
            barWrap.classList.add('visible');
            if (status) status.classList.add('visible');
        }
        var step = 0;
        var stages = [30, 60, 80, 95, 100];
        pctInterval = setInterval(function () {
            pctTarget = stages[Math.min(step, stages.length - 1)];
            step++;
            setStatus(step - 1);
            if (step >= stages.length) {
                clearInterval(pctInterval);
                // finish and hide
                setTimeout(hidePreloader, 350);
            }
        }, 240);

        // smooth fill
        var fillRAF = null;
        function fillStep() {
            if (pct < pctTarget) {
                pct = Math.min(pctTarget, pct + 1.5);
                if (bar) bar.style.width = pct + '%';
            }
            if (pct < 100) fillRAF = requestAnimationFrame(fillStep);
        }
        fillStep();
    }

    // ── Reveal text ───────────────────────────────────────────
    function revealText() {
        if (mono)    mono.classList.add('visible');
        if (nameEl)  setTimeout(function () { nameEl.classList.add('visible');  }, 300);
        if (roleEl)  setTimeout(function () { roleEl.classList.add('visible');  }, 480);
        setTimeout(startProgress, 700);
    }

    // ── Hide preloader ─────────────────────────────────────────
    function hidePreloader() {
        running = false;
        if (animId) cancelAnimationFrame(animId);
        if (pl) {
            pl.style.transition = 'opacity 0.65s cubic-bezier(0.4,0,0.2,1), visibility 0.65s';
            pl.classList.add('hidden');
        }
    }

    // ── Sequence ──────────────────────────────────────────────
    // Start the text reveal after a tiny delay so canvas is painting
    setTimeout(revealText, 200);

    // Hard fallback: if DOMContentLoaded has already fired, boot immediately
    if (document.readyState !== 'loading') {
        // page already loaded — hide after minimum brand moment
        setTimeout(hidePreloader, 2200);
    }

}());

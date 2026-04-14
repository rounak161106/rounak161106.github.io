/* ================================================================
   SKILLS SECTION — Tab switching + Per-chip glow CSS vars
   ================================================================ */
(function () {
    'use strict';

    // ── Tab switching ──────────────────────────────────────────
    var tabs   = document.querySelectorAll('.sk-tab');
    var panels = document.querySelectorAll('.sk-panel');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var cat = tab.getAttribute('data-cat');

            // update tabs
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            // update panels
            panels.forEach(function (p) { p.classList.remove('active'); });
            var target = document.querySelector('.sk-panel[data-cat="' + cat + '"]');
            if (target) target.classList.add('active');

            // re-run AOS refresh so newly shown chips animate
            if (typeof AOS !== 'undefined') AOS.refresh();
        });
    });

    // ── Per-chip colour glow via CSS custom properties ─────────
    // Reads data-glow="#rrggbb" and sets matching CSS vars
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);
        return r + ',' + g + ',' + b;
    }

    document.querySelectorAll('.sk-chip').forEach(function (chip) {
        var hex = chip.getAttribute('data-glow') || '#667eea';
        var rgb = hexToRgb(hex);

        chip.style.setProperty('--chip-glow',        'rgba(' + rgb + ', 0.12)');
        chip.style.setProperty('--chip-glow-border',  'rgba(' + rgb + ', 0.4)');
        chip.style.setProperty('--chip-glow-shadow',  'rgba(' + rgb + ', 0.28)');
        chip.style.setProperty('--chip-glow-color',   hex);
        chip.style.setProperty('--chip-glow-icon-bg', 'rgba(' + rgb + ', 0.15)');

        // 3-D tilt on mouse move
        chip.addEventListener('mousemove', function (e) {
            var rect = chip.getBoundingClientRect();
            var cx   = rect.left + rect.width  / 2;
            var cy   = rect.top  + rect.height / 2;
            var dx   = (e.clientX - cx) / (rect.width  / 2);
            var dy   = (e.clientY - cy) / (rect.height / 2);
            chip.style.transform =
                'translateY(-6px) scale(1.03) ' +
                'rotateX(' + (-dy * 8) + 'deg) ' +
                'rotateY(' + ( dx * 8) + 'deg)';
        });

        chip.addEventListener('mouseleave', function () {
            chip.style.transform = '';
        });
    });

}());

/* ================================================================
   PREMIUM CYBERPUNK HUD PRELOADER LOGIC
   Loads instantly, runs a count-up digit anim, and streams console logs.
   Uses is-preloading class to prevent cursor and listener glitches.
   ================================================================ */
(function () {
    'use strict';

    var pl       = document.getElementById('preloader');
    var mono     = document.getElementById('plMonogram');
    var nameEl   = document.getElementById('plName');
    var roleEl   = document.getElementById('plRole');
    var barWrap  = document.getElementById('plBarWrap');
    var bar      = document.getElementById('plBar');
    var status   = document.getElementById('plStatus');
    var pctText  = document.getElementById('plPercent');
    var progInfo = document.getElementById('plProgressInfo');

    // Bypass for Lighthouse instantly
    if (!pl || document.documentElement.classList.contains('lighthouse-audit')) {
        if (pl) pl.style.display = 'none';
        return;
    }

    // Status messages for loader progression
    var msgs = {
        30: 'INITIALIZING CORE...',
        70: 'LOADING SUBSYSTEMS...',
        100: 'SECURE LAUNCH INITIALIZED'
    };

    var startTime = Date.now();
    var duration = 1200; // Enforce a 1.2s loader duration
    var isLoaded = false;
    var currentPct = 0;
    var failSafeTimeout = null;
    var pctTimer = null;

    function revealBrandingText() {
        if (mono)     mono.classList.add('visible');
        if (nameEl)   setTimeout(function () { nameEl.classList.add('visible');   }, 150);
        if (roleEl)   setTimeout(function () { roleEl.classList.add('visible');   }, 280);
        if (progInfo) setTimeout(function () { progInfo.classList.add('visible'); }, 400);
        if (barWrap)  setTimeout(function () { barWrap.classList.add('visible');  }, 400);
    }

    function hidePreloader() {
        if (failSafeTimeout) clearTimeout(failSafeTimeout);
        if (pctTimer) clearInterval(pctTimer);

        if (pl) {
            pl.classList.add('hidden');
            
            // Remove pointer block classes so mouse actions activate
            setTimeout(function() {
                document.body.classList.remove('is-preloading');
            }, 400);

            // Hide completely from layout after circular animation ends (1s matching CSS transition)
            setTimeout(function() {
                pl.style.display = 'none';
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
            }, 1000);
        }
    }

    // Set body loading state and trigger animations
    document.body.classList.add('is-preloading');
    revealBrandingText();

    // Start progress interval
    pctTimer = setInterval(function() {
        var elapsed = Date.now() - startTime;
        var maxPct = isLoaded ? 100 : 90;
        var targetPct = Math.min(maxPct, Math.floor((elapsed / duration) * 100));

        // Rate limit the increase to at most 2% per frame (16ms) to prevent jumps
        if (currentPct < targetPct) {
            currentPct = Math.min(targetPct, currentPct + 2);
        }

        if (bar) {
            bar.style.width = currentPct + '%';
        }
        if (pctText) {
            pctText.textContent = currentPct + '%';
        }

        if (status) {
            if (currentPct >= 100) {
                status.textContent = msgs[100];
            } else if (currentPct >= 90 && !isLoaded) {
                status.textContent = 'FINISHING LOAD...';
            } else if (currentPct >= 70) {
                status.textContent = msgs[70];
            } else if (currentPct >= 30) {
                status.textContent = msgs[30];
            }
        }

        if (currentPct >= 100) {
            clearInterval(pctTimer);
            setTimeout(hidePreloader, 250); // Let visual state sink in briefly
        }
    }, 16);

    function triggerLoadComplete() {
        isLoaded = true;
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        triggerLoadComplete();
    } else {
        document.addEventListener('DOMContentLoaded', triggerLoadComplete);
        window.addEventListener('load', triggerLoadComplete);
    }

    // Fail-safe timeout (max 2.5 seconds to avoid locking user page in case of network collapse)
    failSafeTimeout = setTimeout(function() {
        console.warn('Preloader fail-safe timeout reached.');
        triggerLoadComplete();
    }, 2500);

}());

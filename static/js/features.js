// ===================================================================
// FEATURES.JS — ORBIT DOCK EDITION
// Drop-in replacement. New: dock, discover cards, magnetic effect,
// 3-D tilt, particles, scroll-ring, cursor blob, activity indicators.
// All existing overlay functionality fully preserved.
// ===================================================================

(function () {
    'use strict';

    // ── CONFIG ──────────────────────────────────────────────────────
    var DEVTO_USERNAME   = 'rounak161106';
    var MEDIUM_USERNAME  = 'rounak16112006';
    var GITHUB_USERNAME  = 'rounak161106';
    var LEETCODE_USERNAME = 'SRWo0aM93N';

    var PROFILES = [
        { name: 'GitHub',     icon: 'fab fa-github', cls: 'github',     user: 'rounak161106',  url: 'https://github.com/rounak161106' },
        { name: 'LeetCode',   icon: 'fas fa-code',   cls: 'leetcode',   user: 'SRWo0aM93N',    url: 'https://leetcode.com/u/SRWo0aM93N/' }
    ];

    var FEATURED_REPOS = [
        'e-waste-india',
        'flask-article-app',
        'restraunt_table_reservation_system',
        'modern-application-development'
    ];

    // ── UTILS ────────────────────────────────────────────────────────
    function inject(html) {
        var d = document.createElement('div');
        d.innerHTML = html.trim();
        while (d.firstChild) document.body.appendChild(d.firstChild);
    }

    function navTo(sel) {
        var el = document.querySelector(sel);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }

    function stripHtml(html) {
        var d = document.createElement('div');
        d.innerHTML = html;
        return d.textContent || '';
    }

    function fmtDate(str) {
        try {
            return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) { return str || ''; }
    }

    function timeAgo(str) {
        try {
            var diff = Date.now() - new Date(str).getTime();
            var days = Math.floor(diff / 86400000);
            if (days < 1)  return 'Today';
            if (days < 7)  return days + 'd ago';
            if (days < 30) return Math.floor(days / 7) + 'w ago';
            return Math.floor(days / 30) + 'mo ago';
        } catch (e) { return ''; }
    }

    function skelLines(n) {
        var html = '<div class="dev-skeleton">';
        for (var i = 0; i < n; i++) html += '<div class="dev-skel-line"></div>';
        return html + '</div>';
    }

    // ── THEME CYCLING ─────────────────────────────────────────────────
    var themeList = ['blue', 'green', 'red', 'cyan'];
    function cycleTheme() {
        var cur  = document.documentElement.getAttribute('data-theme') || 'blue';
        var next = themeList[(themeList.indexOf(cur) + 1) % themeList.length];
        document.documentElement.removeAttribute('data-theme');
        if (next !== 'blue') document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        document.querySelectorAll('.theme-option').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-theme') === next);
        });
    }

    // ── BACK BUTTON ───────────────────────────────────────────────────
    window.addEventListener('popstate', function () {
        if (devOvEl  && devOvEl.classList.contains('open'))  { devOvEl.classList.remove('open');  document.body.style.overflow = ''; }
        if (blogOvEl && blogOvEl.classList.contains('open')) { blogOvEl.classList.remove('open'); document.body.style.overflow = ''; }
    });

    var devOvEl, blogOvEl, cmdOvEl;

    // ================================================================
    // FEATURE 1 — COMMAND PALETTE
    // ================================================================
    var commands = [
        { group: 'Actions',  icon: 'fas fa-bolt',           label: 'Dev Activity',    hint: 'GitHub · LeetCode', action: function () { openDev(); } },
        { group: 'Actions',  icon: 'fas fa-pen-nib',        label: 'Blog / Writing',  hint: 'Dev.to · Medium',   action: function () { openBlog(); } },
        { group: 'Actions',  icon: 'fas fa-palette',        label: 'Switch Theme',    hint: 'Cycle next',        action: cycleTheme },
        { group: 'Navigate', icon: 'fas fa-home',           label: 'Home',            action: function () { navTo('#home'); } },
        { group: 'Navigate', icon: 'fas fa-user',           label: 'About',           action: function () { navTo('#about'); } },
        { group: 'Navigate', icon: 'fas fa-cogs',           label: 'Skills',          action: function () { navTo('#skills'); } },
        { group: 'Navigate', icon: 'fas fa-project-diagram',label: 'Projects',        action: function () { navTo('#projects'); } },
        { group: 'Navigate', icon: 'fas fa-certificate',    label: 'Certifications',  action: function () { navTo('#certifications'); } },
        { group: 'Navigate', icon: 'fas fa-envelope',       label: 'Contact',         action: function () { navTo('#contact'); } },
    ];

    inject(
        '<div class="cmd-palette-overlay" id="cmdOverlay">' +
            '<div class="cmd-palette-card" role="dialog" aria-label="Command palette">' +
                '<div class="cmd-search">' +
                    '<i class="fas fa-search"></i>' +
                    '<input type="text" id="cmdInput" placeholder="Type a command or jump to section..." autocomplete="off" />' +
                    '<span class="cmd-kbd">ESC</span>' +
                '</div>' +
                '<div class="cmd-list" id="cmdList"></div>' +
            '</div>' +
        '</div>'
    );

    cmdOvEl = document.getElementById('cmdOverlay');
    var cmdIn = document.getElementById('cmdInput');
    var cmdLs = document.getElementById('cmdList');
    var cmdIdx = 0, cmdFilt = commands.slice();

    function renderCmd(q) {
        q = (q || '').toLowerCase().trim();
        cmdFilt = q
            ? commands.filter(function (c) {
                return c.label.toLowerCase().indexOf(q) >= 0 ||
                       c.group.toLowerCase().indexOf(q) >= 0 ||
                       (c.hint || '').toLowerCase().indexOf(q) >= 0;
              })
            : commands.slice();
        cmdIdx = 0;
        var h = '', lg = '';
        cmdFilt.forEach(function (c, i) {
            if (c.group !== lg) { h += '<div class="cmd-group-label">' + c.group + '</div>'; lg = c.group; }
            h += '<div class="cmd-item' + (i === 0 ? ' selected' : '') + '" data-i="' + i + '">' +
                 '<i class="' + c.icon + '"></i>' +
                 '<span class="cmd-item-label">' + c.label + '</span>' +
                 (c.hint ? '<span class="cmd-item-hint">' + c.hint + '</span>' : '') +
                 '</div>';
        });
        if (!cmdFilt.length) h = '<div class="cmd-no-results">No matching commands</div>';
        cmdLs.innerHTML = h;
        cmdLs.querySelectorAll('.cmd-item').forEach(function (el) {
            el.addEventListener('click',      function () { execCmd(parseInt(el.getAttribute('data-i'))); });
            el.addEventListener('mouseenter', function () { cmdIdx = parseInt(el.getAttribute('data-i')); hlCmd(); });
        });
    }

    function hlCmd() {
        cmdLs.querySelectorAll('.cmd-item').forEach(function (el) {
            el.classList.toggle('selected', parseInt(el.getAttribute('data-i')) === cmdIdx);
        });
        var s = cmdLs.querySelector('.cmd-item.selected');
        if (s) s.scrollIntoView({ block: 'nearest' });
    }

    function execCmd(i) {
        if (cmdFilt[i]) {
            closeCmd();
            setTimeout(function () { cmdFilt[i].action(); }, 50);
        }
    }

    function openCmd() {
        cmdIn.value = '';
        renderCmd();
        cmdOvEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(function () { cmdIn.focus(); }, 60);
    }

    function closeCmd() {
        cmdOvEl.classList.remove('open');
        document.body.style.overflow = '';
    }

    cmdOvEl.addEventListener('click', function (e) { if (e.target === cmdOvEl) closeCmd(); });
    cmdIn.addEventListener('input',   function () { renderCmd(cmdIn.value); });

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            cmdOvEl.classList.contains('open') ? closeCmd() : openCmd();
            return;
        }
        if (!cmdOvEl.classList.contains('open')) return;
        if (e.key === 'Escape')    { e.preventDefault(); e.stopPropagation(); closeCmd(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); cmdIdx = Math.min(cmdIdx + 1, cmdFilt.length - 1); hlCmd(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); cmdIdx = Math.max(cmdIdx - 1, 0); hlCmd(); }
        if (e.key === 'Enter')     { e.preventDefault(); execCmd(cmdIdx); }
    });


    // ================================================================
    // FEATURE 2 — DEV ACTIVITY OVERLAY
    // ================================================================
    var profilesHTML = PROFILES.filter(function (p) { return p.url; }).map(function (p) {
        return '<a class="profile-card" href="' + p.url + '" target="_blank" rel="noopener">' +
               '<div class="profile-card-icon ' + p.cls + '"><i class="' + p.icon + '"></i></div>' +
               '<div class="profile-card-info">' +
               '<div class="profile-card-name">' + p.name + '</div>' +
               '<div class="profile-card-user">@' + p.user + '</div>' +
               '</div></a>';
    }).join('');

    inject(
        '<div class="dev-overlay" id="devOverlay">' +
            '<button class="dev-close" id="devClose" aria-label="Close"><i class="fas fa-times"></i></button>' +
            '<div class="dev-inner">' +
                '<div class="dev-hero" style="text-align:center;margin-bottom:2rem;">' +
                    '<span class="dev-hero-tag">Developer</span>' +
                    '<h2>Dev <span>Activity</span></h2>' +
                    '<p class="dev-hero-desc" style="max-width:600px;margin:1rem auto 0;">Deep-dive into my professional coding journey across multiple platforms.</p>' +
                '</div>' +

                '<div class="dev-section">' +
                    '<div class="dev-section-title"><i class="fas fa-globe"></i> Profiles</div>' +
                    '<div class="profiles-grid">' + profilesHTML + '</div>' +
                '</div>' +

                '<div class="dev-stack-col" style="display:flex;flex-direction:column;gap:2.5rem;">' +
                    '<div class="dev-section" style="background:rgba(255,255,255,0.015);padding:1.5rem;border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.04);">' +
                        '<div class="dev-section-title" style="margin-bottom:1.5rem;"><i class="fab fa-github"></i> GitHub Contributions</div>' +
                        '<div id="ghBox"></div>' +
                        '<div style="margin-top:2rem;border-top:1px solid rgba(255,255,255,0.05);padding-top:1.5rem;">' +
                            '<div class="dev-section-title" style="font-size:1.05rem;display:flex;justify-content:space-between;align-items:center;">' +
                                '<span><i class="fas fa-star"></i> Featured Open Source</span>' +
                                '<a href="https://github.com/' + GITHUB_USERNAME + '?tab=repositories" target="_blank" rel="noopener" style="color:var(--primary-color);font-size:0.85rem;font-weight:500;text-decoration:none;">View All <i class="fas fa-arrow-right"></i></a>' +
                            '</div>' +
                            '<div id="ghRepos"></div>' +
                        '</div>' +
                    '</div>' +

                    '<div class="dev-section" style="background:rgba(255,255,255,0.015);padding:1.5rem;border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.04);">' +
                        '<div class="dev-section-title" style="margin-bottom:1.5rem;"><i class="fas fa-code"></i> Data Structures & Algorithms</div>' +
                        '<div id="lcBox"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );

    devOvEl = document.getElementById('devOverlay');
    var devLoaded = false;

    function loadGH() {
        var box  = document.getElementById('ghBox');
        var rbox = document.getElementById('ghRepos');
        box.innerHTML  = skelLines(3);
        rbox.innerHTML = skelLines(2);

        var userPromise = fetch('https://api.github.com/users/' + GITHUB_USERNAME)
            .then(function (r) { return r.ok ? r.json() : null; })
            .catch(function () { return null; });

        var repoPromises = FEATURED_REPOS.map(function (repoName) {
            return fetch('https://api.github.com/repos/' + GITHUB_USERNAME + '/' + repoName)
                .then(function (r) { return r.ok ? r.json() : null; })
                .catch(function () { return null; });
        });

        Promise.all([userPromise, Promise.all(repoPromises)]).then(function (results) {
            var u = results[0] || {
                login: GITHUB_USERNAME, name: 'Rounak Prasad',
                avatar_url: 'https://avatars.githubusercontent.com/' + GITHUB_USERNAME,
                public_repos: '12', followers: '15', bio: 'Passionate about Data Science and ML.'
            };
            var repos = (results[1] || []).filter(Boolean);

            // Mark activity dot on dock
            var actDot = document.getElementById('dockActivityDot');
            if (actDot && results[0]) actDot.classList.add('visible');

            var themeColor = document.documentElement.getAttribute('data-theme') || 'blue';
            var ghColor = themeColor === 'green' ? '41b883' : (themeColor === 'red' ? 'ff6b6b' : (themeColor === 'cyan' ? '00f2fe' : '4facfe'));

            box.innerHTML =
                '<div class="gh-profile" style="flex-direction:column;gap:1.5rem;align-items:center;">' +
                    '<div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;width:100%;">' +
                        '<img class="gh-avatar" src="' + u.avatar_url + '" alt="' + u.login + '" style="margin:0;width:80px;height:80px;box-shadow:0 4px 12px rgba(0,0,0,0.2);" />' +
                        '<div class="gh-info" style="text-align:left;flex:1;min-width:200px;">' +
                            '<div class="gh-name" style="font-size:1.4rem;">' + (u.name || u.login) +
                            ' <a href="https://github.com/' + GITHUB_USERNAME + '" target="_blank" style="font-size:0.9rem;color:var(--text-muted);"><i class="fas fa-external-link-alt"></i></a></div>' +
                            '<div class="gh-bio" style="font-size:0.95rem;line-height:1.4;">' + (u.bio || '') + '</div>' +
                        '</div>' +
                        '<div class="gh-stats-row" style="background:var(--body-bg);padding:1rem;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.05);">' +
                            '<span class="gh-stat"><i class="fas fa-book" style="color:var(--primary-color)"></i> <strong>' + u.public_repos + '</strong> repos</span>' +
                            '<span class="gh-stat"><i class="fas fa-user-friends" style="color:var(--primary-color)"></i> <strong>' + u.followers + '</strong> followers</span>' +
                        '</div>' +
                    '</div>' +
                    '<div style="width:100%;margin-top:0.5rem;overflow:hidden;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.05);text-align:center;">' +
                        '<img style="width:100%;display:block;" src="https://github-readme-activity-graph.vercel.app/graph?username=' + GITHUB_USERNAME + '&bg_color=0f1423&color=' + ghColor + '&line=' + ghColor + '&point=ffffff&area=true&hide_border=true" alt="GitHub Activity Graph" />' +
                    '</div>' +
                    '<div style="width:100%;margin-top:1.5rem;overflow:hidden;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.05);text-align:center;">' +
                        '<img style="width:100%;display:block;padding:1rem;" src="https://ghchart.rshah.org/' + ghColor + '/' + GITHUB_USERNAME + '" alt="GitHub Year Heatmap" />' +
                    '</div>' +
                '</div>';

            var repoHtml;
            if (repos.length > 0) {
                repoHtml = repos.map(function (r) {
                    var cleanName = r.name.replace(/[-_]/g, ' ');
                    var desc = r.description || '<span style="opacity:0.6">A personal open source repository.</span>';
                    return '<a class="gh-repo-card" href="' + r.html_url + '" target="_blank" rel="noopener" style="background:var(--body-bg);">' +
                           '<div class="gh-repo-name" style="text-transform:capitalize;"><i class="fas fa-bookmark" style="color:var(--primary-color)"></i> ' + cleanName + '</div>' +
                           '<div class="gh-repo-desc" style="font-size:0.85rem;">' + desc + '</div>' +
                           '<div class="gh-repo-meta" style="margin-top:1rem;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.05);">' +
                           (r.language ? '<span><i class="fas fa-circle" style="font-size:0.5rem;color:var(--primary-color)"></i> ' + r.language + '</span>' : '') +
                           '<span><i class="fas fa-star" style="color:gold;"></i> ' + r.stargazers_count + '</span>' +
                           '<span><i class="fas fa-code-branch"></i> ' + r.forks_count + '</span>' +
                           '</div></a>';
                }).join('');
            } else {
                repoHtml = FEATURED_REPOS.map(function (name) {
                    return '<a class="gh-repo-card" href="https://github.com/' + GITHUB_USERNAME + '/' + name + '" target="_blank" rel="noopener" style="background:var(--body-bg);">' +
                           '<div class="gh-repo-name" style="text-transform:capitalize;"><i class="fas fa-bookmark" style="color:var(--primary-color)"></i> ' + name.replace(/[-_]/g, ' ') + '</div>' +
                           '<div class="gh-repo-desc" style="font-size:0.85rem;opacity:0.6;">Click to view on GitHub.</div>' +
                           '<div class="gh-repo-meta" style="margin-top:1rem;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.05);">' +
                           '<span><i class="fab fa-github"></i> View Source</span></div></a>';
                }).join('');
            }
            rbox.innerHTML = '<div class="gh-repos-grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">' + repoHtml + '</div>';
        });
    }

    function loadLC() {
        var box = document.getElementById('lcBox');
        box.innerHTML = '<div class="lc-card" style="display:flex;justify-content:center;align-items:center;min-height:200px;">' + skelLines(4) + '</div>';

        Promise.all([
            fetch('https://alfa-leetcode-api.onrender.com/' + LEETCODE_USERNAME).then(function (r) { return r.json(); }).catch(function () { return null; }),
            fetch('https://alfa-leetcode-api.onrender.com/' + LEETCODE_USERNAME + '/solved').then(function (r) { return r.json(); }).catch(function () { return null; })
        ]).then(function (results) {
            var u = results[0] || { username: LEETCODE_USERNAME, name: 'Rounak Prasad', avatar: '', ranking: 'N/A', about: 'Practicing DSA on LeetCode.' };
            var s = results[1] || { solvedProblem: 21, easySolved: 20, mediumSolved: 1, hardSolved: 0 };
            var lcHeatmap = 'https://leetcard.jacoblin.cool/' + LEETCODE_USERNAME + '?theme=dark&font=Syne&ext=heatmap';
            var rankNum = u.ranking ? (typeof u.ranking === 'number' ? u.ranking.toLocaleString() : u.ranking) : 'N/A';

            box.innerHTML =
                '<div class="lc-profile" style="display:flex;flex-direction:column;gap:1.5rem;align-items:center;">' +
                    '<div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;width:100%;">' +
                        (u.avatar ? '<img class="gh-avatar" src="' + u.avatar + '" alt="' + u.username + '" style="margin:0;width:80px;height:80px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.2);" />' : '') +
                        '<div class="gh-info" style="text-align:left;flex:1;min-width:200px;">' +
                            '<div class="gh-name" style="font-size:1.4rem;">' + (u.name || u.username) +
                            ' <a href="https://leetcode.com/u/' + LEETCODE_USERNAME + '/" target="_blank" style="font-size:0.9rem;color:var(--text-muted);"><i class="fas fa-external-link-alt"></i></a></div>' +
                            '<div class="gh-bio" style="font-size:0.95rem;line-height:1.4;">' + (u.about || 'Practicing DSA on LeetCode.') + '</div>' +
                        '</div>' +
                        '<div class="gh-stats-row" style="background:var(--body-bg);padding:1rem;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.05);">' +
                            '<span class="gh-stat" style="color:#FFA116;"><i class="fas fa-trophy"></i> <strong>Rank ' + rankNum + '</strong></span>' +
                            '<span class="gh-stat" style="color:#2EC866;"><i class="fas fa-check-circle"></i> <strong>' + s.solvedProblem + '</strong> solved</span>' +
                        '</div>' +
                    '</div>' +
                    '<div style="width:100%;display:flex;gap:1rem;padding:1.5rem;background:var(--body-bg);border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.05);justify-content:space-around;text-align:center;">' +
                        '<div style="display:flex;flex-direction:column;gap:0.5rem;"><span style="color:#00b8a3;font-weight:bold;font-size:1.2rem;">' + s.easySolved + '</span><span style="font-size:0.8rem;color:var(--text-muted);">Easy</span></div>' +
                        '<div style="display:flex;flex-direction:column;gap:0.5rem;"><span style="color:#ffc01e;font-weight:bold;font-size:1.2rem;">' + s.mediumSolved + '</span><span style="font-size:0.8rem;color:var(--text-muted);">Medium</span></div>' +
                        '<div style="display:flex;flex-direction:column;gap:0.5rem;"><span style="color:#ef4743;font-weight:bold;font-size:1.2rem;">' + s.hardSolved + '</span><span style="font-size:0.8rem;color:var(--text-muted);">Hard</span></div>' +
                    '</div>' +
                    '<a href="https://leetcode.com/u/' + LEETCODE_USERNAME + '/" target="_blank" rel="noopener" style="width:100%;overflow:hidden;border-radius:var(--radius-sm);border:1px solid rgba(255,255,255,0.05);text-align:center;">' +
                        '<img style="width:100%;display:block;" src="' + lcHeatmap + '" alt="LeetCode Heatmap" />' +
                    '</a>' +
                '</div>';
        });
    }

    function openDev() {
        if (blogOvEl && blogOvEl.classList.contains('open')) { blogOvEl.classList.remove('open'); }
        devOvEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        history.pushState({ overlay: 'dev' }, '');
        if (!devLoaded) { devLoaded = true; loadGH(); loadLC(); }
    }

    function closeDev() {
        if (!devOvEl.classList.contains('open')) return;
        devOvEl.classList.remove('open');
        document.body.style.overflow = '';
        history.back();
    }

    document.getElementById('devClose').addEventListener('click', closeDev);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && devOvEl.classList.contains('open') && !cmdOvEl.classList.contains('open')) {
            e.preventDefault(); closeDev();
        }
    });


    // ================================================================
    // FEATURE 3 — BLOG OVERLAY
    // ================================================================
    inject(
        '<div class="blog-overlay" id="blogOverlay">' +
            '<button class="blog-close" id="blogClose" aria-label="Close"><i class="fas fa-times"></i></button>' +
            '<div class="blog-inner">' +
                '<div class="blog-hero">' +
                    '<span class="blog-hero-tag">Writing</span>' +
                    '<h2>Latest <span>Articles</span></h2>' +
                    '<p class="blog-hero-desc">Thoughts on machine learning, coding, and my data science journey — pulled live from Dev.to and Medium.</p>' +
                '</div>' +
                '<div class="blog-tabs" id="blogTabs">' +
                    '<button class="blog-tab active" data-src="all"><i class="fas fa-layer-group"></i> All</button>' +
                    '<button class="blog-tab" data-src="devto"><i class="fab fa-dev"></i> Dev.to</button>' +
                    '<button class="blog-tab" data-src="medium"><i class="fab fa-medium"></i> Medium</button>' +
                '</div>' +
                '<div class="blog-grid" id="blogGrid"></div>' +
            '</div>' +
        '</div>'
    );

    blogOvEl = document.getElementById('blogOverlay');
    var blogGrid    = document.getElementById('blogGrid');
    var blogPosts   = [], blogFilter = 'all', blogLoaded = false;

    function fetchDevTo() {
        if (!DEVTO_USERNAME) return Promise.resolve([]);
        return fetch('https://dev.to/api/articles?username=' + DEVTO_USERNAME + '&per_page=20')
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (data) {
                return data.map(function (a) {
                    return { title: a.title, url: a.url, date: a.published_at, summary: a.description, tags: a.tag_list || [], source: 'devto' };
                });
            })
            .catch(function () { return []; });
    }

    function fetchMedium() {
        if (!MEDIUM_USERNAME) return Promise.resolve([]);
        return fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@' + MEDIUM_USERNAME)
            .then(function (r) { return r.ok ? r.json() : { items: [] }; })
            .then(function (d) {
                if (d.status !== 'ok') return [];
                return (d.items || []).map(function (a) {
                    return { title: a.title, url: a.link, date: a.pubDate, summary: stripHtml(a.description).slice(0, 200), tags: a.categories || [], source: 'medium' };
                });
            })
            .catch(function () { return []; });
    }

    function showBlogSkel() {
        blogGrid.innerHTML = '<div class="blog-loading">' +
            [1, 2, 3].map(function () {
                return '<div class="blog-skel-card">' +
                       '<div class="blog-skel-line w30"></div>' +
                       '<div class="blog-skel-line w70"></div>' +
                       '<div class="blog-skel-line w100"></div>' +
                       '<div class="blog-skel-line w90"></div>' +
                       '</div>';
            }).join('') + '</div>';
    }

    function renderBlog() {
        var fil = blogFilter === 'all' ? blogPosts : blogPosts.filter(function (p) { return p.source === blogFilter; });
        if (!fil.length) {
            blogGrid.innerHTML = '<div class="blog-empty"><i class="fas fa-pen-fancy"></i><p>No articles published yet.</p><small>Start writing on Dev.to or Medium and they\'ll appear here automatically!</small></div>';
            return;
        }
        blogGrid.innerHTML = fil.map(function (p) {
            return '<a class="blog-post-card" href="' + p.url + '" target="_blank" rel="noopener">' +
                   '<div class="blog-post-meta">' +
                   '<span class="blog-post-source ' + p.source + '">' + (p.source === 'devto' ? 'DEV.TO' : 'MEDIUM') + '</span>' +
                   '<span class="blog-post-date">' + fmtDate(p.date) + '</span>' +
                   '</div>' +
                   '<div class="blog-post-title">' + p.title + '</div>' +
                   '<div class="blog-post-summary">' + p.summary + '</div>' +
                   (p.tags.length ? '<div class="blog-post-tags">' + p.tags.slice(0, 4).map(function (t) { return '<span class="blog-post-tag">#' + t + '</span>'; }).join('') + '</div>' : '') +
                   '</a>';
        }).join('');
    }

    function loadBlog() {
        if (blogLoaded) return;
        showBlogSkel();
        Promise.all([fetchDevTo(), fetchMedium()]).then(function (results) {
            var all = results[0].concat(results[1]);
            all.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
            blogPosts = all;
            blogLoaded = true;
            renderBlog();
            // After blog loads: populate discover card + badge
            populateBlogDiscoverCard(all);
            if (all.length > 0) {
                var badge = document.getElementById('orbitBadge');
                if (badge) badge.classList.add('visible');
            }
        });
    }

    function openBlog() {
        if (devOvEl && devOvEl.classList.contains('open')) { devOvEl.classList.remove('open'); }
        blogOvEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        history.pushState({ overlay: 'blog' }, '');
        loadBlog();
    }

    function closeBlog() {
        if (!blogOvEl.classList.contains('open')) return;
        blogOvEl.classList.remove('open');
        document.body.style.overflow = '';
        history.back();
    }

    document.getElementById('blogClose').addEventListener('click', closeBlog);
    document.getElementById('blogTabs').addEventListener('click', function (e) {
        var t = e.target.closest('.blog-tab');
        if (!t) return;
        document.querySelectorAll('.blog-tab').forEach(function (b) { b.classList.remove('active'); });
        t.classList.add('active');
        blogFilter = t.getAttribute('data-src');
        renderBlog();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && blogOvEl.classList.contains('open') && !cmdOvEl.classList.contains('open') && !devOvEl.classList.contains('open')) {
            e.preventDefault(); closeBlog();
        }
    });


    // ================================================================
    // FEATURE 4 — ORBIT DOCK
    // ================================================================
    inject(
        '<nav class="orbit-dock" id="orbitDock" aria-label="Quick launch dock">' +
            '<div class="orbit-dock-inner">' +

                '<button class="orbit-item orbit-item--dev" id="dockDev" aria-label="Open Dev Activity">' +
                    '<div class="orbit-icon">' +
                        '<i class="fas fa-bolt"></i>' +
                        '<span class="orbit-activity-dot" id="dockActivityDot"></span>' +
                    '</div>' +
                    '<span class="orbit-label">Activity</span>' +
                '</button>' +

                '<div class="orbit-divider"></div>' +

                '<button class="orbit-item orbit-item--blog" id="dockBlog" aria-label="Open Writing / Blog">' +
                    '<div class="orbit-icon">' +
                        '<i class="fas fa-pen-nib"></i>' +
                        '<span class="orbit-badge" id="orbitBadge"></span>' +
                    '</div>' +
                    '<span class="orbit-label">Writing</span>' +
                '</button>' +

                '<div class="orbit-divider"></div>' +

                '<button class="orbit-item orbit-item--cmd" id="dockCmd" aria-label="Open command search (Ctrl+K)">' +
                    '<div class="orbit-icon" style="position:relative;">' +
                        '<svg class="orbit-progress-svg" viewBox="0 0 40 40" aria-hidden="true">' +
                            '<circle class="orbit-progress-ring" cx="20" cy="20" r="17"/>' +
                        '</svg>' +
                        '<i class="fas fa-search"></i>' +
                    '</div>' +
                    '<span class="orbit-label">Search</span>' +
                '</button>' +

            '</div>' +
        '</nav>'
    );

    // ── particle burst ───────────────────────────────────────────────
    function createParticles(cx, cy, color) {
        var count = 8;
        for (var i = 0; i < count; i++) {
            (function (idx) {
                var p   = document.createElement('div');
                p.className = 'orbit-particle';
                var ang = (idx / count) * Math.PI * 2;
                var dist = 28 + Math.random() * 22;
                var tx  = Math.cos(ang) * dist;
                var ty  = Math.sin(ang) * dist;
                p.style.cssText =
                    'left:' + cx + 'px;top:' + cy + 'px;' +
                    'background:' + (color || 'var(--primary-color)') + ';' +
                    '--tx:' + tx + 'px;--ty:' + ty + 'px;';
                document.body.appendChild(p);
                setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 600);
            })(i);
        }
    }

    function dockClick(btn, fn, color) {
        btn.addEventListener('click', function (e) {
            var rect = btn.getBoundingClientRect();
            createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, color);
            // mobile haptic
            if (navigator.vibrate) navigator.vibrate(8);
            fn();
        });
    }

    var dockDev  = document.getElementById('dockDev');
    var dockBlog = document.getElementById('dockBlog');
    var dockCmd  = document.getElementById('dockCmd');

    dockClick(dockDev,  openDev,  '#818cf8');
    dockClick(dockBlog, openBlog, '#fb923c');
    dockClick(dockCmd,  openCmd,  null);

    // ── scroll progress ring ─────────────────────────────────────────
    var progressRing = document.querySelector('.orbit-progress-ring');
    var circumference = 2 * Math.PI * 17; // ≈ 106.8

    window.addEventListener('scroll', function () {
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0 || !progressRing) return;
        var pct    = Math.min(1, window.scrollY / maxScroll);
        var offset = circumference * (1 - pct);
        progressRing.style.strokeDashoffset = offset;
    }, { passive: true });

    // ── magnetic effect (desktop only) ──────────────────────────────
    var dockEl    = document.getElementById('orbitDock');
    var dockItems = dockEl.querySelectorAll('.orbit-item');

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        dockEl.addEventListener('mousemove', function (e) {
            dockItems.forEach(function (item) {
                var r = item.getBoundingClientRect();
                var cx = r.left + r.width  / 2;
                var cy = r.top  + r.height / 2;
                var dx = e.clientX - cx;
                var dy = e.clientY - cy;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var maxD = 75;
                if (dist < maxD) {
                    var f = 1 - dist / maxD;
                    item.style.transform = 'translate(' + (dx * f * 0.32) + 'px,' + (dy * f * 0.2) + 'px) scale(' + (1 + f * 0.18) + ')';
                } else {
                    item.style.transform = '';
                }
            });
        });

        dockEl.addEventListener('mouseleave', function () {
            dockItems.forEach(function (item) { item.style.transform = ''; });
        });
    }


    // ================================================================
    // FEATURE 5 — DISCOVER SECTION  (injected before #projects)
    // ================================================================
    function injectDiscoverSection() {
        var projects = document.getElementById('projects');
        if (!projects) return;

        var section = document.createElement('section');
        section.className = 'feature-discover';
        section.id = 'featureDiscover';
        section.innerHTML =
            '<div class="container">' +
                '<div class="fd-header">' +
                    '<span class="fd-eyebrow">Explore More</span>' +
                    '<h2 class="fd-title">Beyond the <span>Portfolio</span></h2>' +
                    '<p class="fd-desc">Live coding activity and writing — updated in real-time from across the web.</p>' +
                '</div>' +
                '<div class="fd-grid">' +
                    '<div class="fd-card fd-card--dev" id="fdDevCard" role="button" tabindex="0" aria-label="Open Dev Activity">' +
                        '<div class="fd-card-header">' +
                            '<div class="fd-card-icon"><i class="fas fa-bolt"></i></div>' +
                            '<div>' +
                                '<div class="fd-card-title">Dev Activity</div>' +
                                '<div class="fd-card-sub">GitHub · LeetCode · Profiles</div>' +
                            '</div>' +
                        '</div>' +
                        '<div id="fdDevContent">' +
                            '<div class="fd-skel" style="width:55%"></div>' +
                            '<div class="fd-skel" style="width:100%"></div>' +
                            '<div class="fd-skel" style="width:78%"></div>' +
                        '</div>' +
                        '<button class="fd-cta">Explore Activity <i class="fas fa-arrow-right"></i></button>' +
                    '</div>' +
                    '<div class="fd-card fd-card--blog" id="fdBlogCard" role="button" tabindex="0" aria-label="Open Blog Writing">' +
                        '<div class="fd-card-header">' +
                            '<div class="fd-card-icon"><i class="fas fa-pen-nib"></i></div>' +
                            '<div>' +
                                '<div class="fd-card-title">Writing</div>' +
                                '<div class="fd-card-sub">Dev.to · Medium</div>' +
                            '</div>' +
                        '</div>' +
                        '<div id="fdBlogContent">' +
                            '<div class="fd-skel" style="width:45%"></div>' +
                            '<div class="fd-skel" style="width:100%"></div>' +
                            '<div class="fd-skel" style="width:70%"></div>' +
                        '</div>' +
                        '<button class="fd-cta">Read Articles <i class="fas fa-arrow-right"></i></button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        projects.parentNode.insertBefore(section, projects);

        // ── click / keyboard handlers ────────────────────────────────
        var fdDevCard  = document.getElementById('fdDevCard');
        var fdBlogCard = document.getElementById('fdBlogCard');

        function makeCardClickable(card, fn) {
            card.addEventListener('click', fn);
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
            });
        }
        makeCardClickable(fdDevCard,  openDev);
        makeCardClickable(fdBlogCard, openBlog);

        // ── IntersectionObserver entrance animation ──────────────────
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        [fdDevCard, fdBlogCard].forEach(function (card) { observer.observe(card); });

        // ── 3-D tilt effect (desktop) ────────────────────────────────
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            [fdDevCard, fdBlogCard].forEach(addTiltEffect);
        }

        // ── populate dev card ────────────────────────────────────────
        populateDevDiscoverCard();
    }

    // 3-D tilt
    function addTiltEffect(card) {
        card.addEventListener('mousemove', function (e) {
            if (!card.classList.contains('in-view')) return;
            card.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
            var r  = card.getBoundingClientRect();
            var x  = (e.clientX - r.left) / r.width  - 0.5;
            var y  = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = 'perspective(900px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 7) + 'deg) translateY(-6px)';
        });
        card.addEventListener('mouseleave', function () {
            if (!card.classList.contains('in-view')) return;
            card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, box-shadow 0.3s ease';
            card.style.transform = 'translateY(0)';
        });
    }

    // Populate dev discover card
    function populateDevDiscoverCard() {
        var devContent = document.getElementById('fdDevContent');
        if (!devContent) return;

        Promise.all([
            fetch('https://api.github.com/users/' + GITHUB_USERNAME).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
            fetch('https://alfa-leetcode-api.onrender.com/' + LEETCODE_USERNAME + '/solved').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
        ]).then(function (results) {
            var u = results[0] || { public_repos: '12+', followers: '15' };
            var s = results[1] || { solvedProblem: '21+', easySolved: 20, mediumSolved: 1, hardSolved: 0 };
            
            var easyPct = Math.min(100, Math.max(1, (parseFloat(s.easySolved) / Math.max(1, parseFloat(s.solvedProblem))) * 100)) || 0;
            var medPct = Math.min(100, Math.max(1, (parseFloat(s.mediumSolved) / Math.max(1, parseFloat(s.solvedProblem))) * 100)) || 0;
            var hardPct = Math.min(100, Math.max(1, (parseFloat(s.hardSolved) / Math.max(1, parseFloat(s.solvedProblem))) * 100)) || 0;

            devContent.innerHTML =
                '<div class="fd-stats">' +
                    '<div class="fd-stat"><div class="fd-stat-num">' + u.public_repos + '</div><div class="fd-stat-label">Repos</div></div>' +
                    '<div class="fd-stat"><div class="fd-stat-num">' + u.followers + '</div><div class="fd-stat-label">Followers</div></div>' +
                    '<div class="fd-stat"><div class="fd-stat-num">' + s.solvedProblem + '</div><div class="fd-stat-label">Solved</div></div>' +
                '</div>' +
                '<div class="fd-lc-bars">' +
                    '<div class="fd-lc-bar"><div class="fd-lc-label">Easy <span style="color:#00b8a3">' + s.easySolved + '</span></div><div class="fd-lc-track"><div class="fd-lc-fill easy" style="width:' + easyPct + '%"></div></div></div>' +
                    '<div class="fd-lc-bar"><div class="fd-lc-label">Med <span style="color:#ffc01e">' + s.mediumSolved + '</span></div><div class="fd-lc-track"><div class="fd-lc-fill medium" style="width:' + medPct + '%"></div></div></div>' +
                    '<div class="fd-lc-bar"><div class="fd-lc-label">Hard <span style="color:#ff375f">' + s.hardSolved + '</span></div><div class="fd-lc-track"><div class="fd-lc-fill hard" style="width:' + hardPct + '%"></div></div></div>' +
                '</div>';
                
            // Mark activity dot if real data
            if (u && u.public_repos) {
                var actDot = document.getElementById('dockActivityDot');
                if (actDot) actDot.classList.add('visible');
            }
        });
    }


    // Populate blog discover card (called after blog posts load)
    function populateBlogDiscoverCard(posts) {
        var blogContent = document.getElementById('fdBlogContent');
        if (!blogContent) return;

        if (!posts || !posts.length) {
            blogContent.innerHTML = '<p style="color:var(--text-muted);font-size:0.84rem;text-align:center;padding:0.75rem 0;">Articles coming soon…</p>';
            return;
        }

        var latest = posts.slice(0, 2);
        blogContent.innerHTML =
            '<div class="fd-blog-preview">' +
            latest.map(function (p) {
                return '<div class="fd-blog-post">' +
                       '<div class="fd-blog-source ' + p.source + '">' + (p.source === 'devto' ? 'Dev.to' : 'Medium') + '</div>' +
                       '<div class="fd-blog-title">' + p.title + '</div>' +
                       '<div class="fd-blog-date">' + timeAgo(p.date) + ' · ' + fmtDate(p.date) + '</div>' +
                       '</div>';
            }).join('') +
            '</div>';
    }

    // ── Pre-fetch blog for discover card without opening the overlay ─
    // Only if the section is likely to be scrolled into view (IntersectionObserver)
    function initBlogPreFetch() {
        var discoverSection = document.getElementById('featureDiscover');
        if (!discoverSection) return;
        var ioPreFetch = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                ioPreFetch.disconnect();
                if (!blogLoaded) {
                    Promise.all([fetchDevTo(), fetchMedium()]).then(function (results) {
                        var all = results[0].concat(results[1]);
                        all.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
                        blogPosts = all;
                        blogLoaded = true;
                        populateBlogDiscoverCard(all);
                        if (all.length > 0) {
                            var badge = document.getElementById('orbitBadge');
                            if (badge) badge.classList.add('visible');
                        }
                    });
                }
            }
        }, { rootMargin: '200px' });
        ioPreFetch.observe(discoverSection);
    }

    // Inject section then kick off pre-fetch
    injectDiscoverSection();
    initBlogPreFetch();


    // ================================================================
    // FEATURE 6 — CURSOR BLOB (desktop / fine-pointer only)
    // ================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var blob = document.createElement('div');
        blob.className = 'cursor-blob';
        blob.id = 'cursorBlob';
        document.body.appendChild(blob);

        var blobX = 0, blobY = 0, targetX = 0, targetY = 0, blobRAF;

        document.addEventListener('mousemove', function (e) {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function animateBlob() {
            blobX += (targetX - blobX) * 0.1;
            blobY += (targetY - blobY) * 0.1;
            blob.style.left = blobX + 'px';
            blob.style.top  = blobY + 'px';
            blobRAF = requestAnimationFrame(animateBlob);
        }
        animateBlob();

        // Expand on interactive elements
        document.addEventListener('mouseover', function (e) {
            var el = e.target;
            if (el.closest('a, button, .fd-card, .orbit-item, .blog-post-card, .gh-repo-card, .profile-card')) {
                blob.classList.add('large');
            } else {
                blob.classList.remove('large');
            }
        });

        // Pause RAF when window hidden (battery saving)
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(blobRAF);
            } else {
                animateBlob();
            }
        });
    }

})();

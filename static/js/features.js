// ===================================
// ADDITIVE FEATURES JS
// Command Palette · Dev Activity Overlay · Blog Overlay
// ===================================

(function () {
    'use strict';

    // ========== CONFIG ==========
    const DEVTO_USERNAME = 'rounak161106';
    const MEDIUM_USERNAME = 'rounak16112006';
    const GITHUB_USERNAME = 'rounak161106';
    const LEETCODE_USERNAME = 'SRWo0aM93N';

    const PROFILES = [
        { name: 'GitHub', icon: 'fab fa-github', cls: 'github', user: 'rounak161106', url: 'https://github.com/rounak161106' },
        { name: 'LeetCode', icon: 'fas fa-code', cls: 'leetcode', user: 'SRWo0aM93N', url: 'https://leetcode.com/u/SRWo0aM93N/' }
    ];

    // ========== UTILS ==========
    function inject(html) {
        const d = document.createElement('div');
        d.innerHTML = html.trim();
        while (d.firstChild) document.body.appendChild(d.firstChild);
    }

    function navTo(sel) {
        const el = document.querySelector(sel);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }

    function stripHtml(html) {
        const d = document.createElement('div');
        d.innerHTML = html;
        return d.textContent || '';
    }

    function fmtDate(str) {
        try { return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
        catch { return str; }
    }

    function skelLines(n) {
        return `<div class="dev-skeleton">${'<div class="dev-skel-line"></div>'.repeat(n)}</div>`;
    }

    // Theme cycling
    const themeList = ['blue', 'green', 'red', 'cyan'];
    function cycleTheme() {
        const cur = document.documentElement.getAttribute('data-theme') || 'blue';
        const next = themeList[(themeList.indexOf(cur) + 1) % themeList.length];
        document.documentElement.removeAttribute('data-theme');
        if (next !== 'blue') document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        document.querySelectorAll('.theme-option').forEach(b =>
            b.classList.toggle('active', b.getAttribute('data-theme') === next)
        );
    }

    // ========== BACK BUTTON SUPPORT ==========
    window.addEventListener('popstate', function () {
        if (devOvEl && devOvEl.classList.contains('open')) {
            devOvEl.classList.remove('open');
            document.body.style.overflow = '';
            return;
        }
        if (blogOvEl && blogOvEl.classList.contains('open')) {
            blogOvEl.classList.remove('open');
            document.body.style.overflow = '';
            return;
        }
    });

    var devOvEl, blogOvEl, cmdOvEl;

    // =============================================
    // FEATURE 1: COMMAND PALETTE
    // =============================================
    const commands = [
        { group: 'Actions', icon: 'fas fa-chart-bar', label: 'Dev Activity', hint: 'GitHub · LeetCode', action: function () { openDev(); } },
        { group: 'Actions', icon: 'fas fa-pen-nib', label: 'Blog / Writing', hint: 'Dev.to · Medium', action: function () { openBlog(); } },
        { group: 'Actions', icon: 'fas fa-palette', label: 'Switch Theme', hint: 'Cycle next', action: cycleTheme },
        { group: 'Navigate', icon: 'fas fa-home', label: 'Home', action: function () { navTo('#home'); } },
        { group: 'Navigate', icon: 'fas fa-user', label: 'About', action: function () { navTo('#about'); } },
        { group: 'Navigate', icon: 'fas fa-cogs', label: 'Skills', action: function () { navTo('#skills'); } },
        { group: 'Navigate', icon: 'fas fa-project-diagram', label: 'Projects', action: function () { navTo('#projects'); } },
        { group: 'Navigate', icon: 'fas fa-certificate', label: 'Certifications', action: function () { navTo('#certifications'); } },
        { group: 'Navigate', icon: 'fas fa-envelope', label: 'Contact', action: function () { navTo('#contact'); } },
    ];

    inject(`
        <div class="cmd-palette-overlay" id="cmdOverlay">
            <div class="cmd-palette-card" role="dialog" aria-label="Command palette">
                <div class="cmd-search">
                    <i class="fas fa-search"></i>
                    <input type="text" id="cmdInput" placeholder="Type a command..." autocomplete="off" />
                    <span class="cmd-kbd">ESC</span>
                </div>
                <div class="cmd-list" id="cmdList"></div>
            </div>
        </div>
        <button class="cmd-trigger" id="cmdTrigger" aria-label="Command palette (Ctrl+K)" title="Ctrl+K">
            <i class="fas fa-keyboard"></i>
        </button>
    `);

    cmdOvEl = document.getElementById('cmdOverlay');
    var cmdIn = document.getElementById('cmdInput');
    var cmdLs = document.getElementById('cmdList');
    var cmdIdx = 0, cmdFilt = commands.slice();

    function renderCmd(q) {
        q = (q || '').toLowerCase().trim();
        cmdFilt = q ? commands.filter(function (c) {
            return c.label.toLowerCase().indexOf(q) >= 0 ||
                   c.group.toLowerCase().indexOf(q) >= 0 ||
                   (c.hint || '').toLowerCase().indexOf(q) >= 0;
        }) : commands.slice();
        cmdIdx = 0;
        var h = '', lg = '';
        cmdFilt.forEach(function (c, i) {
            if (c.group !== lg) { h += '<div class="cmd-group-label">' + c.group + '</div>'; lg = c.group; }
            h += '<div class="cmd-item' + (i === 0 ? ' selected' : '') + '" data-i="' + i + '">' +
                '<i class="' + c.icon + '"></i><span class="cmd-item-label">' + c.label + '</span>' +
                (c.hint ? '<span class="cmd-item-hint">' + c.hint + '</span>' : '') + '</div>';
        });
        if (!cmdFilt.length) h = '<div class="cmd-no-results">No matching commands</div>';
        cmdLs.innerHTML = h;
        cmdLs.querySelectorAll('.cmd-item').forEach(function (el) {
            el.addEventListener('click', function () { execCmd(parseInt(el.getAttribute('data-i'))); });
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
            cmdOvEl.classList.remove('open');
            document.body.style.overflow = '';
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

    document.getElementById('cmdTrigger').addEventListener('click', openCmd);
    cmdOvEl.addEventListener('click', function (e) { if (e.target === cmdOvEl) closeCmd(); });
    cmdIn.addEventListener('input', function () { renderCmd(cmdIn.value); });

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            cmdOvEl.classList.contains('open') ? closeCmd() : openCmd();
            return;
        }
        if (!cmdOvEl.classList.contains('open')) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeCmd(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); cmdIdx = Math.min(cmdIdx + 1, cmdFilt.length - 1); hlCmd(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); cmdIdx = Math.max(cmdIdx - 1, 0); hlCmd(); }
        if (e.key === 'Enter') { e.preventDefault(); execCmd(cmdIdx); }
    });

    // =============================================
    // FEATURE 2: DEV ACTIVITY
    // =============================================
    var profilesHTML = PROFILES.filter(function (p) { return p.url; }).map(function (p) {
        return '<a class="profile-card" href="' + p.url + '" target="_blank" rel="noopener">' +
            '<div class="profile-card-icon ' + p.cls + '"><i class="' + p.icon + '"></i></div>' +
            '<div class="profile-card-info"><div class="profile-card-name">' + p.name + '</div>' +
            '<div class="profile-card-user">@' + p.user + '</div></div></a>';
    }).join('');

    const FEATURED_REPOS = ['e-waste-india', 'flask-article-app', 'restraunt_table_reservation_system', 'modern-application-development'];

    inject(`
        <div class="dev-overlay" id="devOverlay">
            <button class="dev-close" id="devClose" aria-label="Close"><i class="fas fa-times"></i></button>
            <div class="dev-inner">
                <div class="dev-hero" style="text-align: center; margin-bottom: 2rem;">
                    <span class="dev-hero-tag">Developer</span>
                    <h1>Dev <span>Activity</span></h1>
                    <p class="dev-hero-desc" style="max-width: 600px; margin: 1rem auto 0;">Deep-dive into my professional coding journey across multiple platforms.</p>
                </div>
                
                <div class="dev-section">
                    <div class="dev-section-title"><i class="fas fa-globe"></i> Profiles Timeline</div>
                    <div class="profiles-grid">${profilesHTML}</div>
                </div>

                <div class="dev-stack-col" style="display: flex; flex-direction: column; gap: 2.5rem;">
                    
                    <div class="dev-section" style="background: rgba(255,255,255,0.015); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.04);">
                        <div class="dev-section-title" style="margin-bottom: 1.5rem;"><i class="fab fa-github"></i> GitHub Contributions</div>
                        <div id="ghBox"></div>
                        <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
                            <div class="dev-section-title" style="font-size: 1.05rem; display:flex; justify-content:space-between; align-items:center;">
                                <span><i class="fas fa-star"></i> Featured Open Source</span>
                                <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" rel="noopener" style="color: var(--primary-color); font-size: 0.85rem; font-weight: 500; text-decoration: none;">View All <i class="fas fa-arrow-right"></i></a>
                            </div>
                            <div id="ghRepos"></div>
                        </div>
                    </div>
                    
                    <div class="dev-section" style="background: rgba(255,255,255,0.015); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.04);">
                        <div class="dev-section-title" style="margin-bottom: 1.5rem;"><i class="fas fa-code"></i> Data Structures & Algorithms</div>
                        <div id="lcBox"></div>
                    </div>

                </div>
            </div>
        </div>
    `);

    devOvEl = document.getElementById('devOverlay');
    var devLoaded = false;

    function loadGH() {
        var box = document.getElementById('ghBox');
        var rbox = document.getElementById('ghRepos');
        box.innerHTML = skelLines(3);
        rbox.innerHTML = skelLines(2);

        var userPromise = fetch('https://api.github.com/users/' + GITHUB_USERNAME).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
        var repoPromises = FEATURED_REPOS.map(function(repoName) {
            return fetch('https://api.github.com/repos/' + GITHUB_USERNAME + '/' + repoName).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
        });

        Promise.all([userPromise, Promise.all(repoPromises)]).then(function (results) {
            // Gracefully handle rate limit by providing generic fallback data
            var u = results[0] || {
                login: GITHUB_USERNAME,
                name: 'Rounak Prasad',
                avatar_url: 'https://avatars.githubusercontent.com/' + GITHUB_USERNAME,
                public_repos: '12',
                followers: '15',
                following: '25',
                bio: 'Passionate about Data Science and Machine Learning.'
            };

            var allRepos = results[1] || [];
            var repos = allRepos.filter(function(r) { return r !== null; });

            var themeColor = document.documentElement.getAttribute('data-theme') || 'blue';
            var ghColor = themeColor === 'green' ? '41b883' : (themeColor === 'red' ? 'ff6b6b' : (themeColor === 'cyan' ? '00f2fe' : '4facfe'));
            
            box.innerHTML = '<div class="gh-profile" style="flex-direction:column; gap:1.5rem; align-items:center;">' +
                '<div style="display:flex; flex-wrap: wrap; gap:1.5rem; align-items:center; width:100%;">' +
                    '<img class="gh-avatar" src="' + u.avatar_url + '" alt="' + u.login + '" style="margin: 0; width: 80px; height: 80px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />' +
                    '<div class="gh-info" style="text-align:left; flex: 1; min-width: 200px;"><div class="gh-name" style="font-size: 1.4rem;">' + (u.name || u.login) + ' <a href="https://github.com/' + GITHUB_USERNAME + '" target="_blank" style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-external-link-alt"></i></a></div>' +
                    '<div class="gh-bio" style="font-size: 0.95rem; line-height: 1.4;">' + (u.bio || '') + '</div></div>' +
                    '<div class="gh-stats-row" style="background: var(--body-bg); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05);">' +
                    '<span class="gh-stat"><i class="fas fa-book" style="color:var(--primary-color)"></i> <strong>' + u.public_repos + '</strong> repos</span>' +
                    '<span class="gh-stat"><i class="fas fa-user-friends" style="color:var(--primary-color)"></i> <strong>' + u.followers + '</strong> followers</span>' +
                    '</div>' +
                '</div>' +
                '<div style="width:100%; margin-top: 0.5rem; overflow:hidden; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align:center;"><img style="width:100%; display: block;" src="https://github-readme-activity-graph.vercel.app/graph?username=' + GITHUB_USERNAME + '&bg_color=0f1423&color=' + ghColor + '&line=' + ghColor + '&point=ffffff&area=true&hide_border=true" alt="GitHub Activity Graph" /></div>' + 
                '<div style="width:100%; margin-top: 1.5rem; overflow:hidden; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align:center;"><img style="width:100%; display: block; padding: 1rem;" src="https://ghchart.rshah.org/' + ghColor + '/' + GITHUB_USERNAME + '" alt="GitHub Year Heatmap" /></div>' + 
            '</div>';

            if (repos && repos.length > 0) {
                rbox.innerHTML = '<div class="gh-repos-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">' + repos.map(function (r) {
                    var cleanName = r.name.replace(/[-_]/g, ' ');
                    var desc = r.description || '<span style="opacity:0.6">A personal open source repository showcasing practical implementation.</span>';
                    return '<a class="gh-repo-card" href="' + r.html_url + '" target="_blank" rel="noopener" style="background: var(--body-bg);">' +
                        '<div class="gh-repo-name" style="text-transform: capitalize;"><i class="fas fa-bookmark" style="color:var(--primary-color)"></i> ' + cleanName + '</div>' +
                        '<div class="gh-repo-desc" style="font-size: 0.85rem;">' + desc + '</div>' +
                        '<div class="gh-repo-meta" style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.05);">' +
                        (r.language ? '<span><i class="fas fa-circle" style="font-size:0.5rem; color:var(--primary-color)"></i> ' + r.language + '</span>' : '') +
                        '<span><i class="fas fa-star" style="color: gold;"></i> ' + r.stargazers_count + '</span>' +
                        '<span><i class="fas fa-code-branch"></i> ' + r.forks_count + '</span>' +
                        '</div></a>';
                }).join('') + '</div>';
            } else {
                // Rate-limited fallback for repos
                rbox.innerHTML = '<div class="gh-repos-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">' + FEATURED_REPOS.map(function (name) {
                    return '<a class="gh-repo-card" href="https://github.com/' + GITHUB_USERNAME + '/' + name + '" target="_blank" rel="noopener" style="background: var(--body-bg);">' +
                        '<div class="gh-repo-name" style="text-transform: capitalize;"><i class="fas fa-bookmark" style="color:var(--primary-color)"></i> ' + name.replace(/[-_]/g, ' ') + '</div>' +
                        '<div class="gh-repo-desc" style="font-size: 0.85rem;"><span style="opacity:0.6">Click to view this repository on GitHub.</span></div>' +
                        '<div class="gh-repo-meta" style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.05);">' +
                        '<span><i class="fab fa-github"></i> View Source</span>' +
                        '</div></a>';
                }).join('') + '</div>';
            }
        });
    }

    function loadLC() {
        var box = document.getElementById('lcBox');
        box.innerHTML = '<div class="lc-card" style="display:flex; justify-content:center; align-items:center; min-height: 200px;">' + skelLines(4) + '</div>';

        // Fetch user data from Alfa LeetCode API for a completely native matching UI
        Promise.all([
            fetch('https://alfa-leetcode-api.onrender.com/' + LEETCODE_USERNAME).then(function(r){return r.json()}).catch(function(){return null}),
            fetch('https://alfa-leetcode-api.onrender.com/' + LEETCODE_USERNAME + '/solved').then(function(r){return r.json()}).catch(function(){return null})
        ]).then(function(results) {
            var u = results[0] || {
                username: LEETCODE_USERNAME,
                name: 'Rounak Prasad',
                avatar: 'https://assets.leetcode.com/users/SRWo0aM93N/avatar_1753846199.png',
                ranking: '3,962,919',
                about: 'Practicing data structures and algorithms.'
            };
            var s = results[1] || { solvedProblem: 21, easySolved: 20, mediumSolved: 1, hardSolved: 0 };
            
            var lcHeatmap = 'https://leetcard.jacoblin.cool/' + LEETCODE_USERNAME + '?theme=dark&font=Syne&ext=heatmap';
            var rankNum = u.ranking ? u.ranking.toLocaleString() : 'N/A';
            
            box.innerHTML = '<div class="lc-profile" style="display:flex; flex-direction:column; gap:1.5rem; align-items:center;">' +
                '<div style="display:flex; flex-wrap: wrap; gap:1.5rem; align-items:center; width:100%;">' +
                    '<img class="gh-avatar" src="' + u.avatar + '" alt="' + u.username + '" style="margin: 0; width: 80px; height: 80px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />' +
                    '<div class="gh-info" style="text-align:left; flex: 1; min-width: 200px;">' +
                        '<div class="gh-name" style="font-size: 1.4rem;">' + (u.name || u.username) + ' <a href="https://leetcode.com/u/' + LEETCODE_USERNAME + '/" target="_blank" style="font-size: 0.9rem; color: var(--text-muted);"><i class="fas fa-external-link-alt"></i></a></div>' +
                        '<div class="gh-bio" style="font-size: 0.95rem; line-height: 1.4;">' + (u.about || 'Practicing DSA on LeetCode.') + '</div>' +
                    '</div>' +
                    '<div class="gh-stats-row" style="background: var(--body-bg); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05);">' +
                        '<span class="gh-stat" style="color:#FFA116;"><i class="fas fa-trophy"></i> <strong>Rank ' + rankNum + '</strong></span>' +
                        '<span class="gh-stat" style="color:#2EC866;"><i class="fas fa-check-circle"></i> <strong>' + s.solvedProblem + '</strong> solved</span>' +
                    '</div>' +
                '</div>' +
                '<div style="width:100%; display:flex; gap: 1rem; margin-top: 0.5rem; padding: 1.5rem; background: var(--body-bg); border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); justify-content: space-around; text-align: center;">' +
                    '<div style="display:flex; flex-direction:column; gap:0.5rem;"><span style="color:#00b8a3; font-weight:bold; font-size:1.2rem;">' + s.easySolved + '</span><span style="font-size:0.8rem; color:var(--text-muted);">Easy</span></div>' +
                    '<div style="display:flex; flex-direction:column; gap:0.5rem;"><span style="color:#ffc01e; font-weight:bold; font-size:1.2rem;">' + s.mediumSolved + '</span><span style="font-size:0.8rem; color:var(--text-muted);">Medium</span></div>' +
                    '<div style="display:flex; flex-direction:column; gap:0.5rem;"><span style="color:#ef4743; font-weight:bold; font-size:1.2rem;">' + s.hardSolved + '</span><span style="font-size:0.8rem; color:var(--text-muted);">Hard</span></div>' +
                '</div>' +
                '<a href="https://leetcode.com/u/' + LEETCODE_USERNAME + '/" target="_blank" rel="noopener" style="width:100%; margin-top: 0.5rem; overflow:hidden; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); text-align:center; transition: transform 0.3s ease;">' +
                    '<img style="width:100%; display: block;" src="' + lcHeatmap + '" alt="LeetCode Heatmap" />' +
                '</a>' +
            '</div>';
        });
    }

    function openDev() {
        // Close any other overlay first
        if (blogOvEl && blogOvEl.classList.contains('open')) {
            blogOvEl.classList.remove('open');
        }
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
            e.preventDefault();
            closeDev();
        }
    });


    // =============================================
    // FEATURE 3: BLOG / WRITING OVERLAY
    // =============================================

    inject(`
        <div class="blog-overlay" id="blogOverlay">
            <button class="blog-close" id="blogClose" aria-label="Close"><i class="fas fa-times"></i></button>
            <div class="blog-inner">
                <div class="blog-hero">
                    <span class="blog-hero-tag">Writing</span>
                    <h1>Latest <span>Articles</span></h1>
                    <p class="blog-hero-desc">Thoughts on machine learning, coding, and my journey in data science — pulled live from Dev.to and Medium.</p>
                </div>
                <div class="blog-tabs" id="blogTabs">
                    <button class="blog-tab active" data-src="all"><i class="fas fa-layer-group"></i> All</button>
                    <button class="blog-tab" data-src="devto"><i class="fab fa-dev"></i> Dev.to</button>
                    <button class="blog-tab" data-src="medium"><i class="fab fa-medium"></i> Medium</button>
                </div>
                <div class="blog-grid" id="blogGrid"></div>
            </div>
        </div>
        <button class="blog-trigger" id="blogTrigger" aria-label="Open blog">✍️ Writing</button>
    `);

    blogOvEl = document.getElementById('blogOverlay');
    var blogGrid = document.getElementById('blogGrid');
    var blogPosts = [], blogFilter = 'all', blogLoaded = false;

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
                return '<div class="blog-skel-card"><div class="blog-skel-line w30"></div><div class="blog-skel-line w70"></div><div class="blog-skel-line w100"></div><div class="blog-skel-line w90"></div></div>';
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
                '<div class="blog-post-meta"><span class="blog-post-source ' + p.source + '">' + (p.source === 'devto' ? 'DEV.TO' : 'MEDIUM') + '</span>' +
                '<span class="blog-post-date">' + fmtDate(p.date) + '</span></div>' +
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
        });
    }

    function openBlog() {
        if (devOvEl && devOvEl.classList.contains('open')) {
            devOvEl.classList.remove('open');
        }
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

    document.getElementById('blogTrigger').addEventListener('click', openBlog);
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
            e.preventDefault();
            closeBlog();
        }
    });

})();

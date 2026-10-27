/* App: shelf -> cuisine book -> recipe play */
(function () {
  var root = document.getElementById('app');
  var save = {};
  try { save = JSON.parse(localStorage.getItem('cookbook.v1') || '{}'); } catch (e) { save = {}; }
  save.done = save.done || {}; save.xp = save.xp || 0; if (save.sound === undefined) save.sound = true;
  function persist() { try { localStorage.setItem('cookbook.v1', JSON.stringify(save)); } catch (e) { } }

  var ac, cleanups = [];
  function sfx(kind) {
    if (!save.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(); o.connect(g); g.connect(ac.destination);
      o.frequency.value = { good: 660, bad: 160, pop: 880, chop: 300, done: 990 }[kind] || 440;
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle';
      g.gain.setValueAtTime(0.07, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.15);
      o.start(); o.stop(ac.currentTime + 0.16);
    } catch (e) { }
  }
  function runCleanups() { cleanups.forEach(function (f) { try { f(); } catch (e) { } }); cleanups = []; }

  var stars = function (n, max) { var s = ''; for (var i = 0; i < (max || 3); i++) s += '<span class="' + (i < n ? 'on' : '') + '">★</span>'; return '<span class="stars">' + s + '</span>'; };

  var MOTIFS = {
    mandala: '<circle cx="50" cy="50" r="10" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="38"/></g><g fill="currentColor"><ellipse cx="50" cy="26" rx="5" ry="9"/><ellipse cx="50" cy="74" rx="5" ry="9"/><ellipse cx="26" cy="50" rx="9" ry="5"/><ellipse cx="74" cy="50" rx="9" ry="5"/><ellipse cx="33" cy="33" rx="4" ry="8" transform="rotate(-45 33 33)"/><ellipse cx="67" cy="67" rx="4" ry="8" transform="rotate(-45 67 67)"/><ellipse cx="67" cy="33" rx="4" ry="8" transform="rotate(45 67 33)"/><ellipse cx="33" cy="67" rx="4" ry="8" transform="rotate(45 33 67)"/></g>',
    lantern: '<rect x="44" y="8" width="12" height="8" fill="currentColor"/><ellipse cx="50" cy="52" rx="28" ry="32" fill="currentColor"/><path d="M50 20 V84 M34 24 Q24 52 34 80 M66 24 Q76 52 66 80" stroke="#0004" stroke-width="3" fill="none"/><rect x="42" y="84" width="16" height="6" fill="currentColor"/><path d="M50 90 v8" stroke="currentColor" stroke-width="3"/>',
    star: '<polygon points="50,6 60,30 86,24 70,46 94,60 66,64 68,92 50,74 32,92 34,64 6,60 30,46 14,24 40,30" fill="currentColor"/><circle cx="50" cy="50" r="11" fill="#0003"/>',
    stripes: '<rect x="10" y="12" width="24" height="76" rx="3" fill="currentColor"/><rect x="38" y="12" width="24" height="76" rx="3" fill="#fff" opacity=".9"/><rect x="66" y="12" width="24" height="76" rx="3" fill="#0004"/>',
    sun: '<circle cx="50" cy="50" r="18" fill="currentColor"/><g stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M50 10v14M50 76v14M10 50h14M76 50h14M22 22l10 10M68 68l10 10M78 22L68 32M32 68L22 78"/></g>',
    sunrise: '<circle cx="50" cy="50" r="30" fill="currentColor"/><path d="M0 70 H100" stroke="#0003" stroke-width="2"/>',
    fleur: '<path d="M50 8 Q34 30 50 52 Q66 30 50 8Z M50 54 Q26 34 14 52 Q24 62 40 56 Q30 72 36 82 Q50 66 50 54Z M50 54 Q74 34 86 52 Q76 62 60 56 Q70 72 64 82 Q50 66 50 54Z" fill="currentColor"/><rect x="34" y="62" width="32" height="8" rx="3" fill="currentColor"/><path d="M42 74 L50 92 L58 74Z" fill="currentColor"/>'
  };
  var motif = function (k) { return '<svg viewBox="0 0 100 100" aria-hidden="true">' + MOTIFS[k] + '</svg>'; };

  function find(cuId, rId) {
    var c = CUISINES.filter(function (x) { return x.id === cuId; })[0];
    return rId ? [c, c.dishes.filter(function (x) { return x.id === rId; })[0]] : c;
  }
  function doneCount(c) { return c.dishes.filter(function (d) { return save.done[d.id]; }).length; }
  function soundBtn() { return '<button class="icon-btn snd" title="Sound on/off">' + (save.sound ? '🔊' : '🔇') + '</button>'; }
  function bindSound() {
    var b = root.querySelector('.snd');
    if (b) b.onclick = function () { save.sound = !save.sound; persist(); b.textContent = save.sound ? '🔊' : '🔇'; };
  }
  function swap(html, cls) {
    runCleanups(); root.className = cls || ''; root.innerHTML = html; root.scrollTop = 0;
  }
  function confetti() {
    var cols = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#fde047'];
    for (var i = 0; i < 70; i++) {
      var d = document.createElement('i'); d.className = 'confetti';
      d.style.cssText = 'left:' + Math.random() * 100 + 'vw;background:' + cols[i % cols.length] + ';animation-delay:' + Math.random() * 0.6 + 's;animation-duration:' + (2 + Math.random() * 2) + 's;transform:rotate(' + Math.random() * 360 + 'deg)';
      document.body.appendChild(d); setTimeout(function (e) { e.remove(); }, 4800, d);
    }
  }

  /* ---------- SHELF ---------- */
  var HEIGHTS = [1, 0.9, 0.97, 0.86, 0.94, 0.88, 0.99], WIDTHS = [1, 0.92, 1.05, 0.95, 1, 0.9, 1.04];
  function showShelf() {
    function book(c, i) {
      return '<button class="book" data-id="' + c.id + '" style="--c:' + c.color + ';--a:' + c.accent + ';--h:' + HEIGHTS[i] + ';--w:' + WIDTHS[i] + '" aria-label="' + c.name + ' cookbook">' +
        '<span class="band top"></span><span class="motif" style="color:' + c.accent + '">' + motif(c.motif) + '</span>' +
        '<span class="spine-title">' + c.name + '</span><span class="band bot"></span><span class="count">' + doneCount(c) + '/5</span></button>';
    }
    var rows = [CUISINES.slice(0, 4), CUISINES.slice(4)], idx = 0;
    var shelves = rows.map(function (r) { return '<div class="shelf"><div class="books">' + r.map(function (c) { return book(c, idx++); }).join('') + '</div><div class="plank"></div></div>'; }).join('');
    swap('<div class="room"><header class="lib-head"><div><h1>The Little Cookbook Library</h1><p>Pick a book from the shelf and cook your way around the world.</p></div><div class="top-right"><span class="xp">⭐ ' + save.xp + ' XP</span>' + soundBtn() + '</div></header><main class="bookcase"><div class="case-frame">' + shelves + '</div></main></div>', 'view-shelf');
    bindSound();
    root.querySelectorAll('.book').forEach(function (b) {
      b.onclick = function () { openCover(b, find(b.dataset.id)); };
    });
  }

  function openCover(el, c) {
    var r = el.getBoundingClientRect(), cover = document.createElement('div');
    cover.className = 'cover'; cover.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;background:' + c.color + ';color:' + c.accent;
    cover.innerHTML = '<div class="cover-in"><div class="cover-motif">' + motif(c.motif) + '</div><h2>' + c.name + '</h2><p>' + c.title + '</p></div>';
    document.body.appendChild(cover);
    var a = cover.animate([{ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }, { left: '0px', top: '0px', width: window.innerWidth + 'px', height: window.innerHeight + 'px' }], { duration: 550, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
    a.onfinish = function () {
      showBook(c);
      var f = cover.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
      f.onfinish = function () { cover.remove(); };
    };
  }

  /* ---------- CUISINE BOOK ---------- */
  function showBook(c) {
    var cards = c.dishes.map(function (d) {
      var p = save.done[d.id];
      return '<button class="dish" data-id="' + d.id + '"><div class="dish-art">' + ART.plate(d.plate, d.name.length) + '</div><h3>' + d.name + '</h3><div class="dish-meta">⏱ ' + d.time + ' min · ' + d.diff + '</div>' + stars(p ? p.stars : 0) + '</button>';
    }).join('');
    swap('<div class="spread" style="--c:' + c.color + ';--a:' + c.accent + '"><section class="page left"><div class="pg-top"><button class="back" id="back">← Library</button>' + soundBtn() + '</div><div class="big-motif" style="color:' + c.color + '">' + motif(c.motif) + '</div><h2 class="cu-title">' + c.name + ' Kitchen</h2><div class="subtitle">' + c.title + '</div><p class="blurb">' + c.blurb + '</p><div class="prog"><div style="width:' + doneCount(c) / c.dishes.length * 100 + '%"></div></div><small>' + doneCount(c) + ' of ' + c.dishes.length + ' dishes cooked</small></section><div class="gutter"></div><section class="page right"><h3 class="contents">Table of Recipes</h3><div class="dish-grid">' + cards + '</div></section></div>', 'view-book');
    bindSound();
    root.querySelector('#back').onclick = showShelf;
    root.querySelectorAll('.dish').forEach(function (b) { b.onclick = function () { openRecipe(c, find(c.id, b.dataset.id)[1]); }; });
  }

  /* ---------- RECIPE ---------- */
  function openRecipe(c, r) {
    var idx = 0, total = 0, combo = 0, bestCombo = 0, xp = 0, items = [], used = {}, finished = false;
    swap('<div class="spread recipe" style="--c:' + c.color + ';--a:' + c.accent + '"><section class="page left"><div class="pg-top"><button class="back" id="back">← ' + c.name + '</button>' + soundBtn() + '</div><h2 class="r-title">' + r.name + '</h2><div class="meta">⏱ ' + r.time + ' min · ' + r.diff + ' · serves 4</div><div class="vessel" id="vessel"></div><h3 class="sec">Ingredients</h3><div class="ings" id="ings"></div></section><div class="gutter"></div><section class="page right"><div class="hud"><span id="h-stars">★ 0</span><span id="h-combo">🔥 x0</span><span id="h-xp">⭐ 0 XP</span></div><div class="trail" id="trail"></div><div id="stepbox"></div></section></div>', 'view-recipe');
    bindSound();
    var vesselEl = root.querySelector('#vessel'), stepbox = root.querySelector('#stepbox');
    root.querySelector('#back').onclick = function () { showBook(c); };

    function renderVessel(steam) { vesselEl.innerHTML = ART.vessel(r.vessel, items.map(ART.color), { steam: steam }); }
    function renderIngs() {
      root.querySelector('#ings').innerHTML = r.ings.map(function (i) { return '<div class="ing' + (used[i[0]] ? ' used' : '') + '">' + ART.svg(i[0]) + '<b>' + ART.name(i[0]) + '</b><small>' + i[1] + '</small></div>'; }).join('');
    }
    function renderTrail() {
      root.querySelector('#trail').innerHTML = r.steps.map(function (s, i) { return '<span class="dot ' + (i < idx ? 'done' : i === idx ? 'cur' : '') + '">' + (i < idx ? '✓' : i + 1) + '</span>'; }).join('');
    }
    function hud() {
      root.querySelector('#h-stars').textContent = '★ ' + total; root.querySelector('#h-combo').textContent = '🔥 x' + combo; root.querySelector('#h-xp').textContent = '⭐ ' + xp + ' XP';
    }
    renderVessel(false); renderIngs();

    function startStep() {
      runCleanups(); renderTrail(); hud();
      var s = r.steps[idx];
      stepbox.innerHTML = '<div class="stepno">Step ' + (idx + 1) + ' of ' + r.steps.length + ' · <span class="gname">' + { add: 'Add', chop: 'Chop', stir: 'Stir', heat: 'Heat', sprinkle: 'Season', simmer: 'Simmer', flip: 'Flip', knead: 'Knead' }[s.g] + '</span></div><p class="instr">' + s.t + '</p><div class="stage" id="stage"></div><div class="fb" id="fb"></div>';
      var ctx = {
        step: s, recipe: r, stage: stepbox.querySelector('#stage'), vesselEl: vesselEl, cleanups: cleanups, sfx: sfx,
        items: function () { return items; },
        addToVessel: function (id) { items.push(id); used[id] = true; renderVessel(false); renderIngs(); vesselEl.classList.remove('plop'); void vesselEl.offsetWidth; vesselEl.classList.add('plop'); }
      };
      GAMES[s.g](ctx).then(function (st) { if (!finished) endStep(st); });
    }
    function endStep(st) {
      runCleanups(); sfx('done');
      total += st; combo = st === 3 ? combo + 1 : 0; bestCombo = Math.max(bestCombo, combo);
      var gain = st * 10 + (combo > 1 ? combo * 2 : 0); xp += gain; hud();
      var last = idx === r.steps.length - 1;
      var fb = stepbox.querySelector('#fb');
      stepbox.querySelector('#stage').classList.add('faded');
      fb.innerHTML = '<div class="verdict">' + ['', 'Keep practising!', 'Nice work!', 'Perfect!'][st] + '</div>' + stars(st) + '<div class="gain">+' + gain + ' XP' + (combo > 1 ? ' · combo x' + combo + '!' : '') + '</div><button class="big next" id="next">' + (last ? 'Plate it! 🍽️' : 'Next step →') + '</button>';
      var nb = fb.querySelector('#next'); nb.focus();
      nb.onclick = function () { if (last) finish(); else { idx++; startStep(); } };
    }
    function finish() {
      finished = true; idx = r.steps.length; renderTrail();
      var pct = total / (r.steps.length * 3), rating = pct > 0.85 ? 3 : pct > 0.6 ? 2 : 1;
      var prev = save.done[r.id]; if (!prev || prev.stars < rating) save.done[r.id] = { stars: rating };
      save.xp += xp; persist(); hud(); sfx('done'); confetti();
      r.ings.forEach(function (i) { used[i[0]] = true; }); renderIngs();
      vesselEl.innerHTML = '<div class="plated">' + ART.plate(r.plate, r.name.length) + '</div>';
      var cnt = doneCount(c);
      stepbox.innerHTML = '<div class="finish"><h2>Bon appétit!</h2><p>You cooked <b>' + r.name + '</b>.</p>' + stars(rating) + '<div class="summary"><span>★ ' + total + '/' + (r.steps.length * 3) + '</span><span>🔥 best combo x' + bestCombo + '</span><span>⭐ ' + xp + ' XP</span></div>' + (cnt === 5 ? '<div class="badge">🏅 ' + c.name + ' Master badge unlocked!</div>' : '') + '<div class="actions"><button class="big" id="again">Cook again</button><button class="big alt" id="tobook">Back to ' + c.name + ' book</button></div></div>';
      stepbox.querySelector('#again').onclick = function () { openRecipe(c, r); };
      stepbox.querySelector('#tobook').onclick = function () { showBook(c); };
    }
    startStep();
  }

  showShelf();
})();

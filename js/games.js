/* Cooking mini-games. Each returns a Promise resolving to 1..3 stars. */
var GAMES = (function () {
  function shuffle(a) { return a.map(function (v) { return [Math.random(), v]; }).sort(function (x, y) { return x[0] - y[0]; }).map(function (v) { return v[1]; }); }
  function cleanup(ctx, fn) { ctx.cleanups.push(fn); }
  function vesselHTML(ctx, steam) { return ART.vessel(ctx.recipe.vessel, ctx.items().map(ART.color), { steam: steam }); }

  function fly(card, ctx, cb) {
    var svg = card.querySelector('svg'), a = svg.getBoundingClientRect(), v = ctx.vesselEl.getBoundingClientRect();
    var clone = svg.cloneNode(true);
    clone.style.cssText = 'position:fixed;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;z-index:999;pointer-events:none';
    document.body.appendChild(clone);
    var dx = v.left + v.width / 2 - a.left - a.width / 2, dy = v.top + v.height / 2 - a.top - a.height / 2;
    var an = clone.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + dx * 0.6 + 'px,' + (dy * 0.6 - 90) + 'px) scale(1.1) rotate(120deg)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.35) rotate(260deg)', opacity: 0.4 }
    ], { duration: 700, easing: 'ease-in' });
    an.onfinish = function () { clone.remove(); cb(); };
  }

  /* 1. ADD: tap the right ingredients */
  function add(ctx) {
    return new Promise(function (res) {
      var need = new Set(ctx.step.ids), mistakes = 0, pending = 0;
      var recIds = ctx.recipe.ings.map(function (i) { return i[0]; });
      var extra = recIds.filter(function (i) { return !need.has(i); });
      var foreign = shuffle(ART.ids.filter(function (i) { return recIds.indexOf(i) < 0; })).slice(0, 4);
      var want = Math.max(3, Math.min(8, need.size + 3));
      var decoys = shuffle(extra).slice(0, Math.ceil(want / 2)).concat(foreign).slice(0, Math.max(2, want - need.size));
      var cards = shuffle(Array.from(need).concat(decoys));
      ctx.stage.innerHTML = '<div class="tray">' + cards.map(function (id) { return '<button class="card" data-id="' + id + '">' + ART.svg(id) + '<span>' + ART.name(id) + '</span></button>'; }).join('') + '</div><p class="hint">Tap the ingredients this step needs. Wrong picks cost a star!</p>';
      ctx.stage.querySelectorAll('.card').forEach(function (card) {
        card.onclick = function () {
          if (card.classList.contains('gone')) return;
          var id = card.dataset.id;
          if (need.has(id)) {
            need.delete(id); pending++; card.classList.add('gone'); ctx.sfx('good');
            fly(card, ctx, function () {
              ctx.addToVessel(id); pending--;
              if (!need.size && !pending) res(mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1);
            });
          } else {
            mistakes++; ctx.sfx('bad'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
          }
        };
      });
    });
  }

  /* 2. CHOP: click along the dashed guides */
  function chop(ctx) {
    return new Promise(function (res) {
      var n = ctx.step.n, W = 320, IW = 150, x0 = (W - IW) / 2, guides = [], used = [], err = 0, cuts = [];
      for (var i = 0; i < n; i++) guides.push(x0 + IW * (i + 1) / (n + 1));
      ctx.stage.innerHTML = '<div class="board" style="width:' + W + 'px"><div class="item" style="left:' + x0 + 'px;width:' + IW + 'px">' + ART.svg(ctx.step.id) + '</div>' +
        guides.map(function (g) { return '<i class="guide" style="left:' + g + 'px"></i>'; }).join('') + '<div class="knife" id="knife">🔪</div></div><p class="hint">Tap on the dashed lines to slice. <b id="left">' + n + '</b> cuts to go.</p>';
      var board = ctx.stage.querySelector('.board'), knife = ctx.stage.querySelector('#knife'), left = ctx.stage.querySelector('#left'), done = false;
      board.onclick = function (e) {
        if (done) return;
        var r = board.getBoundingClientRect(), x = e.clientX - r.left;
        x = Math.max(x0 + 4, Math.min(x0 + IW - 4, x));
        var best = -1, bd = 1e9;
        guides.forEach(function (g, i) { if (used.indexOf(i) < 0 && Math.abs(g - x) < bd) { bd = Math.abs(g - x); best = i; } });
        used.push(best); err += bd; cuts.push(x); ctx.sfx('chop');
        knife.style.left = (x - 14) + 'px'; knife.classList.remove('chopping'); void knife.offsetWidth; knife.classList.add('chopping');
        var cut = document.createElement('i'); cut.className = 'cut'; cut.style.left = x + 'px'; board.appendChild(cut);
        board.querySelectorAll('.guide')[best].style.opacity = .15;
        left.textContent = n - cuts.length;
        if (cuts.length >= n) {
          done = true;
          var sorted = cuts.slice().sort(function (a, b) { return a - b; }), edges = [x0].concat(sorted, [x0 + IW]), svg = ART.svg(ctx.step.id), html = '';
          for (var k = 0; k < edges.length - 1; k++) html += '<div class="slice" style="left:' + edges[k] + 'px;width:' + (edges[k + 1] - edges[k]) + 'px;--dx:' + ((k - (edges.length - 2) / 2) * 5) + 'px"><div style="margin-left:' + (-(edges[k] - x0)) + 'px;width:' + IW + 'px">' + svg + '</div></div>';
          board.querySelector('.item').style.display = 'none'; board.querySelectorAll('.cut,.guide').forEach(function (c) { c.remove(); });
          board.insertAdjacentHTML('beforeend', html);
          var avg = err / n, stars = avg < 9 ? 3 : avg < 18 ? 2 : 1;
          setTimeout(function () { res(stars); }, 900);
        }
      };
    });
  }

  /* 3. STIR: drag in circles */
  function stir(ctx) {
    return new Promise(function (res) {
      var target = ctx.step.n * Math.PI * 2, total = 0, last = null, t0 = null, done = false, ang = 0;
      ctx.stage.innerHTML = '<div class="stirwrap" id="sw">' + vesselHTML(ctx, false) + '<div class="spoon" id="spoon">🥄</div></div><div class="bar"><div id="pb"></div></div><p class="hint">Drag in circles around the pot to stir. <button class="mini" id="tap">or tap to stir</button></p>';
      var sw = ctx.stage.querySelector('#sw'), spoon = ctx.stage.querySelector('#spoon'), pb = ctx.stage.querySelector('#pb'), cg = sw.querySelector('.cg');
      function update() {
        pb.style.width = Math.min(100, total / target * 100) + '%';
        cg.style.transform = 'rotate(' + (total * 25) + 'deg)';
        spoon.style.transform = 'rotate(' + ang + 'rad)';
        if (total >= target && !done) {
          done = true; ctx.sfx('good');
          var s = (performance.now() - t0) / 1000, per = s / ctx.step.n;
          setTimeout(function () { res(per < 2.5 ? 3 : per < 5 ? 2 : 1); }, 300);
        }
      }
      sw.onpointerdown = function (e) { sw.setPointerCapture(e.pointerId); last = null; };
      sw.onpointerup = function () { last = null; };
      sw.onpointermove = function (e) {
        if (e.buttons === 0 && e.pointerType === 'mouse') return;
        var r = sw.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        if (Math.hypot(x, y) < 20) return;
        var a = Math.atan2(y, x);
        if (last !== null) { var d = a - last; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; if (t0 === null) t0 = performance.now(); total += Math.abs(d); }
        last = a; ang = a; update();
      };
      ctx.stage.querySelector('#tap').onclick = function () { if (t0 === null) t0 = performance.now(); total += target / 14; ang += 0.8; update(); };
    });
  }

  /* 4. HEAT: hold to heat, release in the green */
  function heat(ctx) {
    return new Promise(function (res) {
      var temp = 0, holding = false, attempts = 0, raf, last = performance.now(), lo = 52 + Math.random() * 18, hi = lo + 20, done = false;
      ctx.stage.innerHTML = '<div class="burner"><div class="flame" id="flame">🔥</div><div class="mini-vessel">' + vesselHTML(ctx, true) + '</div></div><div class="therm"><div class="zone" style="left:' + lo + '%;width:' + (hi - lo) + '%"></div><div class="mark" id="mk"></div></div><div class="msg" id="msg">Hold the button to heat up, release in the green.</div><button class="big" id="hold">🔥 Hold to heat</button>';
      var mk = ctx.stage.querySelector('#mk'), flame = ctx.stage.querySelector('#flame'), msg = ctx.stage.querySelector('#msg'), btn = ctx.stage.querySelector('#hold');
      function loop(now) {
        var dt = (now - last) / 1000; last = now;
        temp = Math.max(0, Math.min(100, temp + (holding ? 36 : -10) * dt));
        mk.style.left = temp + '%'; flame.style.transform = 'scale(' + (0.5 + temp / 70) + ')'; flame.style.opacity = 0.3 + temp / 100;
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop); cleanup(ctx, function () { cancelAnimationFrame(raf); });
      function down() { if (!done) holding = true; }
      function up() {
        if (!holding || done) return; holding = false;
        if (temp < 5) return;
        attempts++;
        if (temp >= lo && temp <= hi) {
          done = true; ctx.sfx('good'); msg.textContent = 'Perfect temperature! 🎉'; setTimeout(function () { res(attempts === 1 ? 3 : attempts === 2 ? 2 : 1); }, 700);
        } else { ctx.sfx('bad'); msg.textContent = temp < lo ? 'Too cold. Try again!' : 'Too hot! Careful, it burns!'; temp = 0; }
      }
      btn.onpointerdown = function (e) { btn.setPointerCapture(e.pointerId); down(); };
      btn.onpointerup = btn.onpointercancel = up;
      btn.onkeydown = function (e) { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); down(); } };
      btn.onkeyup = function (e) { if (e.code === 'Space') up(); };
    });
  }

  /* 5. SPRINKLE: tap the shaker, stop on target */
  function sprinkle(ctx) {
    return new Promise(function (res) {
      var id = ctx.step.id, n = ctx.step.n, taps = 0, max = Math.max(10, n + 4);
      var marks = '';
      for (var i = 1; i <= max; i++) marks += '<i class="pip' + (i === n ? ' target' : '') + '" data-i="' + i + '"></i>';
      ctx.stage.innerHTML = '<div class="shakerwrap"><button class="shaker" id="shk" aria-label="Shake">' + ART.svg(id) + '<span>' + ART.name(id) + '</span></button><div class="mini-vessel big">' + vesselHTML(ctx, false) + '<div class="drops" id="drops"></div></div></div><div class="pips">' + marks + '</div><p class="hint">Tap the shaker. Stop at the ★ mark (about <b>' + n + '</b> pinches).</p><button class="big" id="enough">That is enough ✓</button>';
      var shk = ctx.stage.querySelector('#shk'), drops = ctx.stage.querySelector('#drops');
      var pips = ctx.stage.querySelectorAll('.pip');
      shk.onclick = function () {
        if (taps >= max) return; taps++; ctx.sfx('pop');
        pips[taps - 1].classList.add('on');
        shk.classList.remove('shaking'); void shk.offsetWidth; shk.classList.add('shaking');
        for (var k = 0; k < 6; k++) { var d = document.createElement('b'); d.style.left = (20 + Math.random() * 60) + '%'; d.style.background = ART.color(id); d.style.animationDelay = (Math.random() * 0.2) + 's'; drops.appendChild(d); setTimeout(function (e) { e.remove(); }, 900, d); }
      };
      ctx.stage.querySelector('#enough').onclick = function () {
        var diff = Math.abs(taps - n);
        ctx.addToVessel(id); res(taps === 0 ? 1 : diff === 0 ? 3 : diff === 1 ? 2 : 1);
      };
    });
  }

  /* 6. SIMMER: pop the bubbles */
  function simmer(ctx) {
    return new Promise(function (res) {
      var n = ctx.step.n, popped = 0, missed = 0, done = false, tm, W = 300, H = 190;
      var liquid = ctx.items().length ? ART.color(ctx.items()[ctx.items().length - 1]) : '#e8b86b';
      ctx.stage.innerHTML = '<div class="potscene" id="ps" style="width:' + W + 'px;height:' + H + 'px"><div class="liquid" style="background:' + liquid + '"></div><div class="potbody"></div></div><p class="hint">Pop <b id="cnt">' + n + '</b> bubbles before they reach the top!</p>';
      var ps = ctx.stage.querySelector('#ps'), cnt = ctx.stage.querySelector('#cnt');
      function spawn() {
        if (done) return;
        var b = document.createElement('button'); b.className = 'bubble'; var s = 26 + Math.random() * 18; b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (14 + Math.random() * (W - 28 - s)) + 'px;animation-duration:' + (2.4 + Math.random() * 1.2) + 's';
        b.onpointerdown = function () { if (b.dataset.p) return; b.dataset.p = 1; popped++; ctx.sfx('pop'); cnt.textContent = Math.max(0, n - popped); b.classList.add('pop'); setTimeout(function () { b.remove(); }, 200); if (popped >= n && !done) { done = true; clearInterval(tm); setTimeout(function () { res(missed <= 2 ? 3 : missed <= 5 ? 2 : 1); }, 400); } };
        b.onanimationend = function () { if (!b.dataset.p) { missed++; b.remove(); } };
        ps.appendChild(b);
      }
      tm = setInterval(spawn, 650); spawn(); cleanup(ctx, function () { clearInterval(tm); done = true; });
    });
  }

  /* 7. FLIP: timing bar */
  function flip(ctx) {
    return new Promise(function (res) {
      var round = 0, hits = 0, raf, t0 = performance.now(), speed = 1.6, zc = 0.3 + Math.random() * 0.4, zw = 0.2, busy = false;
      ctx.stage.innerHTML = '<div class="tossrow"><div class="mini-vessel big" id="tv">' + vesselHTML(ctx, false) + '</div></div><div class="timing"><div class="tzone" id="tz"></div><div class="tmark" id="tm"></div></div><div class="msg" id="msg">Press when the marker is in the green. Round 1 of 3</div><button class="big" id="go">🍳 Flip!</button>';
      var tz = ctx.stage.querySelector('#tz'), tmk = ctx.stage.querySelector('#tm'), msg = ctx.stage.querySelector('#msg'), tv = ctx.stage.querySelector('#tv'), pos = 0;
      function setZone() { tz.style.left = (zc - zw / 2) * 100 + '%'; tz.style.width = zw * 100 + '%'; }
      setZone();
      function loop(now) { var t = (now - t0) / 1000 * speed; pos = Math.abs(((t % 2) + 2) % 2 - 1); tmk.style.left = pos * 100 + '%'; raf = requestAnimationFrame(loop); }
      raf = requestAnimationFrame(loop); cleanup(ctx, function () { cancelAnimationFrame(raf); });
      function press() {
        if (busy) return; busy = true;
        var hit = Math.abs(pos - zc) <= zw / 2; round++;
        tv.classList.remove('toss'); void tv.offsetWidth; tv.classList.add('toss');
        if (hit) { hits++; ctx.sfx('good'); } else ctx.sfx('bad');
        msg.textContent = (hit ? 'Nice flip! ' : 'Missed! ') + (round < 3 ? 'Round ' + (round + 1) + ' of 3' : '');
        if (round >= 3) { cancelAnimationFrame(raf); setTimeout(function () { res(hits >= 3 ? 3 : hits === 2 ? 2 : 1); }, 700); return; }
        speed += 0.4; zc = 0.25 + Math.random() * 0.5; zw = Math.max(0.12, zw - 0.04); setZone();
        setTimeout(function () { busy = false; }, 500);
      }
      ctx.stage.querySelector('#go').onclick = press;
    });
  }

  /* 8. KNEAD: drag back and forth */
  function knead(ctx) {
    return new Promise(function (res) {
      var n = ctx.step.n, count = 0, lastX = null, dir = 0, ext = null, t0 = null, done = false;
      ctx.stage.innerHTML = '<div class="doughpad" id="dp"><div class="dough" id="dg"></div><div class="hand" id="hd">✋</div></div><div class="bar"><div id="pb"></div></div><p class="hint">Drag left and right across the dough to work it. <button class="mini" id="tap">or tap to knead</button></p>';
      var dp = ctx.stage.querySelector('#dp'), dg = ctx.stage.querySelector('#dg'), hd = ctx.stage.querySelector('#hd'), pb = ctx.stage.querySelector('#pb');
      function bump(k) {
        if (t0 === null) t0 = performance.now();
        count += k; pb.style.width = Math.min(100, count / n * 100) + '%'; ctx.sfx('chop');
        if (count >= n && !done) { done = true; var s = (performance.now() - t0) / 1000, per = s / n; setTimeout(function () { res(per < 1.2 ? 3 : per < 2.5 ? 2 : 1); }, 300); }
      }
      dp.onpointermove = function (e) {
        var r = dp.getBoundingClientRect(), x = e.clientX - r.left;
        hd.style.left = x + 'px'; dg.style.transform = 'scale(' + (1 + Math.sin(x / 25) * 0.07) + ',' + (1 - Math.sin(x / 25) * 0.07) + ')';
        if (e.buttons === 0 && e.pointerType === 'mouse') { lastX = null; return; }
        if (lastX === null) { lastX = x; ext = x; return; }
        var d = x > lastX ? 1 : x < lastX ? -1 : 0; if (d !== 0 && d !== dir) { if (Math.abs(x - ext) > 70) { bump(1); } dir = d; ext = x; } lastX = x;
      };
      dp.onpointerdown = function (e) { dp.setPointerCapture(e.pointerId); lastX = null; };
      ctx.stage.querySelector('#tap').onclick = function () { dg.classList.remove('squish'); void dg.offsetWidth; dg.classList.add('squish'); bump(1); };
    });
  }

  return { add: add, chop: chop, stir: stir, heat: heat, sprinkle: sprinkle, simmer: simmer, flip: flip, knead: knead };
})();

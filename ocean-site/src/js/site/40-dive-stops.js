
/* ---------- Dive pages: the camera travels from stop to stop ---------- */
var ENV = {
  bright:{ tint:[1.25,1.2,1.15], shaft:1.2, vig:.25, bloom:0 },
  teal:{ tint:[0.95,1.18,1.1], shaft:.9, vig:.32, bloom:.05 },
  dusk:{ tint:[0.8,0.9,1.15], shaft:.45, vig:.4, bloom:.1 },
  dark:{ tint:[0.7,0.75,0.95], shaft:.15, vig:.5, bloom:.15 },
  abyss:{ tint:[0.55,0.6,0.8], shaft:0, vig:.58, bloom:.2 },
  threat:{ tint:[1.35,0.8,0.8], shaft:.5, vig:.5, bloom:.1 }
};
var STAGE = { on:false, page:null, stops:[], n:0, idx:-1, p:0, target:0, vel:0, travelling:false, lockIn:0, lastIn:0, lockTo:0, acc:0, accT:0, last:performance.now(),
  visited:{}, solved:{}, env:{ tint:[1,1,1], shaft:1, vig:.35, bloom:0 }, envTo:ENV.teal, side:'center', loc:'', hold:0, holdOn:false, modal:false, prompt:false, spin:0 };
var TOTAL_STOPS = $$('.page.stage .stop').length;
var jprog = $('#jprog'), jPath = $('#jprog-path'), jDone = $('#jprog-done'), jArrow = $('#jprog-arrow'), sprompt = $('#sprompt'), vigEl = $('.vig');
var jLen = 0; try { jLen = jPath.getTotalLength(); } catch(e){}
function stopKey(n, k){ return n + ':' + k; }
function discoveredPct(){ return Object.keys(STAGE.visited).length/Math.max(1, TOTAL_STOPS); }

function stageEnter(page, k){
  var el = pageEl(page);
  STAGE.on = true; STAGE.page = page; STAGE.stops = $$('.stop', el); STAGE.n = STAGE.stops.length;
  STAGE.idx = -1; k = Math.max(0, Math.min(STAGE.n - 1, k || 0)); STAGE.p = k; STAGE.target = k; STAGE.vel = 0;
  STAGE.stops.forEach(function(s){ s.classList.remove('is-on','is-off'); });
  /* markers along the progress path */
  $$('.jp-mark', jprog).forEach(function(m){ m.remove(); });
  STAGE.stops.forEach(function(s, i){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'jp-mark'; b.setAttribute('aria-label', 'Go to stop ' + (i + 1) + ' of ' + STAGE.n);
    var f = STAGE.n > 1 ? i/(STAGE.n - 1) : 0, pt = jLen ? jPath.getPointAtLength(f*jLen) : { x:30, y:200*f };
    b.style.left = (pt.x/60*100) + '%'; b.style.top = (pt.y/400*100) + '%';
    b.addEventListener('click', function(){ travelTo(i, true); });
    jprog.appendChild(b);
  });
  if (jLen){ jDone.style.strokeDasharray = jLen; }
  showStop(k);
}
function stageLeave(){
  if (!STAGE.on) return;
  if (STAGE.idx >= 0) hideStop(STAGE.idx, true);
  STAGE.on = false; STAGE.page = null; STAGE.idx = -1; STAGE.holdOn = false;
  root.classList.remove('threat','prompting','at-end'); hidePrompt();
}
function stopY(k){ var P = PAGE[STAGE.page]; return P.y0 + (P.y1 - P.y0)*(STAGE.n > 1 ? k/(STAGE.n - 1) : 0); }
function locked(){ var s = STAGE.stops[STAGE.idx]; return s && s.dataset.lock && !STAGE.solved[stopKey(STAGE.page, STAGE.idx)]; }
function lockedLimit(){
  /* the camera can't pass an unsolved problem */
  for (var i = 0; i < STAGE.n; i++){ var st = STAGE.stops[i]; if (st.dataset.lock && !STAGE.solved[stopKey(STAGE.page, i)] && STAGE.p <= i + 0.02) return i; }
  return STAGE.n - 1;
}
function travelTo(k, jump){
  if (!STAGE.on || STAGE.modal || busy) return;
  k = Math.max(0, Math.min(STAGE.n - 1, k));
  var lim = lockedLimit();
  if (k > lim){ k = lim; var h = STAGE.stops[lim] && $('.hint', STAGE.stops[lim]); if (h) flicker(h); }
  STAGE.target = k; STAGE.last = performance.now(); hidePrompt();
}
function showStop(k){
  var s = STAGE.stops[k]; if (!s) return;
  STAGE.idx = k; STAGE.last = performance.now(); Sound.tick('hover');
  s.classList.remove('is-off'); s.classList.add('is-on');
  STAGE.side = s.dataset.side || 'center'; STAGE.loc = s.dataset.loc || '';
  var key = stopKey(STAGE.page, k), solvedNow = !!STAGE.solved[key];
  var isProblem = s.dataset.type === 'problem';
  STAGE.envTo = ENV[isProblem && solvedNow ? 'teal' : (s.dataset.env || 'teal')] || ENV.teal;
  root.classList.toggle('threat', isProblem && !solvedNow);
  root.classList.toggle('at-end', s.dataset.type === 'end');
  STAGE.visited[key] = 1; STAGE.spin = 1;
  if (k > 0) history.replaceState(null, '', '#' + STAGE.page + '/' + k); else history.replaceState(null, '', '#' + STAGE.page);
  $$('.jp-mark', jprog).forEach(function(m, i){ m.classList.toggle('on', i <= k); });
  /* the panel's own entrance */
  $$('.scr', s).forEach(function(e, i){ var v = e.dataset.v || (e.dataset.v = e.textContent); wait(.15 + i*.1).then(function(){ scramble(e, v, 1, .2); }); });
  $$('.h-wipe', s).forEach(function(e, i){ if (!e.hidden) wipeLines(e, .1 + i*.1); });
  $$('.wl', s).forEach(function(e){ wipeLines(e, .45); });
  $$('.rot', s).forEach(function(e){ rotateIn(e, .6); });
  $$('.statement', s).forEach(function(e){ shuffleIn(e); });
  $$('.cap[data-scramble]', s).forEach(function(e){ e.textContent = ''; wait(1.3).then(function(){ scramble(e, e.dataset.scramble, 1, .3); }); });
  $$('.stats dd', s).forEach(function(dd, i){ var v = dd.dataset.v || (dd.dataset.v = dd.textContent); wait(.35 + i*.12).then(function(){ scramble(dd, v, 1.3, .25); }); });
  if (s.dataset.type === 'narrated') startNarration(s);
  if (isProblem) setupProblem(s, solvedNow);
  if (s.dataset.type === 'slider') setupSlider(s);
  if (s.dataset.type === 'quiz') setupQuiz(s);
  if (s.dataset.type === 'contact'){ var sc = $('.stop-scroll', s); if (sc) sc.scrollTop = 0; }
}
function hideStop(k, instant){
  var s = STAGE.stops[k]; if (!s) return;
  s.classList.remove('is-on');
  if (!instant){ s.classList.add('is-off'); setTimeout(function(){ s.classList.remove('is-off'); }, 800); }
  stopNarration(s);
  if (s.dataset.type === 'problem'){ STAGE.holdOn = false; root.classList.remove('threat'); }
}

/* ---------- input: wheel, swipe, keys ---------- */
function canScrollInside(t, dir){
  var sc = t && t.closest && t.closest('.stop-scroll'); if (!sc) return false;
  if (dir > 0) return sc.scrollTop + sc.clientHeight < sc.scrollHeight - 2;
  return sc.scrollTop > 2;
}
function nudge(stops){
  var now = performance.now(); STAGE.last = now; STAGE.lastIn = now; hidePrompt();
  if (!STAGE.on || STAGE.modal || guide.open || now < STAGE.lockIn) return;
  var near = Math.abs(STAGE.p - Math.round(STAGE.p)) < 0.2 ? 0.75 : 1;        /* slower near a stop, like the reference */
  STAGE.target = Math.max(0, Math.min(lockedLimit(), STAGE.target + stops*near));
}
function stageInput(dir){ travelTo((STAGE.idx >= 0 ? STAGE.idx : Math.round(STAGE.p)) + dir); }
window.addEventListener('wheel', function(e){
  if (!STAGE.on) return;
  var d = e.deltaMode === 1 ? e.deltaY*30 : e.deltaY;
  if (canScrollInside(e.target, d > 0 ? 1 : -1) || (e.target.closest && e.target.closest('.guide,.modal'))) { STAGE.last = performance.now(); return; }
  nudge(Math.max(-0.3, Math.min(0.3, d/750)));
}, {passive:true});
var stTouch = null;
window.addEventListener('touchstart', function(e){ if (!STAGE.on) return; var t = e.target; if (t.closest && t.closest('.guide,.modal,.ba-frame,.therm,.hold,.pdial,.stop-scroll')) { stTouch = null; return; } stTouch = { y:e.touches[0].clientY, t:performance.now(), v:0 }; }, {passive:true});
window.addEventListener('touchmove', function(e){
  if (!STAGE.on || !stTouch) return;
  var y = e.touches[0].clientY, now = performance.now(), dy = stTouch.y - y, dt = Math.max(1, now - stTouch.t);
  stTouch.v = 0.7*stTouch.v + 0.3*(dy/dt); stTouch.y = y; stTouch.t = now;
  nudge(dy/430);
}, {passive:true});
window.addEventListener('touchend', function(){ if (!STAGE.on || !stTouch) return; nudge(Math.max(-0.9, Math.min(0.9, stTouch.v*0.55))); stTouch = null; }, {passive:true});
window.addEventListener('keydown', function(e){
  if (!STAGE.on) return;
  var tag = (document.activeElement || {}).tagName || '';
  if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !/BUTTON|A/.test(tag))){ e.preventDefault(); stageInput(1); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp'){ e.preventDefault(); stageInput(-1); }
});

/* ---------- each frame: glide, catch stops, release them ---------- */
function stageTravel(dt){
  if (!STAGE.on) return;
  var now = performance.now();
  var prev = STAGE.p;
  STAGE.p += (STAGE.target - STAGE.p)*(1 - Math.exp(-(reduce ? 12 : 3.4)*dt));
  STAGE.vel = (STAGE.p - prev)/Math.max(dt, 1e-3);
  STAGE.travelling = Math.abs(STAGE.target - STAGE.p) > 0.04;
  var k = Math.round(STAGE.p), dist = Math.abs(STAGE.p - k);
  /* leaving a stop: its panel goes as soon as the camera moves on */
  if (STAGE.idx >= 0 && Math.abs(STAGE.p - STAGE.idx) > 0.22){ hideStop(STAGE.idx); STAGE.idx = -1; }
  /* arriving: the camera is caught, settles onto the stop, and input pauses briefly */
  if (STAGE.idx < 0 && dist < 0.12 && k >= 0 && k < STAGE.n){ STAGE.target = k; STAGE.lockIn = now + 200; showStop(k); }
  /* drifting between stops with nothing pressed: settle on the closer one */
  if (STAGE.idx < 0 && !STAGE.travelling && now - STAGE.lastIn > 450) STAGE.target = Math.min(lockedLimit(), Math.round(STAGE.p));
}

/* ---------- the idle prompt ---------- */
function hidePrompt(){ if (!STAGE.prompt) return; STAGE.prompt = false; sprompt.classList.remove('on'); root.classList.remove('prompting'); }
var NEUTRAL = { tint:[1,1,1], shaft:1, vig:.3, bloom:0 };
function stageFrame(dt){
  envTick(dt);
  if (!STAGE.on) return;
  stageTravel(dt);
  var now = performance.now(), s = STAGE.stops[STAGE.idx];
  var wantPrompt = s && !STAGE.travelling && !STAGE.modal && !guide.open && now - STAGE.last > 3500 && STAGE.idx < STAGE.n - 1 && !locked() && s.dataset.type !== 'narrated';
  if (wantPrompt && !STAGE.prompt){ STAGE.prompt = true; sprompt.classList.add('on'); root.classList.add('prompting'); var tx = $('.sp-text', sprompt); scramble(tx, 'Scroll to explore', .8, 0); }
  /* progress path: the line fills and the arrow rides along it */
  var f = STAGE.n > 1 ? STAGE.p/(STAGE.n - 1) : 0;
  if (jLen){
    jDone.style.strokeDashoffset = (jLen*(1 - f)).toFixed(1);
    var pt = jPath.getPointAtLength(f*jLen);
    jArrow.style.left = (pt.x/60*100) + '%'; jArrow.style.top = (pt.y/400*100) + '%';
  }
  STAGE.spin = Math.max(0, STAGE.spin - dt*0.5);
  /* hold-to-automate: progress eases up while held, falls back when released */
  if (STAGE.holdEl){
    var key = STAGE.holdKey;
    if (!STAGE.solved[key]){
      STAGE.hold = Math.max(0, Math.min(1, STAGE.hold + (STAGE.holding ? dt/2.4 : -dt/2)));
      STAGE.holdEl.style.setProperty('--h', STAGE.hold.toFixed(3));
      if (STAGE.hold >= 1) solveProblem(STAGE.holdStop);
    }
  }
}

/* themed water, light and vignette ease toward the stop's settings */
function envTick(dt){
  var e = STAGE.env, t = STAGE.on ? STAGE.envTo : NEUTRAL, k = 1 - Math.exp(-1.2*dt);
  for (var i = 0; i < 3; i++) e.tint[i] += (t.tint[i] - e.tint[i])*k;
  e.shaft += (t.shaft - e.shaft)*k; e.bloom += (t.bloom - e.bloom)*k; e.vig += (t.vig - e.vig)*k;
  vigEl.style.setProperty('--vig', e.vig.toFixed(3));
}

/* ---------- interactive problems ---------- */
function solveProblem(s){
  var key = stopKey(STAGE.page, STAGE.stops.indexOf(s));
  if (STAGE.solved[key]) return;
  STAGE.solved[key] = 1; s.classList.add('done');
  root.classList.remove('threat'); STAGE.envTo = ENV.teal; STAGE.holdOn = false; STAGE.holding = false;
  var a = $('.prob-a', s), b = $('.prob-b', s), h = $('.hint', s);
  if (a) a.hidden = true; if (b){ b.hidden = false; shuffleIn(b); }
  if (h){ h.dataset.v = 'Scroll to continue'; scramble(h, 'Scroll to continue', .8, .1); }
  Sound.tick('done'); STAGE.last = performance.now() - 1500;
}

function dragPoint(el, cb, end){
  el.addEventListener('pointerdown', function(e){
    e.preventDefault(); el.setPointerCapture && el.setPointerCapture(e.pointerId);
    function mv(ev){ cb(ev); } function up(ev){ el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); if (end) end(ev); }
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); cb(e);
  });
}
function setupProblem(s, solved){
  var kind = s.dataset.problem;
  if (!solved){ var a = $('.prob-a', s), b = $('.prob-b', s); if (a) a.hidden = false; if (b) b.hidden = true; s.classList.remove('done'); }
  if (kind === 'hold'){
    STAGE.holdEl = $('.hold', s); STAGE.holdStop = s; STAGE.holdKey = stopKey(STAGE.page, STAGE.stops.indexOf(s)); STAGE.holdOn = !solved;
    if (!solved){ STAGE.hold = 0; STAGE.holdEl.style.setProperty('--h', 0); }
    if (!s._bound){ s._bound = 1;
      var hb = $('.hold', s);
      var onDown = function(e){ e.preventDefault(); STAGE.holding = true; STAGE.last = performance.now(); };
      var onUp = function(){ STAGE.holding = false; };
      hb.addEventListener('pointerdown', onDown); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', onUp);
      hb.addEventListener('keydown', function(e){ if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); STAGE.holding = true; } });
      hb.addEventListener('keyup', onUp);
    }
  } else STAGE.holdEl = null;
  if (kind === 'drag' && !s._bound){ s._bound = 1;
    var track = $('.therm-track', s), bars = $$('.mock-load i', s);
    var set = function(t){ s.style.setProperty('--t', (t*100).toFixed(1) + '%'); $('.therm', s).style.setProperty('--t', (t*100).toFixed(1) + '%');
      bars.forEach(function(b, i){ b.style.setProperty('--f', Math.min(1, 0.08 + t*1.15 - i*0.04).toFixed(3)); }); };
    set(0);
    dragPoint($('.therm-knob', s), function(e){ if (s.classList.contains('done')) return; var r = track.getBoundingClientRect(); var t = Math.max(0, Math.min(1, (e.clientY - r.top)/r.height)); set(t); STAGE.last = performance.now(); if (t > 0.97){ set(1); solveProblem(s); } });
  }
  if (kind === 'dial' && !s._bound){ s._bound = 1;
    var dial = $('.pdial', s), gl = $('.dial-globe', s), acc = 0, lastA = null;
    var draw = function(){ drawGlobe(gl, acc*6.2832*0.5, acc); };
    draw();
    dragPoint(dial, function(e){
      if (s.classList.contains('done')) return;
      var r = dial.getBoundingClientRect(), a = Math.atan2(e.clientY - (r.top + r.height/2), e.clientX - (r.left + r.width/2));
      if (lastA !== null){ var d = a - lastA; if (d > Math.PI) d -= 2*Math.PI; if (d < -Math.PI) d += 2*Math.PI; acc = Math.max(0, Math.min(1, acc + d/(2*Math.PI))); }
      lastA = a; dial.style.setProperty('--a', acc.toFixed(3)); draw(); STAGE.last = performance.now();
      if (acc >= 0.98){ dial.style.setProperty('--a', 1); solveProblem(s); }
    }, function(){ lastA = null; });
  }
}

/* ---------- before and after slider ---------- */
function setupSlider(s){
  if (s._bound) return; s._bound = 1;
  var fr = $('.ba-frame', s), pos = 0.12;
  var set = function(p){ pos = p; fr.style.setProperty('--p', (p*100).toFixed(2) + '%'); };
  set(pos);
  dragPoint($('.ba-handle', s), function(e){ var r = fr.getBoundingClientRect(); set(Math.max(0, Math.min(1, (e.clientX - r.left)/r.width))); STAGE.last = performance.now(); },
    function(){ if (pos > 0.98 || pos < 0.02) return; if (pos > 0.9){ var p0 = pos; tween(1.2, E.out, function(t){ set(p0 + (1 - p0)*t); }); } });
  $('.ba-handle', s).addEventListener('keydown', function(e){ if (e.key === 'ArrowRight') set(Math.min(1, pos + 0.05)); if (e.key === 'ArrowLeft') set(Math.max(0, pos - 0.05)); });
}

/* ---------- quiz ---------- */
function setupQuiz(s){
  if (s._bound) return; s._bound = 1;
  var right = +s.dataset.answer, btns = $$('.qz button', s), out = $('.qz-out', s);
  btns.forEach(function(b, i){ b.addEventListener('click', function(){
    if (s.classList.contains('answered')) return;
    s.classList.add('answered'); btns[right].classList.add('right');
    if (i !== right) b.classList.add('wrong');
    out.textContent = ''; scramble(out, i === right ? 'Correct, well done' : 'Not quite. The answer is marked.', .8, 0);
    Sound.tick(i === right ? 'done' : 'click'); STAGE.last = performance.now() - 1500;
  }); });
}

/* ---------- narration: words light up as they are spoken ---------- */
function startNarration(s){
  var lines = $$('.narr-line', s), i = 0, timers = [];
  s._narr = { stop:false, timers:timers };
  lines.forEach(function(l){ if (!l._split){ l._split = 1; l.innerHTML = l.textContent.trim().split(/\s+/).map(function(w){ return '<span class="w">' + w + '</span>'; }).join(' '); } l.classList.remove('on'); $$('.w', l).forEach(function(w){ w.classList.remove('lit'); }); });
  var speak = Sound.isOn() && 'speechSynthesis' in window;
  if (speak) Sound.duck(0.45);
  function next(){
    if (s._narr.stop) return;
    if (i >= lines.length){ if (speak) Sound.duck(1); STAGE.last = performance.now() - 2000; return; }
    var l = lines[i++], words = $$('.w', l);
    lines.forEach(function(x){ x.classList.remove('on'); }); l.classList.add('on');
    if (speak){
      var u = new SpeechSynthesisUtterance(l.textContent), starts = [], c = 0;
      words.forEach(function(w){ starts.push(c); c += w.textContent.length + 1; });
      u.rate = 0.95; u.pitch = 1; u.lang = 'en-US';
      u.onboundary = function(ev){ var ci = ev.charIndex; words.forEach(function(w, j){ if (starts[j] <= ci) w.classList.add('lit'); }); };
      u.onend = function(){ words.forEach(function(w){ w.classList.add('lit'); }); timers.push(setTimeout(next, 650)); };
      u.onerror = u.onend;
      speechSynthesis.speak(u);
    } else {
      words.forEach(function(w, j){ timers.push(setTimeout(function(){ w.classList.add('lit'); }, 300 + j*260)); });
      timers.push(setTimeout(next, 300 + words.length*260 + 1100));
    }
  }
  timers.push(setTimeout(next, 700));
  var skip = $('.narr-skip', s);
  if (skip && !skip._b){ skip._b = 1; skip.addEventListener('click', function(){ stopNarration(s); lines.forEach(function(x, j){ x.classList.toggle('on', j === lines.length - 1); $$('.w', x).forEach(function(w){ w.classList.add('lit'); }); }); STAGE.last = performance.now() - 3000; }); }
}
function stopNarration(s){
  if (!s._narr) return; s._narr.stop = true; s._narr.timers.forEach(clearTimeout);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  Sound.duck(1);
}

/* ---------- text effects the reference uses ---------- */
function shuffleIn(el){
  if (reduce || !el) return;
  var text = el.dataset.t || (el.dataset.t = el.textContent);
  el.innerHTML = text.split(/(\s+)/).map(function(word){ return /^\s+$/.test(word) ? word : '<span style="display:inline-block;white-space:nowrap">' + word.split('').map(function(ch){ return '<span class="ch">' + ch + '</span>'; }).join('') + '</span>'; }).join('');
  var chs = $$('.ch', el), order = chs.map(function(_, i){ return i; }).sort(function(){ return Math.random() - 0.5; });
  el.classList.remove('go');
  order.forEach(function(ci, n){ var c = chs[ci]; c.style.transitionDelay = (n*(1.4/Math.max(1, chs.length))).toFixed(3) + 's'; });
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('go'); }); });
}
function rotateIn(el, delay){
  if (!el || reduce || !el.animate || el._busy) return;
  el._busy = true;
  var html = el.innerHTML, words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(function(w){ return '<span class="w">' + w + '</span>'; }).join(' ');
  var lines = [], top = null;
  $$('.w', el).forEach(function(w){ var t = w.offsetTop; if (top === null || Math.abs(t - top) > 3){ lines.push([]); top = t; } lines[lines.length-1].push(w.textContent); });
  el.innerHTML = lines.map(function(l){ return '<span class="ln"><span class="li">' + l.join(' ') + '</span></span>'; }).join('');
  var last;
  $$('.li', el).forEach(function(li, i){ last = li.animate([{transform:'translateY(110%) rotate(6deg)', opacity:0},{transform:'translateY(0) rotate(0)', opacity:1}], {duration:1500, delay:(delay||0)*1000 + i*110, easing:EXPO_OUT, fill:'both'}); });
  if (last) last.onfinish = function(){ el.innerHTML = html; el._busy = false; }; else el._busy = false;
}

/* ---------- a small wireframe globe (HUD, dial, spotlights) ---------- */
var OKC = { lat:35.47*Math.PI/180, lon:-97.52*Math.PI/180 };
function drawGlobe(cv, rot, glow){
  if (!cv) return; var c = cv.getContext('2d'); if (!c) return; var w = cv.width, R = w*0.42, cx = w/2, cy = w/2, tilt = 0.35;
  c.clearRect(0, 0, w, w);
  c.lineWidth = Math.max(1, w/90); c.strokeStyle = 'rgba(148,230,251,0.75)';
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI*2); c.stroke();
  c.strokeStyle = 'rgba(148,230,251,0.35)';
  function P(lat, lon){ var x = Math.cos(lat)*Math.sin(lon + rot), y = Math.sin(lat), z = Math.cos(lat)*Math.cos(lon + rot); var y2 = y*Math.cos(tilt) - z*Math.sin(tilt), z2 = y*Math.sin(tilt) + z*Math.cos(tilt); return [cx + x*R, cy - y2*R, z2]; }
  for (var m = 0; m < 12; m++){ var lon = m/12*Math.PI*2; c.beginPath(); var first = true; for (var a = -90; a <= 90; a += 6){ var q = P(a*Math.PI/180, lon); if (q[2] < 0){ first = true; continue; } if (first){ c.moveTo(q[0], q[1]); first = false; } else c.lineTo(q[0], q[1]); } c.stroke(); }
  for (var la = -60; la <= 60; la += 30){ c.beginPath(); var f2 = true; for (var lo = 0; lo <= 360; lo += 6){ var q2 = P(la*Math.PI/180, lo*Math.PI/180); if (q2[2] < 0){ f2 = true; continue; } if (f2){ c.moveTo(q2[0], q2[1]); f2 = false; } else c.lineTo(q2[0], q2[1]); } c.stroke(); }
  var d = P(OKC.lat, OKC.lon);
  if (d[2] > 0){ c.fillStyle = glow ? 'rgba(229,250,255,1)' : 'rgba(148,230,251,1)'; c.beginPath(); c.arc(d[0], d[1], Math.max(2, w/26), 0, Math.PI*2); c.fill(); c.strokeStyle = 'rgba(148,230,251,0.6)'; c.beginPath(); c.arc(d[0], d[1], Math.max(4, w/12), 0, Math.PI*2); c.stroke(); }
}
var hudGlobe = $('#hud-globe'), hudRot = 1.6;
function globeFrame(dt){ hudRot += dt*(0.25 + STAGE.spin*2.5); if (hudGlobe) drawGlobe(hudGlobe, hudRot, 0); }

/* ---------- project spotlight modals ---------- */
var modalWrap = $('#modal-wrap'), modalBox = $('.modal', modalWrap), modalBody = $('#modal-body'), modalPrev = null;
function openModal(id){
  var tpl = document.getElementById(id); if (!tpl) return;
  modalPrev = document.activeElement;
  modalBody.innerHTML = ''; modalBody.appendChild(tpl.content.cloneNode(true));
  modalWrap.hidden = false; STAGE.modal = true; hidePrompt();
  modalBox.classList.remove('closing','open'); void modalBox.offsetWidth;
  requestAnimationFrame(function(){ modalBox.classList.add('open'); });
  $$('.m-title span', modalBody).forEach(function(sp, i){ wipeLines(sp, 1 + i*.15); });
  $$('.m-copy p', modalBody).forEach(function(p){ rotateIn(p, 1.2); });
  $$('.m-stats dd', modalBody).forEach(function(dd, i){ var v = dd.textContent; wait(1.3 + i*.12).then(function(){ scramble(dd, v, 1, .2); }); });
  var cv = $('.m-globe-c', modalBody), r = 2.6;
  if (cv){ (function spin(){ if (modalWrap.hidden) return; r += 0.006; drawGlobe(cv, r, 1); requestAnimationFrame(spin); })(); }
  var track = $('.car-track', modalBody);
  if (track){ var ci = 0, nimg = track.children.length; var go2 = function(d){ ci = (ci + d + nimg) % nimg; track.style.transform = 'translateX(' + (-100*ci) + '%)'; };
    $('.car-prev', modalBody).addEventListener('click', function(){ go2(-1); }); $('.car-next', modalBody).addEventListener('click', function(){ go2(1); }); }
  Sound.tick('click');
  setTimeout(function(){ $('#modal-x').focus({ preventScroll:true }); }, 400);
}
function closeModal(){
  if (modalWrap.hidden) return;
  modalBox.classList.remove('open'); modalBox.classList.add('closing');
  setTimeout(function(){ modalWrap.hidden = true; STAGE.modal = false; STAGE.last = performance.now(); if (modalPrev && modalPrev.focus) modalPrev.focus({ preventScroll:true }); }, 650);
}
document.addEventListener('click', function(e){
  var t = e.target.closest && e.target.closest('[data-modal]'); if (t){ e.preventDefault(); openModal(t.dataset.modal); return; }
  if (e.target === modalWrap) closeModal();
  if (e.target.closest && e.target.closest('.modal [data-go]')) closeModal();
});
$('#modal-x').addEventListener('click', closeModal);
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && !modalWrap.hidden) closeModal();
  if (e.key === 'Tab' && !modalWrap.hidden){ var f = $$('button, a[href]', modalBox); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); } }
});

/* ---------- button sounds ---------- */
var lastHover = null, lastHoverT = 0;
document.addEventListener('pointerover', function(e){
  var t = e.target.closest && e.target.closest('a, button'); if (!t || t === lastHover) return;
  lastHover = t; var now = performance.now(); if (now - lastHoverT < 70) return; lastHoverT = now; Sound.tick('hover');
});
document.addEventListener('pointerout', function(e){ if (lastHover && !lastHover.contains(e.relatedTarget)) lastHover = null; });
document.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('a, button')) Sound.tick('click'); }, true);

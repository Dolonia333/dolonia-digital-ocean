/* ---------- Motion vocabulary: expo easings, flicker, scramble ---------- */
var EXPO_OUT = 'cubic-bezier(.16,1,.3,1)', EXPO_IN = 'cubic-bezier(.7,0,.84,0)';
var E = { out:function(t){ return t>=1 ? 1 : 1 - Math.pow(2, -10*t); }, inn:function(t){ return t<=0 ? 0 : Math.pow(2, 10*t - 10); },
  io4:function(t){ return t < .5 ? 8*t*t*t*t : 1 - Math.pow(-2*t + 2, 4)/2; }, io3:function(t){ return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }, out2:function(t){ return 1 - (1-t)*(1-t); }, ios:function(t){ return -(Math.cos(Math.PI*t) - 1)/2; }, out3:function(t){ return 1 - Math.pow(1 - t, 3); }, lin:function(t){ return t; } };
function wait(sec){ return new Promise(function(r){ setTimeout(r, reduce ? 0 : sec*1000); }); }
function tween(dur, ease, fn){
  return new Promise(function(res){
    if (reduce){ fn(1); res(); return; }
    var t0 = null;
    (function step(ts){ if (t0 === null) t0 = ts; var t = Math.min(1, (ts - t0)/(dur*1000)); fn(ease(t)); if (t < 1) requestAnimationFrame(step); else res(); })(performance.now());
  });
}
/* the signature flicker: .8 .3 .8 .3 then settle to full over .2s */
function flicker(el, to){
  if (!el) return;
  if (reduce || !el.animate){ el.style.opacity = to == null ? 1 : to; return; }
  var end = to == null ? 1 : to;
  el.animate([{opacity:0},{opacity:.8,offset:.12},{opacity:.3,offset:.25},{opacity:.8,offset:.37},{opacity:.3,offset:.5},{opacity:end}], {duration:400, easing:'linear', fill:'forwards'});
}
var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/';
/* characters churn, then lock in left to right */
function scramble(el, text, dur, delay){
  return new Promise(function(res){
    if (reduce){ el.textContent = text; res(); return; }
    var t0 = null, d = (dur || 1.4)*1000, rd = (delay || 0.35)*1000, last = 0;
    (function step(ts){
      if (t0 === null) t0 = ts;
      var e = ts - t0, p = Math.max(0, Math.min(1, (e - rd)/(d - rd))), k = Math.floor(E.out(p)*text.length);
      if (ts - last > 45 || p >= 1){
        last = ts;
        var out = text.slice(0, k);
        for (var i = k; i < text.length; i++) out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random()*GLYPHS.length)|0];
        el.textContent = out;
      }
      if (p < 1) requestAnimationFrame(step); else { el.textContent = text; res(); }
    })(performance.now());
  });
}
/* telemetry line: scramble in, pulse three dots, then the value resolves with a flicker */
function telemetryLine(li){
  li.classList.remove('wait');
  li.innerHTML = '<span class="k"></span><b class="v"></b><span class="dots"><i>.</i><i>.</i><i>.</i></span>';
  var k = li.querySelector('.k'), v = li.querySelector('.v'), dots = li.querySelectorAll('.dots i');
  return Promise.all([scramble(k, li.dataset.k, 1.2, .3), scramble(v, li.dataset.v, 1.5, .5)]).then(function(){
    var on = 0, iv = setInterval(function(){ dots.forEach(function(d, i){ d.style.opacity = i === on % 3 ? 1 : .5; }); on++; }, 200);
    return wait(1.1).then(function(){ clearInterval(iv); li.querySelector('.dots').remove(); v.textContent = li.dataset.r; flicker(v); });
  });
}

/* ---------- Intro: loading dial ---------- */
var introState = { begun:false, real:0, shown:0 };
var dial = $('#dial'), wipe = $('#wipe'), progm = $('#progm'), labels = Array.prototype.slice.call(document.querySelectorAll('.dial-n'));
var MASK_C = 2*Math.PI*154;
[wipe, progm].forEach(function(c){ c.style.strokeDasharray = MASK_C + ' ' + MASK_C; c.style.strokeDashoffset = MASK_C; });
function setMask(c, p){ c.style.strokeDashoffset = MASK_C*(1 - p); }
function markProgress(v){ introState.real = Math.max(introState.real, v); }
markProgress(0.12);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ markProgress(0.35); }); else markProgress(0.35);

function runIntro(){
  var t0 = performance.now(), th = [.25,.5,.75,1], ti = 0, done = false;
  if (dial.animate && !reduce) dial.animate([{transform:'translate(-50%,-50%) scale(0)', opacity:0},{transform:'translate(-50%,-50%) scale(1)', opacity:1}], {duration:1000, easing:EXPO_OUT, fill:'forwards'});
  else { dial.style.transform = 'translate(-50%,-50%) scale(1)'; dial.style.opacity = 1; }
  wait(.75).then(function(){
    dial.classList.add('is-thick');
    tween(2, E.out, function(p){ setMask(wipe, p); });
    var tel = Array.prototype.slice.call(document.querySelectorAll('.telemetry li'));
    tel.forEach(function(li, i){ wait(i*.3).then(function(){ telemetryLine(li); }); });
    Array.prototype.slice.call(document.querySelectorAll('.lg')).forEach(function(el, i){ wait(i*.3).then(function(){ scramble(el, el.dataset.text, 1.8, .5); }); });
  });
  var a = dial.querySelectorAll('.dc-a span');
  wait(1.0).then(function(){ flicker(a[0]); }); wait(1.2).then(function(){ flicker(a[1]); });
  /* progress: never faster than a full sweep in two seconds */
  wait(.9).then(function(){
    var last = performance.now();
    (function step(now){
      var dt = (now - last)/1000; last = now;
      introState.shown = Math.min(introState.real, introState.shown + dt/2);
      setMask(progm, introState.shown);
      while (ti < th.length && introState.shown >= th[ti] - 1e-4){ flicker(labels[ti], 1); ti++; }
      if (introState.shown >= 1 && !done && performance.now() - t0 > 3200){ done = true; finishIntro(); return; }
      requestAnimationFrame(step);
    })(last);
  });
}
function askSound(){
  var card = $('#sound-card'); if (!card) return Promise.resolve();
  card.hidden = false; intro.removeAttribute('aria-hidden'); requestAnimationFrame(function(){ card.classList.add('on'); });
  var yes = $('#sc-yes'); setTimeout(function(){ yes.focus({ preventScroll:true }); }, 300);
  return new Promise(function(res){
    function pick(withSound){ if (withSound) Sound.toggle(true); card.classList.remove('on'); intro.setAttribute('aria-hidden', 'true'); setTimeout(function(){ card.hidden = true; }, 500); res(); }
    yes.addEventListener('click', function(){ pick(true); }, { once:true });
    $('#sc-no').addEventListener('click', function(){ pick(false); }, { once:true });
  });
}
function finishIntro(){
  var a = dial.querySelectorAll('.dc-a span'), b = dial.querySelectorAll('.dc-b span');
  /* Loading Experience -> Connection Established, word by word */
  flicker(a[0], 0); wait(.2).then(function(){ flicker(b[0]); });
  wait(.2).then(function(){ flicker(a[1], 0); }); wait(.4).then(function(){ flicker(b[1]); });
  wait(.9).then(function(){
    var li = 3;
    tween(.8, E.inn, function(p){ var v = 1 - p; setMask(wipe, v); while (li >= 0 && v <= [.25,.5,.75,1][li]){ labels[li].style.transition = 'opacity .2s'; labels[li].style.opacity = 0; li--; } });
    return wait(.6);
  }).then(function(){
    if (dial.animate && !reduce) dial.animate([{transform:'translate(-50%,-50%) scale(1)', opacity:1},{transform:'translate(-50%,-50%) scale(0)', opacity:0}], {duration:500, easing:EXPO_IN, fill:'forwards'});
    else dial.style.opacity = 0;
    return wait(.5);
  }).then(function(){
    intro.classList.add('is-out');
    var bgEl = $('#intro-bg');
    if (bgEl.animate && !reduce) bgEl.animate([{opacity:1},{opacity:0}], {duration:2600, easing:EXPO_OUT, fill:'forwards', delay:350});
    else bgEl.style.opacity = 0;
    return wait(.45);
  }).then(function(){
    introState.begun = true;
    enterSite();
    root.classList.add('is-live');
    setTimeout(function(){ intro.hidden = true; }, reduce ? 0 : 3200);
  });
}
var intro = $('#intro');
runIntro();


/* ---------- Ambient sound (generated, no files) ---------- */
var Sound = (function(){
  var ctx, master, lp, on = false, nextBubble = 0, depthF = 0, above = true;
  function start(){
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ctx = new AC();
    var len = ctx.sampleRate*4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i=0;i<len;i++){ var w = Math.random()*2-1; last = (last + 0.02*w)/1.02; d[i] = last*3.2; }
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    var swell = ctx.createGain(); swell.gain.value = 1;
    var lfo = ctx.createOscillator(); lfo.frequency.value = 0.09; var lg = ctx.createGain(); lg.gain.value = 0.35; lfo.connect(lg); lg.connect(swell.gain); lfo.start();
    master = ctx.createGain(); master.gain.value = 0;
    src.connect(lp); lp.connect(swell); swell.connect(master); master.connect(ctx.destination); src.start();
    return true;
  }
  function bubble(){
    if (!ctx || !on || above) return;
    var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime, f = 380 + Math.random()*420;
    o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f*2.6, t+0.09);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t+0.01); g.gain.exponentialRampToValueAtTime(0.0001, t+0.12);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+0.14);
  }
  function whoosh(dur){
    if (!ctx || !on) return;
    var t = ctx.currentTime, src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    var len = Math.ceil(ctx.sampleRate*(dur + 0.2)), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i=0;i<len;i++) d[i] = Math.random()*2-1;
    src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(180, t); bp.frequency.exponentialRampToValueAtTime(1400, t + dur*0.5); bp.frequency.exponentialRampToValueAtTime(220, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + dur*0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(master); src.start(t); src.stop(t + dur + 0.05);
  }
  var duckV = 1;
  function tick(kind){
    if (!ctx || !on) return;
    var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    var f0 = kind === 'hover' ? 1900 : (kind === 'done' ? 660 : 1100), f1 = kind === 'hover' ? 1500 : (kind === 'done' ? 990 : 620), v = kind === 'hover' ? 0.018 : 0.05, len = kind === 'done' ? 0.35 : (kind === 'hover' ? 0.05 : 0.09);
    o.type = kind === 'done' ? 'triangle' : 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + len);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + len + 0.02);
  }
  function duck(v){ duckV = v; if (ctx && on) master.gain.setTargetAtTime(0.22*duckV, ctx.currentTime, 0.4); }
  function toggle(force){
    var want = force === undefined ? !on : force;
    if (want && !ctx && !start()) return;
    if (ctx && ctx.state === 'suspended') ctx.resume();
    on = want;
    if (ctx) master.gain.setTargetAtTime(on ? 0.22*duckV : 0, ctx.currentTime, 0.6);
    var b = $('#audio'); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
    flicker(b.querySelector('.wave'));
  }
  function update(dt, f, isAbove){
    depthF = f; above = isAbove;
    if (!ctx) return;
    lp.frequency.setTargetAtTime(isAbove ? 1600 : 700 - 520*f, ctx.currentTime, 0.4);
    nextBubble -= dt; if (nextBubble < 0){ nextBubble = 1.5 + Math.random()*4; bubble(); }
  }
  return { toggle:toggle, update:update, whoosh:whoosh, tick:tick, duck:duck, isOn:function(){ return on; } };
})();
$('#audio').addEventListener('click', function(){ Sound.toggle(); });

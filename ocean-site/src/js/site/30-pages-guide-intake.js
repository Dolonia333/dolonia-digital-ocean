
/* ---------- Text lines that wipe up from behind a mask ---------- */
function presplit(el){
  if (!el || reduce || !el.animate || el._pre || el._busy) return;
  var html = el.innerHTML, text = el.textContent.trim().split(/\s+/);
  el.innerHTML = text.map(function(w){ return '<span class="w">' + w + '</span>'; }).join(' ');
  var lines = [], top = null;
  $$('.w', el).forEach(function(w){ var t = w.offsetTop; if (top === null || Math.abs(t - top) > 3){ lines.push([]); top = t; } lines[lines.length-1].push(w.textContent); });
  el.innerHTML = lines.map(function(l){ return '<span class="ln"><span class="li" style="transform:translateY(105%)">' + l.join(' ') + '</span></span>'; }).join('');
  el._pre = html;
}
function wipeLines(el, delay){
  if (!el || reduce || !el.animate){ return; }
  if (el._busy) return;
  if (el._pre){
    var orig = el._pre; el._pre = null; el._busy = true;
    var lp = $$('.li', el), lastP;
    lp.forEach(function(li, i){ lastP = li.animate([{transform:'translateY(105%)'},{transform:'translateY(0)'}], {duration:1400, delay:(delay||0)*1000 + i*90, easing:EXPO_OUT, fill:'both'}); });
    if (lastP) lastP.onfinish = function(){ el.innerHTML = orig; el._busy = false; }; else { el.innerHTML = orig; el._busy = false; }
    return;
  }
  el._busy = true;
  var html = el.innerHTML, text = el.textContent.trim().split(/\s+/);
  el.innerHTML = text.map(function(w){ return '<span class="w">' + w + '</span>'; }).join(' ');
  var lines = [], top = null;
  $$('.w', el).forEach(function(w){ var t = w.offsetTop; if (top === null || Math.abs(t - top) > 3){ lines.push([]); top = t; } lines[lines.length-1].push(w.textContent); });
  el.innerHTML = lines.map(function(l){ return '<span class="ln"><span class="li">' + l.join(' ') + '</span></span>'; }).join('');
  var lis = $$('.li', el), last;
  lis.forEach(function(li, i){
    last = li.animate([{transform:'translateY(105%)'},{transform:'translateY(0)'}], {duration:1400, delay:(delay||0)*1000 + i*90, easing:EXPO_OUT, fill:'both'});
  });
  if (last) last.onfinish = function(){ el.innerHTML = html; el._busy = false; };
}
function revealPanel(panel, delay){
  if (!panel || panel.classList.contains('in')) return;
  panel.classList.add('in');
  $$('.wl', panel).forEach(function(p){ wipeLines(p, (delay||0) + 0.35); });
  var tag = $('.depth-tag', panel); if (tag && tag.textContent) scramble(tag, tag.textContent, 1.1, .2);
  $$('.stats dd', panel).forEach(function(dd, i){ var v = dd.dataset.v || (dd.dataset.v = dd.textContent); wait(.35 + i*.12).then(function(){ scramble(dd, v, 1.3, .25); }); });
  $$('.dive small', panel).forEach(function(s, i){ var v = s.dataset.v || (s.dataset.v = s.textContent); wait(.6 + i*.15).then(function(){ scramble(s, v, 1, .2); }); });
}
function hidePanels(pageEl){
  $$('.panel', pageEl).forEach(function(p){ p.classList.remove('in'); });
  $$('.wl', pageEl).forEach(function(p){ p.getAnimations && p.getAnimations({subtree:true}).forEach(function(a){ a.finish(); }); });
}
var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries){
  entries.forEach(function(en){ if (en.isIntersecting && !busy && introState.begun) revealPanel(en.target, 0); });
}, { threshold:0, rootMargin:'0px 0px -14% 0px' }) : null;

/* ---------- Buttons: corner brackets, edges that draw in, rolling label ---------- */
$$('.btn').forEach(function(b){
  var t = b.textContent.trim();
  b.innerHTML = '<span class="btn__t"><span class="a">' + t + '</span><span class="b" aria-hidden="true">' + t + '</span></span>' +
    '<i class="bc tl"></i><i class="bc tr"></i><i class="bc br"></i><i class="bc bl"></i>' +
    '<i class="bl tl"></i><i class="bl tr"></i><i class="bl br"></i><i class="bl bl2"></i>';
});

/* ---------- Pages and transitions ---------- */
var current = null, busy = false, suppressHash = false, pendingAnchor = null;
var cam = { y:PAGE.home.y0, zOff:0, driven:false };
var V = { amt:0 };                                   /* 0..1 strength of the current (vortex) transition */
function pageEl(n){ return $('.page[data-page="' + n + '"]'); }
function hashPage(){ var h = (location.hash || '').replace('#','').split('/')[0]; return PAGE[h] ? h : 'home'; }
function hashStop(){ var k = parseInt((location.hash || '').split('/')[1], 10); return isNaN(k) ? 0 : k; }
function labelDepthTags(n){
  var el = pageEl(n), max = root.scrollHeight - window.innerHeight, P = PAGE[n];
  $$('[data-depth-tag]', el).forEach(function(t){
    var sec = t.closest('.panel'), f = max > 4 ? Math.min(1, Math.max(0, (sec.offsetTop + sec.offsetHeight*0.5 - window.innerHeight*0.5)/max)) : 0;
    t.textContent = metersAt(P.y0 + (P.y1 - P.y0)*f).toLocaleString('en-US') + ' m';
  });
}
function swap(to){
  if (current && PAGE[current].stage) stageLeave();
  root.classList.toggle('staged', !!PAGE[to].stage);
  if (current){ var old = pageEl(current); old.classList.remove('is-active','is-leaving'); hidePanels(old); if (io) $$('.panel', old).forEach(function(p){ io.unobserve(p); }); }
  current = to;
  var el = pageEl(to); el.classList.add('is-active');
  root.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); root.style.scrollBehavior = ''; sTarget = 0; sSmooth = 0;
  root.classList.toggle('on-home', to === 'home');
  root.classList.toggle('on-dives', to === 'dives');
  $$('.menu a').forEach(function(a){ if (a.dataset.go === to) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  document.title = to === 'home' ? 'Dolonia — What runs beneath' : 'Dolonia — ' + (el.getAttribute('aria-label') || '');
  labelDepthTags(to);
  setCurrents(to === 'dives');
  creaturesFor(to);
}
function arrive(to, delay){
  if (PAGE[to].stage){
    var startK = hashStop();
    if (pendingAnchor){ var an = document.getElementById(pendingAnchor); pendingAnchor = null; if (an && an.classList.contains('stop')) startK = $$('.stop', pageEl(to)).indexOf(an); }
    setTimeout(function(){ if (current === to) stageEnter(to, startK); }, (delay||0)*1000);
    return;
  }
  var el = pageEl(to), first = $('.panel', el);
  $$('.wl', first).forEach(presplit);
  setTimeout(function(){
    revealPanel(first, 0);
    if (io) $$('.panel', el).forEach(function(p){ if (p !== first) io.observe(p); });
    if (pendingAnchor){ var a = document.getElementById(pendingAnchor); pendingAnchor = null; if (a) setTimeout(function(){ a.scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); }, 700); }
  }, (delay||0)*1000);
}
function go(to, fromHash, anchor){
  if (!PAGE[to]) to = 'home';
  closeMenu();
  if (anchor) pendingAnchor = anchor;
  if (!introState.begun){ return; }
  if (to === current && PAGE[to].stage){ var an2 = pendingAnchor ? document.getElementById(pendingAnchor) : null; pendingAnchor = null; var kk = an2 ? $$('.stop', pageEl(to)).indexOf(an2) : (fromHash ? hashStop() : -1); if (kk >= 0) travelTo(kk, true); return; }
  if (to === current){ if (pendingAnchor){ var a = document.getElementById(pendingAnchor); pendingAnchor = null; if (a) a.scrollIntoView({behavior:'smooth'}); } return; }
  if (busy) return;
  busy = true; root.classList.add('is-moving');
  if (!fromHash && location.hash.replace('#','') !== to){ suppressHash = true; location.hash = to; }
  var from = current, kind = from === 'home' ? 'dive' : (to === 'home' ? 'rise' : 'vortex');
  if (from === 'home' && to === 'dives' && !reduce){ busy = false; completeDive(); return; }
  tint(to);
  pageEl(from).classList.add('is-leaving');
  var done;
  if (reduce){
    done = wait(0).then(function(){ swap(to); cam.y = PAGE[to].y0; arrive(to, 0); });
  } else if (kind === 'vortex'){
    Sound.whoosh(5.2);
    V.prog = 0;
    var flying = from === 'dives' ? flyInto(to) : Promise.resolve();
    var T_IN = 2.2, T_HOLD = 1.0, T_OUT = 2.6, TOT = T_IN + T_HOLD + T_OUT, swapped = false;
    done = flying.then(function(){ return wait(.05); }).then(function(){
      return tween(TOT, E.lin, function(p){
        var t = p*TOT;
        V.prog = p;
        V.amt = t < T_IN ? E.ios(t/T_IN) : (t < T_IN + T_HOLD ? 1 : 1 - E.ios((t - T_IN - T_HOLD)/T_OUT));
        if (!swapped && t >= T_IN){ swapped = true; FLY.k = 0; swap(to); cam.y = PAGE[to].y0 + (PAGE[to].stage ? 0 : 0); arrive(to, T_HOLD + 1.0); }
        cam.zOff = swapped ? 3*(1 - E.out3(Math.min(1, (t - T_IN)/(T_HOLD + T_OUT)))) : 0;
      });
    }).then(function(){ V.amt = 0; cam.zOff = 0; });
  } else {
    Sound.whoosh(2.6);
    var y0 = cam.y, y1 = PAGE[to].y0, swapped = false;
    cam.driven = true;
    done = tween(kind === 'dive' ? 2.8 : 2.6, E.io3, function(p){
      cam.y = y0 + (y1 - y0)*p;
      if (!swapped && p > (kind === 'dive' ? .62 : .7)){ swapped = true; var keep = cam.y; swap(to); cam.y = keep; arrive(to, .5); }
    }).then(function(){ cam.driven = false; });
  }
  done.then(function(){ busy = false; root.classList.remove('is-moving'); });
}
window.addEventListener('hashchange', function(){ if (suppressHash){ suppressHash = false; return; } go(hashPage(), true); });
var FLY = { k:0, i:0 };
function flyInto(to){
  if (reduce) return Promise.resolve();
  FLY.i = { interfaces:0, systems:1, ai:2 }[to]; if (FLY.i === undefined) FLY.i = 1;
  return tween(1.3, function(t){ return t*t; }, function(p){ FLY.k = p; }).then(function(){ FLY.k = 1; });
}
document.addEventListener('click', function(e){
  var a = e.target.closest && e.target.closest('[data-go]'); if (!a) return;
  e.preventDefault(); go(a.dataset.go, false, a.dataset.to);
});
$$('.hud-btn.book').forEach(function(b){ b.dataset.to = 'contact'; });
$$('.actions a[data-go="work"]').forEach(function(b){ if (/call/i.test(b.textContent)) b.dataset.to = 'contact'; });

/* home: any downward scroll, swipe or key dives in */
var touchY = null;
var D = { p:0, active:false, auto:false, last:0, swapped:false, formed:false };
function canScrub(){ return current === 'home' && introState.begun && !busy && !D.auto && !root.classList.contains('menu-open'); }
function homeDive(){ if (canScrub()){ if (reduce) go('dives'); else completeDive(); } }
function scrub(amount){
  if (!canScrub()) return;
  if (reduce){ if (amount > 0) go('dives'); return; }
  D.active = true; D.last = performance.now();
  D.p = Math.max(0, Math.min(1, D.p + amount));
  if (D.p >= 0.999) completeDive();
}
window.addEventListener('wheel', function(e){ var d = e.deltaMode === 1 ? e.deltaY*30 : e.deltaY; if (d > 0 || D.active) scrub(d*0.0011); }, {passive:true});
window.addEventListener('touchstart', function(e){ touchY = e.touches[0].clientY; }, {passive:true});
window.addEventListener('touchmove', function(e){ if (touchY === null) return; var y = e.touches[0].clientY; scrub((touchY - y)*0.0032); touchY = y; }, {passive:true});
window.addEventListener('touchend', function(){ touchY = null; D.last = performance.now() - 150; }, {passive:true});
function completeDive(){
  if (D.auto || current !== 'home' || !introState.begun) return;
  D.auto = true; D.active = true; busy = true; root.classList.add('is-moving');
  if (location.hash.replace('#','') !== 'dives'){ suppressHash = true; location.hash = 'dives'; }
  tint('dives');
  Sound.whoosh(2.8);
  var p0 = D.p;
  tween(0.6 + 2.4*(1 - p0), E.out2, function(k){ D.p = p0 + (1 - p0)*k; }).then(function(){
    return wait(0.2);
  }).then(function(){
    D.active = false; D.auto = false; D.p = 0; D.swapped = false; D.formed = false;
    busy = false; root.classList.remove('is-moving');
  });
}
function diveFrame(dt){
  if (!D.active) return null;
  if (!D.auto && performance.now() - D.last > 240){
    if (D.p > 0.24) completeDive();
    else { D.p *= Math.exp(-5*dt); if (D.p < 0.002){ D.p = 0; D.active = false; } }
  }
  var homeEl = pageEl('home'), c = $('.content', homeEl);
  if (!D.swapped){ c.style.opacity = Math.max(0, 1 - D.p*2.6).toFixed(3); c.style.transform = 'translateY(' + (-D.p*60).toFixed(1) + 'px)'; }
  if (!D.formed && D.p > 0.5){ D.formed = true; formSchool(); }
  if (!D.swapped && D.p > 0.62){
    D.swapped = true; var keep = cam.y; c.style.opacity = ''; c.style.transform = '';
    swap('dives'); cam.y = keep; arrive('dives', 1.5);
  }
  var e = D.p < .5 ? 2*D.p*D.p : 1 - Math.pow(-2*D.p + 2, 2)/2;
  return PAGE.home.y0 + (PAGE.dives.y0 - PAGE.home.y0)*e;
}
var formSchool = function(){}, creaturesFor = function(){}, tint = function(){};
window.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closeMenu();
  if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && current === 'home' && !/INPUT|TEXTAREA|BUTTON|A/.test((document.activeElement||{}).tagName||'')){ e.preventDefault(); homeDive(); }
});

/* menu */
var menuBtn = $('#menu-btn');
function closeMenu(){ if (!root.classList.contains('menu-open')) return; root.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.setAttribute('aria-label','Open menu'); }
menuBtn.addEventListener('click', function(){
  var open = !root.classList.contains('menu-open');
  root.classList.toggle('menu-open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open){ $$('.menu small').forEach(function(s, i){ var v = s.dataset.v || (s.dataset.v = s.textContent); wait(.2 + i*.06).then(function(){ scramble(s, v, .9, .15); }); }); var f = $('.menu a'); if (f) setTimeout(function(){ f.focus({preventScroll:true}); }, 300); }
});

/* ---------- Intake form ---------- */
(function(){
  var box = $('#intake'); if (!box) return;
  /* Set this to an n8n webhook or Supabase function URL when the site is hosted on dolonia.cloud.
     While it is empty, the form hands the finished request to the visitor's email app. */
  var INTAKE_ENDPOINT = '';
  var form = $('form', box), steps = $$('.ik-step', box), bars = $$('.ik-bars i', box), count = $('#ik-count');
  var back = $('#ik-back'), nextT = $('#ik-next-t'), review = $('#ik-review'), cur = 1;
  function picked(n){ return $$('[name="' + n + '"]:checked', form).map(function(e){ return e.value; }); }
  function text(n){ var e = form.elements[n]; return e ? String(e.value || '').trim() : ''; }
  function bad(key, isBad){ var c = $('[data-req="' + key + '"]', form); if (c) c.classList.toggle('is-invalid', isBad); return isBad; }
  function check(n){
    var errs = [];
    if (n === 1){ if (bad('build', !picked('build').length)) errs.push('build'); if (bad('org', !picked('org').length)) errs.push('org'); }
    if (n === 2){ if (bad('about', text('about').length < 15)) errs.push('about'); }
    if (n === 3){ if (bad('name', text('name').length < 2)) errs.push('name'); if (bad('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text('email')))) errs.push('email'); }
    if (errs.length){ var f = $('[data-req="' + errs[0] + '"] input, [data-req="' + errs[0] + '"] textarea', form); if (f) f.focus(); }
    return !errs.length;
  }
  function renderReview(){
    var rows = [['Project', picked('build').join(', ')], ['For', picked('org')[0]], ['Timeline', picked('timeline')[0] || 'Not given'], ['Budget', picked('budget')[0] || 'Not given']];
    review.innerHTML = '';
    rows.forEach(function(r){ var dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = r[0]; dd.textContent = r[1] || ''; review.appendChild(dt); review.appendChild(dd); });
  }
  function show(n){
    cur = n;
    steps.forEach(function(s){ s.classList.toggle('is-on', +s.dataset.step === n); });
    bars.forEach(function(b, i){ b.classList.toggle('on', i < n); });
    count.textContent = 'Step ' + n + ' of 3';
    back.hidden = n === 1;
    nextT.textContent = n < 3 ? 'Continue' : (INTAKE_ENDPOINT ? 'Send project details' : 'Email my details');
    if (n === 3) renderReview();
    var r = box.getBoundingClientRect(); if (r.top < 0) box.scrollIntoView({ block:'start', behavior: reduce ? 'auto' : 'smooth' });
    var f = $('.ik-step.is-on h3', form); if (f){ f.setAttribute('tabindex', '-1'); f.focus({ preventScroll:true }); }
  }
  form.addEventListener('input', function(e){ var c = e.target.closest('[data-req]'); if (c) c.classList.remove('is-invalid'); });
  form.addEventListener('change', function(e){ var c = e.target.closest('[data-req]'); if (c) c.classList.remove('is-invalid'); });
  back.addEventListener('click', function(){ if (cur > 1) show(cur - 1); });
  function done(h, p){ $('#ik-done-h').textContent = h; $('#ik-done-p').textContent = p; box.classList.add('is-done'); }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!check(cur)) return;
    if (cur < 3){ show(cur + 1); return; }
    var data = { project:picked('build'), organization_type:picked('org')[0] || '', details:text('about'), timeline:picked('timeline')[0] || '', budget:picked('budget')[0] || '',
      name:text('name'), email:text('email'), organization:text('company'), phone:text('phone'), submitted_at:new Date().toISOString(), source:'dolonia.cloud intake' };
    var first = data.name.split(/\s+/)[0];
    if (text('website')){ done('Thanks, ' + first + '.', 'We\'ll be in touch.'); return; }
    function viaEmail(){
      var body = ['Project: ' + data.project.join(', '), 'For: ' + data.organization_type, 'Timeline: ' + (data.timeline || 'Not given'), 'Budget: ' + (data.budget || 'Not given'), '', data.details, '', data.name + (data.organization ? ', ' + data.organization : ''), data.email + (data.phone ? ', ' + data.phone : '')].join('\n');
      window.location.href = 'mailto:zionvanzandt@gmail.com?subject=' + encodeURIComponent('Project inquiry: ' + data.project.join(', ')) + '&body=' + encodeURIComponent(body);
      done('Thanks, ' + first + '. One last step.', 'Your email app should now be open with everything filled in. Press send, and we\'ll reply to ' + data.email + ' with a few times for a call. If nothing opened, email zionvanzandt@gmail.com.');
    }
    if (!INTAKE_ENDPOINT){ viaEmail(); return; }
    nextT.textContent = 'Sending…';
    fetch(INTAKE_ENDPOINT, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(data) })
      .then(function(r){ if (!r.ok) throw new Error(r.status); done('Thanks, ' + first + '. We have it.', 'We\'ll reply to ' + data.email + ' with a few times for a call.'); })
      .catch(function(){ viaEmail(); });
  });
  $('#ik-again').addEventListener('click', function(){ form.reset(); box.classList.remove('is-done'); show(1); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function(en){ root.classList.toggle('hud-dim', en[0].isIntersecting); }, { threshold:0.05 }).observe(box);
})();

/* ---------- Sections flow with the scroll instead of popping in ---------- */
function flowPanels(){
  if (!current) return;
  var el = pageEl(current), ps = el._panels || (el._panels = $$('.panel', el));
  if (ps.length < 2 || reduce) return;
  var vh = window.innerHeight;
  for (var i = 0; i < ps.length; i++){
    var r = ps[i].getBoundingClientRect();
    var below = r.top - vh*0.66, above = vh*0.30 - r.bottom;
    var d = Math.max(0, below, above)/(vh*0.42);
    var o = 1 - Math.min(1, d); o = o*o*(3 - 2*o);
    var shift = below > 0 ? Math.min(1, d)*26 : (above > 0 ? -Math.min(1, d)*26 : 0);
    ps[i].style.opacity = o.toFixed(3);
    ps[i].style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
  }
}

/* ---------- The jellyfish guide ---------- */
var guide = { open:false, talking:0, busy:false, history:[], sample:null, asked:false };
var GPAGES = { home:'the surface', dives:'Choose your dive', interfaces:'Interfaces', systems:'Data and automation', ai:'Private AI', work:'Work with us', contact:'the intake form' };
var KB = [
  { k:['build','do','offer','services','service','make','what','dolonia','company'], q:'What does Dolonia build?',
    a:'We build websites, client portals, intake and booking pages, the databases and automations underneath them, and private AI that runs on our own hardware. We also host and look after what we build.', go:'dives' },
  { k:['fast','quick','long','timeline','time','weeks','days','soon','speed'], q:'How fast can you build?',
    a:'Interfaces come together in days. A recent health-tech storefront went from first call to a working demo in two days. Larger systems take longer, and you get a timeline along with your quote.', go:'interfaces' },
  { k:['cost','price','pricing','much','budget','quote','charge','expensive','afford','rate'], q:'How much does it cost?',
    a:'Every project gets a fixed quote after a short call and the intake form, because scope varies a lot. After launch, a monthly retainer covers hosting and changes.', go:'contact' },
  { k:['government','federal','agency','contract','contracting','sam','cage','uei','naics','certified','certification','wosb','mbe','gov'], q:'Do you work with government?',
    a:'Yes. Dolonia Data Tech Solutions is a DBA of 1921 Holding Co. LLC, a SAM.gov-registered federal prime contractor. CAGE 9T6Y5, UEI YMP7Z9T1WVX5, NAICS 541511 and 541330. Certifications: WOSB, MBE, SDB, WBE and AABE.', go:'work' },
  { k:['ai','private','model','models','llm','chatgpt','data','documents','secure','privacy'], q:'What is private AI?',
    a:'Language models running on Dolonia infrastructure and connected to your own documents, so your data stays inside systems we control. Teams use it for answers from their documents, drafts and summaries, and routing incoming requests.', go:'ai' },
  { k:['automation','automate','database','supabase','n8n','workflow','workflows','integration','integrations','backend'], q:'What happens behind the scenes?',
    a:'Every build sits on a real database (Supabase) with logins and permissions, plus n8n workflows that move data between your tools and handle repetitive steps like scheduling, payments and follow-ups.', go:'systems' },
  { k:['host','hosting','maintain','maintenance','support','after','launch','retainer','changes','update'], q:'Do you host and maintain it?',
    a:'Yes. We host and watch what we build on infrastructure we run, so one team already knows the whole system. A monthly retainer covers changes after launch.', go:'systems' },
  { k:['process','steps','work','how','start','begin','started','first','next'], q:'How do I get started?',
    a:'Fill in the intake form; it takes about two minutes. We reply with times for a 30-minute call, then send a fixed quote. From there we build, connect, launch and run it.', go:'contact' },
  { k:['contact','email','phone','call','reach','where','located','location','office','address','oklahoma'], q:'How do I contact you?',
    a:'Email zionvanzandt@gmail.com or call (405) 937-9610. We work out of The Verge OKC, 600 N Robinson Ave in Oklahoma City.', go:'contact' },
  { k:['who','founder','owner','zion','team','behind'], q:'Who is behind Dolonia?',
    a:'Dolonia is led by Zion Van Zandt, its founder and systems architect, in Oklahoma City.', go:'work' },
  { k:['jellyfish','jelly','you','species','blubber','feed','plankton'], q:'What kind of jellyfish are you?',
    a:'I\'m a blue blubber jellyfish, Catostylus mosaicus. No tentacles, just eight frilly oral arms. Tap the water to drop some plankton and I\'ll pull it in.' },
  { k:['angler','anglerfish','lure','fish','midnight'], q:'Where is the anglerfish?',
    a:'She lives in the midnight zone on the Private AI page. Watch her glowing lure: small fish that swim too close get eaten. You can tempt her with your cursor too.', go:'ai' }
];
var CHIPS = [0, 1, 2, 3, 4, 7];
var FACTS = KB.map(function(e){ return '- ' + e.q + ' ' + e.a; }).join('\n') + '\n- Site pages: home (the surface), dives (choose a layer), interfaces, systems (data and automation), ai (private AI), work (process, federal details, intake form), contact (the intake form).';
var gLog = $('#g-log'), gChips = $('#g-chips'), gForm = $('#g-form'), gIn = $('#g-in'), gBtn = $('#guide-btn'), gBox = $('#guide');
function gMsg(who, text){
  var m = document.createElement('div'); m.className = 'msg ' + who;
  var p = document.createElement('p'); p.textContent = text; m.appendChild(p);
  gLog.appendChild(m); gLog.scrollTop = gLog.scrollHeight; return m;
}
function gGo(m, page){
  if (!page || !GPAGES[page]) return;
  var b = document.createElement('button'); b.type = 'button'; b.className = 'g-go';
  b.textContent = page === 'contact' ? 'Open the intake form' : 'Take me to ' + GPAGES[page];
  b.addEventListener('click', function(){ if (window.innerWidth < 760) closeGuide(); go(page === 'contact' ? 'work' : page, false, page === 'contact' ? 'contact' : undefined); });
  m.appendChild(b); gLog.scrollTop = gLog.scrollHeight;
}
function localAnswer(q){
  var words = q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/), best = null, bestScore = 0;
  KB.forEach(function(e){ var sc = 0; e.k.forEach(function(k){ if (words.indexOf(k) >= 0) sc += k.length > 3 ? 2 : 1; }); if (sc > bestScore){ bestScore = sc; best = e; } });
  if (best && bestScore >= 2) return { a:best.a, go:best.go };
  return { a:'I don\'t have that one, but the team does. Tell us about it in the intake form, or email zionvanzandt@gmail.com.', go:'contact' };
}
function talk(on){ guide.talking = on ? 1 : 0; }
function ask(q){
  q = (q || '').trim(); if (!q || guide.busy) return;
  guide.busy = true; $('.g-send').disabled = true;
  gMsg('me', q); gIn.value = '';
  var m = gMsg('bot', ''), p = $('p', m); p.innerHTML = '<span class="dots" aria-label="Thinking"><i></i><i></i><i></i></span>';
  talk(true);
  function finish(text, page){
    p.textContent = text; gGo(m, page);
    guide.history.push({ role:'user', content:q }, { role:'assistant', content:text });
    guide.busy = false; $('.g-send').disabled = false; talk(false); gLog.scrollTop = gLog.scrollHeight;
  }
  var local = localAnswer(q);
  if (!guide.sample){ setTimeout(function(){ finish(local.a, local.go); }, 650); return; }
  var intro = 'You are the guide on the Dolonia website, speaking as the site\'s blue blubber jellyfish: warm, plain and brief, with no puns and no emoji. Answer only from the facts below. If they do not cover the question, say you do not know and suggest the intake form or emailing Zion. Never invent prices, clients or timelines. Reply in plain text under 80 words, no markdown. If a page would help, end with one final line exactly like "GO: ai" using one of: home, dives, interfaces, systems, ai, work, contact.\n\nFacts:\n' + FACTS;
  var msgs = guide.history.slice(-8).map(function(x){ return { role:x.role, content:x.content }; });
  msgs.push({ role:'user', content:q });
  msgs[0] = { role:'user', content:intro + '\n\nVisitor: ' + msgs[0].content };
  guide.sample(msgs, { modelTier:'quick', cache:false, onText:function(ev){ var t = ev.text.replace(/\n?GO:.*$/s, '').trim(); if (t) p.textContent = t; gLog.scrollTop = gLog.scrollHeight; } })
    .then(function(r){
      var t = (r && r.text) || '', mm = t.match(/GO:\s*([a-z]+)/), page = mm ? mm[1] : null;
      t = t.replace(/\n?GO:.*$/s, '').trim();
      finish(t || local.a, GPAGES[page] ? page : (t ? null : local.go));
    })
    .catch(function(){ finish(local.a, local.go); });
}
function openGuide(){
  if (guide.open) return;
  guide.open = true; gBox.hidden = false; gBtn.classList.add('seen');
  requestAnimationFrame(function(){ root.classList.add('guide-open'); });
  gBtn.setAttribute('aria-expanded', 'true');
  if (!guide.asked){
    guide.asked = true;
    gMsg('bot', 'Hi. I\'m the Dolonia guide. Ask me what we build, how a project works, or where to find something on the site.');
    CHIPS.forEach(function(i){ var b = document.createElement('button'); b.type = 'button'; b.textContent = KB[i].q; b.addEventListener('click', function(){ ask(KB[i].q); }); gChips.appendChild(b); });
    if (window.claude && typeof window.claude.use === 'function'){ window.claude.use('sample').then(function(sm){ guide.sample = sm || null; }).catch(function(){}); }
  }
  setTimeout(function(){ if (window.innerWidth >= 760) gIn.focus({ preventScroll:true }); }, 350);
}
function closeGuide(){
  if (!guide.open) return;
  guide.open = false; root.classList.remove('guide-open'); gBtn.setAttribute('aria-expanded', 'false');
  setTimeout(function(){ if (!guide.open) gBox.hidden = true; }, 500);
}
gBtn.addEventListener('click', function(){ guide.open ? closeGuide() : openGuide(); });
$('#g-close').addEventListener('click', function(){ closeGuide(); gBtn.focus(); });
gForm.addEventListener('submit', function(e){ e.preventDefault(); ask(gIn.value); });
window.addEventListener('keydown', function(e){ if (e.key === 'Escape' && guide.open) closeGuide(); });

function enterSite(){
  var first = hashPage();
  swap(first); cam.y = PAGE[first].y0;
  arrive(first, first === 'home' ? .2 : .6);
}


/* ---------- WebGL ---------- */
var canvas = $('#sea'), renderer;
try {
  if (!window.THREE || !window.createBlubber || !window.createSurface) throw new Error('missing');
  renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, powerPreference:'high-performance'});
} catch(e){
  root.classList.add('no-webgl'); canvas.style.display = 'none'; markProgress(1);
  (function loop(){ var P = PAGE[current || 'home']; var y = STAGE.on ? stopY(STAGE.p) : P.y0 + (P.y1 - P.y0)*pageFrac(); if (current && PAGE[current].dive) discovered[current] = Math.max(discovered[current], pageFrac()); readout(y); flowPanels(); stageFrame(1/60); globeFrame(1/60); requestAnimationFrame(loop); })();
  return;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.3 : 1.75));
var PR = renderer.getPixelRatio();
markProgress(0.55);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2200);
camera.position.set(0, PAGE.home.y0, 14);
scene.add(camera);

var stops = [[0,0x2a6f92],[0.08,0x1b587e],[0.25,0x0e3a5c],[0.5,0x07223d],[0.75,0x040f22],[1,0x01060e]].map(function(s){ return [s[0], new THREE.Color(s[1])]; });
var bg = new THREE.Color();
function bgAt(f){ for (var i=0;i<stops.length-1;i++){ if (f <= stops[i+1][0]){ var t=(f-stops[i][0])/(stops[i+1][0]-stops[i][0]); return bg.copy(stops[i][1]).lerp(stops[i+1][1], t); } } return bg.copy(stops[stops.length-1][1]); }

var surface = createSurface(THREE, { quality: small ? 'low' : 'high' });
scene.add(surface.group);
var J = createBlubber(THREE, { quality: small ? 'low' : 'high', period: reduce ? 2.4 : 0.95 });
var JSCALE = small ? 1.05 : 1.8;
J.root.scale.setScalar(JSCALE); J.setPixelRatio(PR);
if (reduce) J.state.turnTimer = 1e9;
scene.add(J.root);
var deepA = new THREE.Color(0.06,0.27,0.62), deepB = new THREE.Color(0.02,0.10,0.30);
var bloom = createBloom(THREE, renderer, { strength:0.5, threshold:0.55 });

/* marine snow */
var SU = { uTravel:{value:0}, uTime:{value:0}, uDeep:{value:0}, uPR:{value:PR}, uPtr:{value:new THREE.Vector3(0,0,-999)}, uPtrV:{value:new THREE.Vector3()}, uLure:{value:new THREE.Vector3(0,0,-999)}, uLureI:{value:0} };
var NP = small ? 900 : 1800, pPos = new Float32Array(NP*3), pR = new Float32Array(NP);
for (var pi=0;pi<NP;pi++){ pPos[pi*3]=(Math.random()*2-1)*16; pPos[pi*3+1]=-1.2-Math.random()*84; pPos[pi*3+2]=-22+Math.random()*28; pR[pi]=Math.random(); }
var pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3)); pGeo.setAttribute('aRand', new THREE.BufferAttribute(pR,1));
var snow = new THREE.Points(pGeo, new THREE.ShaderMaterial({
  uniforms:SU, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:[
    "attribute float aRand; uniform float uTravel; uniform float uTime; uniform float uDeep; uniform float uPR; uniform vec3 uPtr; uniform vec3 uPtrV; uniform vec3 uLure; uniform float uLureI; varying float vA; varying float vBio; varying float vL;",
    "void main(){ vec3 p = position; p.z = mod(p.z + 22.0 + uTravel, 28.0) - 22.0; float edge = smoothstep(-22.0, -17.0, p.z)*smoothstep(6.0, 2.0, p.z); p.x += sin(uTime*0.12+aRand*30.0)*0.5; p.y += sin(uTime*0.09+aRand*12.0)*0.4;",
    " vec3 dp = p - uPtr; float w = exp(-dot(dp.xy,dp.xy)/2.2)*exp(-dp.z*dp.z/30.0); p.xy += uPtrV.xy*0.16*w;",
    " vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv; float d = -mv.z;",
    " gl_PointSize = (0.6+aRand*1.5)*uPR*(26.0/d);",
    " vBio = step(0.93,aRand)*uDeep*(0.5+0.5*sin(uTime*(0.8+aRand*2.5)+aRand*50.0));",
    " vA = smoothstep(40.0,6.0,d)*(0.14+0.36*aRand)*edge; vec3 lq = p - uLure; vL = exp(-dot(lq,lq)/2.5)*uLureI; vA += vL*0.9; }"].join("\n"),
  fragmentShader:"varying float vA; varying float vBio; varying float vL; void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,r); vec3 c = mix(vec3(0.8,0.9,0.95), vec3(0.45,0.95,0.95), clamp(vBio*1.5 + vL,0.0,1.0)); gl_FragColor = vec4(c*a*(vA+vBio*1.5), 1.0); }"
}));
snow.frustumCulled = false; scene.add(snow);

/* light shafts below the surface */
var shaftU = { uTime:SU.uTime, uShaft:{value:1} };
for (var si=0;si<6;si++){
  var sm = new THREE.ShaderMaterial({ uniforms:Object.assign({}, shaftU, {uOff:{value:si*1.7}}), transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
    vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader:"uniform float uTime; uniform float uShaft; uniform float uOff; varying vec2 vUv; void main(){ float a = pow(vUv.y,2.2)*smoothstep(0.0,0.35,vUv.x)*smoothstep(1.0,0.65,vUv.x); a *= 0.55+0.45*sin(uTime*0.35+uOff); gl_FragColor = vec4(vec3(0.7,0.88,0.95)*a*0.10*uShaft, 1.0); }" });
  var sh = new THREE.Mesh(new THREE.PlaneGeometry(2.5+Math.random()*4, 40), sm);
  sh.position.set(-12+si*4.6+Math.random()*2, -21.5, -10+Math.random()*7); sh.rotation.z = -0.22+Math.random()*0.12;
  scene.add(sh);
}

/* ---------- Ocean currents: ribbons of particles on the "choose a dive" page ---------- */
var CUR = { reveal:{value:0}, target:0, on:false };
var curves = [
  new THREE.CatmullRomCurve3([new THREE.Vector3(-16,-6.5,-6),new THREE.Vector3(-8,-8.8,-3),new THREE.Vector3(0,-7.2,-5),new THREE.Vector3(8,-10.2,-2),new THREE.Vector3(16,-8,-6)]),
  new THREE.CatmullRomCurve3([new THREE.Vector3(-16,-11.5,-4),new THREE.Vector3(-7,-9.6,-7),new THREE.Vector3(2,-12,-3),new THREE.Vector3(9,-9.4,-6),new THREE.Vector3(16,-12.5,-3)]),
  new THREE.CatmullRomCurve3([new THREE.Vector3(-16,-13,-9),new THREE.Vector3(-6,-12.4,-5),new THREE.Vector3(3,-9.4,-8),new THREE.Vector3(10,-13.5,-5),new THREE.Vector3(16,-10.5,-9)])
];
var SAMPLES = 240, tables = curves.map(function(c){ var pts = c.getSpacedPoints(SAMPLES); var tans = []; for (var i=0;i<=SAMPLES;i++) tans.push(c.getTangentAt(i/SAMPLES)); return {p:pts, t:tans}; });
var NCU = small ? 900 : 2100, cuPos = new Float32Array(NCU*3), cuA = new Float32Array(NCU), cuData = [];
for (var ci=0; ci<NCU; ci++){
  var g1 = (Math.random()+Math.random()+Math.random()-1.5)/1.5, g2 = (Math.random()+Math.random()+Math.random()-1.5)/1.5;
  cuData.push({ c:ci%3, t:Math.random(), s:0.012+Math.random()*0.02, o1:g1, o2:g2, w:0.35+Math.random()*0.9, r:Math.random() });
}
var cuGeo = new THREE.BufferGeometry();
cuGeo.setAttribute('position', new THREE.BufferAttribute(cuPos,3).setUsage(THREE.DynamicDrawUsage));
cuGeo.setAttribute('aA', new THREE.BufferAttribute(cuA,1).setUsage(THREE.DynamicDrawUsage));
var currents = new THREE.Points(cuGeo, new THREE.ShaderMaterial({
  uniforms:{ uPR:{value:PR}, uReveal:CUR.reveal }, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"attribute float aA; uniform float uPR; varying float vA; void main(){ vA = aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uPR*(1.3+aA*2.2)*(22.0/-mv.z); }",
  fragmentShader:"uniform float uReveal; varying float vA; void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.05,r); gl_FragColor = vec4(vec3(0.45,0.84,0.97)*a*vA*uReveal*1.7, 1.0); }"
}));
currents.frustumCulled = false; currents.visible = false; scene.add(currents);
var Nv = new THREE.Vector3(), Bv = new THREE.Vector3(), UPV = new THREE.Vector3(0,1,0);
function updateCurrents(dt, time){
  CUR.reveal.value += (CUR.target - CUR.reveal.value)*(1 - Math.exp(-(CUR.target > CUR.reveal.value ? 0.9 : 2.5)*dt));
  currents.visible = CUR.reveal.value > 0.01;
  if (!currents.visible) return;
  for (var i=0;i<NCU;i++){
    var d = cuData[i]; d.t = (d.t + d.s*dt*(reduce ? 0.2 : 1)) % 1;
    var tb = tables[d.c], f = d.t*SAMPLES, k = Math.floor(f), p = tb.p[k], tg = tb.t[k];
    Nv.crossVectors(tg, UPV).normalize(); Bv.crossVectors(Nv, tg).normalize();
    var w = d.w*(0.35 + 0.65*Math.sin(d.t*Math.PI)), wav = Math.sin(d.t*18 + time*0.6 + d.c)*0.25;
    cuPos[i*3] = p.x + Nv.x*d.o1*w + Bv.x*(d.o2*w*0.6 + wav);
    cuPos[i*3+1] = p.y + Nv.y*d.o1*w + Bv.y*(d.o2*w*0.6 + wav);
    cuPos[i*3+2] = p.z + Nv.z*d.o1*w + Bv.z*(d.o2*w*0.6 + wav);
    cuA[i] = Math.sin(d.t*Math.PI)*(0.35 + 0.65*d.r)*smooth(0, 1, 1 - Math.abs(d.o1)/1.6);
  }
  cuGeo.attributes.position.needsUpdate = true; cuGeo.attributes.aA.needsUpdate = true;
}
var TINTS = { dives:0x94e6fb, interfaces:0x94e6fb, systems:0x63f0cc, ai:0xa4adff, work:0x7cc8ff, home:0x94e6fb };
var veilBase = new THREE.Color(0x04304d);
tint = function(to){ var c = new THREE.Color(TINTS[to] || 0x94e6fb); tunU.uTint.value.copy(c); veil.material.uniforms.uCol.value.copy(veilBase).lerp(c, 0.12); };
setCurrents = function(on){ CUR.target = on ? 1 : 0; if (on) CUR.reveal.value = 0; };

/* ---------- The school ---------- */
var school = createSchool(THREE, { count: small ? 70 : 140, perFish: small ? 14 : 18, pixelRatio: PR, quality: small ? 'low' : 'high' });
school.setBox(-10.5);
scene.add(school.group);
formSchool = function(){ school.form(new THREE.Vector3(-3.5, -10.4, -3)); };
var lantern = createSchool(THREE, { species:'lantern', count: small ? 50 : 90, perFish: small ? 12 : 14, pixelRatio: PR, quality: small ? 'low' : 'high' });
scene.add(lantern.group);
var angler = createAngler(THREE, { quality: small ? 'low' : 'high', pixelRatio: PR });
angler.root.scale.setScalar(small ? 1.7 : 2.6);
scene.add(angler.root);
/* the anglerfish's prey: a few small lanternfish drawn to her light */
var prey = createSchool(THREE, { species:'lantern', count: small ? 6 : 9, perFish: 10, pixelRatio: PR, quality: 'low' });
prey.setBoxSize(small ? 2.2 : 4.5, small ? 1.6 : 2.0, 1.4);
scene.add(prey.group);
var region = { cx:0, cy:0, hx:0, hy:0, z:-1 }, preyTmp = new THREE.Vector3();
var shrimp = createShrimp(THREE, { count: small ? 4 : 6 }); scene.add(shrimp.group);
var nearTmp = new THREE.Vector3();
/* more life for each depth */
var extras = createExtras(THREE, { quality: small ? 'low' : 'high', pixelRatio: PR });
scene.add(extras.root);
var ZONE2 = { dives:'sun', interfaces:'sun', systems:'twi', ai:'mid', work:'floor' };
/* the menu's 3D icons: a glass screen, a stack of discs, a lattice ball, each with a turning ring */
var iconMat = new THREE.ShaderMaterial({ uniforms:{ uGlow:{value:0}, uShow:{value:0} }, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  vertexShader:"varying vec3 vN; varying vec3 vW; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
  fragmentShader:"uniform float uGlow; uniform float uShow; varying vec3 vN; varying vec3 vW; void main(){ vec3 V = normalize(cameraPosition - vW); float f = pow(1.0 - abs(dot(normalize(vN), V)), 2.2); vec3 c = vec3(0.58,0.9,0.98)*(0.18 + f*(0.9 + uGlow)); gl_FragColor = vec4(c*uShow, 1.0); }" });
function iconOf(i){
  var g = new THREE.Group(), m = iconMat.clone(), geo;
  if (i === 0){ geo = new THREE.BoxGeometry(1.2, 0.8, 0.12); var st = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.08), m); st.position.y = -0.55; g.add(st); }
  else if (i === 1){ geo = new THREE.CylinderGeometry(0.55, 0.55, 0.28, 32); [-0.36, 0.36].forEach(function(y){ var d = new THREE.Mesh(geo, m); d.position.y = y; g.add(d); }); }
  else geo = new THREE.IcosahedronGeometry(0.62, 1);
  var body = new THREE.Mesh(geo, m); g.add(body);
  var edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color:0xc4f1ff, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false })); g.add(edges);
  var ring = new THREE.Mesh(new THREE.RingGeometry(1.02, 1.07, 96, 1, 0, Math.PI*1.6), new THREE.MeshBasicMaterial({ color:0x94e6fb, transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false, blending:THREE.AdditiveBlending })); g.add(ring);
  g.userData = { mat:m, edges:edges, ring:ring, hover:0, show:0 };
  g.renderOrder = 20; g.frustumCulled = false; scene.add(g); return g;
}
var icons = [iconOf(0), iconOf(1), iconOf(2)], iconHover = -1, iconTmp = new THREE.Vector3(), iconDir = new THREE.Vector3();
$$('.page[data-page="dives"] .dive').forEach(function(d, i){ d.addEventListener('mouseenter', function(){ iconHover = i; }); d.addEventListener('mouseleave', function(){ if (iconHover === i) iconHover = -1; }); d.addEventListener('focusin', function(){ iconHover = i; }); });
root.classList.add('gl');
function updateIcons(dt, time){
  var orbs = $$('.page[data-page="dives"] .orb'), want = 0;
  icons.forEach(function(g, i){
    var u = g.userData, w = want*(FLY.k > 0 ? 0 : 1);
    u.show += (w - u.show)*(1 - Math.exp(-(w ? 2 : 6)*dt));
    g.visible = u.show > 0.01 && !!orbs[i];
    if (!g.visible) return;
    var r = orbs[i].getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + r.height/2;
    ndc.set(cx/window.innerWidth*2 - 1, -(cy/window.innerHeight)*2 + 1);
    raycaster.setFromCamera(ndc, camera);
    var dist = 9; g.position.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, dist);
    var worldH = 2*Math.tan(camera.fov*Math.PI/360)*dist, sz = r.height/window.innerHeight*worldH*1.05;
    g.scale.setScalar(Math.max(0.001, sz*u.show));
    u.hover += ((iconHover === i ? 1 : 0) - u.hover)*(1 - Math.exp(-6*dt));
    g.quaternion.copy(camera.quaternion);
    g.children.forEach(function(ch){ if (ch !== u.ring){ ch.rotation.y = time*0.5 + i; ch.rotation.x = 0.3; } });
    u.ring.rotation.z = -time*(0.4 + u.hover*1.2);
    u.mat.uniforms.uShow.value = u.show; u.mat.uniforms.uGlow.value = u.hover;
    u.edges.material.opacity = (0.35 + 0.65*u.hover)*u.show;
    u.ring.material.opacity = (0.3 + 0.7*u.hover)*u.show;
  });
}
/* busywork bubbles for the hold-to-automate problem */
var emitAcc = 0;
function emitBubbles(dt, rate){
  emitAcc += dt*rate;
  while (emitAcc >= 1){ emitAcc -= 1;
    for (var i = 0; i < NB; i++){ var b = bub[i]; if (b.life <= 0){ b.life = 2.5 + Math.random()*2; b.x = (Math.random()*2 - 1)*7; b.z = 2 + Math.random()*8; b.y = camera.position.y - 5 - Math.random()*2; b.vy = 1.5 + Math.random()*2.5; b.ph = Math.random()*6.28; b.s = 0.6 + Math.pow(Math.random(), 2)*2.2; break; } }
  }
}
function mouthFn(){ return angler.mouthWorld(preyTmp); }
var ZONE = { dives:'mackerel', interfaces:'mackerel', systems:'lantern', ai:'angler' };
creaturesFor = function(page){
  extras.setZone(ZONE2[page] || null, page === 'interfaces');
  var want = ZONE[page] || null, y0 = PAGE[page].y0;
  if (want !== 'mackerel') school.leave(); else if (!school.active()) setTimeout(function(){ school.form(new THREE.Vector3(page === 'dives' ? -3.5 : 3.5, y0 - (page === 'dives' ? 1.4 : 3.2), page === 'dives' ? -3 : -7)); }, 250);
  if (want !== 'lantern') lantern.leave(); else if (!lantern.active()) setTimeout(function(){ lantern.form(new THREE.Vector3(4, y0 - 1.2, -2.5)); }, 250);
  if (want === 'angler'){ setTimeout(function(){ angler.arrive(); }, 600); setTimeout(function(){ shrimp.start(region); }, 1800); setTimeout(function(){ if (!prey.active()) prey.form(new THREE.Vector3(small ? 0 : 1.5, y0 + (small ? 2.0 : -1.0), -1.2)); }, 2600); }
  else { angler.leave(); prey.leave(); shrimp.stop(); }
};
var avoidPtr = { p:new THREE.Vector3(0,0,-999), r:2.4, k:10, zw:0 }, avoidJelly = { p:new THREE.Vector3(), r:2.8, k:7, zw:1 };
school.state.avoid = [avoidPtr, avoidJelly];
lantern.state.avoid = [avoidPtr, avoidJelly];

/* ---------- Bubbles when the camera breaks the surface ---------- */
var NB = small ? 160 : 320, bub = [], bPos = new Float32Array(NB*3), bA = new Float32Array(NB), bS = new Float32Array(NB);
for (var bi=0; bi<NB; bi++) bub.push({ life:0, x:0, y:0, z:0, vy:0, ph:0, s:1 });
var bGeo = new THREE.BufferGeometry();
bGeo.setAttribute('position', new THREE.BufferAttribute(bPos,3).setUsage(THREE.DynamicDrawUsage));
bGeo.setAttribute('aA', new THREE.BufferAttribute(bA,1).setUsage(THREE.DynamicDrawUsage));
bGeo.setAttribute('aS', new THREE.BufferAttribute(bS,1).setUsage(THREE.DynamicDrawUsage));
var bubbles = new THREE.Points(bGeo, new THREE.ShaderMaterial({ uniforms:{ uPR:{value:PR} }, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"attribute float aA; attribute float aS; uniform float uPR; varying float vA; void main(){ vA = aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = min(aS*uPR*(40.0/-mv.z), 90.0*uPR); }",
  fragmentShader:"varying float vA; void main(){ vec2 q = gl_PointCoord-0.5; float r = length(q); float ring = smoothstep(0.5,0.42,r) - smoothstep(0.42,0.3,r)*0.75; float hi = smoothstep(0.16,0.0,length(q-vec2(-0.14,-0.14))); gl_FragColor = vec4(vec3(0.75,0.93,1.0)*(ring*0.55 + hi*0.9)*vA, 1.0); }" }));
bubbles.frustumCulled = false; bubbles.renderOrder = 40; scene.add(bubbles);
var warpT = 0;
function splash(up){
  warpT = 1;
  for (var i=0;i<NB;i++){ var b = bub[i]; b.life = 0.9 + Math.random()*1.4; b.x = (Math.random()-0.5)*9; b.z = 4 + Math.random()*8; b.y = camera.position.y - (up ? -0.5 : 0.6) - Math.random()*3.5; b.vy = (up ? 1 : 1) * (2 + Math.random()*4.5); b.ph = Math.random()*6.28; b.s = 0.5 + Math.pow(Math.random(), 2)*2.6; }
  Sound.whoosh(1.2);
}
function updateBubbles(dt, time){
  var any = false;
  for (var i=0;i<NB;i++){
    var b = bub[i];
    if (b.life > 0){ any = true; b.life -= dt; b.y += b.vy*dt; b.x += Math.sin(time*6 + b.ph)*0.4*dt*b.s; b.vy *= Math.exp(-0.4*dt); }
    bPos[i*3] = b.x; bPos[i*3+1] = Math.min(b.y, -0.05); bPos[i*3+2] = b.z; bA[i] = Math.max(0, Math.min(1, b.life*1.4)); bS[i] = b.s;
  }
  bubbles.visible = any;
  if (any){ bGeo.attributes.position.needsUpdate = true; bGeo.attributes.aA.needsUpdate = true; bGeo.attributes.aS.needsUpdate = true; }
}

/* ---------- The current transition: a tunnel of streaking particles ---------- */
var veil = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.ShaderMaterial({
  uniforms:{ uA:{value:0}, uCol:{value:new THREE.Color(0x04304d)} }, transparent:true, depthTest:false, depthWrite:false,
  vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
  fragmentShader:"uniform float uA; uniform vec3 uCol; varying vec2 vUv; void main(){ float r = length(vUv-0.5); vec3 c = mix(uCol*1.35, uCol*0.55, smoothstep(0.0, 0.75, r)); gl_FragColor = vec4(c, uA); }"
}));
veil.frustumCulled = false; veil.renderOrder = 900; scene.add(veil);
/* The current: a winding tube of moving water. Everything lives in "current space":
   S is distance along the current, T is how far the camera has travelled. The path bends,
   so particles, streaks and the water strands all curve together as they rush past. */
function pcx(S){ return 9.0*Math.sin(S*0.009) + 1.5*Math.sin(S*0.021 + 1.7); }
function pdx(S){ return 0.081*Math.cos(S*0.009) + 0.0315*Math.cos(S*0.021 + 1.7); }
function pcy(S){ return 4.0*Math.sin(S*0.007 + 0.6) + 0.8*Math.sin(S*0.017); }
function pdy(S){ return 0.028*Math.cos(S*0.007 + 0.6) + 0.0136*Math.cos(S*0.017); }
var travel = 0, LEN = 72;
function offX(S){ return pcx(S) - pcx(travel) - (S - travel)*pdx(travel); }
function offY(S){ return pcy(S) - pcy(travel) - (S - travel)*pdy(travel); }
var NT = small ? 1000 : 2000, NS = small ? 320 : 650, NB2 = small ? 12 : 24;
var tData = [], tPos = new Float32Array(NT*3), tA = new Float32Array(NT), sPos = new Float32Array(NS*6), sA = new Float32Array(NS*2);
function seedT(d, far){ d.r = 0.5 + Math.pow(Math.random(), 0.7)*7; d.th = Math.random()*Math.PI*2; d.S = travel + (far ? LEN - 4 + Math.random()*6 : 2 + Math.random()*(LEN - 2)); d.b = 0.3 + Math.random()*0.7; d.v = 0.55 + 0.45*d.b; d.wob = Math.random()*6.28; }
for (var ti=0; ti<NT+NS; ti++){ var dd = {}; seedT(dd, false); tData.push(dd); }
var tGeo = new THREE.BufferGeometry();
tGeo.setAttribute('position', new THREE.BufferAttribute(tPos,3).setUsage(THREE.DynamicDrawUsage)); tGeo.setAttribute('aA', new THREE.BufferAttribute(tA,1).setUsage(THREE.DynamicDrawUsage));
var tunU = { uAmt:{value:0}, uPR:{value:PR}, uTint:{value:new THREE.Color(0x94e6fb)}, uT:{value:0}, uTime:SU.uTime };
var tunDots = new THREE.Points(tGeo, new THREE.ShaderMaterial({ uniforms:tunU, transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"attribute float aA; uniform float uPR; varying float vA; void main(){ vA = aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = min(uPR*(1.2+aA*2.0)*(30.0/-mv.z), 14.0*uPR); }",
  fragmentShader:"uniform float uAmt; uniform vec3 uTint; varying float vA; void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.08,r); gl_FragColor = vec4(mix(uTint*0.85, vec3(0.9,0.98,1.0), vA*0.6)*a*vA*uAmt, 1.0); }" }));
var sGeo = new THREE.BufferGeometry();
sGeo.setAttribute('position', new THREE.BufferAttribute(sPos,3).setUsage(THREE.DynamicDrawUsage)); sGeo.setAttribute('aA', new THREE.BufferAttribute(sA,1).setUsage(THREE.DynamicDrawUsage));
var tunLines = new THREE.LineSegments(sGeo, new THREE.ShaderMaterial({ uniforms:tunU, transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"attribute float aA; varying float vA; void main(){ vA = aA; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
  fragmentShader:"uniform float uAmt; uniform vec3 uTint; varying float vA; void main(){ gl_FragColor = vec4(uTint*vA*uAmt*0.85, 1.0); }" }));
/* out-of-focus particles drifting right past the lens */
var bkData = [], bkPos = new Float32Array(NB2*3), bkA = new Float32Array(NB2), bkS = new Float32Array(NB2);
function seedB(d, far){ d.r = 0.7 + Math.random()*3.2; d.th = Math.random()*Math.PI*2; d.z = far ? -11 - Math.random()*2 : -2 - Math.random()*10; d.sz = 14 + Math.random()*26; d.b = 0.3 + Math.random()*0.7; }
for (var bk=0; bk<NB2; bk++){ var db = {}; seedB(db, false); bkData.push(db); }
var bkGeo = new THREE.BufferGeometry();
bkGeo.setAttribute('position', new THREE.BufferAttribute(bkPos,3).setUsage(THREE.DynamicDrawUsage)); bkGeo.setAttribute('aA', new THREE.BufferAttribute(bkA,1).setUsage(THREE.DynamicDrawUsage)); bkGeo.setAttribute('aS', new THREE.BufferAttribute(bkS,1));
var tunBokeh = new THREE.Points(bkGeo, new THREE.ShaderMaterial({ uniforms:tunU, transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"attribute float aA; attribute float aS; uniform float uPR; varying float vA; void main(){ vA = aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uPR*aS*(4.0/-mv.z); }",
  fragmentShader:"uniform float uAmt; uniform vec3 uTint; varying float vA; void main(){ float r = length(gl_PointCoord-0.5)*2.0; float a = smoothstep(1.0,0.85,r)*(0.55 + 0.45*smoothstep(0.6,0.95,r)); gl_FragColor = vec4(mix(uTint, vec3(0.9,0.97,1.0), 0.4)*a*vA*uAmt*0.16, 1.0); }" }));
/* the water itself: strands of moving light on a winding tube around the camera */
var NOISE_GLSL = "float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); } float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hh(i), hh(i+vec2(1,0)), f.x), mix(hh(i+vec2(0,1)), hh(i+vec2(1,1)), f.x), f.y); } float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i=0;i<4;i++){ v += vn(p)*a; p *= 2.03; a *= 0.5; } return v; }";
var PATH_GLSL = "uniform float uT; float pcx(float S){ return 9.0*sin(S*0.009) + 1.5*sin(S*0.021 + 1.7); } float pdx(float S){ return 0.081*cos(S*0.009) + 0.0315*cos(S*0.021 + 1.7); } float pcy(float S){ return 4.0*sin(S*0.007 + 0.6) + 0.8*sin(S*0.017); } float pdy(float S){ return 0.028*cos(S*0.007 + 0.6) + 0.0136*cos(S*0.017); }";
var tubeGeo = new THREE.CylinderGeometry(1, 1, 1, small ? 40 : 72, small ? 40 : 70, true);
tubeGeo.rotateX(Math.PI/2); tubeGeo.translate(0, 0, -0.5);
var tunTube = new THREE.Mesh(tubeGeo, new THREE.ShaderMaterial({ uniforms:tunU, transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.BackSide,
  vertexShader:PATH_GLSL + " varying vec2 vC; varying float vZ; void main(){ vec3 p = position; float z = p.z*" + LEN.toFixed(1) + "; float S = uT - z; float ang = atan(p.y, p.x); float rad = 7.5*(1.0 + 0.16*sin(ang*3.0 + S*0.09) + 0.08*sin(ang*7.0 - S*0.13)); vec3 q = vec3(p.x*rad, p.y*rad, z); q.x += pcx(S) - pcx(uT) - (S - uT)*pdx(uT); q.y += pcy(S) - pcy(uT) - (S - uT)*pdy(uT); vC = vec2(ang, S); vZ = z; gl_Position = projectionMatrix*modelViewMatrix*vec4(q, 1.0); }",
  fragmentShader:NOISE_GLSL + " uniform float uAmt; uniform vec3 uTint; uniform float uTime; varying vec2 vC; varying float vZ; void main(){ vec2 q = vec2(vC.x*2.5, vC.y*0.09); float warp = fbm(q*1.3 + vec2(0.0, uTime*0.05)); float f = fbm(vec2(vC.x*6.0 + warp*2.2, vC.y*0.16)); float strands = smoothstep(0.52, 0.78, f); float fine = pow(abs(sin(vC.x*38.0 + warp*9.0 + vC.y*0.04)), 26.0)*smoothstep(0.35, 0.7, f); float fade = smoothstep(-70.0, -38.0, vZ)*smoothstep(-0.5, -7.0, vZ); float a = (strands*0.55 + fine*0.8)*fade*uAmt; gl_FragColor = vec4(mix(uTint*0.6, vec3(0.8,0.95,1.0), fine*0.5)*a*0.5, 1.0); }" }));
var goalGeo = new THREE.BufferGeometry(); goalGeo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,-60], 3).setUsage(THREE.DynamicDrawUsage));
var goalU = { uPR:{value:PR}, uSize:{value:0}, uI:{value:0}, uTint:tunU.uTint };
var tunGoal = new THREE.Points(goalGeo, new THREE.ShaderMaterial({ uniforms:goalU, transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"uniform float uPR; uniform float uSize; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uSize*uPR; }",
  fragmentShader:"uniform float uI; uniform vec3 uTint; void main(){ float r = length(gl_PointCoord - 0.5)*2.0; float g = exp(-r*r*4.0)*0.8 + exp(-r*r*22.0)*0.9; gl_FragColor = vec4(mix(uTint, vec3(0.92,0.98,1.0), 0.45)*g*uI, 1.0); }" }));
var lean = new THREE.Vector3();
[tunTube, tunDots, tunLines, tunBokeh, tunGoal].forEach(function(o, k){ o.frustumCulled = false; o.renderOrder = 949 + k; o.visible = false; camera.add(o); });
var swirl = 0;
function updateTunnel(dt){
  var a = V.amt, on = a > 0.002;
  tunDots.visible = tunLines.visible = tunTube.visible = tunBokeh.visible = tunGoal.visible = on; veil.visible = on;
  veil.material.uniforms.uA.value = smooth(0.12, 0.72, a)*0.97;
  tunU.uAmt.value = smooth(0.0, 0.45, a);
  if (!on) return;
  var speed = 4 + 62*a*a, len = 0.2 + 5*a*a;
  travel += speed*dt; tunU.uT.value = travel;
  swirl += dt*(0.2 + 0.6*a);
  /* lean into the bends of the current */
  lean.x += ((ptrS.y*0.18 - pdy(travel + 30)*2.0)*a - lean.x)*(1 - Math.exp(-1.5*dt));
  lean.y += ((ptrS.x*0.18 - pdx(travel + 30)*2.0)*a - lean.y)*(1 - Math.exp(-1.5*dt));
  lean.z += ((-pdx(travel + 20)*1.2)*a - lean.z)*(1 - Math.exp(-1.5*dt));
  [tunDots, tunLines, tunTube, tunBokeh, tunGoal].forEach(function(o){ o.rotation.set(lean.x, lean.y, lean.z); });
  for (var i=0;i<NT+NS;i++){
    var d = tData[i];
    d.S -= speed*dt*(d.v - 1);                     /* slower particles fall behind relative to the flow */
    var z = -(d.S - travel);
    if (z > -1.2) { seedT(d, true); z = -(d.S - travel); }
    var th = d.th + swirl*(1.4/(d.r+0.6)) + Math.sin(clock*0.5 + d.wob)*0.03, rr = d.r*(1 + 0.12*Math.sin(d.S*0.09 + d.th*3.0));
    var x = Math.cos(th)*rr + offX(d.S), y = Math.sin(th)*rr + offY(d.S);
    var fade = smooth(-70, -42, z)*smooth(-1.2, -6, z)*d.b;
    if (i < NT){ tPos[i*3] = x; tPos[i*3+1] = y; tPos[i*3+2] = z; tA[i] = fade; }
    else {
      var j = i - NT, S2 = d.S + len*d.b;
      sPos[j*6] = x; sPos[j*6+1] = y; sPos[j*6+2] = z;
      sPos[j*6+3] = Math.cos(th)*rr + offX(S2); sPos[j*6+4] = Math.sin(th)*rr + offY(S2); sPos[j*6+5] = -(S2 - travel);
      sA[j*2] = fade; sA[j*2+1] = 0;
    }
  }
  for (i=0;i<NB2;i++){
    var b = bkData[i]; b.z += speed*dt*0.12;
    if (b.z > -1.5) seedB(b, true);
    bkPos[i*3] = Math.cos(b.th + swirl*0.3)*b.r; bkPos[i*3+1] = Math.sin(b.th + swirl*0.3)*b.r; bkPos[i*3+2] = b.z;
    bkA[i] = smooth(-13, -9, b.z)*smooth(-1.5, -3, b.z)*b.b; bkS[i] = b.sz;
  }
  var gp = goalGeo.attributes.position; gp.setXYZ(0, offX(travel + 62), offY(travel + 62), -62); gp.needsUpdate = true;
  var pr = V.prog || 0; goalU.uSize.value = 50 + 650*pr*pr*pr; goalU.uI.value = smooth(0.05, 0.4, pr)*(0.3 + 0.4*pr)*smooth(0.0, 0.5, a);
  tGeo.attributes.position.needsUpdate = true; tGeo.attributes.aA.needsUpdate = true; sGeo.attributes.position.needsUpdate = true; sGeo.attributes.aA.needsUpdate = true;
  bkGeo.attributes.position.needsUpdate = true; bkGeo.attributes.aA.needsUpdate = true;
}

/* ---------- Plankton the visitor can feed it ---------- */
var MAXF = 160, food = [];
var fPos = new Float32Array(MAXF*3), fA = new Float32Array(MAXF), fS = new Float32Array(MAXF);
var fGeo = new THREE.BufferGeometry();
fGeo.setAttribute('position', new THREE.BufferAttribute(fPos,3).setUsage(THREE.DynamicDrawUsage));
fGeo.setAttribute('aA', new THREE.BufferAttribute(fA,1).setUsage(THREE.DynamicDrawUsage));
fGeo.setAttribute('aS', new THREE.BufferAttribute(fS,1).setUsage(THREE.DynamicDrawUsage));
var foodPts = new THREE.Points(fGeo, new THREE.ShaderMaterial({
  uniforms:{ uPR:{value:PR} }, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:"attribute float aA; attribute float aS; uniform float uPR; varying float vA; void main(){ vA = aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = aS*uPR*(30.0/-mv.z); }",
  fragmentShader:"varying float vA; void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.1,r); gl_FragColor = vec4(vec3(1.0,0.66,0.40)*a*vA*1.1, 1.0); }"
}));
foodPts.frustumCulled = false; foodPts.renderOrder = 30; scene.add(foodPts);
function spawnFood(at){
  for (var i=0;i<16 && food.length<MAXF;i++){
    var a = Math.random()*Math.PI*2, r = Math.sqrt(Math.random())*0.45;
    food.push({ p:new THREE.Vector3(at.x+Math.cos(a)*r, Math.min(-1, at.y+Math.sin(a)*r), (Math.random()-0.5)*0.8),
      v:new THREE.Vector3((Math.random()-0.5)*0.4,(Math.random()-0.5)*0.4,0), hop:Math.random()*0.8, age:0,
      caught:false, arm:0, node:0, off:new THREE.Vector3(), life:0, size:3+Math.random()*2 });
  }
}
var mouthW = new THREE.Vector3(), tmpF = new THREE.Vector3(), foodCentroid = new THREE.Vector3();
function updateFood(dt){
  var s = J.root.scale.x, nFree = 0; foodCentroid.set(0,0,0);
  J.body.localToWorld(mouthW.set(0,-0.55,0));
  for (var i=food.length-1;i>=0;i--){
    var f = food[i]; f.age += dt;
    if (f.caught){ f.p.copy(J.arms[f.arm].cur[f.node]).add(f.off); f.life -= dt; if (f.life <= 0) food.splice(i,1); continue; }
    f.hop -= dt;
    if (f.hop < 0){ f.hop = 0.35 + Math.random()*0.9; f.v.x += (Math.random()-0.5)*0.9; f.v.y += (Math.random()-0.5)*0.9; }
    f.v.multiplyScalar(Math.exp(-2.2*dt)); f.v.y -= 0.04*dt;
    tmpF.copy(mouthW).sub(f.p); var d = tmpF.length(), reach = 4.2*s;
    if (d < reach) f.v.addScaledVector(tmpF.normalize(), (0.25 + 1.6*Math.max(0, J.state.c))*(1 - d/reach)*0.95*dt);
    f.p.addScaledVector(f.v, dt); if (f.p.y > -0.8) f.p.y = -0.8;
    for (var k=0;k<J.arms.length && !f.caught;k++) for (var j=2;j<J.arms[k].cur.length;j++){
      var nd = J.arms[k].cur[j];
      if (f.p.distanceToSquared(nd) < (0.3*s)*(0.3*s)){ f.caught = true; f.arm = k; f.node = j; f.off.copy(f.p).sub(nd).multiplyScalar(0.55); f.life = 3.5 + Math.random()*2.5; break; }
    }
    if (f.age > 30){ food.splice(i,1); continue; }
    if (Math.abs(f.p.y - camera.position.y) < 8){ foodCentroid.add(f.p); nFree++; }
  }
  for (i=0;i<MAXF;i++){
    if (i < food.length){ var g = food[i]; fPos[i*3]=g.p.x; fPos[i*3+1]=g.p.y; fPos[i*3+2]=g.p.z;
      fA[i] = g.caught ? Math.min(1, g.life/2.5)*0.9 : Math.min(1, g.age*3)*Math.min(1, (30-g.age)/3);
      fS[i] = g.caught ? g.size*(0.6+0.4*Math.min(1, g.life/2.5)) : g.size;
    } else { fA[i] = 0; fS[i] = 0; }
  }
  fGeo.attributes.position.needsUpdate = true; fGeo.attributes.aA.needsUpdate = true; fGeo.attributes.aS.needsUpdate = true;
  if (nFree > 0) foodCentroid.multiplyScalar(1/nFree);
  return nFree;
}

/* ---------- Touch, click, drag ---------- */
var raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), waterPlane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
var ptrW = new THREE.Vector3(0,0,-999), ptrVel = new THREE.Vector3(), ptrT = 0, ptrHas = false;
var jellyC = new THREE.Vector3(), hitTmp = new THREE.Vector3();
var drag = { on:false, moved:false, x:0, y:0 }, spin = { yawV:0, pitch:0 }, lastType = 'mouse', yaw = 0;
var escape = { off:new THREE.Vector3(), vel:new THREE.Vector3(), tilt:0, tiltT:0 };
function toWorld(cx, cy, out){ ndc.set(cx/window.innerWidth*2-1, -(cy/window.innerHeight)*2+1); raycaster.setFromCamera(ndc, camera); return raycaster.ray.intersectPlane(waterPlane, out); }
function jellyCenter(){ return J.body.localToWorld(jellyC.set(0,-0.15,0)); }
function playable(){ return introState.begun && !busy && camera.position.y < -1 && current !== 'home' && !root.classList.contains('menu-open'); }
function overJelly(cx, cy){ if (!playable()) return false; ndc.set(cx/window.innerWidth*2-1, -(cy/window.innerHeight)*2+1); raycaster.setFromCamera(ndc, camera); return raycaster.ray.distanceToPoint(jellyCenter()) < 1.35*J.root.scale.x; }
function ignoreTarget(t){ return !!(t && t.closest && t.closest('a,button,input,textarea,select,label,p,h1,h2,h3,li,dt,dd,.hud,.intro,.menu,.dive,.intake,.ik-direct,.guide,.guide-btn,.stop-in,.side-dive,.jprog,.modal-wrap')); }
function startle(cx, cy){
  J.startle(1);
  var at = toWorld(cx, cy, hitTmp) || jellyCenter().clone();
  var dir = jellyCenter().clone().sub(at); dir.z = 0; if (dir.lengthSq() < 1e-4) dir.set(0,1,0); dir.normalize();
  escape.vel.addScaledVector(dir, reduce ? 1.2 : 3.4);
  escape.tiltT = Math.max(-0.8, Math.min(0.8, -Math.atan2(dir.x, Math.max(0.2, dir.y))));
}
function feedAt(cx, cy){ if (!playable()) return; var at = toWorld(cx, cy, hitTmp); if (at && at.y < -1) spawnFood(at); }
window.addEventListener('pointerdown', function(e){
  lastType = e.pointerType || 'mouse';
  if (lastType !== 'mouse' || e.button !== 0 || ignoreTarget(e.target)) return;
  if (overJelly(e.clientX, e.clientY)){ drag.on = true; drag.moved = false; drag.x = e.clientX; drag.y = e.clientY; root.style.cursor = 'grabbing'; e.preventDefault(); }
  else feedAt(e.clientX, e.clientY);
});
var ptr = {x:0,y:0}, ptrS = {x:0,y:0};
window.addEventListener('pointermove', function(e){
  var now = performance.now()/1000;
  if (!reduce){ ptr.x = e.clientX/window.innerWidth*2-1; ptr.y = e.clientY/window.innerHeight*2-1; }
  if (toWorld(e.clientX, e.clientY, hitTmp)){
    if (ptrHas){ var dtp = Math.max(1/120, now - ptrT); ptrVel.lerp(hitTmp.clone().sub(ptrW).multiplyScalar(1/dtp), 0.5); }
    ptrW.copy(hitTmp); ptrT = now; ptrHas = true;
  }
  if (drag.on){
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    yaw += dx*0.012; spin.yawV = dx*0.012*60; spin.pitch = Math.max(-0.5, Math.min(0.5, spin.pitch + dy*0.004));
    drag.x = e.clientX; drag.y = e.clientY;
  } else if ((e.pointerType || 'mouse') === 'mouse'){
    root.style.cursor = (!ignoreTarget(e.target) && overJelly(e.clientX, e.clientY)) ? 'grab' : '';
  }
}, {passive:true});
window.addEventListener('pointerup', function(e){ if (!drag.on) return; drag.on = false; root.style.cursor = ''; if (!drag.moved){ J.startle(0.35); openGuide(); } });
window.addEventListener('click', function(e){
  if (lastType === 'mouse' || ignoreTarget(e.target)) return;
  if (overJelly(e.clientX, e.clientY)){ J.startle(0.35); openGuide(); } else feedAt(e.clientX, e.clientY);
});

/* ---------- Loop ---------- */
window.addEventListener('scroll', function(){ sTarget = pageFrac(); }, {passive:true});
/* Size the scene to the large viewport, so the phone's address bar sliding in and out
   while scrolling never resizes or re-frames the 3D view. */
var lvhEl = $('#lvh'), lastW = 0, lastH = 0;
function resize(){
  var w = window.innerWidth, h = Math.max(window.innerHeight, (lvhEl && lvhEl.offsetHeight) || 0);
  if (w === lastW && Math.abs(h - lastH) < 2) return;
  lastW = w; lastH = h;
  renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix(); bloom.setSize(w, h);
  if (current) labelDepthTags(current);
}
window.addEventListener('resize', resize); resize();

function targetX(){ if (guide.open) return small ? 0 : 1.6; if (STAGE.on) return small ? 0.6 : (STAGE.side === 'right' ? -5.8 : 5.8); return small ? (current === 'dives' ? 1.4 : (current === 'ai' ? -1.4 : 0.75)) : (current === 'dives' || current === 'ai' ? 6.9 : 4.6); }
function targetY(camY){ if (guide.open) return Math.min(camY + (small ? 4.2 : 0.6), -4.2); if (STAGE.on) return Math.min(camY + (small ? 3.9 : 1.7), -4.2); return Math.min(camY + (current === 'dives' ? (small ? 3.9 : 1.4) : current === 'ai' ? (small ? 4.0 : 2.8) : (small ? 3.4 : 0.75)), -4.2); }
var camOff = { x:0, z:0 }, lookK = 0, floorK = 0, TRAVEL = 0, stageK = 0;
var clock = 0, prevT = performance.now(), lastCamY = cam.y, home = new THREE.Vector3(), frames = 0, hintShown = false, hintEl = $('.hud-hint');
var base = new THREE.Vector3(targetX(), targetY(cam.y), 0), anchorTmp = new THREE.Vector3(), escTmp = new THREE.Vector3(), mouthTmp = new THREE.Vector3();

function frame(now){
  var dt = Math.max(0, Math.min(0.05, (now-prevT)/1000)); prevT = Math.max(prevT, now); clock += dt;
  sSmooth += (sTarget - sSmooth)*(reduce ? 1 : (1 - Math.exp(-6*dt)));
  var P = PAGE[current || 'home'];
  var dy = diveFrame(dt);
  if (dy !== null) cam.y = dy;
  else if (STAGE.on && !busy){ var spp = STAGE.p, PP = PAGE[STAGE.page]; cam.y += (PP.y0 + (PP.y1 - PP.y0)*(STAGE.n > 1 ? spp/(STAGE.n - 1) : 0) - cam.y)*(reduce ? 1 : (1 - Math.exp(-4.5*dt))); }
  else if (!cam.driven && !busy) cam.y += (P.y0 + (P.y1 - P.y0)*sSmooth - cam.y)*(reduce ? 1 : (1 - Math.exp(-5*dt)));
  if (current && P.dive && !busy) discovered[current] = Math.max(discovered[current], sSmooth > 0.97 ? 1 : sSmooth);
  var camY = cam.y;
  if (STAGE.on) TRAVEL = STAGE.p*16; stageK += ((STAGE.on ? 1 : 0) - stageK)*(1 - Math.exp(-2*dt)); SU.uTravel.value = TRAVEL;
  var wantX = STAGE.on ? 1.3*Math.sin(STAGE.p*1.4) : 0, wantZ = 0;
  camOff.x += (wantX - camOff.x)*(1 - Math.exp(-2.5*dt)); camOff.z += (wantZ - camOff.z)*(1 - Math.exp(-2.5*dt));
  lookK += (((current === 'dives' && !small && !reduce) ? 1 : 0) - lookK)*(1 - Math.exp(-2*dt));
  camera.position.set(camOff.x + ptrS.x*0.9*lookK, camY, 14 + camOff.z + cam.zOff);
  if (FLY.k > 0){ var fi2 = icons[FLY.i]; camera.position.z -= 9*FLY.k*FLY.k;  }
  camera.fov = 45 + 22*V.amt*V.amt + 9*FLY.k*FLY.k; camera.updateProjectionMatrix();
  if (introState.begun && !reduce && Math.abs(camY - lastCamY) < 2.5 && ((lastCamY >= 0 && camY < 0) || (lastCamY < 0 && camY >= 0))) splash(camY >= 0);
  lastCamY = camY;
  var aboveT = smooth(-0.5, 1.5, camY), par = (reduce || small) ? 0 : 1;
  floorK += ((current === 'work' ? 1 : 0) - floorK)*(1 - Math.exp(-1.5*dt));
  camera.rotation.x = 0.015*aboveT - 0.16*floorK - ptrS.y*(0.022 + 0.05*lookK)*par; camera.rotation.y = -ptrS.x*(0.032 + 0.1*lookK)*par + 0.1*Math.sin(TRAVEL*0.045)*stageK*(reduce ? 0 : 1);
  camera.rotation.z = (reduce ? 0 : 0.06)*Math.sin(V.amt*Math.PI) + (ptrS.x*0.012*par);

  var tx = targetX(), ty = targetY(camY);
  base.x += (tx - base.x)*(1 - Math.exp(-2*dt));
  base.y += (ty - base.y)*(1 - Math.exp(-3.2*dt));
  base.y = Math.min(ty + 3.2, Math.max(ty - 3.2, base.y));
  ptrS.x += (ptr.x - ptrS.x)*0.04; ptrS.y += (ptr.y - ptrS.y)*0.04;
  var lag = ty - base.y;
  var nFree = updateFood(dt);
  home.set(0,0,0);
  if (nFree > 0){ home.copy(foodCentroid).sub(J.root.position); home.z = 0; if (home.length() > 1.8) home.setLength(1.8); home.multiplyScalar(0.55); }
  escape.vel.addScaledVector(escape.off.clone().sub(home), -1.1*dt);
  escape.vel.multiplyScalar(Math.exp(-1.6*dt));
  escape.off.addScaledVector(escape.vel, dt); escape.off.clampLength(0, 4.5);
  escape.tiltT *= Math.exp(-0.9*dt);
  escape.tilt += (escape.tiltT - escape.tilt)*(1 - Math.exp(-4*dt));
  if (!drag.on){ yaw += spin.yawV*dt; spin.yawV *= Math.exp(-1.8*dt); spin.pitch *= Math.exp(-1.5*dt); }
  yaw += dt*(reduce ? 0.02 : 0.05);
  J.root.position.set(base.x + escape.off.x, Math.min(base.y + escape.off.y, -3.6), 0);
  J.root.rotation.set(0.10 + spin.pitch + ptrS.y*0.10 + Math.max(-0.2, Math.min(0.2, lag*0.025)), yaw, -ptrS.x*0.10 + escape.tilt);
  ptrVel.multiplyScalar(Math.exp(-5*dt));
  J.setFlow(ptrW, ptrVel, 1.6*JSCALE);
  SU.uPtr.value.copy(ptrW); SU.uPtrV.value.copy(ptrVel);
  if (guide.talking && Math.random() < dt*1.4) J.startle(0.3);
  J.update(dt, clock);
  flowPanels();

  var depthF = Math.min(1, Math.max(0, -camY/(-Y_BOTTOM)));
  var deep = smooth(0.2, 0.85, depthF);
  J.uniforms.uGlow.value = deep;
  J.uniforms.uDeep.value.copy(deepA).lerp(deepB, deep);
  J.uniforms.uCaustic.value = 1 - smooth(0.04, 0.22, depthF);
  bloom.uniforms.strength.value = 0.45 + 0.45*deep + 0.35*V.amt + STAGE.env.bloom;
  SU.uTime.value = reduce ? 0 : clock; SU.uDeep.value = deep;
  shaftU.uShaft.value = (1 - smooth(0.05, 0.3, depthF))*STAGE.env.shaft;
  stageFrame(dt); globeFrame(dt);
  var water = bgAt(depthF); water.r = Math.min(1, water.r*STAGE.env.tint[0]); water.g = Math.min(1, water.g*STAGE.env.tint[1]); water.b = Math.min(1, water.b*STAGE.env.tint[2]);
  surface.uniforms.uUnderBg.value.copy(water);
  renderer.setClearColor(water);
  surface.update(clock, camera);
  updateCurrents(dt, clock);
  updateTunnel(dt);
  if (STAGE.holdOn) emitBubbles(dt, (1 - STAGE.hold)*70);
  updateBubbles(dt, clock);
  extras.uniforms.uFog.value.copy(water); extras.update(dt, clock, camY, TRAVEL);
  updateIcons(dt, clock);
  warpT = Math.max(0, warpT - dt/1.3);
  bloom.uniforms.warp.value = warpT*warpT; bloom.uniforms.time.value = clock;
  bloom.uniforms.radial.value = reduce ? 0 : smooth(0.2, 1.0, V.amt)*0.3;
  avoidPtr.p.copy(ptrW); avoidJelly.p.copy(jellyCenter()); avoidJelly.r = 1.6*JSCALE;
  school.uniforms.uFog.value.copy(water);
  school.uniforms.uEnvTop.value.setRGB(Math.min(1, water.r*2.6 + 0.25), Math.min(1, water.g*2.4 + 0.3), Math.min(1, water.b*2.0 + 0.35));
  school.uniforms.uEnvBot.value.copy(water).multiplyScalar(0.35);
  school.uniforms.uCaustic.value = 1 - smooth(0.04, 0.3, depthF);
  if (school.active()) school.setBox(Math.max(-20, Math.min(-4.5, camY - 1.2)));
  school.group.visible = school.update(dt, clock);
  lantern.uniforms.uFog.value.copy(water); lantern.uniforms.uEnvTop.value.copy(school.uniforms.uEnvTop.value); lantern.uniforms.uEnvBot.value.copy(water).multiplyScalar(0.3); lantern.uniforms.uCaustic.value = 0;
  if (lantern.active()) lantern.setBox(Math.max(-40, Math.min(-19, camY - 1.0)));
  lantern.group.visible = lantern.update(dt, clock);
  angler.uniforms.uFog.value.copy(water);
  /* her hunting ground: right of the text on desktop, above it on phones */
  region.cx = small ? 0.2 : 4.5; region.hx = small ? 1.1 : 1.5; region.cy = camY + (small ? 2.2 : -2.4); region.hy = small ? 0.8 : 1.3; region.z = -1.2;
  var preyNear = false, esc = angler.escaWorld(escTmp);
  if (prey.active()){
    prey.setBox(region.cy, region.cx);
    prey.state.attract = angler.state.show > 0.5 ? { p:esc, r: small ? 3.5 : 5.5, k:1.6 } : null;
    prey.uniforms.uFog.value.copy(water); prey.uniforms.uEnvTop.value.copy(water).multiplyScalar(1.6); prey.uniforms.uEnvBot.value.copy(water).multiplyScalar(0.3); prey.uniforms.uCaustic.value = 0;
  }
  /* the nearest thing worth eating, fish or shrimp */
  var nearD = 1e9, nearP = null, angPos = angler.root.position;
  for (var pi2 = 0; pi2 < prey.count; pi2++){ if (prey.active() && prey.available(pi2)){ var dd2 = prey.positions[pi2].distanceTo(angPos); if (dd2 < nearD){ nearD = dd2; nearP = prey.positions[pi2]; } } }
  for (var si2 = 0; si2 < shrimp.count; si2++){ if (shrimp.available(si2)){ var ds2 = shrimp.positions[si2].distanceTo(angPos); if (ds2 < nearD){ nearD = ds2; nearP = shrimp.positions[si2]; } } }
  var angOn = angler.update(dt, clock, { region: region, pointer: ptrW, pointerSpeed: ptrVel.length(), nearPrey: nearP ? nearTmp.copy(nearP) : null });
  shrimp.update(dt, clock, region, angler.uniforms.uLure.value, angOn ? angler.uniforms.uLureI.value : 0);
  prey.group.visible = prey.update(dt, clock);
  if (angOn && angler.state.show > 0.5){
    esc = angler.escaWorld(escTmp);
    var sc = angler.root.scale.x/2.6, mw = angler.mouthWorld(mouthTmp);
    if (ptrW.distanceTo(esc) < 0.75*sc) angler.snap();
    /* strike at any small fish that comes close to the lure or the mouth, and swallow it whole */
    for (var pj = 0; pj < prey.count; pj++){
      if (!prey.available(pj)) continue;
      var pp = prey.positions[pj];
      if (pp.distanceTo(esc) < 0.42*sc || pp.distanceTo(mw) < 0.55*sc){ if (angler.snap()){ prey.capture(pj, mouthFn); shrimp.startle(mw); setTimeout(angler.fed, 400); } break; }
    }
    for (var sj = 0; sj < shrimp.count; sj++){
      if (!shrimp.available(sj)) continue;
      var sp3 = shrimp.positions[sj];
      if (sp3.distanceTo(esc) < 0.4*sc || sp3.distanceTo(mw) < 0.5*sc){ if (angler.snap()){ shrimp.capture(sj, mouthFn); shrimp.startle(mw); setTimeout(angler.fed, 400); } break; }
    }
    var ate = false;
    for (var fi = food.length - 1; fi >= 0; fi--){ var fd = food[fi]; if (!fd.caught && fd.p.distanceTo(mw) < 0.9*sc){ ate = true; food.splice(fi, 1); } else if (!fd.caught && fd.p.distanceTo(esc) < 2.2){ fd.v.addScaledVector(tmpF.copy(esc).sub(fd.p).normalize(), 0.9*dt); } }
    if (ate) angler.snap();
  }
  SU.uLure.value.copy(angOn ? angler.uniforms.uLure.value : SU.uLure.value.set(0,0,-999)); SU.uLureI.value = angOn ? angler.uniforms.uLureI.value : 0;

  readout(camY);
  if (camY < -1.5 && !hintShown && introState.begun && !busy){ hintShown = true; hintEl.classList.add('is-on'); setTimeout(function(){ hintEl.classList.remove('is-on'); }, 9000); }
  Sound.update(dt, depthF, camY > 0);

  var covered = V.amt > 0.86;
  J.root.visible = !covered; surface.group.visible = !covered;
  extras.root.visible = !covered; icons.forEach(function(g){ if (covered) g.visible = false; });
  if (covered){ school.group.visible = false; lantern.group.visible = false; angler.root.visible = false; prey.group.visible = false; shrimp.group.visible = false; currents.visible = false; snow.visible = false; foodPts.visible = false; }
  else { snow.visible = true; foodPts.visible = true; }
  bloom.render(scene, camera);
  frames++; if (frames === 1) markProgress(0.8); else if (frames === 4) markProgress(1);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();

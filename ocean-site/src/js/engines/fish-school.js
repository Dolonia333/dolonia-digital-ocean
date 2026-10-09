/* Schooling mackerel (instanced) for three.js r128.
   Fusiform body with pointed snout and thin caudal peduncle, forked tail, two dorsal fins,
   pectoral fins, finlets, eyes. Silver flanks mirror the water column so they flash as
   fish turn; the back carries the wavy dark bars of a mackerel.
   Motion: carangiform (head steady, rear third and tail do the work), tail beat tied to speed,
   banking into turns, limited turn rate. A particle cloud can swirl in and become the school. */
(function (global) {
"use strict";
function createSchool(THREE, opts){
  opts = opts || {};
  var N = opts.count || 140, PER = opts.perFish || 20, hi = opts.quality !== 'low';
  var LANTERN = opts.species === 'lantern', SP = LANTERN ? 1 : 0;
  var group = new THREE.Group();

  /* ---------------- geometry ---------------- */
  var P = [], NR = [], UV = [], PART = [], I = [];
  function vtx(x, y, z, nx, ny, nz, u, v, part){ P.push(x, y, z); NR.push(nx, ny, nz); UV.push(u, v); PART.push(part); return P.length/3 - 1; }
  var XT = -0.40, XH = 0.52;
  function H(u){ return LANTERN ? 0.112*Math.pow(Math.sin(Math.PI*Math.pow(u, 0.9)), 0.62) + 0.014 : 0.118*Math.pow(Math.sin(Math.PI*Math.pow(u, 0.74)), 0.82) + 0.011; }
  function W(u){ return H(u)*(0.5 + 0.1*Math.sin(Math.PI*u)); }
  var RINGS = hi ? 34 : 22, SEG = hi ? 18 : 12;
  for (var r = 0; r <= RINGS; r++){
    var u = r/RINGS, x = XT + u*(XH - XT), h = H(u), w = W(u);
    for (var s = 0; s <= SEG; s++){
      var a = s/SEG*Math.PI*2, ca = Math.cos(a), sa = Math.sin(a);
      var y = h*ca*(ca > 0 ? 1.0 : 0.92), z = w*sa*(0.86 + 0.14*ca);
      vtx(x, y, z, 0, ca/h, sa/w, u, s/SEG, 0);
    }
  }
  for (r = 0; r < RINGS; r++) for (s = 0; s < SEG; s++){ var A = r*(SEG+1) + s, B = A + SEG + 1; I.push(A, B, A+1, A+1, B, B+1); }
  var TS = 8, TT = 12, tailStart = P.length/3;
  for (var i = 0; i <= TS; i++){
    var sx = i/TS;
    for (var j = 0; j <= TT; j++){
      var t = j/TT*2 - 1, span = 0.012 + 0.18*Math.pow(sx, 0.9);
      var te = -0.64 + 0.115*Math.pow(1 - Math.abs(t), 1.6);
      var xx = XT + (te - XT)*sx + 0.02*sx*Math.abs(t);
      vtx(xx, t*span, 0, 0, 0, 1, -sx*0.25, (t + 1)/2, 1);
    }
  }
  for (i = 0; i < TS; i++) for (j = 0; j < TT; j++){ var a0 = tailStart + i*(TT+1) + j, b0 = a0 + TT + 1; I.push(a0, b0, a0+1, a0+1, b0, b0+1); }
  function fan(base, pts, uu){
    var c = vtx(base[0], base[1], base[2], 0, 0, 1, uu, 0, 1), prev = -1;
    pts.forEach(function(p, k){ var id = vtx(p[0], p[1], p[2], 0, 0, 1, uu, (k + 1)/pts.length, 1); if (prev >= 0) I.push(c, prev, id); prev = id; });
  }
  fan([0.17, 0.105, 0], [[0.26,0.115,0],[0.21,0.17,0],[0.14,0.19,0],[0.08,0.15,0],[0.05,0.11,0]], 0.62);
  fan([-0.06, 0.088, 0], [[0.0,0.094,0],[-0.06,0.135,0],[-0.13,0.12,0],[-0.15,0.075,0]], 0.4);
  fan([-0.07, -0.085, 0], [[-0.01,-0.09,0],[-0.07,-0.125,0],[-0.14,-0.11,0],[-0.15,-0.07,0]], 0.38);
  [-1, 1].forEach(function(sd){ fan([0.27, -0.02, 0.05*sd], [[0.27,0.0,0.06*sd],[0.13,-0.01,0.13*sd],[0.11,-0.05,0.12*sd],[0.24,-0.05,0.055*sd]], 0.8); });
  for (var f = 0; f < 5; f++){ var fx = -0.2 - f*0.042; fan([fx, 0.05 - f*0.006, 0], [[fx + 0.02, 0.052 - f*0.006, 0],[fx - 0.006, 0.078 - f*0.007, 0],[fx - 0.02, 0.05 - f*0.006, 0]], 0.3); }

  var geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(NR, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2));
  geo.setAttribute('aPart', new THREE.Float32BufferAttribute(PART, 1));
  geo.setIndex(I);
  geo.instanceCount = N;
  var aBend = new Float32Array(N), aOcc = new Float32Array(N), aPh = new Float32Array(N), aAmp = new Float32Array(N), aShow = new Float32Array(N), aSeed = new Float32Array(N), aMat = [0,1,2,3].map(function(){ return new Float32Array(N*4); });
  for (var k = 0; k < N; k++){ aPh[k] = Math.random()*Math.PI*2; aSeed[k] = Math.random(); aAmp[k] = 1; }
  function inst(name, arr, size, dyn){ var at = new THREE.InstancedBufferAttribute(arr, size); if (dyn) at.setUsage(THREE.DynamicDrawUsage); geo.setAttribute(name, at); return at; }
  var bendAttr = inst('aBend', aBend, 1, true), occAttr = inst('aOcc', aOcc, 1, true), phAttr = inst('aPh', aPh, 1, true), ampAttr = inst('aAmp', aAmp, 1, true), showAttr = inst('aShow', aShow, 1, true); inst('aSeed', aSeed, 1, false);
  var matAttrs = aMat.map(function(arr, c){ return inst('aM' + c, arr, 4, true); });

  var U0 = {
    uFog:{value:new THREE.Color(0x1b587e)}, uEnvTop:{value:new THREE.Color(0.75,0.92,1.0)}, uEnvBot:{value:new THREE.Color(0.03,0.12,0.2)},
    uSun:{value:new THREE.Vector3(0.15, 1, 0.25).normalize()}, uOpacity:{value:1}, uSpecies:{value:SP}, uTime:{value:0}, uCaustic:{value:1}, uExt:{value:new THREE.Vector3(0.10, 0.045, 0.032)}
  };
  var mat = new THREE.ShaderMaterial({
    uniforms:U0, transparent:true, side:THREE.DoubleSide, depthWrite:true,
    vertexShader:[
      "attribute float aPart; attribute float aPh; attribute float aAmp; attribute float aShow; attribute float aSeed; attribute float aBend; attribute float aOcc;",
      "attribute vec4 aM0; attribute vec4 aM1; attribute vec4 aM2; attribute vec4 aM3;",
      "varying vec3 vN; varying vec3 vWP; varying vec2 vUv; varying float vPart; varying float vShow; varying vec3 vLoc; varying float vSeed; varying float vOcc;",
      "void main(){",
      "  vec3 p = position; vec3 n = normal;",
      /* z: 0 at the snout, ~1.25 at the tail tip, in body lengths */
      "  float z = (0.52 - p.x)/0.92;",
      /* lateral amplitude envelope of a cruising mackerel: smallest just behind the head, largest at the tail */
      "  float A = (0.02 - 0.0825*z + 0.1625*z*z)*aAmp;",
      "  float dA = (-0.0825 + 0.325*z)*aAmp;",
      "  float k = 6.2832/0.95;",
      "  float w = k*z - aPh;",
      "  float off = A*sin(w);",
      "  float slope = dA*sin(w) + A*k*cos(w);",
      /* curvature while turning: head and tail swing toward the inside of the turn */
      "  float zc = z - 0.45; off += aBend*0.5*zc*zc; slope += aBend*zc;",
      "  p.z += off*0.92;",
      "  n = normalize(vec3(n.x + slope*n.z, n.y, n.z));",
      "  mat4 M = mat4(aM0, aM1, aM2, aM3);",
      "  vec4 wp = M*vec4(p, 1.0);",
      "  vN = normalize(mat3(M)*n); vWP = wp.xyz; vUv = uv; vPart = aPart; vShow = aShow; vLoc = position; vSeed = aSeed; vOcc = aOcc;",
      "  gl_Position = projectionMatrix*viewMatrix*wp;",
      "}"].join("\n"),
    fragmentShader:[
      "uniform float uSpecies; uniform vec3 uFog; uniform vec3 uEnvTop; uniform vec3 uEnvBot; uniform vec3 uSun; uniform float uOpacity; uniform float uTime; uniform float uCaustic; uniform vec3 uExt;",
      "varying vec3 vN; varying vec3 vWP; varying vec2 vUv; varying float vPart; varying float vShow; varying vec3 vLoc; varying float vSeed; varying float vOcc;",
      "vec3 envAt(vec3 d){ return mix(uEnvBot, uEnvTop, smoothstep(-0.35, 0.85, d.y)); }",
      "void main(){",
      "  if (vShow < 0.01) discard;",
      "  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWP);",
      "  if (dot(N, V) < 0.0) N = -N;",
      "  float d = length(vWP - cameraPosition);",
      "  float ndv = max(dot(N, V), 0.0); float fres = pow(1.0 - ndv, 4.0);",
      "  vec3 R = reflect(-V, N);",
      "  vec3 col; float alpha = 1.0;",
      "  if (vPart < 0.5){",
      "    float u = vUv.x;",
      "    float hh = uSpecies > 0.5 ? 0.112*pow(sin(3.14159*pow(clamp(u,0.001,1.0), 0.9)), 0.62) + 0.014 : 0.118*pow(sin(3.14159*pow(clamp(u,0.001,1.0), 0.74)), 0.82) + 0.011;",
      "    float yl = vLoc.y/hh;",
      "    float dorsal = smoothstep(0.08, 0.55, yl);",
      "    float belly = smoothstep(-0.05, -0.65, yl);",
      "    float bars = sin(u*44.0 + sin(yl*7.0 + u*17.0 + vSeed*6.0)*1.7);",
      "    bars = smoothstep(0.15, 0.75, bars)*smoothstep(0.25, 0.7, yl);",
      "    vec3 back = mix(vec3(0.16,0.36,0.40), vec3(0.05,0.14,0.18), bars);",
      "    vec3 mirror = envAt(R)*1.15;",
      "    vec3 irid = 0.05*(0.5 + 0.5*cos(6.2832*(fres*1.1 + u*0.4 + vec3(0.55,0.65,0.8))));",
      "    vec3 flank = mirror*vec3(0.92,0.97,1.0) + irid*(1.0 - dorsal);",
      "    vec3 white = mix(vec3(0.82,0.88,0.9), envAt(R), 0.35);",
      "    col = mix(flank, white, belly);",
      "    col = mix(col, back*(0.75 + 0.5*max(dot(N, uSun), 0.0)), dorsal);",
      "    col += vec3(0.85,0.95,1.0)*smoothstep(0.03, 0.0, abs(yl - 0.22))*0.12*(1.0 - dorsal);",
      "    vec2 ep = uSpecies > 0.5 ? vec2((u - 0.88)*0.95, (yl - 0.12)*hh/0.13) : vec2((u - 0.885)*1.5, (yl - 0.18)*hh/0.11);",
      "    float er = length(ep);",
      "    float side = smoothstep(0.35, 0.6, abs(vLoc.z)/(hh*0.55));",
      "    float iris = smoothstep(0.085, 0.07, er)*side; float pupil = smoothstep(0.05, 0.038, er)*side;",
      "    col = mix(col, vec3(0.78,0.82,0.8), iris); col = mix(col, vec3(0.02,0.03,0.04), pupil);",
      "    col += vec3(1.0)*smoothstep(0.018, 0.0, length(ep - vec2(0.012, 0.02)))*side*0.8;",
      "    col += vec3(1.0,0.98,0.94)*pow(max(dot(R, uSun), 0.0), 40.0)*0.9*(1.0 - uSpecies*0.8);",
      "    if (uSpecies > 0.5){",
      "      col = mix(col*0.45, vec3(0.03,0.05,0.08), smoothstep(-0.2, 0.5, yl));",
      "    }",
      "    float sc = sin(u*420.0 + vUv.y*230.0)*sin(u*420.0 - vUv.y*230.0);",
      "    col += envAt(R)*0.10*smoothstep(0.55, 1.0, sc)*(1.0 - dorsal)*(1.0 - smoothstep(3.0, 7.0, d));",
      "    vec2 cq = vWP.xz*1.6;",
      "    float ca = sin(cq.x*1.7 + cq.y*0.6 + uTime*1.3)*sin(cq.y*1.9 - cq.x*0.5 - uTime*1.1) + sin((cq.x + cq.y)*1.2 + uTime*0.9)*0.5;",
      "    col += vec3(0.75,0.95,1.0)*pow(max(ca, 0.0), 3.0)*0.35*uCaustic*max(N.y, 0.0);",
      "  } else {",
      "    float rays = 0.65 + 0.35*sin(vUv.y*60.0);",
      "    col = mix(vec3(0.38,0.5,0.54), envAt(R)*0.85, 0.5)*rays;",
      "    alpha = 0.55;",
      "  }",
      "  col *= mix(1.0, 0.62, vOcc);",
      "  vec3 tr = exp(-d*uExt);",
      "  col = col*tr + uFog*(1.0 - exp(-d*0.055));",
      "  if (uSpecies > 0.5 && vPart < 0.5){",
      "    float u2 = vUv.x; float hh2 = 0.112*pow(sin(3.14159*pow(clamp(u2,0.001,1.0), 0.9)), 0.62) + 0.014; float y2 = vLoc.y/hh2;",
      "    float cell = fract(u2*26.0 + vSeed*0.3); float row1 = smoothstep(0.08, 0.0, abs(y2 + 0.62)); float row2 = smoothstep(0.08, 0.0, abs(y2 + 0.28))*step(0.35, u2)*step(u2, 0.8);",
      "    float dot1 = smoothstep(0.32, 0.12, abs(cell - 0.5));",
      "    float glow = (row1 + row2*0.8)*dot1*step(0.08, u2)*step(u2, 0.92);",
      "    float tw = 0.75 + 0.25*sin(uTime*2.3 + vSeed*40.0 + u2*9.0);",
      "    col += vec3(0.35,0.85,1.0)*glow*2.6*tw*exp(-d*0.025);",
      "  }",
      "  alpha *= uOpacity*vShow*(1.0 - smoothstep(32.0, 44.0, d));",
      "  gl_FragColor = vec4(col, alpha);",
      "}"].join("\n")
  });
  var mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 6;
  group.add(mesh);

  /* ---------------- schooling ---------------- */
  var pos = [], vel = [], head = [], bank = [], scl = [], goal = new THREE.Vector3(), goalT = 0;
  var box = { cx:0, cy:-9, cz:-3, hx:10, hy:2.6, hz:5 };
  for (k = 0; k < N; k++){
    pos.push(new THREE.Vector3(box.cx + (Math.random()-0.5)*6, box.cy + (Math.random()-0.5)*2, box.cz + (Math.random()-0.5)*4));
    vel.push(new THREE.Vector3(1.6 + Math.random(), (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.4));
    head.push(vel[k].clone().normalize()); bank.push(0);
    scl.push(LANTERN ? 0.62 + Math.random()*0.25 : 0.75 + Math.pow(Math.random(), 1.5)*0.6);
  }
  var state = { show:0, showTarget:0, avoid:[], forming:false, formT:0, formDur:3.4, center:new THREE.Vector3(), leaving:false };
  var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), fwd = new THREE.Vector3(), up = new THREE.Vector3(), side = new THREE.Vector3(), Y = new THREE.Vector3(0,1,0);
  var Dv = new THREE.Vector3(), prevH = new THREE.Vector3();
  var speed = [], cruise = [], panic = [], informed = [], yawRate = [];
  for (k = 0; k < N; k++){ cruise.push((LANTERN ? 1.9 + Math.random()*0.8 : 1.45 + Math.random()*0.5)*scl[k]); speed.push(cruise[k]); panic.push(0); informed.push(Math.random() < 0.16); yawRate.push(0); }
  var KN = 7, nbI = new Int32Array(KN), nbD = new Float32Array(KN);
  var life = new Float32Array(N), cap = new Float32Array(N), dead = new Float32Array(N), capFn = [];
  for (k = 0; k < N; k++){ life[k] = 1; cap[k] = -1; dead[k] = 0; capFn.push(null); }
  function gone(j){ return dead[j] > 0 || cap[j] >= 0; }
  function respawn(i){
    var side = Math.random() < 0.5 ? -1 : 1;
    pos[i].set(box.cx + side*(box.hx + 1.5), box.cy + (Math.random()-0.5)*box.hy*1.6, box.cz + (Math.random()-0.5)*box.hz);
    head[i].set(-side, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.3).normalize();
    vel[i].copy(head[i]).multiplyScalar(cruise[i]); speed[i] = cruise[i]; life[i] = 0;
  }
  var follow = 0.85;
  function setBox(cy, cx){ var dy = cy - box.cy; if (Math.abs(dy) > 1e-4){ for (var i = 0; i < N; i++) pos[i].y += dy*follow; goal.y += dy; box.cy = cy; } if (cx !== undefined) box.cx = cx; }
  function steer(dt){
    goalT -= dt; state.t = (state.t || 0) + dt;
    if (goalT < 0 && !state.leaving){ goalT = 4 + Math.random()*5; goal.set(box.cx + (Math.random()-0.5)*2*box.hx*0.8, box.cy + (Math.random()-0.5)*2*box.hy*0.5, box.cz + (Math.random()-0.5)*2*box.hz*0.6); }
    for (var i = 0; i < N; i++){
      var p = pos[i], h = head[i], Li = 1.16*scl[i];
      if (cap[i] >= 0){                                   /* being sucked into a mouth */
        cap[i] += dt; if (capFn[i]) p.lerp(capFn[i](), Math.min(1, dt*16));
        life[i] = Math.max(0, 1 - cap[i]/0.16);
        aPh[i] += dt*40; aAmp[i] = 1.6;
        if (cap[i] > 0.18){ cap[i] = -1; dead[i] = 4 + Math.random()*5; life[i] = 0; }
        continue;
      }
      if (dead[i] > 0){ dead[i] -= dt; if (dead[i] <= 0){ dead[i] = 0; respawn(i); } else continue; }
      if (life[i] < 1) life[i] = Math.min(1, life[i] + dt*0.7);
      /* the seven nearest neighbours, not everyone within a radius */
      for (var q = 0; q < KN; q++){ nbD[q] = 1e9; nbI[q] = -1; }
      for (var j = 0; j < N; j++){
        if (j === i || gone(j)) continue;
        var dx = pos[j].x - p.x, dy = pos[j].y - p.y, dz = pos[j].z - p.z, d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < nbD[KN-1]){ var m = KN - 1; while (m > 0 && nbD[m-1] > d2){ nbD[m] = nbD[m-1]; nbI[m] = nbI[m-1]; m--; } nbD[m] = d2; nbI[m] = j; }
      }
      var ax = 0, ay = 0, az = 0, alx = 0, aly = 0, alz = 0, cx = 0, cy = 0, cz = 0, close = 0;
      for (q = 0; q < KN; q++){
        var jn = nbI[q]; if (jn < 0) continue;
        var o = pos[jn], d = Math.sqrt(nbD[q]) + 1e-4, ex = (o.x - p.x)/d, ey = (o.y - p.y)/d, ez = (o.z - p.z)/d;
        var rep = (LANTERN ? 1.4 : 0.55)*Li;
        if (d < rep){ var f = (rep - d)/rep*3.2; ax -= ex*f; ay -= ey*f; az -= ez*f; }
        alx += head[jn].x; aly += head[jn].y; alz += head[jn].z;
        cx += o.x; cy += o.y; cz += o.z;
        if (d < 1.3*Li) close++;
      }
      aOcc[i] += (Math.min(1, close/6)*0.7 - aOcc[i])*0.1;
      Dv.copy(h).multiplyScalar(1.0);
      Dv.x += alx*0.32 + ax; Dv.y += aly*0.32 + ay; Dv.z += alz*0.32 + az;
      tmp.set(cx/KN - p.x, cy/KN - p.y, cz/KN - p.z); var cl = tmp.length();
      if (cl > 0.9*Li) Dv.addScaledVector(tmp.normalize(), 0.55);
      if (informed[i] || state.leaving){ tmp.copy(goal).sub(p); var gl = tmp.length(); if (gl > 0.5) Dv.addScaledVector(tmp.multiplyScalar(1/gl), state.leaving ? 2.2 : 0.9); }
      if (!state.leaving){
        var wy = p.y - box.cy, wx = p.x - box.cx, wz = p.z - box.cz;
        if (Math.abs(wy) > box.hy) Dv.y -= Math.sign(wy)*1.6*(Math.abs(wy) - box.hy + 0.3);
        if (Math.abs(wx) > box.hx) Dv.x -= Math.sign(wx)*1.6*(Math.abs(wx) - box.hx + 0.3);
        if (Math.abs(wz) > box.hz) Dv.z -= Math.sign(wz)*1.6*(Math.abs(wz) - box.hz + 0.3);
      }
      /* threats: the visitor's hand and the jellyfish. A close pass triggers a fast-start escape */
      for (var a = 0; a < state.avoid.length; a++){
        var ob = state.avoid[a], ox = p.x - ob.p.x, oy = p.y - ob.p.y, oz = (p.z - ob.p.z)*ob.zw, od = Math.sqrt(ox*ox + oy*oy + oz*oz) + 1e-3;
        if (od < ob.r){ var ff = (1 - od/ob.r)*ob.k*0.6; Dv.x += ox/od*ff; Dv.y += oy/od*ff*0.6; Dv.z += oz/od*ff*0.5; if (ob.k > 8) panic[i] = Math.max(panic[i], 1 - od/ob.r); }
      }
      if (state.attract){
        var At = state.attract, ax2 = At.p.x - p.x, ay2 = At.p.y - p.y, az2 = At.p.z - p.z, ad = Math.sqrt(ax2*ax2 + ay2*ay2 + az2*az2) + 1e-3;
        if (ad < At.r){ var pull = At.k*(1 - ad/At.r)*(0.5 + 0.5*Math.sin(state.t*0.7 + i)); Dv.x += ax2/ad*pull; Dv.y += ay2/ad*pull*1.4; Dv.z += az2/ad*pull; }
      }
      Dv.y *= 0.55;
      Dv.normalize();
      /* turn toward the desired heading, but only so fast */
      prevH.copy(h);
      var ang = Math.acos(Math.max(-1, Math.min(1, h.dot(Dv)))), maxT = (1.8 + 5.5*panic[i])*dt;
      if (ang > 1e-4){ h.lerp(Dv, Math.min(1, maxT/ang)).normalize(); }
      if (Math.abs(h.y) > 0.32){ h.y = Math.sign(h.y)*0.32; h.normalize(); }
      /* speed relaxes toward a personal cruising speed; panic is a burst */
      panic[i] *= Math.exp(-1.6*dt);
      var target = cruise[i]*(1 + 1.6*panic[i])*(state.leaving ? 1.7 : 1);
      speed[i] += (target - speed[i])*(1 - Math.exp(-(panic[i] > 0.1 ? 4 : 1.2)*dt));
      p.addScaledVector(h, speed[i]*dt);
      vel[i].copy(h).multiplyScalar(speed[i]);
      /* turning rate in the fish's own frame: bends the body and banks it */
      side.crossVectors(prevH, Y).normalize();
      var yr = (h.x - prevH.x)*side.x + (h.z - prevH.z)*side.z;
      yawRate[i] += (yr/Math.max(dt, 1e-3) - yawRate[i])*(1 - Math.exp(-8*dt));
      aBend[i] = Math.max(-1.6, Math.min(1.6, yawRate[i]/Math.max(speed[i]/Li, 0.4)*0.9));
      bank[i] += (Math.max(-0.6, Math.min(0.6, yawRate[i]*0.22)) - bank[i])*(1 - Math.exp(-4*dt));
      /* tail beat from the Strouhal relation: St = f*A/U ~ 0.25, A ~ 0.2 body lengths peak to peak */
      var fq = 0.25*speed[i]/(0.2*Li);
      aPh[i] += 6.2832*fq*dt;
      aAmp[i] = 1 + 0.35*panic[i];
    }
  }
  function writeMatrices(){
    for (var i = 0; i < N; i++){
      fwd.copy(head[i]);
      side.crossVectors(fwd, Y); if (side.lengthSq() < 1e-6) side.set(0,0,1); side.normalize();
      up.crossVectors(side, fwd).normalize();
      var c = Math.cos(bank[i]), s = Math.sin(bank[i]);
      tmp.copy(up).multiplyScalar(c).addScaledVector(side, s);
      up.copy(tmp);
      tmp2.crossVectors(fwd, up);
      var sc = scl[i], p = pos[i];
      aMat[0][i*4] = fwd.x*sc; aMat[0][i*4+1] = fwd.y*sc; aMat[0][i*4+2] = fwd.z*sc; aMat[0][i*4+3] = 0;
      aMat[1][i*4] = up.x*sc;  aMat[1][i*4+1] = up.y*sc;  aMat[1][i*4+2] = up.z*sc;  aMat[1][i*4+3] = 0;
      aMat[2][i*4] = tmp2.x*sc; aMat[2][i*4+1] = tmp2.y*sc; aMat[2][i*4+2] = tmp2.z*sc; aMat[2][i*4+3] = 0;
      aMat[3][i*4] = p.x; aMat[3][i*4+1] = p.y; aMat[3][i*4+2] = p.z; aMat[3][i*4+3] = 1;
    }
    matAttrs.forEach(function(a){ a.needsUpdate = true; });
    phAttr.needsUpdate = true; ampAttr.needsUpdate = true; bendAttr.needsUpdate = true; occAttr.needsUpdate = true;
  }

  /* ---------------- particle cloud that becomes the school ---------------- */
  var NPt = N*PER, ptPos = new Float32Array(NPt*3), ptA = new Float32Array(NPt), loc = [], start = [];
  var nBody = (RINGS + 1)*(SEG + 1);
  for (var t2 = 0; t2 < NPt; t2++){
    var vi = Math.floor(Math.random()*nBody);
    loc.push(new THREE.Vector3(P[vi*3], P[vi*3+1], P[vi*3+2]));
    start.push({ r:1 + Math.pow(Math.random(), 0.6)*7, th:Math.random()*Math.PI*2, y:(Math.random()-0.5)*5, sp:0.4 + Math.random()*0.9 });
  }
  var ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3).setUsage(THREE.DynamicDrawUsage));
  ptGeo.setAttribute('aA', new THREE.BufferAttribute(ptA, 1).setUsage(THREE.DynamicDrawUsage));
  var cloud = new THREE.Points(ptGeo, new THREE.ShaderMaterial({ uniforms:{ uPR:{value:opts.pixelRatio || 1} }, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:"attribute float aA; uniform float uPR; varying float vA; void main(){ vA = aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uPR*(1.4 + aA*1.8)*(24.0/-mv.z); }",
    fragmentShader:"varying float vA; void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.05,r); gl_FragColor = vec4(vec3(0.5,0.88,0.98)*a*vA*1.4, 1.0); }" }));
  cloud.frustumCulled = false; cloud.visible = false; cloud.renderOrder = 7;
  group.add(cloud);
  var lag = []; for (k = 0; k < N; k++) lag.push(Math.random()*0.45);
  function ease(x){ return x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2; }
  var m4 = new THREE.Matrix4();

  function form(center){
    state.forming = true; state.leaving = false; state.formT = 0; state.center.copy(center);
    box.cy = center.y; box.cz = center.z;
    for (var i = 0; i < N; i++){
      pos[i].set(center.x + (Math.random()-0.5)*6, center.y + (Math.random()-0.5)*1.8, center.z + (Math.random()-0.5)*3);
      vel[i].set(1.7 + Math.random()*0.6, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.4);
      head[i].copy(vel[i]).normalize(); bank[i] = 0; speed[i] = cruise[i]; panic[i] = 0; yawRate[i] = 0; life[i] = 1; cap[i] = -1; dead[i] = 0;
    }
    goal.set(center.x + 6, center.y, center.z); goalT = 4;
    state.show = 0; state.showTarget = 1;
  }
  function leave(){
    if (state.show < 0.02 && !state.forming) return;
    state.forming = false; state.leaving = true; state.showTarget = 0;
    goal.set(box.cx + 40, box.cy + 2, box.cz - 8); goalT = 99;
  }
  function active(){ return state.forming || state.show > 0.01 || state.showTarget > 0; }
  function update(dt, time){
    if (!active()) return false;
    U0.uTime.value = time;
    steer(Math.min(dt, 0.04));
    writeMatrices();
    if (!state.forming){
      state.show += (state.showTarget - state.show)*(1 - Math.exp(-(state.showTarget > state.show ? 1.2 : 0.9)*dt));
      for (var i = 0; i < N; i++) aShow[i] = state.show*life[i];
      showAttr.needsUpdate = true;
      cloud.visible = false;
      if (state.leaving && state.show < 0.01){ state.leaving = false; state.show = 0; }
      return true;
    }
    state.formT += dt;
    var T = state.formT/state.formDur;
    cloud.visible = true;
    for (i = 0; i < N; i++){ var mi = Math.max(0, Math.min(1, (T - lag[i])/(1 - 0.45))); aShow[i] = Math.max(0, (mi - 0.78)/0.22); }
    showAttr.needsUpdate = true;
    for (var t = 0; t < NPt; t++){
      var k = t % N, st = start[t], mk = Math.max(0, Math.min(1, (T - lag[k])/(1 - 0.45))), e = ease(mk);
      var th = st.th + time*st.sp*(1.2 - e), sx = state.center.x + Math.cos(th)*st.r*(1 - 0.5*e), sz = state.center.z + Math.sin(th)*st.r*0.6, sy = state.center.y + st.y*(1 - 0.6*e) + Math.sin(time*1.3 + st.th)*0.3;
      m4.set(aMat[0][k*4], aMat[1][k*4], aMat[2][k*4], aMat[3][k*4],
             aMat[0][k*4+1], aMat[1][k*4+1], aMat[2][k*4+1], aMat[3][k*4+1],
             aMat[0][k*4+2], aMat[1][k*4+2], aMat[2][k*4+2], aMat[3][k*4+2],
             0, 0, 0, 1);
      tmp2.copy(loc[t]).applyMatrix4(m4);
      ptPos[t*3] = sx + (tmp2.x - sx)*e; ptPos[t*3+1] = sy + (tmp2.y - sy)*e; ptPos[t*3+2] = sz + (tmp2.z - sz)*e;
      ptA[t] = Math.min(1, T*3)*(1 - Math.max(0, (mk - 0.82)/0.18));
    }
    ptGeo.attributes.position.needsUpdate = true; ptGeo.attributes.aA.needsUpdate = true;
    if (T > 1.45){ state.forming = false; cloud.visible = false; state.show = 1; }
    return true;
  }
  function setBoxSize(hx, hy, hz){ box.hx = hx; box.hy = hy; box.hz = hz; }
  function available(i){ return !gone(i) && life[i] > 0.6 && state.show > 0.5 && !state.forming; }
  function capture(i, fn){ if (!available(i)) return false; cap[i] = 0; capFn[i] = fn; return true; }
  return { group:group, update:update, form:form, leave:leave, active:active, state:state, setBox:setBox, setBoxSize:setBoxSize, uniforms:U0, positions:pos, count:N, available:available, capture:capture };
}
global.createSchool = createSchool;
})(typeof window !== 'undefined' ? window : this);

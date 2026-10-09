/* More life for each depth, three.js r128, all procedural.
   Sunlight: manta rays gliding past, a sardine bait ball.
   Twilight: comb jellies with shimmering comb rows, a sperm whale passing far off.
   Midnight: Atolla jellyfish with its blue "burglar alarm" ring of light.
   Abyssal plain: a rippled sand floor with glass sponges, sea pens and brittle stars. */
(function (global) {
"use strict";
function createExtras(THREE, opts){
  opts = opts || {};
  var hi = opts.quality !== 'low', PR = opts.pixelRatio || 1;
  var groups = { sun:new THREE.Group(), twi:new THREE.Group(), mid:new THREE.Group(), floor:new THREE.Group(), shelf:new THREE.Group() };
  var U = { uTime:{value:0}, uFog:{value:new THREE.Color(0x0e3a5c)}, uTravel:{value:0}, uFloorY:{value:-12} };
  var FOG = "uniform vec3 uFog; vec3 fogIt(vec3 c, float d, float a, float b){ return mix(c, uFog, smoothstep(a, b, d)); }";

  /* ================= giant manta rays (Mobula birostris) =================
     Diamond disc about 2.4x wider than long, with highly tapered, swept, falcate pectoral fins.
     Horn-shaped cephalic fins either side of a wide terminal mouth, rolled while cruising.
     Eyes on the sides of the head behind them; five pairs of gill slits underneath.
     A short whip tail (shorter than the disc) with a small dorsal fin at its base.
     Black above with two white triangular shoulder patches that leave a dark "T" across the head;
     white below with dark spots clustered on the lower abdomen and charcoal trailing edges.
     Flapping: about 0.3 strokes a second, tip-to-tip height of roughly three quarters of a body
     length, a faster downstroke than upstroke, waves running both out along the span and back
     along the chord, very flexible tips, and a body that stays almost level while the wings work. */
  var mantaGeo = (function(){
    var NSP = hi ? 44 : 26, NCH = hi ? 26 : 16, P = [], AT = [], I = [];
    var SPAN = 1.2;
    function le(sa){ return -0.47 + 0.5*Math.pow(sa, 1.25) - 0.05*Math.sin(Math.PI*sa); }
    function chord(sa){ return 0.9*Math.pow(1 - sa, 1.3) + 0.012; }
    function thick(sa, c){ var core = 0.13*Math.pow(Math.max(0, 1 - sa/0.32), 1.4); return (core + 0.022*Math.pow(1 - sa, 1.5) + 0.003)*Math.pow(Math.sin(Math.PI*Math.min(1, Math.max(0, c))), 0.65); }
    function surf(side){
      var base = P.length/3;
      for (var j = 0; j <= NCH; j++){
        for (var i = -NSP; i <= NSP; i++){
          var sg = i/NSP, sa = Math.abs(sg), c = j/NCH;
          var z = le(sa) + chord(sa)*c, t = thick(sa, c);
          var y = side > 0 ? t*0.68 : -t*0.32;
          if (side < 0 && sa < 0.28) y -= 0.012*Math.sin(Math.PI*c);             /* rounded belly */
          P.push(sg*SPAN, y, z); AT.push(sg, c, side, 0);
        }
      }
      var W = 2*NSP + 1;
      for (j = 0; j < NCH; j++) for (i = 0; i < W - 1; i++){
        var a = base + j*W + i, b = a + W;
        if (side > 0) I.push(a, b, a+1, a+1, b, b+1); else I.push(a, a+1, b, a+1, b+1, b);
      }
    }
    surf(1); surf(-1);
    /* cephalic fins: rolled horns pointing forward from the corners of the head */
    [-1, 1].forEach(function(sd){
      var NL = 10, NR = 8, base = P.length/3;
      for (var u = 0; u <= NL; u++){
        var t = u/NL, cx = sd*(0.15 - 0.03*t), cz = -0.47 - 0.2*t, cy = 0.005 - 0.02*t, rad = 0.03*(1 - 0.35*t);
        for (var r = 0; r <= NR; r++){ var a = -0.6 + r/NR*4.6; P.push(cx + sd*Math.cos(a)*rad, cy + Math.sin(a)*rad*0.8, cz); AT.push(sd*0.13, t, 1, 1); }
      }
      for (u = 0; u < NL; u++) for (var r2 = 0; r2 < NR; r2++){ var a2 = base + u*(NR+1) + r2, b2 = a2 + NR + 1; I.push(a2, b2, a2+1, a2+1, b2, b2+1); }
    });
    /* the whip tail and the small dorsal fin at its base */
    (function(){ var NL = 14, NR = 6, base = P.length/3; for (var u = 0; u <= NL; u++){ var t = u/NL, z = 0.4 + 0.62*t, rad = 0.022*(1 - t) + 0.002; for (var r = 0; r <= NR; r++){ var a = r/NR*Math.PI*2; P.push(Math.cos(a)*rad, Math.sin(a)*rad + 0.004, z); AT.push(0, t, 1, 2); } }
      for (u = 0; u < NL; u++) for (var r = 0; r < NR; r++){ var a3 = base + u*(NR+1) + r, b3 = a3 + NR + 1; I.push(a3, b3, a3+1, a3+1, b3, b3+1); } })();
    var d0 = P.length/3; P.push(0,0.03,0.4, 0,0.1,0.47, 0,0.02,0.5); AT.push(0,0,1,3, 0,0,1,3, 0,0,1,3); I.push(d0, d0+1, d0+2, d0, d0+2, d0+1);
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('aAt', new THREE.Float32BufferAttribute(AT, 4)); g.setIndex(I); g.computeVertexNormals();
    return g;
  })();
  var mantaVS = [
    "attribute vec4 aAt; uniform float uTime; uniform float uPhase; uniform float uFreq; uniform float uAmp; uniform float uBank;",
    "varying vec3 vN; varying vec3 vW; varying vec4 vAt; varying vec3 vL;",
    "float stroke(float th){ return sin(th + 0.32*sin(th)); }",                       /* quicker downstroke */
    "float chordL(float sa){ return 0.9*pow(1.0 - sa, 1.3) + 0.012; }",
    "float heave(float sa, float c){ float th = uTime*6.2832*uFreq + uPhase - sa*1.1 - c*chordL(sa)*3.2;",  /* waves out along the span and back along the chord, more at the tips */
    "  return uAmp*pow(sa, 1.7)*stroke(th) + 0.04*uAmp*sa*sin(th*2.0 - c*chordL(sa)*4.0); }",
    "void main(){",
    "  vec3 p = position; vec3 n = normal; vAt = aAt; vL = position;",
    "  float part = aAt.w;",
    "  if (part < 0.5){",
    "    float sa = abs(aAt.x), c = aAt.y;",
    "    float h = heave(sa, c), e = 0.02;",
    "    float dh = (heave(min(1.0, sa + e), c) - heave(max(0.0, sa - e), c))/(2.0*e*1.2);",
    "    float dc = (heave(sa, c + 0.04) - heave(sa, max(0.0, c - 0.04)))/0.08;",
    "    p.y += h;",
    "    n = normalize(n + vec3(-dh*sign(aAt.x)*n.y, 0.0, -dc*0.4*n.y));",
    "  } else if (part < 1.5){ p.x += sin(uTime*0.8 + uPhase)*0.004*aAt.y; }",
    "  else if (part < 2.5){ float t = aAt.y; p.x += sin(uTime*1.3 + uPhase - t*4.0)*0.05*t*t; p.y += sin(uTime*6.2832*uFreq + uPhase - 1.5)*0.03*t; }",
    "  p.y -= 0.012*uAmp*sin(uTime*6.2832*uFreq + uPhase + 1.2);",                    /* the body barely heaves */
    "  vec4 wp = modelMatrix*vec4(p, 1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*n);",
    "  gl_Position = projectionMatrix*viewMatrix*wp;",
    "}"].join("\n");
  var mantaFS = FOG + [
    " uniform float uTime; varying vec3 vN; varying vec3 vW; varying vec4 vAt; varying vec3 vL;",
    "float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }",
    "float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f); return mix(mix(hh(i), hh(i + vec2(1,0)), f.x), mix(hh(i + vec2(0,1)), hh(i + vec2(1,1)), f.x), f.y); }",
    "void main(){",
    "  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.0) N = -N;",
    "  float part = vAt.w, top = vAt.z; float ax = abs(vL.x), z = vL.z;",
    "  vec3 col;",
    "  if (part > 0.5 && part < 1.5) col = vec3(0.05, 0.055, 0.06);",                   /* black cephalic fins */
    "  else if (part > 1.5) col = vec3(0.07, 0.075, 0.08);",
    "  else if (top > 0.0){",
    "    col = vec3(0.045, 0.05, 0.058) + vn(vL.xz*18.0)*0.025;",
    "    float wob = (vn(vL.xz*7.0) - 0.5)*0.05;",
    /* two right-angled white shoulder patches; the dark gap between them makes the T */
    "    float inP = step(0.13, ax)*step(ax, 0.62)*step(-0.4 + wob, z)*step(z, -0.1 - (ax - 0.13)*0.42 + wob);",
    "    float soft = smoothstep(0.0, 0.05, min(min(ax - 0.13, 0.62 - ax), min(z + 0.4 - wob, -0.1 - (ax - 0.13)*0.42 + wob - z)));",
    "    col = mix(col, vec3(0.78, 0.81, 0.82)*(0.9 + 0.1*vn(vL.xz*30.0)), inP*soft);",
    "    col = mix(col, vec3(0.6, 0.63, 0.65), smoothstep(0.06, 0.0, abs(ax - 1.0 + 0.0))*0.0);",
    "  } else {",
    "    col = vec3(0.86, 0.88, 0.88) + vn(vL.xz*20.0)*0.03;",
    "    float spots = smoothstep(0.7, 0.76, vn(vL.xz*26.0 + 3.7))*step(-0.05, z)*smoothstep(0.4, 0.15, ax)*smoothstep(0.42, 0.25, z);",
    "    col = mix(col, vec3(0.12, 0.13, 0.14), spots);",                          /* dark spots on the lower abdomen */
    "    col = mix(col, vec3(0.2, 0.21, 0.23), smoothstep(0.82, 0.97, vAt.y)*smoothstep(0.15, 0.4, ax));",   /* charcoal trailing edge */
    "    float mouth = smoothstep(-0.43, -0.47, z)*step(ax, 0.14);",
    "    col = mix(col, vec3(0.1, 0.1, 0.11), mouth);",                               /* dark mouth */
    "    for (int k = 0; k < 5; k++){ float gz = -0.33 + float(k)*0.05; col = mix(col, vec3(0.45, 0.47, 0.5), smoothstep(0.008, 0.0, abs(z - gz))*step(0.1, ax)*step(ax, 0.2)); }",   /* gill slits */
    "  }",
    "  float eye = smoothstep(0.022, 0.012, length(vec2(ax - 0.19, z + 0.42)));",
    "  col = mix(col, vec3(0.01), eye);",
    "  vec3 L = normalize(vec3(0.2, 1.0, 0.3));",
    "  float lit = top > 0.0 ? 0.35 + 0.65*max(dot(N, L), 0.0) : 0.72 + 0.28*max(-N.y, 0.0);",
    "  float spec = min(0.25, pow(max(dot(reflect(-L, N), V), 0.0), 24.0)*0.25)*step(0.0, top)*step(abs(vL.x), 1.1);",
    "  float caus = pow(vn(vW.xz*0.8 + uTime*0.3)*vn(vW.xz*1.3 - uTime*0.25), 2.0)*0.6*max(N.y, 0.0);",
    "  vec3 c2 = col*lit + vec3(0.7, 0.9, 1.0)*(spec + caus*0.35);",
    "  float d = length(vW - cameraPosition);",
    "  gl_FragColor = vec4(fogIt(c2, d, 10.0, 52.0), 1.0 - smoothstep(46.0, 56.0, d));",
    "}"].join("\n");
  var mantas = [];
  for (var m = 0; m < 3; m++){
    var mu = Object.assign({ uPhase:{value:m*2.1}, uFreq:{value:0.3 + m*0.04}, uAmp:{value:0.34}, uBank:{value:0} }, U);
    var mm = new THREE.Mesh(mantaGeo, new THREE.ShaderMaterial({ uniforms:mu, vertexShader:mantaVS, fragmentShader:mantaFS, side:THREE.DoubleSide }));
    mm.scale.setScalar(3.2 + m*0.9); mm.frustumCulled = false; mm.rotation.order = 'YXZ';
    mantas.push({ mesh:mm, u:mu, t:m*37, sp:0.012 + m*0.002, y0:-8 - m*3.4, z0:-15 - m*6, R:24 + m*4, yaw:0, bank:0 });
    groups.sun.add(mm);
  }
  /* ================= sardine bait ball ================= */
  var NS = hi ? 520 : 260;
  var sGeo = new THREE.InstancedBufferGeometry();
  (function(){
    var P = [-0.5,0,0, 0.5,0,0.06, 0.5,0,-0.06,  0.5,0.07,0, 0.5,-0.07,0, -0.5,0,0,  -0.5,0,0, -0.72,0.09,0, -0.72,-0.09,0];
    sGeo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    sGeo.setAttribute('aU', new THREE.Float32BufferAttribute([0,1,1, 1,1,0, 0,-0.3,-0.3], 1));
  })();
  var sOff = new Float32Array(NS*4), sSpd = new Float32Array(NS);
  for (var si = 0; si < NS; si++){ var r = 0.6 + Math.pow(Math.random(), 0.5)*2.2; sOff[si*4] = Math.random()*Math.PI*2; sOff[si*4+1] = (Math.random()*2 - 1)*1.6; sOff[si*4+2] = r; sOff[si*4+3] = Math.random(); sSpd[si] = 0.5 + Math.random()*0.35; }
  sGeo.setAttribute('aOff', new THREE.InstancedBufferAttribute(sOff, 4)); sGeo.setAttribute('aSpd', new THREE.InstancedBufferAttribute(sSpd, 1));
  sGeo.instanceCount = NS;
  var sardines = new THREE.Mesh(sGeo, new THREE.ShaderMaterial({ uniforms:Object.assign({ uCenter:{value:new THREE.Vector3(-6, -12, -9)} }, U), side:THREE.DoubleSide,
    vertexShader:"attribute float aU; attribute vec4 aOff; attribute float aSpd; uniform float uTime; uniform vec3 uCenter; varying float vShade; varying vec3 vW; void main(){ float a = aOff.x + uTime*aSpd; float yy = aOff.y + sin(uTime*0.5 + aOff.w*6.0)*0.3; float rr = aOff.z*(1.0 + 0.12*sin(uTime*0.7 + aOff.w*9.0)); vec3 c = uCenter + vec3(cos(a)*rr, yy*0.9, sin(a)*rr*0.7); vec3 dir = normalize(vec3(-sin(a), 0.0, cos(a)*0.7)); vec3 side = normalize(cross(dir, vec3(0.0,1.0,0.0))); vec3 p = position*0.32; p.z += sin(uTime*14.0 + aOff.w*30.0 - aU*3.0)*0.04*(1.0 - aU); vec3 w = c + dir*(-p.x) + vec3(0.0,1.0,0.0)*p.y + side*p.z; vW = w; vShade = 0.55 + 0.45*sin(a*2.0 + aOff.w*10.0); gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.0); }",
    fragmentShader:FOG + " varying float vShade; varying vec3 vW; void main(){ vec3 c = mix(vec3(0.35,0.45,0.5), vec3(0.85,0.93,0.97), vShade); float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 8.0, 40.0), 1.0); }" }));
  sardines.frustumCulled = false; groups.sun.add(sardines);

  /* ================= comb jellies ================= */
  var combGeo = new THREE.SphereGeometry(0.5, hi ? 40 : 24, hi ? 28 : 18); combGeo.scale(1, 1.45, 1);
  var combMat = new THREE.ShaderMaterial({ uniforms:U, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:"varying vec3 vN; varying vec3 vW; varying vec3 vL; void main(){ vL = position; vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:"uniform float uTime; varying vec3 vN; varying vec3 vW; varying vec3 vL; vec3 hue(float h){ return clamp(abs(mod(h*6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); } void main(){ vec3 V = normalize(cameraPosition - vW); float f = pow(1.0 - abs(dot(normalize(vN), V)), 2.0); float ang = atan(vL.z, vL.x); float rows = smoothstep(0.93, 1.0, cos(ang*8.0)); float along = vL.y/0.725; float wave = 0.5 + 0.5*sin(along*14.0 - uTime*6.0); vec3 rainbow = hue(fract(along*0.8 + uTime*0.35 + ang*0.1)); float cap = smoothstep(0.55, 0.95, abs(along)); vec3 c = vec3(0.4,0.7,0.85)*f*0.6 + rainbow*rows*(0.35 + 0.65*wave)*(1.0 - cap)*1.5; float d = length(vW - cameraPosition); gl_FragColor = vec4(c*(1.0 - smoothstep(16.0, 34.0, d)), 1.0); }" });
  var combs = [];
  for (var cj = 0; cj < (hi ? 7 : 4); cj++){
    var cm = new THREE.Mesh(combGeo, combMat); cm.frustumCulled = false;
    var cs = 0.9 + Math.random()*0.8; cm.scale.setScalar(cs);
    combs.push({ mesh:cm, base:new THREE.Vector3((Math.random()*2 - 1)*9, -24 - Math.random()*12, -6 - Math.random()*10), ph:Math.random()*10, sp:0.15 + Math.random()*0.2 });
    groups.twi.add(cm);
  }

  /* ================= sperm whale, far off ================= */
  var whaleGeo = (function(){
    var R = hi ? 48 : 30, S = hi ? 20 : 14, P = [], I = [], UVs = [];
    for (var i = 0; i <= R; i++){
      var u = i/R, x = (0.5 - u)*1.0;                                        /* u 0 = snout */
      var h = u < 0.42 ? 0.16 + 0.02*Math.sin(u*7.0) : 0.16*Math.pow(Math.max(0, 1 - (u - 0.42)/0.58), 0.9) + 0.015;   /* the big square head */
      var w = u < 0.42 ? 0.12 : h*0.75;
      for (var j = 0; j <= S; j++){ var a = j/S*Math.PI*2, c = Math.cos(a), s = Math.sin(a); var sq = u < 0.42 ? 1.0 + 0.25*(Math.pow(Math.abs(c), 0.4) - 1) : 1; P.push(x, c*h*sq, s*w); UVs.push(u, j/S); }
    }
    for (i = 0; i < R; i++) for (var j2 = 0; j2 < S; j2++){ var a2 = i*(S+1) + j2, b2 = a2 + S + 1; I.push(a2, b2, a2+1, a2+1, b2, b2+1); }
    var f0 = P.length/3;                                                     /* horizontal flukes */
    P.push(-0.48,0,0, -0.62,0,0.22, -0.66,0,0.05, -0.62,0,-0.22, -0.66,0,-0.05); UVs.push(1,0, 1.1,0, 1.1,0, 1.1,0, 1.1,0);
    I.push(f0, f0+1, f0+2, f0, f0+4, f0+3);
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UVs, 2)); g.setIndex(I); g.computeVertexNormals();
    return g;
  })();
  var whale = new THREE.Mesh(whaleGeo, new THREE.ShaderMaterial({ uniforms:U, side:THREE.DoubleSide,
    vertexShader:"uniform float uTime; varying vec3 vN; varying vec3 vW; void main(){ vec3 p = position; float t = clamp(uv.x, 0.0, 1.2); p.y += sin(uTime*0.9 - t*3.0)*0.06*t*t; vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " varying vec3 vN; varying vec3 vW; void main(){ vec3 N = normalize(vN); float lit = 0.35 + 0.4*max(N.y, 0.0); vec3 c = vec3(0.16,0.17,0.19)*lit; float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 14.0, 60.0), 1.0); }" }));
  whale.scale.setScalar(16); whale.frustumCulled = false; groups.twi.add(whale);
  var whaleT = 0;

  /* ================= Atolla jellyfish ================= */
  var atollaGeo = new THREE.SphereGeometry(0.5, hi ? 48 : 28, hi ? 20 : 12, 0, Math.PI*2, 0, Math.PI*0.5); atollaGeo.scale(1, 0.5, 1);
  var atollaMat = new THREE.ShaderMaterial({ uniforms:U, transparent:true, side:THREE.DoubleSide, depthWrite:false,
    vertexShader:"uniform float uTime; varying vec3 vL; varying vec3 vW; varying vec3 vN; void main(){ vL = position; vec3 p = position; float r = length(p.xz); p.xz *= 1.0 + 0.06*sin(uTime*1.3)*smoothstep(0.2, 0.5, r); vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:"uniform float uTime; varying vec3 vL; varying vec3 vW; varying vec3 vN; void main(){ float r = length(vL.xz)/0.5; float ang = atan(vL.z, vL.x); vec3 V = normalize(cameraPosition - vW); float f = pow(1.0 - abs(dot(normalize(vN), V)), 1.6); vec3 body = mix(vec3(0.35,0.04,0.08), vec3(0.75,0.1,0.16), f)*0.8; float groove = smoothstep(0.03, 0.0, abs(r - 0.62))*0.6; float chase = pow(0.5 + 0.5*sin(ang*1.0 - uTime*5.0), 12.0); float ring = smoothstep(0.08, 0.0, abs(r - 0.92)); vec3 glow = vec3(0.3,0.7,1.0)*ring*(0.35 + 2.4*chase); vec3 c = body*(0.4 + groove) + glow; float d = length(vW - cameraPosition); gl_FragColor = vec4(c, (0.65*f + 0.35 + ring*chase)*(1.0 - smoothstep(18.0, 32.0, d))); }" });
  var atollas = [];
  for (var at = 0; at < 2; at++){
    var ag = new THREE.Group(), bell = new THREE.Mesh(atollaGeo, atollaMat); bell.frustumCulled = false; ag.add(bell);
    var tent = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 3.2, 3, 1, true), new THREE.MeshBasicMaterial({ color:0x401018, transparent:true, opacity:0.5 }));
    tent.position.set(0.35, -1.6, 0); ag.add(tent);                       /* the one long tentacle Atolla trails */
    ag.scale.setScalar(2.0 + at*0.8);
    atollas.push({ g:ag, base:new THREE.Vector3(at ? -5.5 : 6.5, at ? -50 : -44, at ? -9 : -7), ph:at*3 });
    groups.mid.add(ag);
  }

  /* ================= abyssal floor ================= */
  var FLOOR_Y = -78;
  var floorGeo = new THREE.PlaneGeometry(120, 80, hi ? 160 : 90, hi ? 100 : 60); floorGeo.rotateX(-Math.PI/2);
  var fp = floorGeo.attributes.position;
  for (var fi = 0; fi < fp.count; fi++){ var fx = fp.getX(fi), fz = fp.getZ(fi); fp.setY(fi, Math.sin(fx*0.9 + Math.sin(fz*0.3)*2.0)*0.08 + Math.sin(fx*0.13 + fz*0.21)*0.9 + Math.sin(fz*0.07)*1.2); }
  floorGeo.computeVertexNormals();
  var floor = new THREE.Mesh(floorGeo, new THREE.ShaderMaterial({ uniforms:U,
    vertexShader:"varying vec3 vW; varying vec3 vN; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; vN = normal; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " varying vec3 vW; varying vec3 vN; float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); } void main(){ float g = h(floor(vW.xz*40.0))*0.12; vec3 c = vec3(0.13,0.16,0.2)*(0.6 + 0.6*max(vN.y, 0.0)) + g*0.12; float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 6.0, 40.0), 1.0); }" }));
  floor.position.y = FLOOR_Y; floor.position.z = -18; groups.floor.add(floor);
  function floorH(x, z){ var zz = z + 18; return FLOOR_Y + Math.sin(x*0.9 + Math.sin(zz*0.3)*2.0)*0.08 + Math.sin(x*0.13 + zz*0.21)*0.9 + Math.sin(zz*0.07)*1.2; }
  /* glass sponges: lattice vases that glow faintly */
  var spongeGeo = new THREE.LatheGeometry([0,0.0, 0.12,0.02, 0.16,0.4, 0.2,0.9, 0.26,1.4, 0.3,1.8, 0.27,1.86].reduce(function(a, v, i, arr){ if (i % 2 === 0) a.push(new THREE.Vector2(arr[i], arr[i+1])); return a; }, []), hi ? 28 : 16);
  var spongeMat = new THREE.ShaderMaterial({ uniforms:U, transparent:true, side:THREE.DoubleSide, depthWrite:false,
    vertexShader:"uniform float uTime; varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec3 p = position; p.x += sin(uTime*0.6 + position.y*2.0)*0.01*position.y; vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:"varying vec2 vUv; varying vec3 vW; void main(){ vec2 g = vec2(vUv.x*48.0, vUv.y*22.0); vec2 q = abs(fract(g + vec2(vUv.y*6.0, 0.0)) - 0.5); vec2 q2 = abs(fract(g - vec2(vUv.y*6.0, 0.0)) - 0.5); float lat = max(smoothstep(0.42, 0.5, max(q.x, q.y)), smoothstep(0.44, 0.5, max(q2.x, q2.y))); vec3 c = vec3(0.75,0.85,0.9)*lat*0.55 + vec3(0.3,0.45,0.55)*0.06; float d = length(vW - cameraPosition); gl_FragColor = vec4(c, (0.18 + lat*0.6)*(1.0 - smoothstep(22.0, 40.0, d))); }" });
  var floorItems = [];
  for (var sp = 0; sp < (hi ? 14 : 8); sp++){
    var sm = new THREE.Mesh(spongeGeo, spongeMat); var sx = (Math.random()*2 - 1)*16, sz = -6 - Math.random()*22;
    sm.position.set(sx, floorH(sx, sz) - 0.05, sz); sm.scale.setScalar(0.8 + Math.random()*1.4); sm.rotation.z = (Math.random() - 0.5)*0.2; sm.frustumCulled = false;
    groups.floor.add(sm);
  }
  /* sea pens: a stalk with a feather that sways in the current */
  var penMat = new THREE.ShaderMaterial({ uniforms:U, side:THREE.DoubleSide,
    vertexShader:"uniform float uTime; varying float vY; varying vec3 vW; void main(){ vY = position.y; vec3 p = position; float sw = sin(uTime*0.8 + modelMatrix[3][0]*0.7)*0.12*p.y*p.y; p.x += sw; vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " varying float vY; varying vec3 vW; void main(){ vec3 c = mix(vec3(0.5,0.28,0.2), vec3(0.95,0.62,0.45), smoothstep(0.2, 1.4, vY))*0.7; float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 6.0, 36.0), 1.0); }" });
  var penGeo = (function(){ var P = [], I = [], H = 1.5, N = 14; for (var k = 0; k <= N; k++){ var y = 0.3 + k/N*(H - 0.3), w = 0.16*Math.sin(Math.PI*k/N); var o = P.length/3; P.push(0, y, 0, -w, y + 0.06, 0.02, w, y + 0.06, -0.02); if (k > 0){ I.push(o - 3, o, o - 2, o, o + 1, o - 2, o - 3, o - 1, o, o, o - 1, o + 2); } } P.push(-0.015,0,0, 0.015,0,0, 0.015,0.35,0, -0.015,0.35,0); var b = P.length/3 - 4; I.push(b, b+1, b+2, b, b+2, b+3); var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); return g; })();
  for (var pn = 0; pn < (hi ? 22 : 12); pn++){
    var pm = new THREE.Mesh(penGeo, penMat); var px = (Math.random()*2 - 1)*18, pz = -4 - Math.random()*24;
    pm.position.set(px, floorH(px, pz) - 0.05, pz); pm.scale.setScalar(0.7 + Math.random()*0.9); pm.rotation.y = Math.random()*6.28; pm.frustumCulled = false;
    groups.floor.add(pm);
  }
  /* brittle stars: five thin arms that ripple as they crawl */
  var starGeo = (function(){ var P = [], I = [], A = []; for (var k = 0; k < 5; k++){ var a = k/5*Math.PI*2; for (var s = 0; s <= 10; s++){ var r = 0.05 + s/10*0.55, w = 0.025*(1 - s/10) + 0.004; var cx = Math.cos(a)*r, cz = Math.sin(a)*r, nx = -Math.sin(a)*w, nz = Math.cos(a)*w; P.push(cx + nx, 0.01, cz + nz, cx - nx, 0.01, cz - nz); A.push(k + s/10, k + s/10); if (s > 0){ var o = P.length/3 - 4; I.push(o, o+1, o+2, o+1, o+3, o+2); } } } var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('aArm', new THREE.Float32BufferAttribute(A, 1)); g.setIndex(I); return g; })();
  var starMat = new THREE.ShaderMaterial({ uniforms:U, side:THREE.DoubleSide,
    vertexShader:"attribute float aArm; uniform float uTime; varying vec3 vW; void main(){ vec3 p = position; float arm = floor(aArm); float s = fract(aArm); float ang = arm/5.0*6.2832; vec2 perp = vec2(-sin(ang), cos(ang)); p.xz += perp*sin(uTime*1.6 + arm*1.3 - s*5.0)*0.06*s; vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " varying vec3 vW; void main(){ vec3 c = vec3(0.7,0.5,0.52)*0.7; float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 6.0, 34.0), 1.0); }" });
  var stars = [];
  for (var st = 0; st < (hi ? 12 : 7); st++){
    var sm2 = new THREE.Mesh(starGeo, starMat); var bx = (Math.random()*2 - 1)*14, bz = -4 - Math.random()*18;
    sm2.position.set(bx, floorH(bx, bz) + 0.02, bz); sm2.scale.setScalar(0.8 + Math.random()*0.8); sm2.rotation.y = Math.random()*6.28; sm2.frustumCulled = false;
    stars.push({ mesh:sm2, dir:Math.random()*6.28, sp:0.03 + Math.random()*0.04 });
    groups.floor.add(sm2);
  }

  /* ================= sunlit sandy shelf (Interfaces) ================= */
  var DUNE = "float dune(float x, float q){ return sin(x*0.35 + q*0.12)*0.35 + sin(q*0.07 + 1.3)*0.6 + sin(x*1.3 + q*0.9)*0.05; }";
  function duneJS(x, q){ return Math.sin(x*0.35 + q*0.12)*0.35 + Math.sin(q*0.07 + 1.3)*0.6 + Math.sin(x*1.3 + q*0.9)*0.05; }
  var SPAN = 84, ZNEAR = 12, ZFAR = ZNEAR - SPAN;
  var sandGeo = new THREE.PlaneGeometry(110, SPAN, hi ? 120 : 70, hi ? 110 : 60); sandGeo.rotateX(-Math.PI/2); sandGeo.translate(0, 0, (ZNEAR + ZFAR)/2);
  var sand = new THREE.Mesh(sandGeo, new THREE.ShaderMaterial({ uniforms:U,
    vertexShader:DUNE + " uniform float uTravel; uniform float uFloorY; varying vec3 vW; varying vec2 vQ; void main(){ vec3 p = position; float q = p.z - uTravel; p.y = uFloorY + dune(p.x, q); vQ = vec2(p.x, q); vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " uniform float uTime; varying vec3 vW; varying vec2 vQ; float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); } float caus(vec2 p, float t){ vec2 a = p*0.9; float c = 0.0; for (int i = 0; i < 3; i++){ a += vec2(sin(a.y*1.7 + t*0.9), cos(a.x*1.5 - t*0.7))*0.45; c += 0.5 + 0.5*sin(a.x*2.1 + a.y*1.6); } return pow(c/3.0, 6.0); } void main(){ float grain = h(floor(vQ*48.0))*0.06; float ripple = 0.5 + 0.5*sin(vQ.y*5.5 + sin(vQ.x*0.8)*2.0); vec3 c = vec3(0.86,0.88,0.82)*(0.82 + 0.12*ripple) + grain; c += vec3(0.6,0.9,1.0)*caus(vQ*0.55, uTime)*0.75; float d = length(vW - cameraPosition); float edge = smoothstep(" + ZFAR.toFixed(1) + " + 6.0, " + ZFAR.toFixed(1) + " + 26.0, vW.z); gl_FragColor = vec4(fogIt(c, d, 10.0, 56.0), 1.0); }" }));
  sand.frustumCulled = false; groups.shelf.add(sand);
  /* seagrass: thousands of blades in clumps, swaying */
  var NG = hi ? 2600 : 1200, gGeo = new THREE.InstancedBufferGeometry();
  (function(){ var P = [], UVs = [], I = [], seg = 4; for (var k = 0; k <= seg; k++){ var t = k/seg, w = 0.05*(1 - t*0.85); P.push(-w, t, 0, w, t, 0); UVs.push(0, t, 1, t); if (k){ var o = k*2; I.push(o-2, o-1, o, o-1, o+1, o); } } gGeo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); gGeo.setAttribute('uv', new THREE.Float32BufferAttribute(UVs, 2)); gGeo.setIndex(I); })();
  var gA = new Float32Array(NG*4), gB = new Float32Array(NG*2);
  for (var gi = 0, cl = 0; gi < NG; cl++){ var cx = (Math.random()*2 - 1)*26, cz = ZFAR + Math.random()*SPAN; if (Math.abs(cx) < 2.2 && Math.random() < 0.8) continue; var cnt = 8 + Math.floor(Math.random()*26);
    for (var c2 = 0; c2 < cnt && gi < NG; c2++, gi++){ gA[gi*4] = cx + (Math.random() - 0.5)*1.6; gA[gi*4+1] = cz + (Math.random() - 0.5)*1.6; gA[gi*4+2] = 0.5 + Math.random()*1.1; gA[gi*4+3] = Math.random()*6.28; gB[gi*2] = (Math.random() - 0.5)*0.8; gB[gi*2+1] = Math.random(); } }
  gGeo.setAttribute('aA', new THREE.InstancedBufferAttribute(gA, 4)); gGeo.setAttribute('aB', new THREE.InstancedBufferAttribute(gB, 2)); gGeo.instanceCount = NG;
  var grass = new THREE.Mesh(gGeo, new THREE.ShaderMaterial({ uniforms:U, side:THREE.DoubleSide,
    vertexShader:DUNE + " attribute vec4 aA; attribute vec2 aB; uniform float uTime; uniform float uTravel; uniform float uFloorY; varying float vT; varying vec3 vW; varying float vTone; void main(){ float z = mod(aA.y + uTravel - " + ZFAR.toFixed(1) + ", " + SPAN.toFixed(1) + ") + " + ZFAR.toFixed(1) + "; float q = z - uTravel; float t = position.y; float hgt = aA.z; float bend = sin(uTime*1.2 + aA.w + aA.x*0.3)*0.25*t*t + aB.x*t*0.4; vec3 p = vec3(aA.x + position.x*cos(aA.w) + bend*0.6, uFloorY + dune(aA.x, q) + t*hgt, z + position.x*sin(aA.w) + bend*0.3); vT = t; vTone = aB.y; vW = p; gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0); }",
    fragmentShader:FOG + " varying float vT; varying vec3 vW; varying float vTone; void main(){ vec3 base = mix(vec3(0.16,0.38,0.26), vec3(0.32,0.66,0.46), vTone); vec3 c = mix(base*0.6, base*1.35 + vec3(0.05,0.12,0.1), vT); float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 6.0, 44.0), 1.0); }" }));
  grass.frustumCulled = false; groups.shelf.add(grass);
  /* rocks with mossy tops, and a few starfish */
  var shelfProps = [];
  var rockMat = new THREE.ShaderMaterial({ uniforms:U,
    vertexShader:"varying vec3 vN; varying vec3 vW; varying float vUp; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vUp = vN.y; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " varying vec3 vN; varying vec3 vW; varying float vUp; void main(){ float lit = 0.45 + 0.55*max(vN.y, 0.0); vec3 c = mix(vec3(0.3,0.33,0.3), vec3(0.28,0.45,0.25), smoothstep(0.2, 0.8, vUp))*lit; float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 6.0, 44.0), 1.0); }" });
  for (var rk = 0; rk < (hi ? 16 : 9); rk++){
    var rg = new THREE.IcosahedronGeometry(1, 2), rp = rg.attributes.position;
    for (var vi = 0; vi < rp.count; vi++){ var vx = rp.getX(vi), vy = rp.getY(vi), vz = rp.getZ(vi), n = 1 + 0.25*Math.sin(vx*3.1 + rk)*Math.sin(vz*2.7 - rk) + 0.12*Math.sin(vy*6.0 + rk*2.0); rp.setXYZ(vi, vx*n, vy*n*0.55, vz*n); }
    rg.computeVertexNormals();
    var rm = new THREE.Mesh(rg, rockMat), sc = 0.7 + Math.random()*1.8; rm.scale.set(sc, sc, sc*(0.8 + Math.random()*0.5)); rm.frustumCulled = false;
    var side = Math.random() < 0.5 ? -1 : 1;
    shelfProps.push({ m:rm, x:side*(3.5 + Math.random()*16), z0:ZFAR + Math.random()*SPAN, lift:-0.25*sc });
    groups.shelf.add(rm);
  }
  var starShape = new THREE.Shape(); for (var sp2 = 0; sp2 <= 10; sp2++){ var aa = sp2/10*Math.PI*2 + Math.PI/2, rr = sp2 % 2 ? 0.16 : 0.42; if (sp2 === 0) starShape.moveTo(Math.cos(aa)*rr, Math.sin(aa)*rr); else starShape.lineTo(Math.cos(aa)*rr, Math.sin(aa)*rr); }
  var starG = new THREE.ExtrudeGeometry(starShape, { depth:0.06, bevelEnabled:true, bevelSize:0.04, bevelThickness:0.04, bevelSegments:2 }); starG.rotateX(-Math.PI/2);
  var starM = new THREE.ShaderMaterial({ uniforms:U, vertexShader:"varying vec3 vW; varying vec3 vN; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:FOG + " varying vec3 vW; varying vec3 vN; void main(){ vec3 c = vec3(0.95,0.62,0.4)*(0.55 + 0.45*max(vN.y,0.0)); float d = length(vW - cameraPosition); gl_FragColor = vec4(fogIt(c, d, 6.0, 40.0), 1.0); }" });
  for (var sf = 0; sf < (hi ? 8 : 5); sf++){ var sm3 = new THREE.Mesh(starG, starM); sm3.scale.setScalar(0.7 + Math.random()*0.6); sm3.rotation.y = Math.random()*6.28; sm3.frustumCulled = false; shelfProps.push({ m:sm3, x:(Math.random()*2 - 1)*12, z0:ZFAR + Math.random()*SPAN, lift:0.02, flat:true }); groups.shelf.add(sm3); }
  function wrapZ(z0, travel){ return ((z0 + travel - ZFAR) % SPAN + SPAN) % SPAN + ZFAR; }
  /* abyssal props drift past too */
  groups.floor.children.forEach(function(m){ if (m !== floor) m.userData.z0 = m.position.z; });

  var root = new THREE.Group(); Object.keys(groups).forEach(function(k){ groups[k].visible = false; root.add(groups[k]); });
  var want = { sun:0, twi:0, mid:0, floor:0, shelf:0 }, vis = { sun:0, twi:0, mid:0, floor:0, shelf:0 };
  function setZone(z, shelf){ Object.keys(want).forEach(function(k){ want[k] = (k === z) ? 1 : 0; }); want.shelf = shelf ? 1 : 0; }
  function update(dt, time, camY, travel){
    U.uTime.value = time; U.uTravel.value = travel || 0; U.uFloorY.value = camY - 4.6;
    Object.keys(vis).forEach(function(k){ vis[k] += (want[k] - vis[k])*(1 - Math.exp(-1.5*dt)); groups[k].visible = vis[k] > 0.02; });
    if (groups.sun.visible){
      mantas.forEach(function(o){
        o.t += dt*o.sp;
        /* a long, lazy loop through the water: wide banking turns, small rises and dips */
        var a = o.t, x = Math.sin(a)*o.R, z = o.z0 + Math.sin(a*2.0)*6.0, y = o.y0 + Math.sin(a*1.3 + 1.0)*1.4;
        var dx = Math.cos(a)*o.R, dz = Math.cos(a*2.0)*12.0, dy = Math.cos(a*1.3 + 1.0)*1.8;
        var yaw = Math.atan2(-dx, -dz);
        var dyaw = yaw - o.yaw; if (dyaw > Math.PI) dyaw -= 2*Math.PI; if (dyaw < -Math.PI) dyaw += 2*Math.PI;
        o.yaw += dyaw*(1 - Math.exp(-2*dt));
        o.bank += (Math.max(-0.5, Math.min(0.5, -dyaw/Math.max(dt, 1e-3)*0.9)) - o.bank)*(1 - Math.exp(-1.5*dt));
        var pitch = Math.atan2(dy, Math.sqrt(dx*dx + dz*dz))*0.6;
        o.mesh.position.set(x, y, z); o.mesh.rotation.set(pitch, o.yaw, o.bank);
        o.u.uBank.value = o.bank;
      });
    }
    if (groups.twi.visible){
      combs.forEach(function(o){ o.mesh.position.set(o.base.x + Math.sin(time*o.sp + o.ph)*1.2, o.base.y + Math.sin(time*o.sp*0.7 + o.ph)*0.8, o.base.z); o.mesh.rotation.set(Math.sin(time*0.3 + o.ph)*0.3, time*0.1 + o.ph, Math.cos(time*0.25 + o.ph)*0.25); });
      whaleT += dt; var wx = -60 + ((whaleT*1.1) % 120); whale.position.set(wx, -31 + Math.sin(whaleT*0.05)*2, -42); whale.rotation.set(0, Math.PI, -0.05);
    }
    if (groups.mid.visible){
      atollas.forEach(function(o){ o.g.position.set(o.base.x + Math.sin(time*0.12 + o.ph)*1.5, o.base.y + Math.sin(time*0.2 + o.ph)*1.0, o.base.z); o.g.rotation.set(0.25*Math.sin(time*0.17 + o.ph), time*0.05, 0.15); });
    }
    if (groups.shelf.visible){
      shelfProps.forEach(function(o){ var z = wrapZ(o.z0, travel || 0); o.m.position.set(o.x, U.uFloorY.value + duneJS(o.x, z - (travel || 0)) + o.lift, z); });
    }
    if (groups.floor.visible){
      groups.floor.children.forEach(function(m){ if (m.userData.z0 === undefined) return; var z = ((m.userData.z0 + (travel || 0)*0.6 + 34) % 40 + 40) % 40 - 34; m.position.z = z; m.position.y = floorH(m.position.x, z) - 0.05 + (m.userData.lift || 0); });
      stars.forEach(function(o){ o.mesh.position.x += Math.cos(o.dir)*o.sp*dt; o.mesh.userData.z0 += Math.sin(o.dir)*o.sp*dt; o.mesh.position.y = floorH(o.mesh.position.x, o.mesh.position.z) + 0.02; o.mesh.rotation.y += dt*0.05; if (Math.random() < dt*0.05) o.dir += (Math.random() - 0.5)*1.5; });
    }
  }
  return { root:root, update:update, setZone:setZone, uniforms:U, floorY:FLOOR_Y };
}
global.createExtras = createExtras;
})(typeof window !== 'undefined' ? window : this);

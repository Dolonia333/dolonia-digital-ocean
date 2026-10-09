/* Female humpback anglerfish (Melanocetus johnsonii) for three.js r128.
   Built from species descriptions: short, deep, globular body with a humped back and a soft,
   flabby belly (distensible stomach); huge head with a nearly vertical mouth and a projecting
   lower jaw; long, slender, inward-curving fangs; tiny eyes; smooth, velvety dark skin; one
   dorsal fin set far back above a small anal fin; small rounded pectorals; no pelvic fins;
   a rounded tail. The illicium (a modified dorsal spine, about half the body length) carries
   a glowing esca with a dark crest. An ambush hunter: it drifts slowly, hangs still, twitches
   the lure, and strikes in a blink when prey comes close, swallowing it whole. */
(function (global) {
"use strict";
function createAngler(THREE, opts){
  opts = opts || {};
  var hi = opts.quality !== 'low';
  var root = new THREE.Group(); root.rotation.order = 'YZX';
  var body = new THREE.Group(); root.add(body);
  var U = {
    uLure:{value:new THREE.Vector3()}, uLureCol:{value:new THREE.Color(0.45, 0.96, 1.0)}, uLureI:{value:0},
    uJaw:{value:0}, uShow:{value:0}, uTime:{value:0}, uFog:{value:new THREE.Color(0x040f22)}, uAmb:{value:0.045},
    uBelly:{value:0}, uSwim:{value:0}, uDorsal:{value:0}, uPecPh:{value:0}, uPecAmp:{value:0}, uGulp:{value:0}, uTail:{value:0}, uBend:{value:0}, uWave:{value:0}, uWavePh:{value:0}, uJiggle:{value:0}
  };
  var P = [], NR = [], JAW = [], PART = [], FIN = [], I = [], finId = 0;
  function v(x, y, z, nx, ny, nz, jaw, part){ P.push(x, y, z); NR.push(nx, ny, nz); JAW.push(jaw); PART.push(part); FIN.push(finId); return P.length/3 - 1; }

  /* ---------- body ---------- */
  var HX = 0.02, HY = -0.16, SLOPE = 1.55;                          /* jaw hinge and the steep mouth cleft */
  function mouthY(x){ return HY + SLOPE*(x - HX); }
  function shape(x0){                                                /* x0: 1 snout .. -1 tail */
    if (x0 >= 0) return { x:x0*0.48, ry:0.47, rz:0.40 };
    var t = -x0; return { x:-t*0.62, ry:0.47*(1 - 0.78*Math.pow(t, 1.35)), rz:0.40*(1 - 0.8*Math.pow(t, 1.3)) };
  }
  var LAT = hi ? 72 : 44, LON = hi ? 64 : 40;
  for (var i = 0; i <= LAT; i++){
    var th = i/LAT*Math.PI, x0 = Math.cos(th), r = Math.sin(th), sh = shape(x0);
    for (var j = 0; j <= LON; j++){
      var ph = j/LON*Math.PI*2, c = Math.cos(ph), sn = Math.sin(ph);
      var x = sh.x, y = r*c*sh.ry, z = r*sn*sh.rz;
      if (y > 0) y += 0.06*Math.exp(-Math.pow((x + 0.06)/0.2, 2))*c*r;          /* the hump */
      else y *= 1.07;                                                           /* soft, deep belly */
      var jaw = (x > HX + 0.01 && y < mouthY(x)) ? 1 : 0;
      if (jaw && x > 0.24){ var k = (x - 0.24)/0.24; x += 0.06*k; y += 0.03*k; }  /* projecting lower jaw */
      v(x, y, z, 0, 0, 0, jaw, 0);
    }
  }
  for (i = 0; i < LAT; i++) for (j = 0; j < LON; j++){ var A = i*(LON+1) + j, B = A + LON + 1; I.push(A, B, A+1, A+1, B, B+1); }
  var bodyEnd = P.length/3;

  /* ---------- fangs: long, slender, curving inward and back ---------- */
  var tv = new THREE.Vector3(), u1 = new THREE.Vector3(), u2 = new THREE.Vector3(), dv = new THREE.Vector3(), iv = new THREE.Vector3();
  function ring(cx, cy, cz, d, rad, seg, jaw){
    u1.set(0, 0, 1); if (Math.abs(d.z) > 0.9) u1.set(1, 0, 0);
    u1.cross(d).normalize(); u2.crossVectors(d, u1).normalize();
    var base = P.length/3;
    for (var s = 0; s < seg; s++){ var a = s/seg*Math.PI*2, ca = Math.cos(a), sa = Math.sin(a);
      v(cx + (u1.x*ca + u2.x*sa)*rad, cy + (u1.y*ca + u2.y*sa)*rad, cz + (u1.z*ca + u2.z*sa)*rad, u1.x*ca + u2.x*sa, u1.y*ca + u2.y*sa, u1.z*ca + u2.z*sa, jaw, 2); }
    return base;
  }
  function fang(bx, by, bz, dir, inward, len, rad, jaw){
    var seg = 5, d0 = dv.copy(dir).normalize().clone(), b0 = ring(bx, by, bz, d0, rad, seg, jaw);
    var m = new THREE.Vector3(bx, by, bz).addScaledVector(d0, len*0.55);
    var d1 = d0.clone().addScaledVector(inward, 0.55).normalize();
    var b1 = ring(m.x, m.y, m.z, d1, rad*0.55, seg, jaw);
    var tip = m.clone().addScaledVector(d1, len*0.45);
    var t = v(tip.x, tip.y, tip.z, d1.x, d1.y, d1.z, jaw, 2);
    for (var s = 0; s < seg; s++){ var a0 = b0 + s, a1 = b0 + (s+1)%seg, c0 = b1 + s, c1 = b1 + (s+1)%seg; I.push(a0, c0, a1, a1, c0, c1, c0, t, c1); }
  }
  function surfZ(x, y){ return 0.40*Math.sqrt(Math.max(0, 1 - Math.pow(x/0.5, 2) - Math.pow(y/0.5, 2))); }
  var NU = hi ? 15 : 9;
  for (var sd = -1; sd <= 1; sd += 2){
    for (var q = 0; q < NU; q++){
      var f = q/(NU - 1), tx = 0.07 + f*0.36, ty = mouthY(tx), tz = surfZ(tx, ty)*0.9*sd;
      var long = (q % 2 === 0);
      /* upper jaw: down, in, back */
      fang(tx, ty + 0.004, tz, tv.set(-0.25, -1, 0), iv.set(-0.35, -0.2, -0.9*sd), (long ? 0.085 : 0.05)*(0.7 + 0.5*Math.sin(f*Math.PI)), 0.0075, 0);
      /* lower jaw: the long ones, up, in, back */
      var lx = tx + 0.03 + (tx > 0.24 ? 0.06*(tx - 0.24)/0.24 : 0), ly = ty - 0.008 + (tx > 0.24 ? 0.03*(tx - 0.24)/0.24 : 0);
      fang(lx, ly, tz*1.02, tv.set(-0.3, 1, 0), iv.set(-0.45, 0.1, -0.9*sd), (long ? 0.17 : 0.09)*(0.6 + 0.6*Math.sin(f*Math.PI*0.9 + 0.2)), 0.009, 1);
    }
  }
  /* ---------- tiny eyes ---------- */
  [-1, 1].forEach(function(s2){
    var cx = 0.27, cy = 0.2, cz = surfZ(0.27, 0.2)*s2*0.98, R = 0.017, base = P.length/3;
    for (var a = 0; a <= 6; a++) for (var b = 0; b <= 8; b++){
      var t1 = a/6*Math.PI, t2 = b/8*Math.PI*2, nx = Math.sin(t1)*Math.cos(t2), ny = Math.cos(t1), nz = Math.sin(t1)*Math.sin(t2);
      v(cx + nx*R, cy + ny*R, cz + nz*R, nx, ny, nz, 0, 3);
    }
    for (a = 0; a < 6; a++) for (b = 0; b < 8; b++){ var e0 = base + a*9 + b, e1 = e0 + 9; I.push(e0, e1, e0+1, e0+1, e1, e1+1); }
  });
  /* ---------- fins: rounded, with slightly incised membranes between rays ---------- */
  function finFan(base, rays, part){
    /* base: [x,y,z] root; rays: list of tip points; membrane dips between rays */
    var c = v(base[0], base[1], base[2], 0, 0, 1, 0, part), prev = -1;
    for (var k2 = 0; k2 < rays.length; k2++){
      var t3 = rays[k2], id = v(t3[0], t3[1], t3[2], 0, 0, 1, 0, part);
      if (prev >= 0){
        var pt = rays[k2-1], mx = (pt[0] + t3[0])/2, my = (pt[1] + t3[1])/2, mz = (pt[2] + t3[2])/2;
        var notch = v(base[0] + (mx - base[0])*0.9, base[1] + (my - base[1])*0.9, base[2] + (mz - base[2])*0.9, 0, 0, 1, 0, part);
        I.push(c, prev, notch, c, notch, id, prev, id, notch);
      }
      prev = id;
    }
  }
  function arc(cx, cy, cz, rad, a0, a1, n, sx, sy){ var out = []; for (var k3 = 0; k3 <= n; k3++){ var a = a0 + (a1 - a0)*k3/n; out.push([cx + Math.cos(a)*rad*(sx || 1), cy + Math.sin(a)*rad*(sy || 1), cz]); } return out; }
  finId = 1; finFan([-0.6, 0, 0], arc(-0.6, 0, 0, 0.28, Math.PI - 0.8, Math.PI + 0.8, 10), 4);                       /* caudal */
  var dy0 = 0.47*(1 - 0.78*Math.pow(0.55, 1.35));
  finId = 2; finFan([-0.36, dy0 - 0.02, 0], arc(-0.36, dy0 - 0.02, 0, 0.17, 0.5, 2.4, 8, 1.1, 1), 4);               /* single dorsal, far back */
  finId = 3; finFan([-0.39, -dy0*1.07 + 0.02, 0], arc(-0.39, -dy0*1.07 + 0.02, 0, 0.1, -2.4, -0.9, 4, 1.1, 1), 4);
  finId = 4;   /* small anal fin */
  [-1, 1].forEach(function(s3){
    var px = -0.02, py = -0.04, pz = 0.36*s3, rays = [];
    for (var k4 = 0; k4 <= 8; k4++){ var a = -0.9 + k4/8*1.5; rays.push([px - Math.cos(a)*0.13, py + Math.sin(a)*0.11, pz + 0.07*s3]); }
    finFan([px, py, pz], rays, 4);                                                                            /* small pectoral lobe */
  });
  finId = 0;

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(NR, 3));
  geo.setAttribute('aJaw', new THREE.Float32BufferAttribute(JAW, 1));
  geo.setAttribute('aPart', new THREE.Float32BufferAttribute(PART, 1));
  geo.setAttribute('aFin', new THREE.Float32BufferAttribute(FIN, 1));
  geo.setIndex(I);
  geo.computeVertexNormals();
  var nr = geo.attributes.normal;
  for (i = bodyEnd; i < P.length/3; i++){ if (PART[i] === 2 || PART[i] === 3) nr.setXYZ(i, NR[i*3], NR[i*3+1], NR[i*3+2]); }

  var mat = new THREE.ShaderMaterial({
    uniforms:U, side:THREE.DoubleSide, transparent:true, depthWrite:true,
    vertexShader:[
      "attribute float aJaw; attribute float aPart; attribute float aFin; uniform float uJaw; uniform float uTime; uniform float uBelly; uniform float uSwim; uniform float uDorsal; uniform float uPecPh; uniform float uPecAmp; uniform float uGulp; uniform float uTail; uniform float uBend; uniform float uWave; uniform float uWavePh; uniform float uJiggle;",
      "varying vec3 vWP; varying vec3 vN; varying vec3 vLoc; varying float vPart; varying float vJaw;",
      "void main(){",
      "  vec3 p = position; vec3 n = normal;",
      "  if (aPart < 0.5 && p.y < 0.0 && aJaw < 0.5){ float b = smoothstep(0.0, -0.3, p.y)*smoothstep(-0.5, -0.15, p.x)*smoothstep(0.3, 0.05, p.x); p.y -= uBelly*0.09*b; p.z *= 1.0 + uBelly*0.16*b; }",
      "  if (aJaw > 0.5){ float a = -uJaw*1.1; vec2 h = vec2(" + HX.toFixed(3) + ", " + HY.toFixed(3) + "); vec2 q = p.xy - h; float c = cos(a), s = sin(a);",
      "    p.xy = h + vec2(c*q.x - s*q.y, s*q.x + c*q.y); n.xy = vec2(c*n.x - s*n.y, s*n.x + c*n.y); }",
      "  if (aPart < 0.5 && aJaw < 0.5 && uGulp > 0.001){ float gx = mix(0.25, -0.38, uGulp); float k = exp(-pow((p.x - gx)/0.1, 2.0))*(1.0 - uGulp*0.4); p.z *= 1.0 + 0.2*k; p.y -= 0.05*k*smoothstep(0.1, -0.3, p.y); }",
      "  if (aFin > 1.5 && aFin < 2.5){ float by = 0.17; p.y = by + (p.y - by)*(0.7 + 0.6*uDorsal); p.x += (p.y - by)*0.25*uDorsal; }",
      "  if (aFin > 3.5){ float d = length(vec2(p.x + 0.02, p.y + 0.04)); p.z += sign(p.z)*0.0; p.y += sin(uPecPh)*uPecAmp*d*1.6; p.z += sign(p.z)*cos(uPecPh)*uPecAmp*d*0.4; }",
      "  if (aPart < 0.5 && aJaw < 0.5 && p.y < 0.0) p.y += uJiggle*0.06*smoothstep(0.0, -0.35, p.y)*smoothstep(0.3, -0.35, p.x);",
      "  float tailK = smoothstep(0.2, -0.85, p.x);",
      "  float wave = sin(uWavePh - p.x*4.2)*uWave*(0.15 + 0.85*tailK*tailK);",          /* travels head to tail, grows toward the tail */
      "  float bend = uBend*(p.x - 0.05)*(p.x - 0.05);",                                  /* the whole body curves into a turn */
      "  float slope = -cos(uWavePh - p.x*4.2)*4.2*uWave*(0.15 + 0.85*tailK*tailK) + 2.0*uBend*(p.x - 0.05);",
      "  p.z += wave + bend; n = normalize(vec3(n.x - slope*n.z*0.5, n.y, n.z));",
      "  if (aFin > 0.5 && aFin < 1.5) p.z += sin(uWavePh - 4.2)*(0.02 + uWave*0.8)*smoothstep(-0.6, -0.95, p.x);",   /* the tail fin follows through */
      "  vec4 wp = modelMatrix*vec4(p, 1.0);",
      "  vWP = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vLoc = position; vPart = aPart; vJaw = aJaw;",
      "  gl_Position = projectionMatrix*viewMatrix*wp;",
      "}"].join("\n"),
    fragmentShader:[
      "uniform vec3 uLure; uniform vec3 uLureCol; uniform float uLureI; uniform float uShow; uniform float uAmb; uniform float uJaw; uniform vec3 uFog;",
      "varying vec3 vWP; varying vec3 vN; varying vec3 vLoc; varying float vPart; varying float vJaw;",
      "float h3(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x + p.y + p.z)); }",
      "float n3(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);",
      "  return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),",
      "             mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }",
      "void main(){",
      "  if (vPart < 0.5 && uJaw > 0.03 && vJaw > 0.04 && vJaw < 0.96) discard;",
      "  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWP);",
      "  bool inside = !gl_FrontFacing; if (inside) N = -N;",
      "  float mott = 0.0;",
      "  if (vPart < 0.5){",
      "    mott = n3(vLoc*7.0)*0.6 + n3(vLoc*19.0)*0.4;",
      "    vec3 g = vec3(n3(vLoc*120.0 + 3.1), n3(vLoc*120.0 + 7.7), n3(vLoc*120.0 + 1.3)) - 0.5; N = normalize(N + g*0.14);",   /* minute skin spinules */
      "  }",
      "  vec3 L = uLure - vWP; float dl = length(L); L /= dl;",
      "  float att = uLureI*1.8/(1.0 + dl*dl*0.2);",
      "  float wrap = max(dot(N, L)*0.7 + 0.3, 0.0);",
      "  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 20.0);",
      "  vec3 base; float a = 1.0; float sh = 0.32;",
      "  if (vPart < 0.5){",
      "    base = inside ? vec3(0.24, 0.04, 0.06) : mix(vec3(0.075, 0.062, 0.064), vec3(0.15, 0.11, 0.1), mott);",
      "    if (!inside && vLoc.y < -0.05) base = mix(base, vec3(0.09, 0.07, 0.075), 0.5);",
      "    float lip = smoothstep(0.2, 0.5, vJaw)*smoothstep(0.8, 0.5, vJaw); base *= 1.0 - 0.75*lip;",
      "    float gill = smoothstep(0.012, 0.0, abs(vLoc.x + 0.07))*smoothstep(0.02, -0.04, vLoc.y)*smoothstep(-0.2, -0.1, vLoc.y)*step(0.25, abs(vLoc.z));",
      "    base *= 1.0 - 0.6*gill;",
      "    float pores = smoothstep(0.012, 0.0, length(fract(vec2(vLoc.x*14.0, vLoc.y*3.0 + 0.5)) - 0.5)*0.08)*smoothstep(0.03, 0.0, abs(vLoc.y - 0.05 + vLoc.x*0.15))*step(-0.5, vLoc.x)*step(vLoc.x, 0.15);",
      "    base += vec3(0.05, 0.045, 0.045)*pores;",
      "  } else if (vPart < 2.5){ base = vec3(0.86, 0.85, 0.78); a = 0.88; sh = 1.2; }",
      "  else if (vPart < 3.5){ base = vec3(0.01); sh = 0.9; }",
      "  else { base = vec3(0.075, 0.06, 0.065); a = 0.6; sh = 0.2; }",
      "  vec3 col = base*(uAmb + wrap*att*uLureCol*3.4) + uLureCol*spec*att*sh*1.3;",
      "  col += vec3(0.07, 0.13, 0.2)*pow(1.0 - max(dot(N, V), 0.0), 3.0)*0.6;",
      "  if (vPart > 1.5 && vPart < 2.5) col += uLureCol*0.06*uLureI;",
      "  float d = length(vWP - cameraPosition);",
      "  col = mix(col, uFog, smoothstep(16.0, 42.0, d));",
      "  gl_FragColor = vec4(col, a*uShow);",
      "}"].join("\n")
  });
  var mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.renderOrder = 8;
  body.add(mesh);

  /* ---------- illicium and esca ---------- */
  var rod = new THREE.Group(); rod.position.set(0.2, 0.47, 0); body.add(rod);
  var curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0), new THREE.Vector3(0.05,0.16,0), new THREE.Vector3(0.2,0.26,0), new THREE.Vector3(0.36,0.22,0), new THREE.Vector3(0.45,0.11,0)]);
  var lureMat = function(frag){ return new THREE.ShaderMaterial({ uniforms:U, transparent:true,
    vertexShader:"varying vec3 vWP; varying vec3 vN; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vWP = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:frag }); };
  var rodMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.008, 6, false), lureMat("uniform vec3 uLure; uniform vec3 uLureCol; uniform float uLureI; uniform float uShow; uniform float uAmb; varying vec3 vWP; varying vec3 vN; void main(){ vec3 L = uLure - vWP; float d = length(L); float att = uLureI/(1.0 + d*d*2.0); vec3 c = vec3(0.07,0.055,0.055)*(uAmb + max(dot(normalize(vN), L/d)*0.7 + 0.3, 0.0)*att*2.6) + uLureCol*att*0.2; gl_FragColor = vec4(c, uShow); }"));
  rodMesh.renderOrder = 8; rod.add(rodMesh);
  var tipP = curve.getPoint(1);
  var esca = new THREE.Group(); esca.position.copy(tipP); rod.add(esca);
  var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.042, 22, 16), lureMat("uniform vec3 uLureCol; uniform float uLureI; varying vec3 vN; varying vec3 vWP; void main(){ vec3 V = normalize(cameraPosition - vWP); float f = pow(max(dot(normalize(vN), V), 0.0), 1.4); gl_FragColor = vec4(mix(uLureCol*0.55, vec3(0.93,1.0,1.0), f)*(0.3 + 1.5*uLureI), max(uLureI, 0.0)); }"));
  bulb.scale.set(1, 1.1, 0.8); bulb.renderOrder = 9; esca.add(bulb);
  /* the esca's dark crests: a larger one behind, a small one in front */
  var crestGeo = new THREE.BufferGeometry();
  crestGeo.setAttribute('position', new THREE.Float32BufferAttribute([-0.03,0.01,0, -0.085,0.055,0, -0.07,-0.02,0,  0.025,0.02,0, 0.05,0.05,0, 0.04,0.0,0], 3));
  crestGeo.computeVertexNormals();
  var crest = new THREE.Mesh(crestGeo, lureMat("uniform vec3 uLure; uniform vec3 uLureCol; uniform float uLureI; uniform float uShow; varying vec3 vWP; void main(){ float d = length(uLure - vWP); gl_FragColor = vec4(vec3(0.06,0.045,0.05) + uLureCol*uLureI*0.25*exp(-d*8.0), uShow*0.9); }"));
  crest.material.side = THREE.DoubleSide; crest.renderOrder = 8; esca.add(crest);
  var haloGeo = new THREE.BufferGeometry(); haloGeo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0], 3));
  var halo = new THREE.Points(haloGeo, new THREE.ShaderMaterial({
    uniforms:Object.assign({ uPR:{value:opts.pixelRatio || 1}, uScale:{value:1} }, U), transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:"uniform float uPR; uniform float uScale; uniform float uLureI; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uPR*uScale*360.0*(0.8 + 0.2*uLureI)/-mv.z; }",
    fragmentShader:"uniform vec3 uLureCol; uniform float uLureI; void main(){ float r = length(gl_PointCoord - 0.5)*2.0; float g = exp(-r*r*5.0)*0.65 + exp(-r*r*32.0)*1.5; gl_FragColor = vec4(uLureCol*g*uLureI, 1.0); }" }));
  halo.frustumCulled = false; halo.renderOrder = 10; esca.add(halo);

  /* ---------- behaviour ----------
     Modelled on in-situ footage: most of the time she drifts passively at any angle; now and then
     she swims slowly (about a quarter of a body length a second) with both pectoral fins beating
     together; when prey comes within range she freezes, raises her dorsal fin, slows her breathing
     and casts the lure; she strikes in a blink, swallows with a visible gulp and a swollen belly;
     anything rushing at her body makes her bolt, then settle again. */
  var st = { lure:0, show:0, target:0, yaw:Math.PI, pitch:0, roll:0, jaw:0, snapT:-1, cool:0, kick:0, lunge:0, t:Math.random()*10,
             visible:false, fresh:false, mode:'drift', modeT:4, belly:0, twitchT:2, wob:0, breathPh:0, cast:0, dorsal:0, gulp:-1,
             tPitch:0, tRoll:0, oriT:0, pec:0, flee:0, yawV:0, pitchV:0, rollV:0, bend:0, jig:0, jigV:0, rodA:0, rodV:0, rodB:0, rodBV:0, lastVy:0 };
  var pos = new THREE.Vector3(), vel = new THREE.Vector3(), goal = new THREE.Vector3(), tmp = new THREE.Vector3(), escaW = new THREE.Vector3(), mouthW = new THREE.Vector3();
  function arrive(){ if (st.lure < 0.02 && st.show < 0.02) st.fresh = true; st.target = 1; st.visible = true; }
  function leave(){ st.target = 0; }
  function snap(){ if (st.cool > 0 || st.target < 1 || st.show < 0.5 || st.mode === 'flee') return false; st.snapT = 0; st.cool = 2.4; st.kick = 1; return true; }
  function fed(){ st.belly = Math.min(1, st.belly + 0.7); st.gulp = 0; }
  function escaWorld(out){ return esca.getWorldPosition(out || escaW); }
  function mouthWorld(out){ return body.localToWorld((out || mouthW).set(0.36, 0.12, 0)); }
  function pickGoal(R){ goal.set(R.cx + (Math.random()*2 - 1)*R.hx, R.cy + (Math.random()*2 - 1)*R.hy, R.z + (Math.random() - 0.5)*0.8); }
  function update(dt, time, o){
    U.uTime.value = time;
    st.lure += ((st.target ? 1 : 0) - st.lure)*(1 - Math.exp(-(st.target ? 1.1 : 2.2)*dt));
    var bodyT = st.target && st.lure > 0.55 ? 1 : 0;
    st.show += (bodyT - st.show)*(1 - Math.exp(-(bodyT ? 0.7 : 2.5)*dt));
    st.visible = st.lure > 0.005 || st.show > 0.005;
    root.visible = st.visible;
    if (!st.visible) return false;
    var R = o.region, sc = root.scale.x, BL = 1.1*sc;
    if (st.fresh){ pickGoal(R); pos.copy(goal); root.position.copy(pos); st.fresh = false; st.mode = 'drift'; st.modeT = 3; }
    st.t += dt;
    var dyR = R.cy - (st.lastCy == null ? R.cy : st.lastCy); st.lastCy = R.cy; pos.y += dyR; goal.y += dyR;
    /* is anything worth eating nearby? (prey detection range scaled to her size) */
    var prey = o.nearPrey, preyD = prey ? prey.distanceTo(pos) : 1e9, detectR = 2.4*BL, prox = Math.max(0, 1 - preyD/detectR);
    /* a hand rushing at her body makes her bolt */
    if (o.pointer && o.pointer.z > -500 && st.mode !== 'flee' && (o.pointerSpeed || 0) > 3 && o.pointer.distanceTo(pos) < 0.7*BL){
      st.mode = 'flee'; st.modeT = 0.8; tmp.copy(pos).sub(o.pointer); tmp.z = 0; if (tmp.lengthSq() < 1e-4) tmp.set(1, 0, 0); tmp.normalize();
      vel.copy(tmp).multiplyScalar(2.2*BL); st.flee = 1;
    }
    st.modeT -= dt;
    if (st.mode === 'flee'){ if (st.modeT <= 0){ st.mode = 'drift'; st.modeT = 4 + Math.random()*4; } }
    else if (prey && preyD < detectR){ st.mode = 'stalk'; }
    else if (st.mode === 'stalk'){ st.mode = 'drift'; st.modeT = 3; }
    else if (st.modeT <= 0){
      if (st.mode === 'drift'){ st.mode = 'swim'; st.modeT = 3 + Math.random()*3; pickGoal(R); }
      else { st.mode = 'drift'; st.modeT = 5 + Math.random()*7; }
    }
    /* movement */
    if (st.mode === 'swim'){
      tmp.copy(goal).sub(pos); var dist = tmp.length();
      var sp = 0.24*BL;                                                     /* about a quarter of a body length a second */
      if (dist > 0.1) vel.lerp(tmp.multiplyScalar(Math.min(sp, dist)/dist), 1 - Math.exp(-1.0*dt)); else { st.mode = 'drift'; st.modeT = 5; }
    } else if (st.mode === 'flee'){
      vel.multiplyScalar(Math.exp(-1.2*dt));
    } else {
      vel.multiplyScalar(Math.exp(-(st.mode === 'stalk' ? 3 : 0.8)*dt));
      if (st.mode === 'drift') vel.addScaledVector(tmp.set(Math.sin(st.t*0.21), Math.sin(st.t*0.17 + 1.3), 0), 0.006*BL*dt);
    }
    /* keep her inside her patch of water */
    if (Math.abs(pos.x - R.cx) > R.hx*1.4) vel.x -= Math.sign(pos.x - R.cx)*0.2*dt*BL;
    if (Math.abs(pos.y - R.cy) > R.hy*1.4) vel.y -= Math.sign(pos.y - R.cy)*0.2*dt*BL;
    pos.addScaledVector(vel, dt);
    root.position.copy(pos);
    var speed = vel.length();
    /* orientation: spring-damped, so turns overshoot a little and settle, and she banks into them */
    st.oriT -= dt;
    if (st.mode === 'drift' && st.oriT <= 0){ st.oriT = 4 + Math.random()*5; st.tPitch = (Math.random()*2 - 1)*0.45; st.tRoll = (Math.random()*2 - 1)*0.45; }
    if (st.mode !== 'drift'){ st.tPitch = 0; st.tRoll = 0; }
    var tYaw = st.yaw;
    if (st.mode === 'stalk' && prey){ tYaw = Math.atan2(-(prey.z - pos.z)*0.5, prey.x - pos.x); st.tPitch = Math.max(-0.4, Math.min(0.4, Math.atan2(prey.y - pos.y, Math.abs(prey.x - pos.x) + 0.3)*0.6)); }
    else if (Math.hypot(vel.x, vel.z) > 0.05*BL) tYaw = Math.atan2(-vel.z, vel.x);
    /* keep her side-on enough to read: within about 50 degrees of facing left or right */
    var faceR = Math.cos(tYaw) >= 0, baseY = faceR ? 0 : Math.PI, off = Math.atan2(Math.sin(tYaw - baseY), Math.cos(tYaw - baseY));
    tYaw = baseY + Math.max(-0.65, Math.min(0.65, off));
    var dY = Math.atan2(Math.sin(tYaw - st.yaw), Math.cos(tYaw - st.yaw));
    var kY = st.mode === 'flee' ? 26 : (st.mode === 'stalk' ? 5 : 2.2), cY = 2*0.7*Math.sqrt(kY);
    st.yawV = (st.yawV || 0) + (dY*kY - st.yawV*cY)*dt; st.yaw += st.yawV*dt;
    var kP = st.mode === 'swim' ? 3 : 1.2, cP = 2*0.6*Math.sqrt(kP);
    st.pitchV = (st.pitchV || 0) + ((st.tPitch - st.pitch)*kP - st.pitchV*cP)*dt; st.pitch += st.pitchV*dt;
    var tRollB = st.tRoll - st.yawV*0.22;                                          /* lean into the turn */
    st.rollV = (st.rollV || 0) + ((tRollB - st.roll)*kP - st.rollV*cP)*dt; st.roll += st.rollV*dt;
    /* each in-phase stroke of the pectorals is a small push: surge forward, bob, tip the nose */
    var pecRate = st.mode === 'swim' ? 1.1 : (st.mode === 'flee' ? 4 : (st.mode === 'stalk' ? 0.25 : 0.35));
    st.pec += dt*pecRate*6.2832;
    var stroke = Math.sin(st.pec), push = Math.max(0, stroke);
    if (st.mode === 'swim'){ var fwd = tmp.set(Math.cos(st.yaw), 0, -Math.sin(st.yaw)); vel.addScaledVector(fwd, push*push*0.35*BL*dt); }
    var bob = stroke*(st.mode === 'swim' ? 0.035 : 0.012);
    root.rotation.set(st.roll*0.7, st.yaw, st.pitch + bob); root.rotation.order = 'YZX';
    U.uPecPh.value = st.pec; U.uPecAmp.value += ((st.mode === 'swim' ? 0.13 : (st.mode === 'flee' ? 0.15 : (st.mode === 'stalk' ? 0.02 : 0.035))) - U.uPecAmp.value)*(1 - Math.exp(-3*dt));
    /* the body: bends into turns, a gentle wave runs to the tail, much stronger when she bolts */
    var bendT = Math.max(-0.9, Math.min(0.9, -st.yawV*0.45));
    st.bend = (st.bend || 0) + (bendT - (st.bend || 0))*(1 - Math.exp(-6*dt));
    U.uBend.value = st.bend;
    st.flee *= Math.exp(-1.5*dt); U.uTail.value = st.flee;
    var waveT = st.mode === 'flee' ? 0.1 : (st.mode === 'swim' ? 0.03 : (st.mode === 'stalk' ? 0.006 : 0.014));
    U.uWave.value += (Math.max(waveT, st.flee*0.1) - U.uWave.value)*(1 - Math.exp(-3*dt));
    U.uWavePh.value += dt*(st.mode === 'flee' || st.flee > 0.3 ? 16 : (st.mode === 'swim' ? 4.5 : 1.6));
    /* loose parts lag: the belly jiggles with vertical surges, the rod swings on its spring */
    var accY = ((vel.y - (st.lastVy || 0))/Math.max(dt, 1e-3)) + bob*6; st.lastVy = vel.y;
    st.jig = st.jig || 0; st.jigV = st.jigV || 0;
    st.jigV += (-st.jig*30 - st.jigV*4 - accY*0.25*(1 + st.belly))*dt; st.jig += st.jigV*dt;
    U.uJiggle.value = Math.max(-1, Math.min(1, st.jig));
    st.rodA = st.rodA || 0; st.rodV = st.rodV || 0;
    st.rodV += (-st.rodA*16 - st.rodV*2.6 - accY*0.06 + st.yawV*0.5 + push*(st.mode === 'swim' ? 0.4 : 0))*dt; st.rodA += st.rodV*dt;
    st.rodB = st.rodB || 0; st.rodBV = st.rodBV || 0;
    st.rodBV += (-st.rodB*14 - st.rodBV*2.2 - st.yawV*0.6)*dt; st.rodB += st.rodBV*dt;
    U.uSwim.value += (Math.min(1, speed/(0.3*BL)) - U.uSwim.value)*(1 - Math.exp(-2*dt));
    /* prey in range: dorsal rays rise, breathing slows */
    st.dorsal += ((st.mode === 'stalk' ? 1 : 0) - st.dorsal)*(1 - Math.exp(-2*dt));
    U.uDorsal.value = st.dorsal;
    st.breathPh += dt*6.2832/(st.mode === 'stalk' ? 9 : 5);
    var breath = 0.5 + 0.5*Math.sin(st.breathPh);
    /* the strike: the jaw drops in a blink, a short lunge, then it closes and she swallows */
    st.cool = Math.max(0, st.cool - dt);
    if (st.snapT >= 0){
      st.snapT += dt; var tt = st.snapT;
      st.jaw = tt < 0.05 ? tt/0.05 : (tt < 0.12 ? 1 : Math.max(0, 1 - (tt - 0.12)/0.35));
      st.lunge = tt < 0.07 ? tt/0.07 : Math.max(0, 1 - (tt - 0.07)/0.9);
      if (tt > 1.2) st.snapT = -1;
    } else { st.jaw += ((0.03 + 0.06*breath*(st.mode === 'stalk' ? 0.4 : 1)) - st.jaw)*(1 - Math.exp(-3*dt)); st.lunge *= Math.exp(-3*dt); }
    body.position.x = st.lunge*0.22;
    if (st.gulp >= 0){ st.gulp += dt/1.3; if (st.gulp > 1) st.gulp = -1; }
    U.uGulp.value = st.gulp < 0 ? 0 : st.gulp;
    st.belly = Math.max(0, st.belly - dt*0.05);
    U.uBelly.value = st.belly;
    /* the lure: a slow sway, prey-like twitches, and a casting motion when something is close */
    st.twitchT -= dt;
    if (st.twitchT <= 0){ st.wob = (Math.random() < 0.5 ? -1 : 1)*(0.5 + Math.random()*0.5); st.twitchT = st.mode === 'stalk' ? 0.35 + Math.random()*0.7 : 1.8 + Math.random()*3; }
    st.wob *= Math.exp(-7*dt); st.kick *= Math.exp(-3.5*dt);
    st.cast += dt*(1.4 + prox*2.2);
    var castAmt = st.mode === 'stalk' ? 0.08 + 0.16*prox : 0;
    rod.rotation.z = Math.sin(time*1.1)*0.04 + st.wob*0.1*Math.sin(time*28.0) - st.kick*0.35 + Math.sin(st.cast)*castAmt + st.rodA;
    rod.rotation.x = Math.sin(time*0.7)*0.04 + st.wob*0.06 + st.rodB;
    esca.position.set(tipP.x + Math.sin(time*13.0)*0.006*prox, tipP.y + Math.cos(time*11.0)*0.006*prox, tipP.z);
    U.uJaw.value = st.jaw;
    U.uLureI.value = st.lure*(0.9 + 0.06*Math.sin(time*2.3) + 0.04*Math.sin(time*9.1) + 0.12*prox*Math.sin(time*5.0));
    U.uShow.value = st.show;
    halo.material.uniforms.uScale.value = sc/2.6;
    root.updateMatrixWorld(true);
    U.uLure.value.copy(escaWorld());
    return true;
  }
  return { root:root, update:update, arrive:arrive, leave:leave, snap:snap, fed:fed, escaWorld:escaWorld, mouthWorld:mouthWorld, uniforms:U, state:st,
    setPixelRatio:function(pr){ halo.material.uniforms.uPR.value = pr; } };
}
global.createAngler = createAngler;

/* Deep-sea shrimp: arched, segmented body with a forward rostrum, a tail fan, paddling swimmerets
   and very long antennae. Red pigment looks black in the deep, so they show only where the lure
   lights them. They drift toward the light, and flick backward when something strikes nearby. */
function createShrimp(THREE, opts){
  opts = opts || {}; var N = opts.count || 5;
  var U = { uLure:{value:new THREE.Vector3(0,0,-999)}, uLureI:{value:0}, uLureCol:{value:new THREE.Color(0.45,0.96,1.0)}, uTime:{value:0}, uFog:{value:new THREE.Color(0x040f22)} };
  var bodyGeo = (function(){
    var NL = 18, NR = 10, P = [], A = [], I = [];
    for (var i = 0; i <= NL; i++){
      var t = i/NL, x = 0.5 - t*1.05, arch = -0.18*Math.pow(t, 2.2), r = 0.1*Math.pow(Math.sin(Math.PI*Math.min(1, 0.1 + t*0.95)), 0.7)*(1 - 0.55*t) + 0.008;
      var seg = 0.008*Math.cos(t*44.0);
      for (var j = 0; j <= NR; j++){ var a = j/NR*Math.PI*2; P.push(x, arch + Math.cos(a)*(r + seg)*1.15, Math.sin(a)*(r + seg)*0.8); A.push(t); }
    }
    for (i = 0; i < NL; i++) for (var j2 = 0; j2 < NR; j2++){ var q = i*(NR+1) + j2, w = q + NR + 1; I.push(q, w, q+1, q+1, w, w+1); }
    var b = P.length/3; P.push(0.5,0.01,0, 0.72,0.04,0, 0.5,0.04,0); A.push(0,0,0); I.push(b, b+1, b+2, b, b+2, b+1);      /* rostrum */
    var f = P.length/3; P.push(-0.55,-0.2,0, -0.72,-0.16,0.09, -0.75,-0.24,0, -0.72,-0.16,-0.09); A.push(1,1.1,1.1,1.1); I.push(f, f+1, f+2, f, f+2, f+3, f, f+2, f+1, f, f+3, f+2);   /* tail fan */
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('aT', new THREE.Float32BufferAttribute(A, 1)); g.setIndex(I); g.computeVertexNormals(); return g;
  })();
  var limbGeo = (function(){
    var P = [], A = [];
    function line(a, b, k){ P.push(a[0],a[1],a[2], b[0],b[1],b[2]); A.push(0, k, 1, k); }
    for (var l = 0; l < 5; l++){ var x = 0.3 - l*0.09; [-1,1].forEach(function(sd){ line([x,-0.05,0.03*sd], [x - 0.04, -0.17, 0.06*sd], l); }); }   /* walking legs */
    for (l = 0; l < 5; l++){ var x2 = -0.1 - l*0.08; [-1,1].forEach(function(sd){ line([x2,-0.08 - l*0.02,0.03*sd], [x2 + 0.02, -0.16 - l*0.02, 0.04*sd], 10 + l); }); }  /* swimmerets */
    [-1,1].forEach(function(sd){ var px = 0.45, py = 0.03, pz = 0.02*sd; for (var k = 0; k < 16; k++){ var t = (k+1)/16, nx = 0.45 - t*1.25, ny = 0.03 + Math.sin(t*2.6)*0.14, nz = sd*(0.02 + t*0.2); line([px,py,pz],[nx,ny,nz], 20 + t); px = nx; py = ny; pz = nz; } });   /* long antennae sweeping back */
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('aL', new THREE.Float32BufferAttribute(A, 2)); return g;
  })();
  var bodyMat = new THREE.ShaderMaterial({ uniforms:U, transparent:true, side:THREE.DoubleSide,
    vertexShader:"attribute float aT; uniform float uTime; varying vec3 vW; varying vec3 vN; varying float vT; void main(){ vec3 p = position; vT = aT; p.y += sin(uTime*3.0)*0.01*aT; vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:"uniform vec3 uLure; uniform vec3 uLureCol; uniform float uLureI; uniform vec3 uFog; varying vec3 vW; varying vec3 vN; varying float vT; void main(){ vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW); vec3 L = uLure - vW; float d = length(L); L /= d; float att = uLureI*2.4/(1.0 + d*d*0.4); float f = pow(1.0 - abs(dot(N, V)), 2.0); vec3 red = vec3(0.75, 0.12, 0.1); float bands = 0.85 + 0.15*sin(vT*44.0); vec3 c = red*bands*(0.03 + max(dot(N, L)*0.6 + 0.4, 0.0)*att*1.6) + vec3(0.9,0.5,0.45)*f*att*0.4; c += uLureCol*pow(max(dot(reflect(-L, N), V), 0.0), 30.0)*att*0.8; c = mix(c, uFog, smoothstep(14.0, 34.0, length(vW - cameraPosition))); gl_FragColor = vec4(c, 0.92); }" });
  var limbMat = new THREE.ShaderMaterial({ uniforms:U, transparent:true,
    vertexShader:"attribute vec2 aL; uniform float uTime; varying vec3 vW; void main(){ vec3 p = position; float k = aL.y; if (k >= 10.0 && k < 20.0) p.x += aL.x*sin(uTime*14.0 - (k - 10.0)*0.9)*0.04; if (k < 10.0) p.x += aL.x*sin(uTime*2.0 + k)*0.015; if (k >= 20.0) { float t = k - 20.0; p.y += sin(uTime*1.5 + t*4.0)*0.03*t; } vec4 wp = modelMatrix*vec4(p,1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:"uniform vec3 uLure; uniform float uLureI; varying vec3 vW; void main(){ float d = length(uLure - vW); float att = uLureI*1.2/(1.0 + d*d*0.5); gl_FragColor = vec4(vec3(0.7, 0.15, 0.12)*(0.03 + att), 0.55); }" });
  var group = new THREE.Group(), list = [];
  for (var i = 0; i < N; i++){
    var g = new THREE.Group(), b = new THREE.Mesh(bodyGeo, bodyMat), l = new THREE.LineSegments(limbGeo, limbMat);
    b.frustumCulled = false; l.frustumCulled = false; g.add(b); g.add(l); g.scale.setScalar(0.42 + Math.random()*0.15); g.visible = false;
    group.add(g);
    list.push({ g:g, pos:new THREE.Vector3(), vel:new THREE.Vector3(), yaw:0, life:0, cap:-1, capFn:null, dead:0, flick:0, ph:Math.random()*6 });
  }
  var positions = list.map(function(o){ return o.pos; }), active = false, box = { cx:0, cy:0, hx:2, hy:1.2, z:-1.2 };
  function place(o){ var sd = Math.random() < 0.5 ? -1 : 1; o.pos.set(box.cx + sd*(box.hx + 1.2), box.cy + (Math.random()*2 - 1)*box.hy, box.z + (Math.random() - 0.5)*1.2); o.vel.set(-sd*0.2, 0, 0); o.life = 0; }
  function start(R){ box.cx = R.cx; box.cy = R.cy; box.hx = R.hx; box.hy = R.hy; box.z = R.z; if (!active){ list.forEach(function(o){ place(o); o.pos.x = box.cx + (Math.random()*2 - 1)*box.hx*1.4; o.cap = -1; o.dead = 0; }); } active = true; }
  function stop(){ active = false; }
  function available(i){ var o = list[i]; return active && o.cap < 0 && o.dead <= 0 && o.life > 0.7; }
  function capture(i, fn){ if (!available(i)) return false; list[i].cap = 0; list[i].capFn = fn; return true; }
  function startle(at){ list.forEach(function(o){ if (o.cap < 0 && o.pos.distanceTo(at) < 2.2){ o.flick = 0.35; o.vel.copy(o.pos).sub(at).setLength(3.2); } }); }
  function update(dt, time, R, lure, lureI){
    U.uTime.value = time; U.uLure.value.copy(lure); U.uLureI.value = lureI;
    var dyR = R.cy - box.cy; box.cx = R.cx; box.cy = R.cy; box.hx = R.hx; box.hy = R.hy; box.z = R.z;
    list.forEach(function(o){
      if (!active){ o.life = Math.max(0, o.life - dt); o.g.visible = o.life > 0.01; return; }
      o.pos.y += dyR;
      if (o.cap >= 0){ o.cap += dt; if (o.capFn) o.pos.lerp(o.capFn(), Math.min(1, dt*18)); o.life = Math.max(0, 1 - o.cap/0.14); if (o.cap > 0.16){ o.cap = -1; o.dead = 5 + Math.random()*5; o.life = 0; } }
      else if (o.dead > 0){ o.dead -= dt; o.g.visible = false; if (o.dead <= 0) place(o); return; }
      else {
        o.life = Math.min(1, o.life + dt*0.6);
        if (o.flick > 0){ o.flick -= dt; o.vel.multiplyScalar(Math.exp(-3*dt)); }
        else {
          var tx = lure.x - o.pos.x, ty = lure.y - o.pos.y, tz = lure.z - o.pos.z, d = Math.sqrt(tx*tx + ty*ty + tz*tz) + 1e-3;
          var pull = lureI > 0.3 && d < 6 ? 0.18 : 0;                                  /* drawn to the light */
          o.vel.x += (tx/d*pull + Math.sin(time*0.4 + o.ph)*0.05)*dt; o.vel.y += (ty/d*pull + Math.cos(time*0.33 + o.ph)*0.05)*dt; o.vel.z += (tz/d*pull*0.5)*dt;
          o.vel.multiplyScalar(Math.exp(-0.9*dt));
          if (Math.abs(o.pos.x - box.cx) > box.hx + 2) o.vel.x -= Math.sign(o.pos.x - box.cx)*0.4*dt;
          if (Math.abs(o.pos.y - box.cy) > box.hy + 1.5) o.vel.y -= Math.sign(o.pos.y - box.cy)*0.4*dt;
        }
        o.pos.addScaledVector(o.vel, dt);
      }
      o.g.visible = o.life > 0.01;
      var vx = o.flick > 0 ? -o.vel.x : o.vel.x;                                      /* a tail-flip sends them backward */
      if (Math.abs(vx) > 0.02) o.yaw += ((vx < 0 ? Math.PI : 0) - o.yaw)*(1 - Math.exp(-2*dt));
      o.g.position.copy(o.pos); o.g.rotation.set(0, o.yaw, Math.sin(time*0.7 + o.ph)*0.15 - (o.flick > 0 ? 0.6 : 0));
      o.g.scale.setScalar((0.42 + 0.0)*Math.max(0.05, o.life));
    });
  }
  return { group:group, update:update, start:start, stop:stop, available:available, capture:capture, startle:startle, positions:positions, count:N, uniforms:U };
}
global.createShrimp = createShrimp;
})(typeof window !== 'undefined' ? window : this);

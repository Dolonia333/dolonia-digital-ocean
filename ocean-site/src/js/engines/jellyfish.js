/* Procedural Catostylus mosaicus (blue blubber jellyfish) for three.js r128.
   Units: bell radius = 1. Bell height ~0.5 of diameter. Oral arms ~0.55 of diameter.
   createBlubber(THREE, {quality:'high'|'low'}) -> { root, update(dt, time), state } */
(function (global) {
"use strict";

var GLSL_COMMON = [
"vec2 hash22(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }",
"vec2 worleyP(vec2 x, float period){",
"  vec2 n = floor(x); vec2 f = fract(x); float F1 = 8.0; float F2 = 8.0;",
"  for(int j=-1;j<=1;j++){ for(int i=-1;i<=1;i++){",
"    vec2 g = vec2(float(i), float(j)); vec2 cell = n + g; cell.x = mod(cell.x, period);",
"    vec2 o = hash22(cell); vec2 r = g + o - f; float d = dot(r,r);",
"    if(d < F1){ F2 = F1; F1 = d; } else if(d < F2){ F2 = d; } } }",
"  return sqrt(vec2(F1, F2));",
"}",
"float contraction(float ph){ ph = fract(ph); if(ph < 0.34){ float x = ph/0.34; return x*x*(3.0-2.0*x); }",
"  float t = (ph-0.34)/0.66; return exp(-4.0*t)*cos(4.2*t); }",
"float tuckf(float ph){ ph = fract(ph); if(ph < 0.34) return 0.0; float t = (ph-0.34)/0.66;",
"  return sin(3.14159265*clamp(t/0.5,0.0,1.0))*(1.0-0.6*t); }"
].join("\n");
var GLSL_FRAG = [
"vec3 perturbN(vec3 pos, vec3 n, float h){",
"  vec3 dpdx = dFdx(pos); vec3 dpdy = dFdy(pos); float dhx = dFdx(h); float dhy = dFdy(h);",
"  vec3 r1 = cross(dpdy, n); vec3 r2 = cross(n, dpdx); float det = dot(dpdx, r1);",
"  vec3 grad = sign(det)*(dhx*r1 + dhy*r2);",
"  return normalize(abs(det)*n - grad);",
"}"
].join("\n");

function contraction(ph){ ph = ph - Math.floor(ph); if (ph < 0.34){ var x = ph/0.34; return x*x*(3-2*x); }
  var t = (ph-0.34)/0.66; return Math.exp(-4*t)*Math.cos(4.2*t); }
function speedShape(ph){ ph = ph - Math.floor(ph); if (ph < 0.34){ var x = ph/0.34; return Math.pow(x*x*(3-2*x),1.2); }
  var t = (ph-0.34)/0.66; return Math.exp(-3.5*t) + 0.16*Math.exp(-Math.pow((t-0.8)/0.12,2)); }

function createBlubber(THREE, opts){
  opts = opts || {};
  var hi = (opts.quality || 'high') === 'high';
  var root = new THREE.Group();
  var body = new THREE.Group();
  root.add(body);

  var U = {
    uPhase:{value:0}, uAsym:{value:0}, uTurn:{value:0}, uTime:{value:0}, uGlow:{value:0}, uAmp:{value:1}, uCaustic:{value:0},
    uLight:{value:new THREE.Vector3(0.2, 0.85, 0.6).normalize()},
    uMilk:{value:new THREE.Color(0.84,0.95,1.0)}, uDeep:{value:new THREE.Color(0.06,0.29,0.75)}
  };

  /* ---------------- Bell ---------------- */
  var NL = 112;                          /* velar lappets (14 per octant) */
  var SEG = NL * (hi ? 5 : 3);
  var outerPts = [], oW = [], oM = [];
  var i, th, k, ND = hi ? 48 : 30;
  function mOf(y){ return Math.min(1, Math.max(0, (0.30 - y)/0.30)); }
  for (i = 0; i <= ND; i++){
    th = (i/ND)*Math.PI/2; var sN = i/ND;
    var rO = 0.985*Math.pow(Math.sin(th), 0.9)*(1 + 0.03*Math.pow(sN, 6));
    var yO = 0.02 + 0.98*Math.pow(Math.cos(th), 1.05);
    outerPts.push([rO, yO]); oW.push(sN*0.95); oM.push(mOf(yO));
  }
  [[0.99,-0.004],[0.968,-0.014],[0.94,-0.012]].forEach(function(b){ outerPts.push(b); oW.push(1); oM.push(1); });

  var innerPts = [outerPts[outerPts.length-1]], iW = [1], iM = [1];
  var NI = hi ? 30 : 18;
  for (i = 1; i <= NI; i++){
    th = (1 - i/NI)*Math.PI/2;
    var yI = 0.78*Math.cos(th);
    innerPts.push([0.92*Math.pow(Math.sin(th), 0.95), yI]); iW.push(1 - i/NI); iM.push(mOf(yI)*0.8);
  }

  function smoothstep(a,b,x){ var t = Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); }

  function makeBellPart(pts, W, M, isInner){
    var geo = new THREE.LatheGeometry(pts.map(function(p){ return new THREE.Vector2(p[0],p[1]); }), SEG);
    var np = pts.length, pos = geo.attributes.position, cnt = pos.count;
    var aW = new Float32Array(cnt), aM = new Float32Array(cnt), aAng = new Float32Array(cnt), aRib = new Float32Array(cnt), aP = new Float32Array(cnt);
    for (var s = 0; s <= SEG; s++){
      var phi = s/SEG*Math.PI*2;
      var u = NL*phi/(Math.PI*2), fr = u - Math.floor(u);
      var rib = -Math.cos(NL*phi);                         /* +1 lappet centre, -1 notch */
      var notch = Math.pow(Math.abs(fr*2-1), 4);
      var nearest = Math.round(u), rhop = (nearest % 14 === 0) ? Math.exp(-Math.pow((u-nearest)*3.2,2)) : 0;
      for (var j = 0; j < np; j++){
        var idx = s*np + j, m = M[j];
        var x = pos.getX(idx), y = pos.getY(idx), z = pos.getZ(idx), r = Math.sqrt(x*x+z*z);
        var pz = smoothstep(0.0, 0.3, m);
        aP[idx] = pz;
        var rr = r * (1 + pz*0.010*rib + Math.pow(m,2.0)*0.010*rib);
        var edge = smoothstep(0.72, 1.0, m);
        if (r > 1e-6){ x *= rr/r; z *= rr/r; }
        pos.setXYZ(idx, x, y, z);
        aW[idx] = W[j]; aM[idx] = m; aAng[idx] = phi; aRib[idx] = rib;
      }
    }
    geo.setAttribute('aW', new THREE.BufferAttribute(aW,1));
    geo.setAttribute('aM', new THREE.BufferAttribute(aM,1));
    geo.setAttribute('aAng', new THREE.BufferAttribute(aAng,1));
    geo.setAttribute('aRib', new THREE.BufferAttribute(aRib,1));
    geo.setAttribute('aP', new THREE.BufferAttribute(aP,1));
    geo.computeVertexNormals();
    var nor = geo.attributes.normal;                      /* weld the lathe seam */
    for (var jj = 0; jj < np; jj++){
      var a = jj, b = SEG*np + jj;
      var nx = nor.getX(a)+nor.getX(b), ny = nor.getY(a)+nor.getY(b), nz = nor.getZ(a)+nor.getZ(b);
      var l = Math.sqrt(nx*nx+ny*ny+nz*nz) || 1;
      nor.setXYZ(a, nx/l, ny/l, nz/l); nor.setXYZ(b, nx/l, ny/l, nz/l);
    }
    var mat = new THREE.ShaderMaterial({
      uniforms: Object.assign({ uInner:{value:isInner?1:0} }, U),
      transparent:true, depthWrite:false, side:THREE.FrontSide,
      extensions:{derivatives:true},
      vertexShader: [GLSL_COMMON,
        "attribute float aW; attribute float aM; attribute float aAng; attribute float aRib; attribute float aP;",
        "uniform float uPhase; uniform float uAsym; uniform float uTurn; uniform float uInner; uniform float uAmp;",
        "varying vec3 vWP; varying vec3 vN; varying float vW; varying float vM; varying float vRib; varying vec3 vRest; varying float vP;",
        "void main(){",
        "  float ph = uPhase - uAsym*0.14*0.5*(1.0-cos(aAng-uTurn));",
        "  float c = contraction(ph)*uAmp; float tk = tuckf(ph)*uAmp;",
        "  vec3 p = position; float r = length(p.xz); vec2 dir = r > 1e-5 ? p.xz/r : vec2(0.0);",
        "  float marg = aM*aM*aM;",
        "  float rn = r*(1.0 - 0.16*c*pow(aW,1.3)) - marg*(0.05*c + 0.08*tk);",
        "  p.y += 0.07*c*(1.0-aW)*(1.0-0.3*uInner) - 0.02*c*aW + marg*0.06*tk;",
        "  p.xz = dir*rn;",
        "  vec4 wp = modelMatrix*vec4(p,1.0);",
        "  vWP = wp.xyz; vN = normalize(mat3(modelMatrix)*normal);",
        "  vW = aW; vM = aM; vRib = aRib; vRest = position; vP = aP;",
        "  gl_Position = projectionMatrix*viewMatrix*wp;",
        "}"].join("\n"),
      fragmentShader: [GLSL_COMMON,
        "uniform vec3 uLight; uniform vec3 uMilk; uniform vec3 uDeep; uniform float uGlow; uniform float uInner; uniform float uTime; uniform float uCaustic;",
        "varying vec3 vWP; varying vec3 vN; varying float vW; varying float vM; varying float vRib; varying vec3 vRest; varying float vP;",
        "void main(){",
        "  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N;",
        "  vec3 V = normalize(cameraPosition - vWP);",
        "  float ndv = clamp(abs(dot(N,V)),0.0,1.0); float fres = pow(1.0-ndv, 2.2);",
        "  float wrap = clamp((dot(N,uLight)+0.65)/1.65, 0.0, 1.0);",
        "  float rr = length(vRest.xz); float ang = atan(vRest.x, vRest.z);",
        "  vec2 wf = worleyP(vRest.xz*20.0, 1.0e4);",
        "  float plates = smoothstep(0.02, 0.14, wf.y-wf.x);",
        "  float gran = (1.0-uInner)*(1.0-smoothstep(0.3, 0.85, vW));",
        "  float radial = pow(abs(cos(8.0*ang)), 40.0)*smoothstep(0.3,0.42,rr)*(1.0-smoothstep(0.86,0.95,rr));",
        "  float ring = exp(-pow((rr-0.73)/0.015, 2.0));",
        "  vec2 lw = worleyP(vRest.xz*26.0, 1.0e4);",
        "  float lace = (1.0-smoothstep(0.0,0.06,lw.y-lw.x))*smoothstep(0.74,0.80,rr)*(1.0-smoothstep(0.93,0.98,rr));",
        "  float qx = (vRest.x+vRest.z)*0.7071; float qz = (vRest.x-vRest.z)*0.7071;",
        "  float c1 = (1.0-smoothstep(0.05,0.11,abs(qx)))*(1.0-smoothstep(0.28,0.40,abs(qz)));",
        "  float c2 = (1.0-smoothstep(0.05,0.11,abs(qz)))*(1.0-smoothstep(0.28,0.40,abs(qx)));",
        "  float crossM = max(max(c1,c2), 1.0-smoothstep(0.10,0.17,rr));",
        "  float internal = (radial*0.12 + ring*0.25 + lace*0.25 + crossM*0.3)*(1.0-vM)*0.3;",
        "  float groove = smoothstep(0.3,-1.0,vRib)*vP*(0.5+0.5*vM);",
        "  float light = 0.36 + 0.46*wrap;",
        "  float t = light*(1.0-0.34*groove) + internal*0.45 + gran*(plates-1.0)*0.025 + vP*0.13 + smoothstep(0.75,1.0,vM)*0.12;",
        "  vec3 bellMilk = vec3(0.76, 0.88, 1.0);",
        "  vec3 col = mix(uDeep, bellMilk, clamp(t,0.0,1.0));",
        "  col += bellMilk*fres*0.22;",
        "  if (uCaustic > 0.01 && uInner < 0.5){",
        "    vec2 cp = vWP.xz*0.9; float tt = uTime;",
        "    vec2 ka = worleyP(cp*1.3 + vec2(tt*0.23, tt*0.17), 1.0e4); vec2 kb = worleyP(cp*2.1 - vec2(tt*0.19, -tt*0.27), 1.0e4);",
        "    float k = (1.0-smoothstep(0.0,0.16,ka.y-ka.x))*0.6 + (1.0-smoothstep(0.0,0.12,kb.y-kb.x))*0.5;",
        "    col += vec3(0.85,0.96,1.0)*k*uCaustic*pow(max(N.y,0.0),1.5)*0.32;",
        "  }",
        "  vec3 H = normalize(uLight+V); col += pow(max(dot(N,H),0.0),40.0)*0.16*(1.0-uInner);",
        "  float a = uInner > 0.5 ? (0.30 + 0.35*fres + 0.3*vM) : (0.88 + 0.1*fres);",
        "  a = clamp(a + internal*0.15, 0.0, 0.97);",
        "  gl_FragColor = vec4(col*(1.0+0.25*uGlow), a);",
        "}"].join("\n")
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    return mesh;
  }
  /* LatheGeometry faces outward when the profile runs bottom-to-top: outer runs lip->apex,
     inner runs apex->lip so the subumbrella faces into the cavity. */
  outerPts.reverse(); oW.reverse(); oM.reverse();
  innerPts.reverse(); iW.reverse(); iM.reverse();
  var bellInner = makeBellPart(innerPts, iW, iM, true);
  var bellOuter = makeBellPart(outerPts, oW, oM, false);
  bellInner.renderOrder = 2; bellOuter.renderOrder = 20;

  /* rhopalia: 8 tiny bright points in the deep notches */
  var rhoGeo = new THREE.BufferGeometry(), rhoPos = new Float32Array(8*3), rhoAng = new Float32Array(8);
  for (k = 0; k < 8; k++){ var pa = k*Math.PI/4; rhoPos[k*3] = Math.sin(pa)*0.93; rhoPos[k*3+1] = 0.03; rhoPos[k*3+2] = Math.cos(pa)*0.93; rhoAng[k] = pa; }
  rhoGeo.setAttribute('position', new THREE.BufferAttribute(rhoPos,3));
  rhoGeo.setAttribute('aAng', new THREE.BufferAttribute(rhoAng,1));
  var rhopalia = new THREE.Points(rhoGeo, new THREE.ShaderMaterial({
    uniforms: Object.assign({uPR:{value:1}}, U), transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader: [GLSL_COMMON,
      "attribute float aAng; uniform float uPhase; uniform float uAsym; uniform float uTurn; uniform float uPR; uniform float uAmp;",
      "void main(){ float ph = uPhase - uAsym*0.14*0.5*(1.0-cos(aAng-uTurn)); float c = contraction(ph)*uAmp; float tk = tuckf(ph)*uAmp;",
      " vec3 p = position; p.xz *= (1.0 - 0.16*c) - (0.05*c + 0.08*tk); p.y += 0.06*tk - 0.02*c;",
      " vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = uPR*45.0/-mv.z; }"].join("\n"),
    fragmentShader: "void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,r); gl_FragColor = vec4(vec3(0.95,0.98,1.0)*a*a*0.35, 1.0); }"
  }));
  rhopalia.frustumCulled = false; rhopalia.renderOrder = 21;

  /* ---------------- Oral pillars + oral disc ---------------- */
  var glassVert = [GLSL_COMMON,
    "uniform float uPhase; uniform float uAmp;",
    "varying vec3 vWP; varying vec3 vN; varying float vY;",
    "void main(){ float c = contraction(uPhase)*uAmp; vec3 p = position; p.y += 0.05*c; p.xz *= 1.0 - 0.06*c;",
    " vec4 wp = modelMatrix*vec4(p,1.0); vWP = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vY = position.y;",
    " gl_Position = projectionMatrix*viewMatrix*wp; }"].join("\n");
  var glassFrag = [
    "uniform vec3 uLight; uniform vec3 uMilk; uniform vec3 uDeep; uniform float uGlow; uniform float uOpacity;",
    "varying vec3 vWP; varying vec3 vN; varying float vY;",
    "void main(){ vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N; vec3 V = normalize(cameraPosition - vWP);",
    " float fres = pow(1.0-abs(dot(N,V)), 1.8); float wrap = clamp((dot(N,uLight)+0.6)/1.6,0.0,1.0);",
    " vec3 col = mix(uDeep, uMilk, clamp(0.3 + 0.55*wrap + 0.35*fres, 0.0, 1.0));",
    " float a = clamp(uOpacity + 0.45*fres, 0.0, 0.95)*mix(1.0, 0.15, smoothstep(-0.02, 0.2, vY));",
    " gl_FragColor = vec4(col*(1.0+0.2*uGlow), a); }"].join("\n");
  function glassMat(op){ return new THREE.ShaderMaterial({ uniforms:Object.assign({uOpacity:{value:op}}, U), vertexShader:glassVert, fragmentShader:glassFrag,
    transparent:true, depthWrite:false, side:THREE.DoubleSide }); }

  var pillarGroup = new THREE.Group();
  var PU = hi ? 32 : 20, PV = hi ? 24 : 14;
  for (k = 0; k < 4; k++){
    var ang = Math.PI/4 + k*Math.PI/2, rad = new THREE.Vector3(Math.sin(ang),0,Math.cos(ang)), tan = new THREE.Vector3(Math.cos(ang),0,-Math.sin(ang));
    var g = new THREE.BufferGeometry(), P = [], I = [];
    for (var vv = 0; vv <= PV; vv++){
      var v = vv/PV, y = 0.64 - v*0.92;
      var flare = 1 - smoothstep(0, 0.38, v), foot = smoothstep(0.75, 1.0, v);
      var aT = 0.14 + 0.07*flare + 0.03*foot, aR = 0.065 + 0.03*flare + 0.02*foot, rc = 0.31 - 0.03*flare;
      for (var uu = 0; uu <= PU; uu++){
        var t2 = uu/PU*Math.PI*2, cx = Math.sin(t2)*aT, cz = Math.cos(t2)*aR;
        P.push(rad.x*(rc+cz)+tan.x*cx, y, rad.z*(rc+cz)+tan.z*cx);
      }
    }
    for (vv = 0; vv < PV; vv++) for (uu = 0; uu < PU; uu++){ var a0 = vv*(PU+1)+uu, b0 = a0+PU+1; I.push(a0,b0,a0+1, a0+1,b0,b0+1); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(P,3)); g.setIndex(I); g.computeVertexNormals();
    pillarGroup.add(new THREE.Mesh(g, glassMat(0.42)));
  }
  var disc = new THREE.Mesh(new THREE.SphereGeometry(0.4, hi?48:28, hi?16:10), glassMat(0.35));
  disc.scale.set(1, 0.2, 1); disc.position.y = -0.17;
  pillarGroup.children.forEach(function(m){ m.renderOrder = 5; m.frustumCulled = false; });

  /* ---------------- Oral arms ---------------- */
  var NA = 8, NN = 7, ARM_LEN = 1.32;
  var NU = hi ? 60 : 36, NV = hi ? 90 : 54;
  var armGeo = new THREE.BufferGeometry(), AP = [], AI = [];
  for (var av = 0; av <= NV; av++) for (var au = 0; au <= NU; au++) AP.push(au/NU*Math.PI*2, av/NV, 0);
  for (av = 0; av < NV; av++) for (au = 0; au < NU; au++){ var q0 = av*(NU+1)+au, q1 = q0+NU+1; AI.push(q0,q0+1,q1, q0+1,q1+1,q1); }
  armGeo.setAttribute('position', new THREE.Float32BufferAttribute(AP,3)); armGeo.setIndex(AI);

  var armVert = [GLSL_COMMON,
    "uniform vec3 uP[7]; uniform vec3 uO[7]; uniform vec3 uS[7]; uniform float uSeed; uniform float uTime; uniform float uScale;",
    "varying vec3 vWP; varying vec3 vN; varying float vFw; varying float vB1; varying float vTh; varying float vV;",
    "const float W1 = 0.96; const float W2 = -0.96; const float W3 = 3.14159265;",
    "float prof(float v){",
    "  float stalk = mix(0.55, 0.68, smoothstep(0.0,0.3,v));",
    "  float s = mix(stalk, 1.0, smoothstep(0.22,0.48,v));",
    "  float tip = v > 0.7 ? sqrt(max(0.0, 1.0 - pow((v-0.7)/0.3, 2.0))) : 1.0;",
    "  return s*max(tip, 0.0)*sqrt(smoothstep(0.0, 0.07, v));",
    "}",
    "vec3 spineP(float v){ float f = clamp(v,0.0,1.0)*6.0; int i = int(min(floor(f),5.0)); float t = f - float(i);",
    "  vec3 p0 = uP[i > 0 ? i-1 : 0]; vec3 p1 = uP[i]; vec3 p2 = uP[i+1]; vec3 p3 = uP[i < 5 ? i+2 : 6];",
    "  float t2 = t*t; float t3 = t2*t;",
    "  return 0.5*((2.0*p1) + (-p0+p2)*t + (2.0*p0-5.0*p1+4.0*p2-p3)*t2 + (-p0+3.0*p1-3.0*p2+p3)*t3); }",
    "vec3 spineO(float v){ float f = clamp(v,0.0,1.0)*6.0; int i = int(min(floor(f),5.0)); float t = f - float(i);",
    "  return normalize(mix(uO[i], uO[i+1], t)); }",
    "vec3 spineS(float v){ float f = clamp(v,0.0,1.0)*6.0; int i = int(min(floor(f),5.0)); float t = f - float(i);",
    "  return normalize(mix(uS[i], uS[i+1], t)); }",
    "float frillW(float th, float v){",
    "  float l1 = pow(max(0.0,cos(th-W1)),4.0); float l2 = pow(max(0.0,cos(th-W2)),4.0);",
    "  float outer = smoothstep(-0.6, 0.6, cos(th));",
    "  return smoothstep(0.25, 0.36, v)*(0.8 + 0.2*outer)*(1.0 - 0.35*smoothstep(0.93,1.0,v));",
    "}",
    "vec3 armPos(float th, float v, out float fw, out float b1){",
    "  float l1 = pow(max(0.0,cos(th-W1)),4.0); float l2 = pow(max(0.0,cos(th-W2)),4.0); float l3 = pow(max(0.0,cos(th-W3)),6.0);",
    "  float R = (0.098 + 0.045*l1 + 0.045*l2 + 0.02*l3)*prof(v);",
    "  fw = frillW(th, v);",
    "  vec2 c1 = worleyP(vec2(th/6.2831853*15.0, v*17.0 + uSeed*7.0), 15.0);",
    "  vec2 c2 = worleyP(vec2(th/6.2831853*30.0, v*34.0 + uSeed*3.0), 30.0);",
    "  float e1 = clamp(c1.x/0.78, 0.0, 1.0); b1 = sqrt(1.0 - e1*e1);",
    "  float e2 = clamp(c2.x/0.78, 0.0, 1.0); float b2 = sqrt(1.0 - e2*e2);",
    "  float shimmer = 0.93 + 0.07*sin(uTime*2.6 + v*9.0 + th*3.0 + uSeed*5.0);",
    "  float d = fw*(0.072*b1 + 0.022*b2)*shimmer*min(1.0, prof(v)*1.6);",
    "  vec2 dir = vec2(sin(th), cos(th));",
    "  float bulge = 1.0 + 0.10*sin(v*9.0 + uSeed*4.0) + 0.06*sin(v*17.0 + uSeed*9.0);",
    "  vec2 q = dir*(R*bulge + d); q.x *= 1.06; q.y *= 0.9;",
    "  return spineP(v) + (spineS(v)*q.x + spineO(v)*q.y)*uScale;",
    "}",
    "void main(){",
    "  float th = position.x; float v = position.y; float fw; float b1; float fa; float fb;",
    "  vec3 p = armPos(th, v, fw, b1);",
    "  vec3 pa = armPos(th + 0.02, v, fa, fb);",
    "  vec3 pb = armPos(th, v + 0.01, fa, fb);",
    "  vec3 nrm = cross(pb - p, pa - p);",
    "  if (v > 0.995) nrm = -(spineP(1.0) - spineP(0.9));",
    "  vec4 wp = modelMatrix*vec4(p,1.0);",
    "  vWP = wp.xyz; vN = normalize(mat3(modelMatrix)*nrm); vFw = fw; vB1 = b1; vTh = th; vV = v;",
    "  gl_Position = projectionMatrix*viewMatrix*wp;",
    "}"].join("\n");

  var armFrag = [GLSL_COMMON, GLSL_FRAG,
    "uniform vec3 uLight; uniform vec3 uMilk; uniform vec3 uDeep; uniform float uGlow; uniform vec3 uCenter; uniform float uScaleW;",
    "varying vec3 vWP; varying vec3 vN; varying float vFw; varying float vB1; varying float vTh; varying float vV;",
    "void main(){",
    "  vec3 V = normalize(cameraPosition - vWP);",
    "  vec3 N = normalize(vN); if(dot(N,V) < 0.0) N = -N;",
    "  vec2 F = worleyP(vec2(vTh/6.2831853*64.0, vV*74.0), 64.0);",
    "  float e = clamp(F.x/0.62, 0.0, 1.0); float bead = 1.0 - e*e;",
    "  float crev = smoothstep(0.0, 0.32, F.y - F.x);",
    "  float h = vFw*(bead*0.55 + vB1*1.2);",
    "  N = perturbN(vWP, N, h*0.016);",
    "  float wrap = clamp((dot(N,uLight)+0.55)/1.55, 0.0, 1.0);",
    "  float ao = mix(0.42, 1.0, pow(clamp(vB1,0.0,1.0), 0.6));",
    "  float side = mix(0.62, 1.0, smoothstep(-0.6, 0.7, cos(vTh)));",
    "  float occl = mix(1.0, ao*mix(0.5, 1.0, bead)*side, clamp(vFw,0.0,1.0));",
    "  float lit = (0.78 + 0.42*wrap)*occl;",
    "  vec3 col = mix(uDeep, uMilk, clamp(lit, 0.0, 1.0));",
    "  col += vec3(1.0)*pow(bead, 4.0)*0.12*vFw*wrap;",
    "  float fres = pow(1.0 - abs(dot(N,V)), 2.0);",
    "  col += uMilk*fres*0.22;",
    "  float a = mix(0.22 + 0.4*fres, mix(0.7, 0.97, ao*mix(0.6,1.0,bead)), smoothstep(0.08, 0.55, vFw));",
    "  float back = clamp(dot(vWP - uCenter, -V)/(0.9*uScaleW), 0.0, 1.0);",
    "  col = mix(col, uDeep*1.15, back*0.45); a *= 1.0 - back*0.3;",
    "  gl_FragColor = vec4(col*(1.0+0.2*uGlow), a);",
    "}"].join("\n");

  var arms = [];
  var CENTER = {value:new THREE.Vector3()}, SCALEW = {value:1};
  function armAngle(i){ var pair = Math.floor(i/2), side = (i%2) ? 1 : -1; return Math.PI/4 + pair*Math.PI/2 + side*0.34; }
  for (var ai = 0; ai < NA; ai++){
    var Pu = [], Ou = [], Su = [];
    for (var nn = 0; nn < NN; nn++){ Pu.push(new THREE.Vector3()); Ou.push(new THREE.Vector3()); Su.push(new THREE.Vector3()); }
    var am = new THREE.ShaderMaterial({
      uniforms: Object.assign({ uP:{value:Pu}, uO:{value:Ou}, uS:{value:Su}, uSeed:{value:ai*1.618}, uScale:{value:1}, uCenter:CENTER, uScaleW:SCALEW }, U),
      vertexShader: armVert, fragmentShader: armFrag, transparent:true, depthWrite:true, side:THREE.DoubleSide,
      extensions:{derivatives:true}
    });
    var mesh = new THREE.Mesh(armGeo, am); mesh.frustumCulled = false; mesh.renderOrder = 10;
    var a = armAngle(ai);
    var radial = new THREE.Vector3(Math.sin(a),0,Math.cos(a));
    var anchor = radial.clone().multiplyScalar(0.50).add(new THREE.Vector3(0,0.15,0));
    var sideSign = (ai%2) ? 1 : -1, tangent = new THREE.Vector3(Math.cos(a),0,-Math.sin(a));
    var restDir = radial.clone().multiplyScalar(0.0).addScaledVector(tangent, sideSign*0.02).add(new THREE.Vector3(0,-1,0)).normalize();
    var rest = [];
    for (nn = 0; nn < NN; nn++){
      var bend = (nn/(NN-1)); bend = -bend*bend*0.07;
      rest.push(anchor.clone().addScaledVector(restDir, nn*ARM_LEN/(NN-1)).addScaledVector(radial, bend));
    }
    arms.push({ mesh:mesh, angle:a, radial:radial, rest:rest, P:Pu, O:Ou, S:Su,
      cur:[], prev:[], seg:ARM_LEN/(NN-1)*(0.90 + 0.16*((ai*0.618)%1)) });
    body.add(mesh);
  }

  body.add(bellInner); body.add(pillarGroup); body.add(bellOuter); body.add(rhopalia);

  /* ---------------- Simulation ---------------- */
  var state = { phase:0, period: opts.period || 0.95, asym:0, turn:0, turnTimer: 4 + Math.random()*4,
    surge:0, surgeV:0, tilt:new THREE.Vector2(0,0), lastC:0, inited:false,
    cyc:0, jitter:1, amp:1, startle:0, c:0,
    flowP:new THREE.Vector3(), flowV:new THREE.Vector3(), flowR:1 };
  var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), inv = new THREE.Matrix4(), q = new THREE.Quaternion();
  var down = new THREE.Vector3(), radW = new THREE.Vector3(), T = new THREE.Vector3(), Ov = new THREE.Vector3();

  function initArms(){
    root.updateMatrixWorld(true);
    arms.forEach(function(A){
      A.cur = []; A.prev = [];
      A.rest.forEach(function(r){ var w = body.localToWorld(r.clone()); A.cur.push(w); A.prev.push(w.clone()); });
    });
    state.inited = true;
  }

  function stepArms(cdot){
    body.getWorldQuaternion(q);
    var s = root.scale.x;
    down.set(0,-1,0).applyQuaternion(q);
    arms.forEach(function(A){
      radW.copy(A.radial).applyQuaternion(q);
      var cur = A.cur, prev = A.prev;
      var anc = body.localToWorld(tmp.copy(A.rest[0]));
      var jump = tmp2.copy(anc).sub(cur[0]);
      if (jump.lengthSq() > 0.25*s*s){ for (var j0 = 0; j0 < NN; j0++){ cur[j0].add(jump); prev[j0].add(jump); } }
      cur[0].copy(anc); prev[0].copy(anc);
      for (var j = 1; j < NN; j++){
        var f = j/(NN-1);
        var vx = (cur[j].x - prev[j].x)*0.9, vy = (cur[j].y - prev[j].y)*0.9, vz = (cur[j].z - prev[j].z)*0.9;
        prev[j].copy(cur[j]);
        cur[j].x += vx; cur[j].y += vy; cur[j].z += vz;
        /* jet from the bell sweeps the arms down/in on contraction, they drift out on relaxation */
        var flow = cdot*0.0016*s*f;
        cur[j].addScaledVector(down, Math.max(flow,0)*1.0);
        cur[j].addScaledVector(radW, -flow*0.7);
        /* stiffness: thick fleshy arms keep their shape */
        /* water pushed around by the visitor's pointer */
        var fdx = cur[j].x - state.flowP.x, fdy = cur[j].y - state.flowP.y, fdz = cur[j].z - state.flowP.z;
        var fw = Math.exp(-(fdx*fdx + fdy*fdy + fdz*fdz)/(state.flowR*state.flowR));
        if (fw > 0.01) cur[j].addScaledVector(state.flowV, fw*f*0.006);
        var target = body.localToWorld(tmp.copy(A.rest[j]));
        var k = 0.075 - 0.04*f;
        cur[j].lerp(target, k);
      }
      for (var it = 0; it < 2; it++){
        for (var c = 1; c < NN; c++){
          var a0 = cur[c-1], b0 = cur[c];
          tmp.copy(b0).sub(a0); var d = tmp.length() || 1e-6, L = A.seg*s, diff = (d-L)/d;
          if (c === 1){ b0.addScaledVector(tmp, -diff); }
          else { a0.addScaledVector(tmp, diff*0.5); b0.addScaledVector(tmp, -diff*0.5); }
        }
      }
    });
  }

  function writeArmUniforms(){
    inv.copy(body.matrixWorld).invert();
    arms.forEach(function(A){
      for (var j = 0; j < NN; j++) A.P[j].copy(A.cur[j]).applyMatrix4(inv);
      for (j = 0; j < NN; j++){
        var jn = Math.min(NN-1, j+1), jp = Math.max(0, j-1);
        T.copy(A.P[jn]).sub(A.P[jp]).normalize();
        Ov.copy(A.radial).addScaledVector(T, -A.radial.dot(T)).normalize();
        A.O[j].copy(Ov); A.S[j].crossVectors(T, Ov).normalize();
      }
    });
  }

  var acc = 0;
  function update(dt, time){
    if (!state.inited) initArms();
    dt = Math.max(0, Math.min(dt, 0.05));
    state.startle = Math.max(0, state.startle - dt/3.0);
    state.phase += dt/(state.period*state.jitter*(1 - 0.55*state.startle));
    var ph = state.phase;
    if (Math.floor(ph) !== state.cyc){            /* every pulse is a little different */
      state.cyc = Math.floor(ph);
      state.jitter = 1 + (Math.random()-0.5)*0.14;
      state.amp = (0.9 + Math.random()*0.2)*(1 + 0.18*state.startle);
    }
    /* occasional turns: contraction starts on one side and travels around the margin */
    state.turnTimer -= dt;
    if (state.turnTimer < 0){ state.turn = Math.random()*Math.PI*2; state.asymTarget = 0.6 + Math.random()*0.4; state.turnHold = 2.5 + Math.random()*2.5; state.turnTimer = 7 + Math.random()*6; }
    if (state.turnHold > 0){ state.turnHold -= dt; } else { state.asymTarget = 0; }
    state.asym += ((state.asymTarget||0) - state.asym)*Math.min(1, dt*1.5);
    /* swimming surge: fast on contraction, glide on relaxation (high-passed so it stays in frame) */
    var sp = speedShape(ph) - 0.45;
    state.surgeV = sp*0.16*state.amp*(1 + 1.2*state.startle);
    state.surge += state.surgeV*dt; state.surge -= state.surge*Math.min(1, dt*1.2);
    body.position.y = state.surge;
    var tx = Math.sin(state.turn)*state.asym*0.10, tz = Math.cos(state.turn)*state.asym*0.10;
    state.tilt.x += (tz - state.tilt.x)*Math.min(1, dt*0.8);
    state.tilt.y += (-tx - state.tilt.y)*Math.min(1, dt*0.8);
    body.rotation.x = state.tilt.x; body.rotation.z = state.tilt.y;
    root.updateMatrixWorld(true);

    var c = contraction(ph)*state.amp; state.c = c; var cdot = (c - state.lastC)/Math.max(dt,1e-4)*0.016; state.lastC = c;
    acc += dt; var steps = 0;
    while (acc >= 1/60 && steps < 4){ stepArms(cdot); acc -= 1/60; steps++; }
    if (steps === 4) acc = 0;
    writeArmUniforms();

    body.localToWorld(CENTER.value.set(0,-0.5,0)); SCALEW.value = root.scale.x;
    U.uAmp.value = state.amp;
    U.uPhase.value = ph; U.uTime.value = time; U.uAsym.value = state.asym; U.uTurn.value = state.turn;
  }

  function startle(k){ state.startle = Math.min(1, Math.max(state.startle, k == null ? 1 : k)); }
  function setFlow(p, v, r){ state.flowP.copy(p); state.flowV.copy(v); state.flowR = r; }
  return { root:root, body:body, update:update, uniforms:U, state:state, arms:arms, startle:startle, setFlow:setFlow,
    setPixelRatio:function(pr){ rhopalia.material.uniforms.uPR.value = pr; } };
}

global.createBlubber = createBlubber;

/* Soft bloom: scene -> bright pass -> two blur levels -> additive composite. */
function createBloom(THREE, renderer, opts){
  opts = opts || {};
  var strength = opts.strength || 0.9, threshold = opts.threshold || 0.5;
  var quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  var quadGeo = new THREE.PlaneGeometry(2,2);
  var quadScene = new THREE.Scene(); var quad = new THREE.Mesh(quadGeo); quadScene.add(quad);
  var VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
  function mat(fs, uniforms){ return new THREE.ShaderMaterial({ uniforms:uniforms, vertexShader:VS, fragmentShader:fs, depthTest:false, depthWrite:false }); }
  var RT = THREE.WebGLMultisampleRenderTarget || THREE.WebGLRenderTarget;
  var rtScene, rtA1, rtB1, rtA2, rtB2;
  var brightM = mat("uniform sampler2D tDiffuse; uniform float uTh; varying vec2 vUv; void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb; float l = dot(c, vec3(0.2126,0.7152,0.0722)); float k = smoothstep(uTh, uTh+0.35, l); gl_FragColor = vec4(c*k, 1.0); }",
    { tDiffuse:{value:null}, uTh:{value:threshold} });
  var blurM = mat("uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv; void main(){ vec3 s = texture2D(tDiffuse, vUv).rgb*0.2270; s += (texture2D(tDiffuse, vUv+uDir*1.3846).rgb + texture2D(tDiffuse, vUv-uDir*1.3846).rgb)*0.3162; s += (texture2D(tDiffuse, vUv+uDir*3.2308).rgb + texture2D(tDiffuse, vUv-uDir*3.2308).rgb)*0.0703; gl_FragColor = vec4(s, 1.0); }",
    { tDiffuse:{value:null}, uDir:{value:new THREE.Vector2()} });
  var compM = mat("uniform float uGrade; uniform float uVig; uniform float uRadial; uniform float uWarp; uniform float uT; uniform sampler2D tScene; uniform sampler2D tB1; uniform sampler2D tB2; uniform float uS; varying vec2 vUv; void main(){ vec2 uv = vUv + vec2(sin(vUv.y*26.0 + uT*7.0), cos(vUv.x*22.0 + uT*6.0))*0.008*uWarp; vec3 c = texture2D(tScene, uv).rgb; if (uRadial > 0.001){ vec2 dir = uv - 0.5; vec3 acc = c; for (int i = 1; i < 8; i++){ acc += texture2D(tScene, uv - dir*float(i)*0.014*uRadial).rgb; } c = acc/8.0; } float l = dot(c, vec3(0.2126,0.7152,0.0722)); vec3 b = (texture2D(tB1, vUv).rgb*0.5 + texture2D(tB2, vUv).rgb*0.7)*uS*(1.0 - 0.75*smoothstep(0.2, 0.9, l)); c += b; float L = dot(c, vec3(0.2126,0.7152,0.0722)); c = mix(c, L*vec3(0.80,0.95,1.08)*1.04, uGrade); vec2 q = vUv - 0.5; c *= 1.0 - uVig*smoothstep(0.25, 0.75, length(q*vec2(1.1,1.0))); gl_FragColor = vec4(c, 1.0); }",
    { tScene:{value:null}, tB1:{value:null}, tB2:{value:null}, uS:{value:strength}, uGrade:{value:0.22}, uVig:{value:0.35}, uRadial:{value:0}, uWarp:{value:0}, uT:{value:0} });
  function mk(w,h,ms){ var t = ms ? new RT(w,h) : new THREE.WebGLRenderTarget(w,h); t.texture.minFilter = THREE.LinearFilter; t.texture.magFilter = THREE.LinearFilter; t.texture.generateMipmaps = false; return t; }
  function setSize(w,h){
    var pr = renderer.getPixelRatio(); w = Math.max(1, Math.floor(w*pr)); h = Math.max(1, Math.floor(h*pr));
    [rtScene, rtA1, rtB1, rtA2, rtB2].forEach(function(t){ if (t) t.dispose(); });
    rtScene = mk(w,h,true);
    rtA1 = mk(w>>2||1, h>>2||1); rtB1 = mk(w>>2||1, h>>2||1);
    rtA2 = mk(w>>3||1, h>>3||1); rtB2 = mk(w>>3||1, h>>3||1);
  }
  function pass(m, target){ quad.material = m; renderer.setRenderTarget(target); renderer.render(quadScene, quadCam); }
  function blur(src, tmp, w, h){
    blurM.uniforms.tDiffuse.value = src.texture; blurM.uniforms.uDir.value.set(1/w, 0); pass(blurM, tmp);
    blurM.uniforms.tDiffuse.value = tmp.texture; blurM.uniforms.uDir.value.set(0, 1/h); pass(blurM, src);
  }
  function render(scene, camera){
    renderer.setRenderTarget(rtScene); renderer.render(scene, camera);
    brightM.uniforms.tDiffuse.value = rtScene.texture; pass(brightM, rtA1);
    blur(rtA1, rtB1, rtA1.width, rtA1.height);
    blurM.uniforms.tDiffuse.value = rtA1.texture; blurM.uniforms.uDir.value.set(0,0); pass(blurM, rtA2);
    blur(rtA2, rtB2, rtA2.width, rtA2.height); blur(rtA2, rtB2, rtA2.width, rtA2.height);
    compM.uniforms.tScene.value = rtScene.texture; compM.uniforms.tB1.value = rtA1.texture; compM.uniforms.tB2.value = rtA2.texture;
    pass(compM, null);
  }
  return { setSize:setSize, render:render, uniforms:{ strength:compM.uniforms.uS, threshold:brightM.uniforms.uTh, grade:compM.uniforms.uGrade, vignette:compM.uniforms.uVig, radial:compM.uniforms.uRadial, warp:compM.uniforms.uWarp, time:compM.uniforms.uT } };
}
global.createBloom = createBloom;
})(typeof window !== 'undefined' ? window : this);

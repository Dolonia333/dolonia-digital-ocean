/* Sky dome + Gerstner ocean surface, readable from above and below. three.js r128. */
(function (global) {
"use strict";
var NOISE = [
"uniform float uTime; uniform vec3 uSun;",
"float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }",
"float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);",
"  return mix(mix(hash12(i), hash12(i+vec2(1.0,0.0)), u.x), mix(hash12(i+vec2(0.0,1.0)), hash12(i+vec2(1.0,1.0)), u.x), u.y); }",
"float fbm(vec2 p){ float a = 0.5; float s = 0.0; for(int i=0;i<4;i++){ s += a*vnoise(p); p = p*2.03 + vec2(1.7,9.2); a *= 0.5; } return s; }",
"vec3 skyFast(vec3 d){ float h = max(d.y,0.0); vec3 c = mix(vec3(0.64,0.74,0.81), vec3(0.22,0.40,0.57), pow(h,0.5)); return c + vec3(0.9,0.9,0.85)*0.06*smoothstep(0.0,0.3,h)*(0.6+0.4*sin(d.x*7.0+d.z*5.0)); }",
"vec3 skyCol(vec3 d){",
"  float h = max(d.y, 0.0);",
"  vec3 zen = vec3(0.22,0.40,0.57); vec3 hor = vec3(0.64,0.74,0.81);",
"  vec3 c = mix(hor, zen, pow(h, 0.5));",
"  float sd = max(dot(d, uSun), 0.0);",
"  c += vec3(1.0,0.96,0.88)*pow(sd, 400.0)*0.7 + vec3(0.85,0.85,0.78)*pow(sd, 10.0)*0.10;",
"  if (d.y > 0.0){",
"    vec2 uv = d.xz/(d.y + 0.06)*0.42 + vec2(uTime*0.006, uTime*0.0025);",
"    float n = fbm(uv*1.1); float n2 = fbm(uv*2.9 + 7.0);",
"    float cov = smoothstep(0.42, 0.72, n*0.8 + n2*0.32);",
"    float shade = mix(0.70, 1.0, smoothstep(0.35, 0.85, n2));",
"    float fade = smoothstep(0.0, 0.16, d.y);",
"    c = mix(c, vec3(0.92,0.95,0.97)*shade, cov*fade*0.9);",
"  }",
"  return c;",
"}"].join("\n");

function createSurface(THREE, opts){
  opts = opts || {};
  var hi = (opts.quality || 'high') === 'high';
  var U = {
    uTime:{value:0}, uSun:{value:new THREE.Vector3(-0.75, 0.2, -1).normalize()},
    uDeepCol:{value:new THREE.Color(0.03, 0.17, 0.27)}, uUnderBg:{value:new THREE.Color(0.08,0.30,0.45)}
  };
  var group = new THREE.Group();

  /* sky */
  var sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.ShaderMaterial({
    uniforms:U, side:THREE.BackSide, depthWrite:false,
    vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader:[NOISE, "varying vec3 vDir; void main(){ vec3 d = normalize(vDir); vec3 c = skyCol(vec3(d.x, max(d.y, 0.0), d.z)); gl_FragColor = vec4(c, 1.0); }"].join("\n")
  }));
  sky.renderOrder = -100; sky.frustumCulled = false;
  group.add(sky);

  /* ocean: radial grid, dense near the viewer */
  var RINGS = hi ? 170 : 110, SEGS = hi ? 220 : 140, RMAX = 1400;
  var P = [], I = [];
  for (var i = 0; i <= RINGS; i++){
    var t = i/RINGS, r = RMAX*Math.pow(t, 2.7);
    for (var j = 0; j <= SEGS; j++){ var a = j/SEGS*Math.PI*2; P.push(Math.cos(a)*r, 0, Math.sin(a)*r); }
  }
  for (i = 0; i < RINGS; i++) for (j = 0; j < SEGS; j++){
    var A = i*(SEGS+1)+j, B = A+SEGS+1;
    I.push(A, A+1, B, A+1, B+1, B);
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setIndex(I);
  var ocean = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms:U, side:THREE.DoubleSide,
    vertexShader:[
      "uniform float uTime;",
      "varying vec3 vWP; varying vec3 vNrm; varying float vH;",
      "vec3 gerst(vec2 p, vec2 dir, float L, float A, float Q, inout vec3 T, inout vec3 B){",
      "  float k = 6.2831853/L; float w = sqrt(9.8*k); vec2 d = normalize(dir);",
      "  float f = k*dot(d,p) - w*uTime; float c = cos(f); float s = sin(f);",
      "  T += vec3(-Q*d.x*d.x*A*k*s, d.x*A*k*c, -Q*d.x*d.y*A*k*s);",
      "  B += vec3(-Q*d.x*d.y*A*k*s, d.y*A*k*c, -Q*d.y*d.y*A*k*s);",
      "  return vec3(Q*A*d.x*c, A*s, Q*A*d.y*c);",
      "}",
      "void main(){",
      "  vec3 wp = (modelMatrix*vec4(position,1.0)).xyz; vec2 p = wp.xz;",
      "  vec3 T = vec3(1.0,0.0,0.0); vec3 B = vec3(0.0,0.0,1.0); vec3 disp = vec3(0.0);",
      "  disp += gerst(p, vec2(1.0,0.3), 26.0, 0.30, 0.6, T, B);",
      "  disp += gerst(p, vec2(0.6,1.0), 15.0, 0.20, 0.6, T, B);",
      "  disp += gerst(p, vec2(-0.4,1.0), 8.5, 0.11, 0.5, T, B);",
      "  disp += gerst(p, vec2(1.0,-0.7), 4.6, 0.055, 0.5, T, B);",
      "  disp += gerst(p, vec2(0.2,-1.0), 2.7, 0.03, 0.4, T, B);",
      "  float fall = 1.0 - smoothstep(160.0, 700.0, length(p - cameraPosition.xz));",
      "  wp += disp*fall; vH = disp.y*fall;",
      "  vNrm = normalize(mix(vec3(0.0,1.0,0.0), normalize(cross(B, T)), fall));",
      "  vWP = wp; gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);",
      "}"].join("\n"),
    fragmentShader:[NOISE,
      "uniform vec3 uDeepCol; uniform vec3 uUnderBg;",
      "varying vec3 vWP; varying vec3 vNrm; varying float vH;",
      "void main(){",
      "  vec3 N = normalize(vNrm);",
      "  float dist = length(vWP - cameraPosition);",
      "  vec2 q = vWP.xz; float tt = uTime;",
      "  vec2 g = vec2(0.0);",
      "  g += vec2(0.8,0.6)*cos(dot(q, vec2(0.8,0.6))*1.9 - tt*2.3)*0.5;",
      "  g += vec2(-0.5,0.86)*cos(dot(q, vec2(-0.5,0.86))*2.7 - tt*2.9)*0.35;",
      "  g += vec2(0.96,-0.28)*cos(dot(q, vec2(0.96,-0.28))*3.9 - tt*3.4)*0.25;",
      "  g += vec2(-0.2,-0.98)*cos(dot(q, vec2(-0.2,-0.98))*5.3 - tt*4.1)*0.18;",
      "  float detail = 1.0 - smoothstep(15.0, 160.0, dist);",
      "  N = normalize(N + vec3(-g.x, 0.0, -g.y)*0.12*detail);",
      "  vec3 V = normalize(cameraPosition - vWP);",
      "  if (cameraPosition.y > vWP.y - 0.05){",
      "    vec3 R = reflect(-V, N); R.y = abs(R.y);",
      "    float fres = 0.02 + 0.98*pow(1.0 - max(dot(N,V), 0.0), 5.0);",
      "    vec3 water = uDeepCol + vec3(0.05,0.13,0.15)*clamp(vH*1.8 + 0.35, 0.0, 1.0);",
      "    vec3 col = mix(water, skyFast(R), fres*0.92);",
      "    col += vec3(1.0,0.96,0.88)*pow(max(dot(R, uSun), 0.0), 260.0)*1.5;",
      "    float haze = smoothstep(40.0, 950.0, dist);",
      "    col = mix(col, skyFast(normalize(vec3(-V.x, 0.015, -V.z))), haze);",
      "    gl_FragColor = vec4(col, 1.0);",
      "  } else {",
      "    float cw = dot(-V, N);",
      "    float win = smoothstep(0.58, 0.86, cw);",
      "    vec3 col = mix(uUnderBg*1.3, vec3(0.60,0.80,0.90), win);",
      "    col += vec3(0.6,0.8,0.9)*pow(max(-V.y, 0.0), 30.0)*0.35;",
      "    col = mix(col, uUnderBg, smoothstep(4.0, 60.0, dist));",
      "    gl_FragColor = vec4(col, 1.0);",
      "  }",
      "}"].join("\n")
  }));
  ocean.frustumCulled = false; ocean.renderOrder = -50;
  group.add(ocean);

  function update(time, camera){
    U.uTime.value = time;
    sky.position.copy(camera.position);
    ocean.position.set(camera.position.x, 0, camera.position.z);
    var above = camera.position.y > 0;
    sky.visible = above;
    ocean.visible = camera.position.y > -40;
  }
  return { group:group, update:update, uniforms:U };
}
global.createSurface = createSurface;
})(typeof window !== 'undefined' ? window : this);

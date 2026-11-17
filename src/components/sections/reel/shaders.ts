// GLSL for the showreel warp plane. A unit plane (position.xy in [-1,1], uv in
// [0,1]) is mapped into a pixel-space rounded card and displaced by simplex
// noise whose amplitude is driven by scroll progress (uWarp) and scroll
// velocity (uVelocity) — the Lusion-style "liquid bend that settles flat".

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

export const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec3 position;

uniform vec2 uResolution;   // stage size in CSS px
uniform vec2 uRectCenter;   // card centre in CSS px (origin top-left)
uniform vec2 uRectSize;     // card w,h in CSS px
uniform float uWarp;        // 0..1 bell curve (wave amplitude)
uniform float uFlow;        // 0..1 monotonic release progress (advances wave)
uniform float uVelocity;    // signed scroll velocity
uniform float uTime;

varying vec2 vUv;
varying float vWarp;
varying float vInt;

${SIMPLEX}

void main() {
  vUv = uv;
  vWarp = uWarp;

  // unit plane [-1,1] -> card rect in px
  vec2 px = uRectCenter + position.xy * 0.5 * uRectSize;

  // All in-plane (2D) — no shear or perspective.
  float vmag = min(abs(uVelocity), 1.5);

  // ── 1) INITIAL TUG: at the very start of the release, grab the top-left
  //    corner and pull it, then let go. Its strength is its OWN pulse (not the
  //    tiny early warp value), so it actually shows. uv (0,1) = top-left screen.
  float tl = smoothstep(1.05, 0.0, uv.x + (1.0 - uv.y));
  // eased over more scroll so it builds gradually instead of snapping early
  float tug = tl
            * smoothstep(0.0, 0.24, uFlow)
            * (1.0 - smoothstep(0.32, 0.68, uFlow));
  px.x -= tug * 84.0; // pull left (2x — really emphasise the tug)
  px.y -= tug * 52.0; // and up

  // ── 2) TONED-DOWN 3D WARP: organic simplex-noise displacement (so the left and
  //    right never share one direction — no S-wave) plus a gentle perspective fold
  //    that tips the plane in depth. The old 3D version, dialled back.
  float amp = uWarp * 11.0 + vmag * 3.0;
  float t = uFlow * 2.4 + uTime * 0.14;
  vec2 n = vec2(
    snoise(uv * 2.3 + vec2(t, 0.0)),
    snoise(uv * 2.1 + vec2(0.0, t) + 11.3)
  );
  px += n * amp;

  // fake depth: a noise-driven diagonal fold tapers the plane (perspective tilt),
  // kept subtle so it reads 3D without the page-flip exaggeration.
  float fold = snoise(uv * 1.5 + t * 0.5);
  float depth = fold * uWarp * 0.11;
  px = uRectCenter + (px - uRectCenter) * (1.0 + depth * (uv.x - 0.5));

  // ── 3) RIGHT-CORNER LIFT: as the card grows into the final Play Reel, the two
  //    right corners lift up-and-in instead of drooping outward/down. Weighted
  //    to the corners (high uv.x, far from vertical centre) with the bottom-right
  //    travelling furthest, and scaled by uWarp so it vanishes once settled flat.
  float rc = smoothstep(0.5, 1.0, uv.x) * (abs(uv.y - 0.5) * 2.0);
  float botBias = 1.0 + (1.0 - uv.y) * 0.9; // bottom-right moves more than top-right
  float lift = rc * uWarp * botBias;
  px.y -= lift * 34.0; // up
  px.x -= lift * 14.0; // and slightly in (left)

  vInt = clamp(uWarp * 0.35, 0.0, 1.0);

  vec2 ndc = vec2(px.x / uResolution.x * 2.0 - 1.0,
                  1.0 - px.y / uResolution.y * 2.0);
  gl_Position = vec4(ndc, 0.0, 1.0);
}
`;

export const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying float vWarp;
varying float vInt;

uniform sampler2D uTexture;
uniform float uHasVideo;
uniform float uTexAspect;   // video w/h
uniform float uFlow;        // 0..1 release progress (drives the overlay fade)
uniform vec2 uRectSize;     // px
uniform float uRadius;      // px
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

void main() {
  vec2 uv = vUv;

  // rounded-rect SDF -> antialiased alpha
  vec2 halfpx = uRectSize * 0.5;
  vec2 p = (uv - 0.5) * uRectSize;
  vec2 d = abs(p) - (halfpx - uRadius);
  float dist = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - uRadius;
  float alpha = 1.0 - smoothstep(-1.5, 1.5, dist);
  if (alpha <= 0.002) discard;

  vec3 rgb;
  if (uHasVideo > 0.5) {
    float cardAspect = uRectSize.x / uRectSize.y;
    // flip x: the video texture samples mirrored otherwise (text reads backwards)
    vec2 fuv = vec2(1.0 - uv.x, uv.y);
    vec2 tuv = fuv;
    if (uTexAspect > cardAspect) {
      float s = cardAspect / uTexAspect;
      tuv.x = (fuv.x - 0.5) * s + 0.5;
    } else {
      float s = uTexAspect / cardAspect;
      tuv.y = (fuv.y - 0.5) * s + 0.5;
    }
    float off = vInt * 0.005;
    rgb = vec3(
      texture2D(uTexture, tuv + vec2(off, 0.0)).r,
      texture2D(uTexture, tuv).g,
      texture2D(uTexture, tuv - vec2(off, 0.0)).b
    );
  } else {
    rgb = mix(uColorA, uColorB, uv.x);
    rgb = mix(rgb, uColorC, smoothstep(0.15, 1.0, uv.y) * 0.55);
    float r = distance(uv, vec2(0.5, 0.42));
    rgb += uColorC * 0.18 * (1.0 - smoothstep(0.0, 0.7, r));
  }

  // ── purple overlay (#8A2FB5): full 50% while the card is held (tug not yet
  //    begun), fading to 0% just before the Play Reel reveal. The fade sweeps
  //    diagonally — the top-right clears first, the bottom-left last.
  float corner = (uv.x + uv.y) * 0.5;          // 1 = top-right, 0 = bottom-left
  float delay = 1.0 - corner;                  // 0 top-right -> 1 bottom-left
  float sweep = smoothstep(0.0, 0.8, uFlow);   // 0 during hold -> 1 as the card nears final
  float local = smoothstep(delay * 0.6, delay * 0.6 + 0.4, sweep);
  float ov = 0.5 * (1.0 - local);
  // Screen blend at ov opacity
  vec3 purple = vec3(0.541, 0.184, 0.710);
  vec3 screened = 1.0 - (1.0 - rgb) * (1.0 - purple);
  rgb = mix(rgb, screened, ov);

  gl_FragColor = vec4(rgb, alpha);
}
`;

export const HERO_VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

/**
 * The octave count is compiled into the shader so mobile GPUs do not pay for
 * branches or unused noise work. All variants render the same composition.
 */
export function createLiquidHeroFragmentShader(octaves) {
  return `
precision highp float;

#define FBM_OCTAVES ${octaves}

varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec2 u_trailPointer;
uniform vec2 u_pointerVelocity;
uniform float u_interaction;
uniform vec2 u_clickPosition;
uniform float u_clickAge;

const mat2 ROTATE = mat2(0.80, -0.60, 0.60, 0.80);

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 curve = local * local * (3.0 - 2.0 * local);

  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));

  return mix(mix(a, b, curve.x), mix(c, d, curve.x), curve.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  float normalizer = 0.0;

  for (int i = 0; i < FBM_OCTAVES; i++) {
    value += valueNoise(p) * amplitude;
    normalizer += amplitude;
    p = ROTATE * p * 1.96 + vec2(17.13, 9.41);
    amplitude *= 0.49;
  }

  return value / normalizer;
}

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float denominator = max(dot(ab, ab), 0.00001);
  float projection = clamp(dot(p - a, ab) / denominator, 0.0, 1.0);
  return length(p - (a + ab * projection));
}

vec3 colorRamp(float value) {
  vec3 blackBlue = vec3(0.004, 0.012, 0.035);
  vec3 midnight = vec3(0.012, 0.045, 0.118);
  vec3 deepCobalt = vec3(0.025, 0.125, 0.330);
  vec3 cobalt = vec3(0.065, 0.285, 0.680);
  vec3 electricBlue = vec3(0.220, 0.505, 0.920);

  vec3 color = mix(blackBlue, midnight, smoothstep(0.02, 0.34, value));
  color = mix(color, deepCobalt, smoothstep(0.27, 0.58, value));
  color = mix(color, cobalt, smoothstep(0.53, 0.82, value));
  color = mix(color, electricBlue, smoothstep(0.80, 1.0, value));
  return color;
}

void main() {
  float shortestSide = min(u_resolution.x, u_resolution.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / shortestSide;
  vec2 pointer = (u_pointer - 0.5) * u_resolution.xy / shortestSide;
  vec2 trailPointer = (u_trailPointer - 0.5) * u_resolution.xy / shortestSide;
  vec2 clickPosition = (u_clickPosition - 0.5) * u_resolution.xy / shortestSide;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  float timeA = u_time * 0.026;
  float timeB = u_time * 0.017;
  float timeC = u_time * 0.011;

  // Two stages of domain warping keep the field broad and sculptural. The
  // unequal time vectors prevent the whole environment from drifting as one.
  vec2 fieldUv = uv * mix(1.28, 1.06, smoothstep(0.72, 1.55, aspect));
  vec2 q = vec2(
    fbm(fieldUv * 1.08 + vec2(timeA, -timeB)),
    fbm(fieldUv * 1.08 + vec2(5.23 - timeB, 1.71 + timeA * 0.72))
  );
  vec2 r = vec2(
    fbm(fieldUv * 0.82 + q * 1.36 + vec2(1.90 + timeC, 8.12 - timeA * 0.34)),
    fbm(fieldUv * 0.82 + q.yx * 1.22 + vec2(8.31 - timeB * 0.58, 2.72 + timeC))
  );

  vec2 pointerDelta = uv - pointer;
  float pointerDistance = length(pointerDelta);
  vec2 pointerNormal = pointerDelta / max(pointerDistance, 0.0001);
  vec2 pointerTangent = vec2(-pointerNormal.y, pointerNormal.x);
  float pointerField = (1.0 - smoothstep(0.035, 0.49, pointerDistance)) * u_interaction;
  float velocity = clamp(length(u_pointerVelocity), 0.0, 1.0);

  // A slower pointer becomes the memory of the gesture. The segment between
  // it and the live pointer bends the field without drawing a literal trail.
  float wakeDistance = segmentDistance(uv, trailPointer, pointer);
  float wake = (1.0 - smoothstep(0.015, 0.20 + velocity * 0.06, wakeDistance));
  wake *= velocity * u_interaction;

  vec2 flowDirection = normalize((r - q) + vec2(0.001));
  vec2 displacedUv = fieldUv;
  displacedUv += (r - 0.5) * 0.62;
  displacedUv += pointerNormal * pointerField * (0.055 + velocity * 0.028);
  displacedUv += pointerTangent * pointerField * (r.x - 0.5) * 0.075;
  displacedUv += flowDirection * wake * 0.045;

  // One restrained click wave. It affects refraction, never the UI layer.
  float clickDistance = length(uv - clickPosition);
  float clickRadius = max(u_clickAge, 0.0) * 0.34;
  float clickEnvelope = 1.0 - smoothstep(0.0, 1.55, max(u_clickAge, 0.0));
  float clickWave = exp(-pow((clickDistance - clickRadius) * 30.0, 2.0));
  clickWave *= clickEnvelope * step(0.0, u_clickAge);
  displacedUv += (uv - clickPosition) / max(clickDistance, 0.0001) * clickWave * 0.028;

  float field = fbm(displacedUv * 1.02 + r * 0.88 + vec2(-timeB, timeC));
  float secondary = fbm(displacedUv * 1.64 - q * 0.54 + vec2(timeC, -timeA * 0.31));
  float refractiveFold = abs(field - secondary);
  float glassRidge = 1.0 - smoothstep(0.055, 0.29, refractiveFold);
  glassRidge *= smoothstep(0.34, 0.79, field);
  float foldedSurface = 1.0 - smoothstep(
    0.045,
    0.19,
    abs(field - (0.46 + (r.x - 0.5) * 0.19))
  );

  // Aspect-aware anchors keep the light masses framing the copy on wide and
  // tall screens instead of cropping a desktop composition on mobile.
  float horizontalAnchor = mix(0.39, 0.76, smoothstep(0.72, 1.62, aspect));
  vec2 warpedPosition = uv + (r - 0.5) * 0.43 + (q.yx - 0.5) * 0.14;
  vec2 leftDelta = warpedPosition - vec2(-horizontalAnchor, 0.29);
  vec2 rightDelta = warpedPosition - vec2(horizontalAnchor * 0.92, 0.17);
  vec2 lowerDelta = warpedPosition - vec2(-horizontalAnchor * 0.52, -0.56);

  float leftMass = exp(-dot(leftDelta * vec2(0.78, 1.42), leftDelta * vec2(0.78, 1.42)) * 3.2);
  float rightMass = exp(-dot(rightDelta * vec2(0.70, 1.24), rightDelta * vec2(0.70, 1.24)) * 3.0);
  float lowerMass = exp(-dot(lowerDelta * vec2(0.72, 1.64), lowerDelta * vec2(0.72, 1.64)) * 3.5);

  leftMass *= smoothstep(0.28, 0.77, field + q.x * 0.26);
  rightMass *= smoothstep(0.30, 0.80, secondary + r.y * 0.24);
  lowerMass *= smoothstep(0.34, 0.82, field * 0.72 + secondary * 0.38);

  float outerZone = smoothstep(0.17, 0.69, length(vec2(uv.x * 0.74, uv.y * 1.06)));
  float centerCalm = 1.0 - smoothstep(0.13, 0.52, length(vec2(uv.x * 0.70, (uv.y + 0.01) * 1.22)));
  float massLight = leftMass * 0.82 + rightMass * 0.92 + lowerMass * 0.52;
  massLight *= mix(0.54, 1.0, outerZone);
  foldedSurface *= smoothstep(0.15, 0.70, massLight + outerZone * 0.20);

  float fluidLight = smoothstep(0.37, 0.83, field * 0.70 + secondary * 0.30);
  fluidLight = pow(fluidLight, 1.52);
  fluidLight *= mix(0.38, 0.92, outerZone);

  float pointerDepth = pointerField * (0.075 + velocity * 0.13);
  pointerDepth *= 0.42 + glassRidge * 0.58;

  // Broad shafts live inside the same warped material, so their edges never
  // resolve as rectangular overlays.
  float beamWarp = (field - 0.5) * 0.22 + (secondary - 0.5) * 0.10;
  float beamA = 1.0 - smoothstep(0.05, 0.34, abs(uv.x * 0.58 + uv.y - 0.43 + beamWarp));
  float beamB = 1.0 - smoothstep(0.03, 0.29, abs(uv.x * 0.72 - uv.y + 0.61 - beamWarp * 0.72));
  float beams = (beamA * 0.034 + beamB * 0.018) * outerZone;

  float energy = massLight * 1.06 + fluidLight * 0.52 + glassRidge * 0.12;
  energy += foldedSurface * (0.10 + massLight * 0.15);
  energy += pointerDepth + wake * 0.045 + clickWave * 0.055 + beams;
  energy *= mix(0.72, 1.0, 1.0 - centerCalm);

  vec3 color = colorRamp(clamp(energy, 0.0, 1.0));
  color += vec3(0.018, 0.095, 0.245) * glassRidge * (0.28 + massLight * 0.46);
  color += vec3(0.026, 0.135, 0.355) * foldedSurface * massLight * 0.20;
  color += vec3(0.055, 0.175, 0.420) * wake * 0.11;

  // Internal edge reflection is intermittent and material-like, not an outline.
  float edgeDistance = min(min(v_uv.x, 1.0 - v_uv.x), min(v_uv.y, 1.0 - v_uv.y));
  float innerEdge = exp(-edgeDistance * 53.0) * smoothstep(0.62, 0.91, field + massLight * 0.18);
  color += vec3(0.04, 0.18, 0.52) * innerEdge * 0.13;

  // Calm the navigation and copy zones while retaining detail at their edges.
  float topMask = 1.0 - smoothstep(0.77, 1.0, v_uv.y) * 0.22;
  color *= topMask;
  color *= 1.0 - centerCalm * 0.13;

  vec2 vignetteUv = (v_uv - 0.5) * vec2(0.88, 1.08);
  float vignette = 1.0 - smoothstep(0.34, 0.79, dot(vignetteUv, vignetteUv));
  color *= mix(0.70, 1.0, vignette);

  // Low-amplitude, slowly changing grain prevents banding without reading as static.
  float grain = hash21(gl_FragCoord.xy + floor(u_time * 6.0) * 19.17) - 0.5;
  color += grain * 0.009;

  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
  `
}

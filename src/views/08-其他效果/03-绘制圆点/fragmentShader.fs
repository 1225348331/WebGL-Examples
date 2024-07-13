#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
  float distance = distance(gl_PointCoord, vec2(0.5f, 0.5f));
  if(distance <= 0.5f) {
    outColor = vec4(1.0f, 1.0f, 0.0f, 1.0f);
  } else {
    // float smooths = 1.0f - smoothstep(0.5f, sqrt(0.5f), distance);
    float smooths = 1.0f - distance / sqrt(0.5f);
    outColor = mix(vec4(0.0f, 0.0f, 0.0f, 1.0f), vec4(1.0f, 1.0f, 0.0f, 1.0f), smooths);
  }
}
#version 300 es
precision mediump float;

uniform float u_Alpha;
out vec4 outColor;
void main() {
  float dist = distance(gl_PointCoord, vec2(0.5f, 0.5f));
  if(dist < 0.5f) {
    outColor = vec4(1.0f, 0.87f, 0.0f, u_Alpha);
  } else {
    discard;
  }
}
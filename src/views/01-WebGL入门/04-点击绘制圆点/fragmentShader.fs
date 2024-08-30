#version 300 es
precision mediump float;

uniform vec2 u_Color;
out vec4 outColor;
void main() {
  float dist = distance(gl_PointCoord, vec2(0.5f, 0.5f));
  if(dist < 0.5f) {
    outColor = vec4(u_Color, 1.0f, 1.0f);
  } else {
    discard;
  }
}
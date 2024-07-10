#version 300 es
precision mediump float;

out vec4 outColor;
uniform vec2 u_Color;

void main() {
  outColor = vec4(u_Color, 1.0f, 1.0f);
}
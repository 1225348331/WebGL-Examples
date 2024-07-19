#version 300 es
precision mediump float;

uniform sampler2D u_screen;
uniform float u_opacity;

in vec2 v_tex_pos;
out vec4 outColor;

void main() {
  vec4 color = texture(u_screen, 1.0f - v_tex_pos);
  // 一个技巧来保证不透明度即使值接近 1.0 也会消失
  // a hack to guarantee opacity fade out even with a value close to 1.0
  outColor = vec4(floor(255.0f * color * u_opacity) / 255.0f);
}
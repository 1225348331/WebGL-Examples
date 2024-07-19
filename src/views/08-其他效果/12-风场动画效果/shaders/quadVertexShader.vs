#version 300 es

in vec2 a_pos;
out vec2 v_tex_pos;

void main() {
  gl_Position = vec4(1.0f - 2.0f * a_pos, 0, 1);
  v_tex_pos = a_pos;
}
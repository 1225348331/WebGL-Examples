#version 300 es

in vec4 a_Position;
out vec2 v_Position;

void main() {
  gl_Position = a_Position;
  v_Position = (a_Position.xy + vec2(1.0f, 1.0f)) / 2.0f;
}
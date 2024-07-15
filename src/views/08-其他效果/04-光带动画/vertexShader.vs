#version 300 es

in vec4 a_Position;
out vec4 v_Position;

void main() {
  gl_Position = a_Position;
  v_Position = a_Position;
}
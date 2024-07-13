#version 300 es

in vec4 a_Position;
in vec4 a_Color;
out vec4 v_Color;

void main() {
  gl_Position = a_Position;
  gl_PointSize = 80.0f;
  v_Color = a_Color;
}
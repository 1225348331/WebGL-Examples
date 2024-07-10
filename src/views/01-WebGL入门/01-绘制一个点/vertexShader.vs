#version 300 es

in vec4 a_Position;
in float a_PointSize;
void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}
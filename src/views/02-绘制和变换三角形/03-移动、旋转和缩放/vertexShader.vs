#version 300 es

in vec4 a_Position;
uniform mat4 u_ModelMatrix;

void main() {
  gl_Position = u_ModelMatrix * a_Position;
}
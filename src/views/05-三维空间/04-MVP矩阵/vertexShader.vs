#version 300 es

in vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
in vec4 a_Color;
out vec4 v_Color;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  v_Color = a_Color;
}
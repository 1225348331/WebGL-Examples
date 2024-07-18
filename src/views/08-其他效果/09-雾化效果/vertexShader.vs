#version 300 es

in vec4 a_Position;
in vec4 a_Color;
in vec4 a_Normal;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
out vec4 v_Position;
out vec4 v_Normal;
out vec4 v_Color;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  v_Position = u_ModelMatrix * a_Position;
  v_Normal = transpose(inverse(u_ModelMatrix)) * a_Normal;
  v_Color = a_Color;
}
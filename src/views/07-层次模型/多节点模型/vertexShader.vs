#version 300 es

in vec4 a_Position;
in vec4 a_Normal;
uniform vec4 u_Color;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
// uniform mat4 u_NormalMatrix;

out vec4 v_Color;
out vec4 v_Normal;
out vec4 v_Position;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  v_Position = u_ModelMatrix * a_Position;
  mat4 nomalMatrix = transpose(inverse(u_ModelMatrix));
  v_Normal = normalize(nomalMatrix * a_Normal);
  v_Color = u_Color;
}
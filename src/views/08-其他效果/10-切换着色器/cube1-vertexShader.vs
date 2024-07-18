#version 300 es

in vec4 position;
in vec4 normal;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;

out vec4 v_Normal;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * position;
  v_Normal = transpose(inverse(u_ModelMatrix)) * normal;
}
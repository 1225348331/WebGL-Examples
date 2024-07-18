#version 300 es 

uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
in vec4 position;
in vec2 texcoord;
out vec2 v_TexCoord;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * position;
  v_TexCoord = texcoord;
}
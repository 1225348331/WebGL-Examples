#version 300 es

in vec4 a_Position;
in vec2 a_TexCoord;
in float a_Face;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
out vec2 v_TexCoord;
out float v_Face;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  v_TexCoord = a_TexCoord;
  v_Face = a_Face;
}
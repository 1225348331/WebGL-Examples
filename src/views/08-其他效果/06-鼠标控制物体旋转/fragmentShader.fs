#version 300 es
precision mediump float;

in vec2 v_TexCoord;
uniform sampler2D u_Texture;
out vec4 outColor;

void main() {
  outColor = texture(u_Texture, v_TexCoord);
}
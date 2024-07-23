#version 300 es
precision mediump float;

uniform sampler2D u_Texture;
in vec2 v_TexCoord;
out vec4 outColor;

void main() {
  outColor = texture(u_Texture, v_TexCoord);
}
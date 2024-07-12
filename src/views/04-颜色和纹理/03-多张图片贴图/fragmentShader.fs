#version 300 es
precision mediump float;

in vec2 v_TexCoord;
uniform sampler2D u_Texture1;
uniform sampler2D u_Texture2;
out vec4 outColor;

void main() {
  vec4 color1 = texture(u_Texture1, v_TexCoord);
  vec4 color2 = texture(u_Texture2, v_TexCoord);
  outColor = mix(color1, color2, 0.5f);
}
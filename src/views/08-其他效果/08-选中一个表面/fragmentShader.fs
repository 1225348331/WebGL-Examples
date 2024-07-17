#version 300 es
precision mediump float;

in vec2 v_TexCoord;
in float v_Face;
uniform int u_PickedFace;
uniform sampler2D u_Texture;
out vec4 outColor;

void main() {
  int face = int(v_Face);
  // outColor = texture(u_Texture, v_TexCoord);
  outColor = (face == u_PickedFace) ? vec4(1.0f) : texture(u_Texture, v_TexCoord);
  if(u_PickedFace == 0) {
    outColor.w = v_Face / 255.0f;
  } else {
    outColor.w = 1.0;
    // outColor = vec4(1.0f, 1.0f, 1.0f, 1.0f);
  }

}
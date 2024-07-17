#version 300 es

in vec4 a_Position;

in float a_Face;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform int u_PickedFace;
out vec4 v_Color;


void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  vec4 a_Color = vec4(1.0f, 0.0f, 1.0f, 1.0f);
  vec4 pickColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);
  int face = int(a_Face);
  vec3 color = (face == u_PickedFace) ? pickColor.rgb : a_Color.rgb;
  if(u_PickedFace == 0) {
    v_Color = vec4(color, a_Face / 255.0f);
  } else {
    v_Color = vec4(color, 1.0f);
  }
}
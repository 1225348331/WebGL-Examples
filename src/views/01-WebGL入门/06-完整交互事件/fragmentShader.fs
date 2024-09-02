#version 300 es
precision mediump float;

in float v_Alpha;
out vec4 outColor;
void main() {
  float dist = distance(gl_PointCoord, vec2(0.5f, 0.5f));
  if(dist < 0.5f) {
    outColor = vec4(1.0f, 0.87f, 0.0f, v_Alpha);
  } else {
    discard;
  }
}
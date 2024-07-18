#version 300 es
precision mediump float;

in vec4 v_Normal;
out vec4 OutColor;

void main() {
  vec4 color = vec4(1.0f, 1.0f, 0.0f, 1.0f);
  vec4 lightColor = vec4(0.0f, 1.0f, 0.0f, 1.0f);
  vec4 lightDirection = vec4(-0.5f, 3.0f, 4.0f, 1.0f);
  vec4 diffuse = color * lightColor * max(dot(normalize(lightDirection), normalize(v_Normal)), 0.0f);
  OutColor = vec4(diffuse.rgb, 1.0f);
}
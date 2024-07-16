#version 300 es
precision highp float;
in vec4 v_Color;
in vec4 v_Normal;
in vec4 v_Position;
uniform vec4 u_LightColor;
uniform vec4 u_LightPosition;
uniform vec4 u_AmbientColor;

out vec4 outColor;

void main() {
  vec4 diffuse = u_LightColor * v_Color * max(dot(normalize(u_LightPosition - v_Position), normalize(v_Normal)), 0.0f);
  vec4 ambient = u_AmbientColor * v_Color;
  outColor = vec4(vec3(diffuse + ambient), v_Color.a);
}

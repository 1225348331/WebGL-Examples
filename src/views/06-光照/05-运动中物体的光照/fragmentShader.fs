#version 300 es
precision mediump float;

in vec4 v_Color;
in vec4 v_Position;
in vec4 v_Normal;
out vec4 outColor;
uniform vec4 u_LightPosition; // 点光源坐标
uniform vec4 u_LightColor; // 点光源颜色
uniform vec4 u_AmbientColor; // 环境光颜色

void main() {
  // 漫反射颜色
  vec4 diffuse = v_Color * u_LightColor * max(dot(normalize(v_Normal), normalize(u_LightPosition - v_Position)), 0.0f);
  // 环境光颜色
  vec4 ambient = u_AmbientColor * v_Color;
  outColor = vec4(vec3(diffuse + ambient), v_Color.a);
}
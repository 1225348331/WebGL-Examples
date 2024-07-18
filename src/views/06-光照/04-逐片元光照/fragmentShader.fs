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
  vec4 diffuse = v_Color * u_LightColor * max(dot(normalize(u_LightPosition - v_Position), normalize(v_Normal)), 0.0f);
  vec4 ambient = u_AmbientColor * v_Color;
  outColor = vec4(vec3(diffuse + ambient), v_Color.a);
}
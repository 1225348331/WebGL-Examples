#version 300 es
precision mediump float;

in vec4 v_Position;
in vec4 v_Normal;
in vec4 v_Color;

uniform vec4 u_LightColor; // 点光源颜色
uniform vec4 u_LightPosition; // 点光源位置
uniform vec4 u_AmbientColor; // 环境光颜色
uniform vec4 u_EyePosition; // 视点坐标
uniform vec2 u_Dist; // 视点距离
uniform vec4 u_FogColor; // 雾颜色
out vec4 outColor;

void main() {
  // 点光源
  vec4 diffuse = v_Color * u_LightColor * max(dot(normalize(u_LightPosition - v_Position), normalize(v_Normal)), 0.0f);
  // 环境光
  vec4 ambient = v_Color * u_AmbientColor;
  // 雾化因子
  float fogFactor = clamp((u_Dist.y - distance(v_Position, u_EyePosition)) / (u_Dist.y - u_Dist.x), 0.0f, 1.0f);
  // 光颜色
  outColor = vec4(vec3(diffuse + ambient), v_Color.a);
  // 最终颜色
  outColor = mix(u_FogColor, v_Color, fogFactor);
}
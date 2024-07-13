#version 300 es

uniform mat4 u_ModelMatrix; // 模型矩阵
uniform mat4 u_ViewMatrix; // 视图矩阵
uniform mat4 u_ProjMatrix; // 投影矩阵
in vec4 a_Position; // 点坐标
in vec4 a_Normal; // 点法线向量
in vec4 a_Color; // 点颜色
uniform vec4 u_LightPosition; // 点光源坐标
uniform vec4 u_LightColor; // 点光源颜色
uniform vec4 u_AmbientColor; // 环境光颜色

out vec4 v_Color;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  // 漫反射颜色
  vec4 diffuse = u_LightColor * a_Color * max(dot(normalize(a_Normal), normalize(u_LightPosition - a_Position)), 0.0f);
  // 环境光颜色
  vec4 ambient = u_AmbientColor * a_Color;
  // 最终颜色
  v_Color = vec4(vec3(diffuse + ambient), a_Color.a);
}
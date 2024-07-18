#version 300 es

uniform mat4 u_ModelMatrix; // 模型矩阵
uniform mat4 u_ViewMatrix; // 视图矩阵
uniform mat4 u_ProjMatrix; // 投影矩阵
in vec4 a_Position; // 点坐标
in vec4 a_Normal; // 点法线向量
in vec4 a_Color; // 点颜色

out vec4 v_Position;
out vec4 v_Normal;
out vec4 v_Color;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  v_Position = u_ModelMatrix * a_Position;
  v_Normal = normalize(transpose(inverse(u_ModelMatrix)) * a_Normal);
  v_Color = a_Color;
}
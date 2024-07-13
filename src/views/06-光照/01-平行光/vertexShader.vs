#version 300 es

uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
in vec4 a_Position; // 点坐标
in vec4 a_Color; // 点颜色
in vec4 a_Normal; // 点法向量
uniform vec4 u_LightColor; // 平行光颜色
uniform vec4 u_LightDirection; // 平行光方向

out vec4 v_Color;

void main() {
  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  v_Color = u_LightColor * a_Color * max(dot(normalize(u_LightDirection), normalize(a_Normal)), 0.0f);
  v_Color = vec4(vec3(v_Color), a_Color.a);
}
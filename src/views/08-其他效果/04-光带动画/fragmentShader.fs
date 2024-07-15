#version 300 es
precision highp float;

uniform float u_Resolution; // canvas分辨率（宽 高）
uniform float u_Time; // 时间
uniform float u_Speed; // 光带动画速度
uniform vec4 u_Color; // 光带颜色
uniform float u_Width; // 光带宽度
in vec4 v_Position;

out vec4 outColor;

void main() {
  float coordX = u_Time * u_Speed / u_Resolution - 0.5f;
  if(v_Position.x >= coordX - u_Width / 2.0f && v_Position.x <= coordX + u_Width / 2.0f) {
    float opacity = smoothstep(-u_Width, u_Width, coordX - v_Position.x);
    // float opacity = 1.0f - u_Time * u_Speed / u_Resolution;
    outColor = vec4(u_Color.xyz, opacity);

  } else {
    outColor = vec4(0.0f, 0.0f, 0.0f, 0.0f);
  }
}

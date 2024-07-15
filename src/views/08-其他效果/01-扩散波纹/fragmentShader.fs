#version 300 es
precision highp float;

uniform float u_Resolution; // canvas分辨率（宽 高）
uniform float u_Time; // 时间
uniform float u_Speed; // 扩散速度
uniform float u_Number; // 扩散波纹数量
uniform vec4 u_Color; // 扩散波颜色
uniform float u_Width; // 扩散波纹宽度

out vec4 outColor;

void main() {
  float dist = distance(vec2(gl_FragCoord.x / u_Resolution, gl_FragCoord.y / u_Resolution), vec2(0.5f, 0.5f));
  float ratio = mod(u_Time * u_Speed - dist * u_Resolution, u_Resolution / u_Number);
  if(ratio > 0.0f && ratio <= u_Width * u_Resolution / u_Number) {
    float opacity = 0.5f - dist;
    outColor = vec4(u_Color.xyz, opacity * 2.0f);
  } else {
    outColor = vec4(0.0f, 0.0f, 0.0f, 0.0f);
  }
}

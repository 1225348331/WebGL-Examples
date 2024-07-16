#version 300 es
precision highp float;

uniform float u_Resolution; // canvas分辨率（宽 高）
uniform float u_Time; // 时间
uniform float u_SnowflakeAmount; // 雪花数量
uniform float u_BlizardFactor; // 暴风雪因子
uniform float u_Speed; // 下雪速度

out vec4 outColor;
float rnd(float x) {
  return fract(sin(dot(vec2(x + 47.49f, 38.2467f / (x + 2.3f)), vec2(12.9898f, 78.233f))) * (43758.5453f));
}

float drawCircle(vec2 center, float radius, vec2 uv) {
  return 1.0f - smoothstep(0.0f, radius, length(uv - center));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_Resolution;
  outColor = vec4(0.808f, 0.89f, 0.918f, 1.0f);
  float j;
  for(float i = 0.0f; i < u_SnowflakeAmount; i++) {
    j = float(i);
    float speed = 0.3f + rnd(cos(j)) * (0.7f + 0.5f * cos(j / (float(u_SnowflakeAmount) * 0.25f)));
    vec2 center = vec2((0.25f - uv.y) * u_BlizardFactor + rnd(j) + 0.1f * cos(u_Speed * u_Time + sin(j)), mod(sin(j) - speed * (u_Speed * u_Time * 1.5f * (0.1f + u_BlizardFactor)), 1.0f));
    outColor += vec4(0.09f * drawCircle(center, 0.001f + speed * 0.012f, uv));
  }

}

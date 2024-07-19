#version 300 es
precision mediump float;

uniform sampler2D u_wind;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform sampler2D u_color_ramp;
in vec2 v_particle_pos;

out vec4 outColor;

void main() {
  // 速度
  vec2 velocity = mix(u_wind_min, u_wind_max, texture(u_wind, v_particle_pos).rg);
  float speed_t = length(velocity) / length(u_wind_max);
  // color ramp is encoded in a 16x16 texture 颜色渐变被编码在16 * 16的纹理中
  vec2 ramp_pos = vec2(fract(16.0f * speed_t), floor(16.0f * speed_t) / 16.0f);
  outColor = texture(u_color_ramp, ramp_pos);
}
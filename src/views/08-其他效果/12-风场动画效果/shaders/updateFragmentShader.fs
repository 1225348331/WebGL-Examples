#version 300 es
precision mediump float;

uniform sampler2D u_particles;
uniform sampler2D u_wind;
uniform vec2 u_wind_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform float u_rand_seed;
uniform float u_speed_factor;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;

in vec2 v_tex_pos;
out vec4 outColor;

// 伪随机数发生器
// pseudo-random generator
const vec3 rand_constants = vec3(12.9898f, 78.233f, 4375.85453f);
float rand(const vec2 co) {
  float t = dot(rand_constants.xy, co);
  return fract(sin(t) * (rand_constants.z + t));
}
// 风速查询；使用基于 4 个相邻像素的手动双线性过滤进行平滑插值
// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
vec2 lookup_wind(const vec2 uv) {
  // 返回texture(u_wind, uv).rg; // 低分辨率硬件过滤
  // return texture(u_wind, uv).rg; // lower-res hardware filtering
  vec2 px = 1.0f / u_wind_res;
  vec2 vc = (floor(uv * u_wind_res)) * px;
  vec2 f = fract(uv * u_wind_res);
  vec2 tl = texture(u_wind, vc).rg;
  vec2 tr = texture(u_wind, vc + vec2(px.x, 0)).rg;
  vec2 bl = texture(u_wind, vc + vec2(0, px.y)).rg;
  vec2 br = texture(u_wind, vc + px).rg;
  return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main() {
  vec4 color = texture(u_particles, v_tex_pos);
  vec2 pos = vec2(color.r / 255.0f + color.b, color.g / 255.0f + color.a); // decode particle position from pixel RGBA

  vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
  float speed_t = length(velocity) / length(u_wind_max);

  // take EPSG:4236 distortion into account for calculating where the particle moved
  float distortion = cos(radians(pos.y * 180.0f - 90.0f));
  vec2 offset = vec2(velocity.x / distortion, -velocity.y) * 0.0001f * u_speed_factor;

  // update particle position, wrapping around the date line
  pos = fract(1.0f + pos + offset);

  // a random seed to use for the particle drop
  vec2 seed = (pos + v_tex_pos) * u_rand_seed;

  // drop rate is a chance a particle will restart at random position, to avoid degeneration
  float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
  float drop = step(1.0f - drop_rate, rand(seed));

  vec2 random_pos = vec2(rand(seed + 1.3f), rand(seed + 2.1f));
  pos = mix(pos, random_pos, drop);

  // encode the new particle position back into RGBA
  outColor = vec4(fract(pos * 255.0f), floor(pos * 255.0f) / 255.0f);
}
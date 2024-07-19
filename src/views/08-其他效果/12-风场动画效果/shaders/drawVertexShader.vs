#version 300 es

in float a_index;
uniform sampler2D u_particles;
uniform float u_particles_res;

out vec2 v_particle_pos;

void main() {
  vec4 color = texture(u_particles, vec2(fract(a_index / u_particles_res), floor(a_index / u_particles_res) / u_particles_res));
  v_particle_pos = vec2(color.r / 255.0f + color.b, color.g / 255.0f + color.a);
  gl_Position = vec4(2.0f * v_particle_pos.x - 1.0f, 1.0f - 2.0f * v_particle_pos.y, 0, 1);
  gl_PointSize = 1.0f;
}
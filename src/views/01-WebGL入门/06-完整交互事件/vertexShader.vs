#version 300 es

in vec3 a_Position;
out float v_Alpha;

void main() {
  gl_Position = vec4(a_Position.x, a_Position.y, 0.0f, 1.0f);
  gl_PointSize = 20.0f;
  v_Alpha = a_Position.z;
}
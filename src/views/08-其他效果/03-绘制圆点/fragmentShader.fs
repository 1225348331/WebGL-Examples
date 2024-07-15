#version 300 es
precision highp float;

in vec4 v_Color;
out vec4 outColor;

void main() {
  float distance = distance(gl_PointCoord, vec2(0.5f, 0.5f));
  float alpha = smoothstep(0.48f, 0.52f, distance); // 使用 smoothstep 函数进行平滑过渡
  outColor = mix(v_Color, vec4(0.0f, 0.0f, 0.0f, 0.0f), alpha);
}
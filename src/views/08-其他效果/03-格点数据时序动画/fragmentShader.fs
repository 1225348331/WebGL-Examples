#version 300 es
precision mediump float;
precision mediump sampler2DArray;

in vec2 v_Position; // 纹理坐标
uniform sampler2DArray u_TextureArray; // 纹理数组
uniform float u_CurrentIndex; // 当前播放动画的纹理序号
uniform float u_Time; // 时序时间
struct clampColor {
  float stop;
  vec4 color;
};
uniform clampColor clampColors[10];
out vec4 outColor;

void main() {
  float val1 = texture(u_TextureArray, vec3(v_Position, u_CurrentIndex)).r;
  float val2 = texture(u_TextureArray, vec3(v_Position, u_CurrentIndex + 1.0f)).r;
  float val = mix(val1, val2, u_Time);
  for(int i = 1; i < 10; i++) {
    if(val >= clampColors[i - 1].stop && val < clampColors[i].stop) {
      outColor = clampColors[i].color;
      break;
    }
  }

}
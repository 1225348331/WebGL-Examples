#version 300 es
precision mediump float;

in vec2 v_Position; // 纹理坐标
uniform sampler2D u_Texture; // 纹理
uniform sampler2D u_ColorTexture; // 渐变色颜色纹理
uniform bool u_IsStep; // 是否分级渲染
struct clampColor {
  float stop;
  vec4 color;
};
// 分级色带数据
uniform clampColor clampColors[10];
out vec4 outColor;

void main() {
  float val = texture(u_Texture, v_Position).r;
  if(u_IsStep) {
    for(int i = 1; i < 10; i++) {
      if(val >= clampColors[i - 1].stop && val < clampColors[i].stop) {
        outColor = clampColors[i].color;
        break;
      }
    }
  } else {
    outColor = texture(u_ColorTexture, vec2(val, 0.5f));
  }
}
#version 300 es
precision mediump float; // Указываем точность для float

in vec2 position;
out vec2 vUV;

void main() {
    vUV = (position + 1.0) * 0.5; // [-1,1] → [0,1]
    gl_Position = vec4(position, 0.0, 1.0);
}

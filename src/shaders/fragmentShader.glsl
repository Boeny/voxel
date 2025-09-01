#version 300 es
precision mediump float; // Указываем точность для float
precision mediump sampler2D; // Указываем точность для sampler2D

in vec2 vUV;
out vec4 outColor;

uniform sampler2D pixelTexture;

void main() {
    vec4 texColor = texture(pixelTexture, vUV);

    // Просто выводим
    outColor = texColor;
}

#version 300 es
precision mediump float; // Указываем точность для float
precision mediump sampler2D; // Указываем точность для sampler2D

in vec2 vUV;
out vec4 outColor;

uniform sampler2D pixelTexture;
uniform float ratio;
uniform float x;

void main() {
    vec4 texColor = texture(pixelTexture, vUV);

    float radius = 0.4;

    vec2 delta_center = vUV - vec2(x, 0.5);
    delta_center.y = delta_center.y / ratio;

    float red = 1.0 - length(delta_center) / radius;

    outColor = vec4(red * texColor.r, 0, 0, 1);
}

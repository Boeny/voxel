#version 300 es
precision mediump float; // Указываем точность для float
precision mediump sampler2D; // Указываем точность для sampler2D

in vec2 vUV; // [0,1]
out vec4 outColor;

uniform sampler2D pixelTexture;
uniform float ratio;
uniform float x;

void main() {
    vec4 texColor = texture(pixelTexture, vUV);

    vec2 delta_center = vUV - vec2(x, 0.5); // [-x,1-x] / [-0.5,0.5]
    delta_center.y = delta_center.y / ratio;

    float delta_len = length(delta_center);
    float brightness = 0.1 / delta_len;
    vec2 direction = delta_center / delta_len + 1.0; // [0,1]

    outColor = vec4(brightness * direction * texColor.r, 0, 1); // [0,1]
}

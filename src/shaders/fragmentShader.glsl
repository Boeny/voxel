#version 300 es
precision mediump float; // Указываем точность для float
precision mediump sampler3D;  // Указываем точность для sampler3D

uniform vec2 resolution;
uniform float time;
uniform sampler3D voxelTexture;

out vec4 outColor;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    // Простая визуализация — вычисляем цвет по координатам
    vec3 voxelPos = vec3(uv, time);
    vec4 voxelValue = texture(voxelTexture, voxelPos);

    outColor = voxelValue;
}

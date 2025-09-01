#version 300 es
precision mediump float; // Указываем точность для float

in vec3 position;
void main() {
    gl_Position = vec4(position, 1.0);
}

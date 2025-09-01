import vertexShaderSrc from './shaders/vertexShader.glsl';
import fragmentShaderSrc from './shaders/fragmentShader.glsl';
import { compileShader, createContext, attachShaders } from './utils';

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight

const context = createContext('voxelCanvas', screenWidth, screenHeight);
const program = context.createProgram();

attachShaders(context, program, [
    compileShader(context, vertexShaderSrc, context.VERTEX_SHADER),
    compileShader(context, fragmentShaderSrc, context.FRAGMENT_SHADER),
]);

context.linkProgram(program);
if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    console.error('Error linking program:', context.getProgramInfoLog(program));
}
context.useProgram(program);

// Создаем буфер для вершин
const positionBuffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

// Вершины для отрисовки всей поверхности
const positions = [
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
];
context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);

// Привязываем атрибуты
const positionAttributeLocation = context.getAttribLocation(program, 'position');
context.enableVertexAttribArray(positionAttributeLocation);
context.vertexAttribPointer(positionAttributeLocation, 3, context.FLOAT, false, 0, 0);

// Функция для создания текстуры вокселей
function createVoxelTexture() {
    const size = 32; // 32x32x32 вокселей
    const data = new Uint8Array(size * size * size * 4); // RGBA текстура

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                const index = (x + size * (y + size * z)) * 4;
                data[index] = Math.random() * 255;     // R
                data[index + 1] = Math.random() * 255; // G
                data[index + 2] = Math.random() * 255; // B
                data[index + 3] = 255;                 // A
            }
        }
    }

    const texture = context.createTexture();
    context.bindTexture(context.TEXTURE_3D, texture);
    context.texImage3D(context.TEXTURE_3D, 0, context.RGBA, size, size, size, 0, context.RGBA, context.UNSIGNED_BYTE, data);
    context.texParameteri(context.TEXTURE_3D, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.texParameteri(context.TEXTURE_3D, context.TEXTURE_MAG_FILTER, context.NEAREST);

    return texture;
}

const voxelTexture = createVoxelTexture();

// Привязываем текстуру к юниформу
const voxelTextureLocation = context.getUniformLocation(program, 'voxelTexture');
context.activeTexture(context.TEXTURE0);
context.bindTexture(context.TEXTURE_3D, voxelTexture);
context.uniform1i(voxelTextureLocation, 0);

// Привязываем разрешение экрана
const resolutionLocation = context.getUniformLocation(program, 'resolution');
context.uniform2f(resolutionLocation, screenWidth, screenHeight);

// Анимация
function animate(time) {
    time *= 0.001; // Преобразуем в секунды
    context.uniform1f(context.getUniformLocation(program, 'time'), time);
    context.clear(context.COLOR_BUFFER_BIT);
    context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(animate);
}

animate();

import vertexShaderSrc from './shaders/vertexShader.glsl';
import fragmentShaderSrc from './shaders/fragmentShader.glsl';
import { compileShader, createContext, attachShaders, createTexture, animate } from './utils';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const pixelSize = 5;
const CANVAS_ID = 'voxelCanvas';

const context = createContext(CANVAS_ID, screenWidth, screenHeight);
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
const vertices = new Float32Array([
    // первый треугольник
    -1.0, -1.0,  // нижний левый
    1.0, -1.0,  // нижний правый
    -1.0,  1.0,  // верхний левый
    // второй треугольник
    -1.0,  1.0,  // верхний левый
    1.0, -1.0,  // нижний правый
    1.0,  1.0   // верхний правый
]);
context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

// Привязываем атрибуты
const positionAttributeLocation = context.getAttribLocation(program, 'position');
context.enableVertexAttribArray(positionAttributeLocation);
context.vertexAttribPointer(positionAttributeLocation, 2, context.FLOAT, false, 0, 0);

const width = Math.floor(screenWidth / pixelSize);
const height = Math.floor(screenHeight / pixelSize);

const data = new Uint8Array(width * height * 4); // RGBA текстура
for (let i = 0; i < data.length; i++) {
    data[i] = 255;
}

function setPixel(data, x, y, color) {
    const index = (Math.floor(y) * width + Math.floor(x)) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = 255;
}

createTexture(context, width, height, data);
context.uniform1i(context.getUniformLocation(program, 'pixelTexture'), 0);
context.uniform1f(context.getUniformLocation(program, 'ratio'), width / height);

context.viewport(0, 0, screenWidth, screenHeight);
//context.clear(context.COLOR_BUFFER_BIT);

const speed = 20;
const freq = 5;
let oldTime = 0;

animate((time) => {
    const x = width / 2 + speed * Math.sin(time * freq);
    setPixel(data, width / 2 + speed * Math.sin(oldTime * freq),  height/2, [255,255,255]);
    setPixel(data, x, height/2, [0,0,0]);
    oldTime = time;

    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, width, height, 0, context.RGBA, context.UNSIGNED_BYTE, data);
    context.uniform1f(context.getUniformLocation(program, 'x'), x / width);

    context.drawArrays(context.TRIANGLES, 0, 6);
});

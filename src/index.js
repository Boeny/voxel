import vertexShaderSrc from './shaders/vertexShader.glsl';
import fragmentShaderSrc from './shaders/fragmentShader.glsl';
import { compileShader, createContext, attachShaders, createTexture } from './utils';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const pixelSize = 10;


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
const vertices = new Float32Array([
  -1.0, -1.0,  // нижний левый
   1.0, -1.0,  // нижний правый
  -1.0,  1.0,  // верхний левый
  -1.0,  1.0,  // верхний левый
   1.0, -1.0,  // нижний правый
   1.0,  1.0   // верхний правый
]);
context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

// Привязываем атрибуты
const positionAttributeLocation = context.getAttribLocation(program, 'position');
context.enableVertexAttribArray(positionAttributeLocation);
context.vertexAttribPointer(positionAttributeLocation, 2, context.FLOAT, false, 0, 0);

// Анимация
function animate(time) {
    //time *= 0.001; // Преобразуем в секунды
    context.viewport(0, 0, screenWidth, screenHeight);
    context.clear(context.COLOR_BUFFER_BIT);

    createTexture(context, Math.floor(screenWidth / pixelSize), Math.floor(screenHeight / pixelSize));
    context.uniform1i(context.getUniformLocation(program, 'pixelSize'), pixelSize);
    context.uniform1i(context.getUniformLocation(program, 'pixelTexture'), 0);
    context.uniform2f(context.getUniformLocation(program, 'resolution'), screenWidth, screenHeight);

    context.drawArrays(context.TRIANGLES, 0, 6);
    requestAnimationFrame(animate);
}

animate();

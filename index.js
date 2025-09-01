import vertexShaderSrc from './vertexShader.glsl';
import fragmentShaderSrc from './fragmentShader.glsl';

const canvas = document.getElementById('voxelCanvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    console.error('WebGL 2.0 not available');
    alert('WebGL 2.0 is not supported by your browser!');
    throw new Error('WebGL 2.0 not supported');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Компилируем шейдеры
function compileShader(src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

// Создаем программу WebGL
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program:', gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Создаем буфер для вершин
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Вершины для отрисовки всей поверхности
const positions = [
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Привязываем атрибуты
const positionAttributeLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

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

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, size, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}

const voxelTexture = createVoxelTexture();

// Привязываем текстуру к юниформу
const voxelTextureLocation = gl.getUniformLocation(program, 'voxelTexture');
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_3D, voxelTexture);
gl.uniform1i(voxelTextureLocation, 0);

// Привязываем разрешение экрана
const resolutionLocation = gl.getUniformLocation(program, 'resolution');
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Анимация
function animate(time) {
    time *= 0.001; // Преобразуем в секунды
    gl.uniform1f(gl.getUniformLocation(program, 'time'), time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(animate);
}

animate();

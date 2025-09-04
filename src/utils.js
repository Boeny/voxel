export function createContext(id, width, height) {
    const canvas = document.getElementById(id);
    const context = canvas.getContext('webgl2');

    if (!context) {
        console.error('WebGL 2.0 not available');
        alert('WebGL 2.0 is not supported by your browser!');
        throw new Error('WebGL 2.0 not supported');
    }

    canvas.width = width;
    canvas.height = height;

    return context;
}

export function compileShader(context, src, type) {
    const shader = context.createShader(type);
    context.shaderSource(shader, src);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.error('Error compiling shader:', context.getShaderInfoLog(shader));
        context.deleteShader(shader);
        return null;
    }

    return shader;
}

export function attachShaders(context, program, shaders) {
    shaders.forEach((shader) => {
        context.attachShader(program, shader);
    })
}

export function createTexture(context, width, height, data) {
    const texture = context.createTexture();
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, texture);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, width, height, 0, context.RGBA, context.UNSIGNED_BYTE, data);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
}

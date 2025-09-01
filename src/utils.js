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

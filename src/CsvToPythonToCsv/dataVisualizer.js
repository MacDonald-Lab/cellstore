const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

//If no data is entered this alert can be displayed
alert(`No Data to display`)

//creates vertex data for graph
const vertexData = [
    -1, 1, 0,
    -1, -1, 0,
    -1, -1, 0,
    1, -1, 0,
];

//buffer for gpu
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

//vertex data into buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

//create and compile vertex and fragment shader 
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1);
    //gl_PointSize = 10.0;
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
}
`);
gl.compileShader(fragmentShader);

//create program 
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//enable attributes
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

//draw
gl.useProgram(program);
gl.drawArrays(gl.LINES, 0, 4);

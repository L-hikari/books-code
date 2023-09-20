const baseUrl = '/shader_glsl/02';

async function loadShaderFile() {
  let vShader = await fetch(baseUrl + '/first_vertex.vert');
  let fShader = await fetch(baseUrl + '/first_fragment.frag');

  vShader = await vShader.text();
  fShader = await fShader.text();

  main(vShader, fShader);
}


function main(VSHADER_SOURCE, FSHADER_SOURCE) {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  var gl2 = getWebGLContext(canvas);
  if (!gl2) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl2, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl, gl2);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl, gl2) {
  var vertices = new Float32Array([
    1.0, 1.0,   -1.0, 1.0,   -1.0, -1.0
  ]);

  const colors = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
  ]);

  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  document.getElementById('change-btn').addEventListener('click', function () {
    var vertices = new Float32Array([
      1.0, 0.5,   -1.0, 0.5,   -1.0, -0.5
    ]);
    console.log(vertices);

    var a_Position = gl2.getAttribLocation(gl2.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    
    // var vertexBuffer = gl.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, vertexBuffer);
    gl2.bufferData(gl2.ARRAY_BUFFER, vertices, gl2.STATIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl2.vertexAttribPointer(a_Position, 2, gl2.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl2.enableVertexAttribArray(a_Position);
  

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    gl2.drawArrays(gl.POINTS, 0, 3);
  });

  // Create a buffer object
  var colorBuffer = gl.createBuffer();
  if (!colorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Color);

  return n;
}
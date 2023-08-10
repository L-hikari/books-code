const baseUrl = '/shader_glsl/03';

async function loadShaderFile() {
  let vShader = await fetch(baseUrl + '/texture.vert');
  let fShader = await fetch(baseUrl + '/brightness.frag');

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

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  initTextures(gl, n);
}

function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -1.0,  1.0,   0.0, 1.0,
    -1.0, -1.0,   0.0, 0.0,
     1.0,  1.0,   1.0, 1.0,
     1.0, -1.0,   1.0, 0.0,
  ]);

  var n = 4; // The number of vertices

  // Create a buffer object
  var vertexTexBuffer = gl.createBuffer();
  if (!vertexTexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  const a_Uv = gl.getAttribLocation(gl.program, 'a_Uv');
  if (a_Uv < 0) {
    console.log('Failed to get the storage location of a_Uv');
    return -1;
  }

  gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_Uv);

  return n;
}

function initTextures(gl, n) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  const u_ParrotTex = gl.getUniformLocation(gl.program, 'u_ParrotTex');
  if (!u_ParrotTex) {
    console.log('Failed to get the storage location of u_ParrotTex');
    return false;
  }

  const u_brightness = gl.getUniformLocation(gl.program, 'u_brightness');
  if (!u_brightness) {
    console.log('Failed to get the storage location of u_brightness');
    return false;
  }

  const image = new Image();
  image.src = '../../webgl-examples/resources/sky.jpg';
  image.onload = function() {

    // 不通过webgl反转图片，在顶点着色器处理
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_ParrotTex, 0);
    gl.uniform1f(u_brightness, 0.8);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the rectangle
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

  }

  // return textureUnit;
}

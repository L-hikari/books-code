const baseUrl = '/shader_glsl/04';

async function loadShaderFile() {
  let vShader = await fetch(baseUrl + '/passthrough.vert');
  let fShader = await fetch(baseUrl + '/alphaTest.frag');

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
  var verticesTexCoords = buildMesh(0.25, 0.5, {x: 0.0, y: 0.15, z: 0.0});
  console.log(verticesTexCoords);

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

  var pos = gl.getAttribLocation(gl.program, 'pos');
  if (pos < 0) {
    console.log('Failed to get the storage location of pos');
    return -1;
  }
  // Assign the buffer object to pos variable
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, FSIZE * 5, 0);

  // Enable the assignment to pos variable
  gl.enableVertexAttribArray(pos);

  const uv = gl.getAttribLocation(gl.program, 'uv');
  if (uv < 0) {
    console.log('Failed to get the storage location of uv');
    return -1;
  }

  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(uv);

  return n;
}

function initTextures(gl, n) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  const greenMan = gl.getUniformLocation(gl.program, 'greenMan');
  if (!greenMan) {
    console.log('Failed to get the storage location of greenMan');
    return false;
  }

  const image = new Image();
  image.src = './assets/alien1.png';
  image.onload = function() {

    // 不通过webgl反转图片，在顶点着色器处理
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(greenMan, 0);
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the rectangle
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

  }

  // return textureUnit;
}

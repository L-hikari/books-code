const baseUrl = '/shader_glsl/04';

async function loadShaderFile() {
  let vShader = await fetch(baseUrl + '/passthrough.vert');
  let fShader = await fetch(baseUrl + '/alphaTest.frag');

  vShader = await vShader.text();
  fShader = await fShader.text();

  main(vShader, fShader);
}

let buffer1;
let buffer2;
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

  const p1 = new Promise((resolve, reject) => {
    const image1 = new Image();
    image1.src = './assets/forest.png';
    image1.onload = function () {
      resolve(image1)
    };
  });
  
  const p2 = new Promise((resolve, reject) => {
    const image2 = new Image();
    image2.src = './assets/alien.png';
    image2.onload = function () {
      resolve(image2);
    };
  });
  
  Promise.all([p1, p2])
  .then(([image1, image2]) => {
    // initArrayBuffer(gl, image1, image2);
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);
  
    // // Draw the rectangle
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
    draw1(gl, image1);
    draw2(gl, image2);
  });

}


/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {HTMLImageElement} image1 
 * @param {HTMLImageElement} image2 
 * @returns 
 */
function initArrayBuffer(gl, image1, image2) {

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // buildMesh(1.0, 1.0, {x: 0.0, y: 0.0, z: -0.5});
  const verticesTexCoords = new Float32Array([
    // forest
    -1, 1, -0.5, 0, 1,
    -1, -1, -0.5, 0, 0,
    1, 1, -0.5, 1, 1,
    -1, -1, -0.5, 0, 0,
    1, -1, -0.5, 1, 0,
    1, 1, -0.5, 1, 1,
    // green man
    // -0.5, 0.5, 0, 0, 1,
    // -0.5, -0.5, 0, 0, 0,
    // 0.5, 0.5, 0, 1, 1,
    // -0.5, -0.5, 0, 0, 0,
    // 0.5, -0.5, 0, 1, 0,
    // 0.5, 0.5, 0, 1, 1,
  ]);

  const pos = gl.getAttribLocation(gl.program, 'pos');
  if (pos < 0) {
    console.log('Failed to get the storage location of pos');
    return -1;
  }

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(pos);

  const uv = gl.getAttribLocation(gl.program, 'uv');
  if (uv < 0) {
    console.log('Failed to get the storage location of uv');
    return -1;
  }

  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(uv);

  const texture1 = gl.createTexture();
  if (!texture1) {
    console.log('Failed to create the texture1 object');
    return false;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);

  const forest = gl.getUniformLocation(gl.program, 'forest');
  if (!forest) {
    console.log('Failed to get the storage location of forest');
    return false;
  }

  gl.uniform1i(forest, 0);

  const texture2 = gl.createTexture();
  if (!texture2) {
    console.log('Failed to create the texture2 object');
    return false;
  }

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

  const greenMan = gl.getUniformLocation(gl.program, 'greenMan');
  if (!greenMan) {
    console.log('Failed to get the storage location of greenMan');
    return false;
  }

  gl.uniform1i(greenMan, 1);
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {HTMLImageElement} image
 */
function draw1(gl, image) {
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  const verticesTexCoords = new Float32Array([
    // forest
    -1, 1, -0.5, 0, 1,
    -1, -1, -0.5, 0, 0,
    1, 1, -0.5, 1, 1,
    -1, -1, -0.5, 0, 0,
    1, -1, -0.5, 1, 0,
    1, 1, -0.5, 1, 1,
  ]);

  const pos = gl.getAttribLocation(gl.program, 'pos');
  if (pos < 0) {
    console.log('Failed to get the storage location of pos');
    return -1;
  }

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(pos);

  const uv = gl.getAttribLocation(gl.program, 'uv');
  if (uv < 0) {
    console.log('Failed to get the storage location of uv');
    return -1;
  }

  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(uv);

  const texture1 = gl.createTexture();
  if (!texture1) {
    console.log('Failed to create the texture1 object');
    return false;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const forest = gl.getUniformLocation(gl.program, 'forest');
  if (!forest) {
    console.log('Failed to get the storage location of forest');
    return false;
  }

  gl.uniform1i(forest, 0);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {HTMLImageElement} image
 */
function draw2(gl, image) {
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  const verticesTexCoords = new Float32Array([
    // green man
    -0.25, 0.25, 0, 0, 1,
    -0.25, -0.25, 0, 0, 0,
    0.25, 0.25, 0, 1, 1,
    -0.25, -0.25, 0, 0, 0,
    0.25, -0.25, 0, 1, 0,
    0.25, 0.25, 0, 1, 1,
  ]);

  const pos = gl.getAttribLocation(gl.program, 'pos');
  if (pos < 0) {
    console.log('Failed to get the storage location of pos');
    return -1;
  }

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(pos);

  const uv = gl.getAttribLocation(gl.program, 'uv');
  if (uv < 0) {
    console.log('Failed to get the storage location of uv');
    return -1;
  }

  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(uv);

  const texture1 = gl.createTexture();
  if (!texture1) {
    console.log('Failed to create the texture1 object');
    return false;
  }

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const forest = gl.getUniformLocation(gl.program, 'forest');
  if (!forest) {
    console.log('Failed to get the storage location of forest');
    return false;
  }

  gl.uniform1i(forest, 1);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
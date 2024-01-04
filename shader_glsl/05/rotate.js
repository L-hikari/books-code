const baseUrl = '/shader_glsl/05/';

loadShaderFile(baseUrl + 'rotate.vert', baseUrl + 'rotate.frag')
.then(main);

let buffer1;
let buffer2;
function main([VSHADER_SOURCE, FSHADER_SOURCE]) {
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

  const pos = gl.getAttribLocation(gl.program, 'pos');
  if (pos < 0) {
    console.log('Failed to get the storage location of pos');
    return -1;
  }

  const uv = gl.getAttribLocation(gl.program, 'uv');
  if (uv < 0) {
    console.log('Failed to get the storage location of uv');
    return -1;
  }

  const forest = gl.getUniformLocation(gl.program, 'forest');
  if (!forest) {
    console.log('Failed to get the storage location of forest');
    return false;
  }

  const greenMan = gl.getUniformLocation(gl.program, 'greenMan');
  if (!greenMan) {
    console.log('Failed to get the storage location of greenMan');
    return false;
  }

  const u_cloud = gl.getUniformLocation(gl.program, 'u_cloud');
  if (!u_cloud) {
    console.log('Failed to get the storage location of u_cloud');
    return false;
  }
  
  const u_sun = gl.getUniformLocation(gl.program, 'u_sun');
  if (!u_sun) {
    console.log('Failed to get the storage location of u_sun');
    return false;
  }

  const u_currentTexNum = gl.getUniformLocation(gl.program, 'u_currentTexNum');
  if (!u_currentTexNum) {
    console.log('Failed to get the storage location of u_currentTexNum');
    return false;
  }

  const u_need_rotate = gl.getUniformLocation(gl.program, 'u_need_rotate');
  if (!u_need_rotate) {
    console.log('Failed to get the storage location of u_need_rotate');
    return -1;
  }

  const p1 = new Promise((resolve, reject) => {
    const image1 = new Image();
    image1.src = '../04/assets/forest.png';
    image1.onload = function () {
      resolve(image1)
    };
  });
  
  const p2 = new Promise((resolve, reject) => {
    const image2 = new Image();
    image2.src = '../04/assets/alien.png';
    image2.onload = function () {
      resolve(image2);
    };
  });

  const p3 = new Promise((resolve, reject) => {
    const image3 = new Image();
    image3.src = '../04/assets/cloud.png';
    image3.onload = function () {
      const image_ = makePowerOfTwo(image3);
      resolve(image_);
    }
  });

  const p4 = new Promise((resolve, reject) => {
    const image4 = new Image();
    image4.src = '../04/assets/sun.png';
    image4.onload = function () {
      const image_ = makePowerOfTwo(image4);
      resolve(image_);
    }
  });
  
  Promise.all([p1, p2, p3, p4])
  .then(([image1, image2, image3, image4]) => {
    
    // initArrayBuffer(gl, image1, image2);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);

    const verticesTexs = new Float32Array([
      // forest
      -1, 1, -0.5, 0, 1,
      -1, -1, -0.5, 0, 0,
      1, 1, -0.5, 1, 1,
      -1, -1, -0.5, 0, 0,
      1, -1, -0.5, 1, 0,
      1, 1, -0.5, 1, 1,
      // sun
      -1.0, 1.0, -0.8, 0, 1,
      -1.0, -1.0, -0.8, 0, 0,
      1.0, 1.0, -0.8, 1, 1,
      -1.0, -1.0, -0.8, 0, 0,
      1.0, -1.0, -0.8, 1, 0,
      1.0, 1.0, -0.8, 1, 1,
      // green man
      -0.25, 0, 0, 0, 1,
      -0.25, -0.5, 0, 0, 0,
      0.25, 0, 0, 1, 1,
      -0.25, -0.5, 0, 0, 0,
      0.25, -0.5, 0, 1, 0,
      0.25, 0, 0, 1, 1,
      // cloud
      -0.9, 0.9, 0, 0, 1,
      -0.9, 0.5, 0, 0, 0,
      -0.5, 0.9, 0, 1, 1,
      -0.9, 0.5, 0, 0, 0,
      -0.5, 0.5, 0, 1, 0,
      -0.5, 0.9, 0, 1, 1,
    ]);

    bindBufferData(gl, verticesTexs, pos, uv);

    bindTextureImage(gl, forest, image1, 0);
    gl.uniform1i(u_currentTexNum, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 太阳光设置加法混合
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    bindTextureImage(gl, u_sun, image4, 3);
    gl.uniform1i(u_currentTexNum, 3);
    gl.drawArrays(gl.TRIANGLES, 6, 6);

    // 其余设置alpha混合
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    bindTextureImage(gl, greenMan, image2, 1);
    gl.uniform1i(u_currentTexNum, 1);
    gl.drawArrays(gl.TRIANGLES, 12, 6);
    gl.uniform1i(u_need_rotate, 1);
    gl.drawArrays(gl.TRIANGLES, 12, 6);
    gl.uniform1i(u_need_rotate, 0);

    bindTextureImage(gl, u_cloud, image3, 2);
    gl.uniform1i(u_currentTexNum, 2);
    gl.drawArrays(gl.TRIANGLES, 18, 6);
  });

}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Array} bufferData 
 * @param {*} pos 
 * @param {*} uv 
 * @returns 
 */
function bindBufferData(gl, bufferData, pos, uv) {
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  const FSIZE = bufferData.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(pos);

  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(uv);
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {*} sampler 
 * @param {HTMLImageElement} image 
 * @param {number} unit 
 * @returns 
 */
function bindTextureImage(gl, sampler, image, unit) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  switch (unit) {
    case 0:
      gl.activeTexture(gl.TEXTURE0);
      break;
    case 1:
      gl.activeTexture(gl.TEXTURE1);
      break;
    case 2:
      gl.activeTexture(gl.TEXTURE2);
      break;
    case 3:
      gl.activeTexture(gl.TEXTURE3);
      break;
    default:
      break;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(sampler, unit);
}
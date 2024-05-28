const baseUrl = '/shader_glsl/07/';

loadShaderFile(baseUrl + 'mesh.vert', baseUrl + 'mesh.frag')
.then(main);

let buffer1;
let buffer2;
function main([VSHADER_SOURCE, FSHADER_SOURCE]) {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  /** @type {WebGL2RenderingContext} */
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

  const a_pos = gl.getAttribLocation(gl.program, 'a_pos');
  if (a_pos < 0) {
    console.log('Failed to get the storage location of a_pos');
    return -1;
  }

  // const a_uv = gl.getAttribLocation(gl.program, 'a_uv');
  // if (a_uv < 0) {
  //   console.log('Failed to get the storage location of a_uv');
  //   return -1;
  // }

  const u_projectionMatrix = gl.getUniformLocation(gl.program, 'u_projectionMatrix');
  if (!u_projectionMatrix) {
    console.log('Failed to get the storage location of u_projectionMatrix');
    return false;
  }
  const u_viewMatrix = gl.getUniformLocation(gl.program, 'u_viewMatrix');
  if (!u_viewMatrix) {
    console.log('Failed to get the storage location of u_viewMatrix');
    return false;
  }
  const u_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');
  if (!u_modelMatrix) {
    console.log('Failed to get the storage location of u_modelMatrix');
    return false;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);

  const { mat4, vec3 } = glMatrix;
  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const modelMatrix = mat4.create();

  // Set perspective projection matrix
  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
  // Set view matrix (camera position and lookAt)
  const eye = vec3.fromValues(0, 0, 5);
  const center = vec3.fromValues(0, 0, 0);
  const up = vec3.fromValues(0, 1, 0);
  mat4.lookAt(viewMatrix, eye, center, up);
  // Set model matrix (initially identity)
  mat4.identity(modelMatrix);

  const loader = new THREE.PLYLoader();
  loader.load('../assets/torus.ply', geometry => {
    const vertices = new Float32Array(geometry.vertices.length * 3);
    for (let i = 0; i < geometry.vertices.length; i++) {
      const item = geometry.vertices[i];
      vertices[i * 3] = item.x;
      vertices[i * 3 + 1] = item.y;
      vertices[i * 3 + 2] = item.z;
    }

    const indices = new Uint16Array(geometry.faces.length * 3);
    for (let i = 0; i < geometry.faces.length; i++) {
      const item = geometry.faces[i];
      indices[i * 3] = item.a;
      indices[i * 3 + 1] = item.b;
      indices[i * 3 + 2] = item.c;
    }
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(indices, vertices);
    
    bindBufferData(gl, vertices, indices, a_pos);
    // gl.uniformMatrix4fv(u_mvp, false, matrix);
    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      mat4.rotate(modelMatrix, modelMatrix, -Math.PI / 4, vec3.fromValues(0, 1, 0));
      // gl.uniformMatrix4fv(u_mvp, false, mvpMatrix);
      gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
      gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
      gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      // requestAnimationFrame(render);
    }

    render();

  });
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Array} vertices 
 * @param {Array} indices 
 * @param {*} a_pos 
 * @param {*} a_uv 
 * @returns 
 */
function bindBufferData(gl, vertices, indices, a_pos) {
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  const FSIZE = vertices.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_pos);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
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
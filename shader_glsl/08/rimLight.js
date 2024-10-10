const baseUrl = '/shader_glsl/08/';

loadShaderFile(baseUrl + 'rimLight.vert', baseUrl + 'rimLight.frag')
.then(main);

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

    const a_normal = gl.getAttribLocation(gl.program, 'a_normal');
    if (a_normal < 0) {
      console.log('Failed to get the storage location of a_normal');
      return -1;
    }

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
    const u_lightDirection = gl.getUniformLocation(gl.program, 'u_lightDirection');
    if (!u_lightDirection) {
      console.log('Failed to get the storage location of u_lightDirection');
      return false;
    }
    const u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if (!u_lightColor) {
      console.log('Failed to get the storage location of u_lightColor');
      return false;
    }
    const u_cameraPosition = gl.getUniformLocation(gl.program, 'u_cameraPosition');
    if (!u_cameraPosition) {
      console.log('Failed to get the storage location of u_cameraPosition');
      return false;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    const {mat4, vec3} = glMatrix;
    const projectionMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const modelMatrix = mat4.create();

    // Set perspective projection matrix
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100.0);
    // Set view matrix (camera position and lookAt)
    const eye = vec3.fromValues(3, 3, 3);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(viewMatrix, eye, center, up);

    const lightDirection = vec3.fromValues(-1.0, -3.0, -3.0);
    const lightColor = vec3.fromValues(1.0, 1.0, 1.0);

    var vertices = new Float32Array([   // Coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);
 
 
   var colors = new Float32Array([    // Colors
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);
 
 
   var normals = new Float32Array([    // Normal
     0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
   ]);
 
   // Indices of the vertices
   var indices = new Uint16Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9,10,   8,10,11,    // up
     12,13,14,  12,14,15,    // left
     16,17,18,  16,18,19,    // down
     20,21,22,  20,22,23     // back
  ]);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // console.log(normals);

    bindBufferData(gl, vertices, indices, normals, a_pos, a_normal);

    gl.uniform3fv(u_lightDirection, lightDirection);
    gl.uniform3fv(u_lightColor, lightColor);
    gl.uniform3fv(u_cameraPosition, eye);

    const render = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(u_projectionMatrix, false, projectionMatrix);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        // requestAnimationFrame(render);
    };

    render();
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {Array} vertices
 * @param {Array} indices
 * @param {*} a_pos
 * @param {*} a_normal
 * @returns
 */
function bindBufferData(gl, vertices, indices, normals, a_pos, a_normal) {
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

    const normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
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

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_normal);
}

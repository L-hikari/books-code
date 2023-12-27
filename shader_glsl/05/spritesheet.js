loadShaderFile('/shader_glsl/05/spritesheet.vert', '/shader_glsl/05/spritesheet.frag')
.then(([VSHADER_SOURCE, FSHADER_SOURCE]) => {
    
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

    const a_uv = gl.getAttribLocation(gl.program, 'a_uv');
    if (a_uv < 0) {
      console.log('Failed to get the storage location of a_uv');
      return -1;
    }

    const a_charPos = gl.getAttribLocation(gl.program, 'a_charPos');
    if (a_charPos < 0) {
      console.log('Failed to get the storage location of a_charPos');
      return -1;
    }

    const u_greenMan = gl.getUniformLocation(gl.program, 'u_greenMan');
    if (!u_greenMan) {
      console.log('Failed to get the storage location of u_greenMan');
      return false;
    }

    const u_size = gl.getUniformLocation(gl.program, 'u_size');
    if (!u_size) {
        console.log('Failed to get the storage location of u_size');
        return false;
    }

    const u_offset = gl.getUniformLocation(gl.program, 'u_offset');
    if (!u_offset) {
        console.log('Failed to get the storage location of u_offset');
        return false;
    }

    const imagePromise = new Promise((resolve, reject) => {
        const image1 = new Image();
        image1.src = '../04/assets/walk_sheet.png';
        image1.onload = function () {
          resolve(image1)
        };
    });

    imagePromise.then(image => {
        /** @type {boolean} */
        let walkRight;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const verticesTexs = new Float32Array([
            -1, 1, -0.5, 0, 1,
            -1, -1, -0.5, 0, 0,
            1, 1, -0.5, 1, 1,
            -1, -1, -0.5, 0, 0,
            1, -1, -0.5, 1, 0,
            1, 1, -0.5, 1, 1,
        ]);

        const charPos = new Float32Array([0.0, 0.0, 0.0]);

        bindBufferData(gl, verticesTexs, a_pos, a_uv);
        bindTextureImage(gl, u_greenMan, image, 0);

        gl.uniform2f(u_size, 0.28, 0.19);

        let frame = 0.0;
        const render = () => {
            // frame = frame > 10 ? 0.0 : frame += 0.28;
            if (walkRight) {
                charPos[0] += 0.4;
                gl.vertexAttrib3fv(a_charPos, charPos);
            }
            
            gl.uniform2f(u_offset, frame % 3, Math.floor(frame / 3));

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        render();

        // setInterval(render, 300);
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight') {
                walkRight = true;
                render();
            }
        });
    
        document.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight') {
                walkRight = false;
                render();
            }
        });
    });

});

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {Float32Array} vertices 
 * @param {*} a_pos 
 * @param {*} a_uv 
 */
function bindBufferData(gl, vertices, a_pos, a_uv) {
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    const FSIZE = vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_pos);

    gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
    gl.enableVertexAttribArray(a_uv);
}


/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {*} sampler 
 * @param {HTMLImageElement} image 
 * @param {number} unit 
 */
function bindTextureImage(gl, sampler, image, unit) {
    const texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.activeTexture(gl[`TEXTURE${unit}`]);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(sampler, unit);
}
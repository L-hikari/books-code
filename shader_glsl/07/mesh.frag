#ifdef GL_ES
precision mediump float;
#endif

varying vec3 v_uv;

void main() {
    gl_FragColor = vec4(v_uv, 1.0);
}
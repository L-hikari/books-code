#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_greenMan;
varying vec2 v_uv;

void main() {
	gl_FragColor = texture2D(u_greenMan, v_uv);
}

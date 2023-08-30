#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D greenMan;
varying vec2 v_uv;

void main() {
	gl_FragColor = texture2D(greenMan, v_uv);
	if (gl_FragColor.a < 1.0) discard;
}

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D greenMan;
uniform sampler2D forest;
varying vec2 v_uv;

void main() {

	vec4 greenManColor = texture2D(greenMan, v_uv);
	vec4 forestColor = texture2D(forest, v_uv);
	
	gl_FragColor = forestColor * greenManColor;
	if (gl_FragColor.a < 1.0) discard;
}

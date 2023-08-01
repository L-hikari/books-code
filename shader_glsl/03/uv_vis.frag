#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_ParrotTex;

varying vec2 v_Uv;

void main() {
	gl_FragColor = texture2D(u_ParrotTex, v_Uv);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
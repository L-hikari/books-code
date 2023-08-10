#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_ParrotTex;
uniform vec4 u_multiply;
uniform vec4 u_add;

varying vec2 v_Uv;

void main() {
	gl_FragColor = texture2D(u_ParrotTex, v_Uv) * u_multiply + u_add;
}
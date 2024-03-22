attribute vec3 a_pos;
attribute vec2 a_uv;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;


varying vec2 v_uv;

void main() {
	gl_Position = u_proj * vec4(a_pos, 1.0);
	// gl_Position = vec4(a_pos, 1.0);
	v_uv = vec2(a_uv.x, 1.0 - a_uv.y);
}
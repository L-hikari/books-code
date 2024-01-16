attribute vec3 pos;
attribute vec2 uv;
uniform bool u_need_trans;
uniform mat4 u_transform;
attribute mat4 u_transform2;

varying vec2 v_uv;

void main() {

	if (u_need_trans) {
		gl_Position = u_transform * vec4(pos, 1.0);
	} else {
		gl_Position = vec4(pos, 1.0);
	}
	v_uv = vec2(uv.x, 1.0 - uv.y);
}
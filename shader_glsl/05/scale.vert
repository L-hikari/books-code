attribute vec3 pos;
attribute vec2 uv;
uniform bool u_need_scale;

varying vec2 v_uv;

void main() {
    vec3 scale = vec3(0.5, 0.75, 1.0);
	vec3 translate = vec3(-0.55, 0.0, 0.0);

	if (u_need_scale) {
		gl_Position = vec4(pos * scale + translate, 1.0);
	} else {
		gl_Position = vec4(pos, 1.0);
	}
	v_uv = vec2(uv.x, 1.0 - uv.y);
}
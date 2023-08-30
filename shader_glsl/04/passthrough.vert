attribute vec3 pos;
attribute vec2 uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(pos, 1.0);
	v_uv = vec2(uv.x, 1.0 - uv.y);
}
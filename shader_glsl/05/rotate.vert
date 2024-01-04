attribute vec3 pos;
attribute vec2 uv;
uniform bool u_need_rotate;

varying vec2 v_uv;

void main() {
    float radians = 1.0;
    vec3 rotatedPos = pos;
    rotatedPos.x = (cos(radians) * pos.x) - (sin(radians) * pos.y);
    rotatedPos.y = (cos(radians) * pos.y) + (sin(radians) * pos.x);

	if (u_need_rotate) {
		gl_Position = vec4(rotatedPos, 1.0);
	} else {
		gl_Position = vec4(pos, 1.0);
	}
	v_uv = vec2(uv.x, 1.0 - uv.y);
}
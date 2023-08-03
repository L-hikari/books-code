attribute vec4 a_Position;
attribute vec2 a_Uv;

uniform float u_time;

varying vec2 v_Uv;

void main() {
	// 反转y轴，可以把图片纹理放正
	v_Uv = vec2(a_Uv.x, 1.0 - a_Uv.y) + vec2(1.0, 0.0) * u_time;
	gl_Position = a_Position;
}
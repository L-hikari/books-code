attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec3 a_charPos;

uniform vec2 u_size;
uniform vec2 u_offset;

varying vec2 v_uv;

void main() {
    gl_Position = vec4(a_pos + a_charPos, 1.0);
    v_uv = vec2(a_uv.x, 1.0 - a_uv.y) * u_size + (u_offset * u_size);
}
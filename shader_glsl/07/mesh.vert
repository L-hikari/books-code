attribute vec3 a_pos;
attribute vec2 a_uv;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

varying vec3 v_uv;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_pos, 1.0);
    v_uv = a_pos;
}
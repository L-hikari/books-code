attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec3 a_normal;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

varying vec3 v_uv;
varying vec3 v_normal;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_pos, 1.0);
    v_uv = a_pos;
    // v_normal = (u_modelMatrix * vec4(a_normal, 0.0)).xyz;
    v_normal = a_normal;
}
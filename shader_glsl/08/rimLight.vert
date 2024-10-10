#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 a_pos;
attribute vec3 a_normal;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

varying vec3 v_normal;
varying vec3 v_worldPos;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_pos, 1.0);
    v_normal = a_normal;
    v_worldPos = (u_modelMatrix * vec4(a_pos, 1.0)).xyz;
}
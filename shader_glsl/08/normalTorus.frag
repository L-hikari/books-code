#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_meshColor;

varying vec3 v_uv;
varying vec3 v_normal;

void main() {
    // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec3 normal = normalize(v_normal);
    float lightAmt = max(dot(normal, u_lightDirection), 0.0);
    vec3 fragLight = u_lightColor * lightAmt;
    gl_FragColor = vec4(vec3(1, 0, 0) * fragLight, 1.0);
}
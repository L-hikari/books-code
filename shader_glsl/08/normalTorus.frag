#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_meshColor;

varying vec3 v_normal;

void main() {
    // <漫反射光颜色> = <入射光颜色> * <表面基底色> * dot(<光线方向> * <法线方向>)
    vec3 normal = normalize(v_normal);
    float lightAmt = max(dot(normal, u_lightDirection), 0.0);
    vec3 fragLight = u_lightColor * lightAmt;
    gl_FragColor = vec4(vec3(1, 0, 0) * fragLight, 1.0);
}
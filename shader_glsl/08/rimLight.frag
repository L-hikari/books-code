#ifdef GL_ES
    precision mediump float;
#endif

uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_cameraPosition;

varying vec3 v_worldPos;
varying vec3 v_normal;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 toCamera = normalize(u_cameraPosition - v_worldPos);

    float rimAmt = 1.0 - max(dot(normal, toCamera), 0.0);
    rimAmt = pow(rimAmt, 2.0);

    float lightAmt = max(0.0, dot(normal, u_lightDirection));
    vec3 fragLight = u_lightColor * lightAmt;

    // 使用法线作为颜色输出，使得每个面根据其法线方向有不同的颜色
    vec3 colorBasedOnNormal = (normal * 0.5 + 0.5); // 将法线从 [-1, 1] 转换到 [0, 1] 范围
    // 将轮廓效果颜色设置为基于法线的颜色
    // vec3 rimColor = colorBasedOnNormal * rimAmt;
    // 结合光照效果和轮廓效果
    // gl_FragColor = vec4(fragLight + rimColor, 1.0);

    vec3 rimColor = vec3(0.0, 0.0, 1.0) * rimAmt;  // 蓝色轮廓
    // gl_FragColor = vec4(fragLight + rimColor, 1.0);

    gl_FragColor = vec4(fragLight + rimAmt, 1.0);
    // gl_FragColor = vec4(normal, 1.0);
}
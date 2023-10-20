#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D greenMan;
uniform sampler2D forest;
uniform sampler2D u_cloud;
uniform sampler2D u_sun;
uniform int u_currentTexNum;

varying vec2 v_uv;

void main() {
	vec4 greenManColor = texture2D(greenMan, v_uv);
	vec4 forestColor = texture2D(forest, v_uv);
	vec4 cloudColor = texture2D(u_cloud, v_uv);
	vec4 sunColor = texture2D(u_sun, v_uv);

	if (u_currentTexNum == 0) {
		gl_FragColor = forestColor;
	} else if (u_currentTexNum == 1) {
		gl_FragColor = greenManColor;
		if (gl_FragColor.a < 1.0) discard;
	} else if (u_currentTexNum == 2) {
		gl_FragColor = cloudColor;
		// if (gl_FragColor.a < 0.9) discard;
		// gl_FragColor.a = min(gl_FragColor.a, 0.5);
	} else if (u_currentTexNum == 3) {
		gl_FragColor = sunColor;
	}
	
	// gl_FragColor = forestColor * greenManColor;
	// gl_FragColor = cloudColor;
	
}

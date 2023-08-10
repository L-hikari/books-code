#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_ParrotTex;
uniform sampler2D u_flowerTex;

varying vec2 v_Uv;

void main() {
	vec4 parrot = texture2D(u_ParrotTex, v_Uv);
	vec4 flower = texture2D(u_flowerTex, v_Uv);
	// mix: 前两个参数是需要混合的值，第三个参数如果是0混合结果就是第一个参数的100%
	// 最后一个参数的0%，第三个参数如果是1混合结果就是第二个参数的100%第一个参数的0%
	//gl_FragColor = mix(parrot, flower, 0.5);
	gl_FragColor = mix(flower, parrot, flower.r);
}
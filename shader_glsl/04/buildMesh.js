function buildMesh(w, h, pos) {
	const verticesTexCoords = [];
	// 顶点和uv坐标顺序必须满足gl.TRIANGLE_STRIP顺序才可以绘制出矩形
	const verts = [
		-w + pos.x,
		h + pos.y,
		pos.z,
		-w + pos.x,
		-h + pos.y,
		pos.z,
		w + pos.x,
		h + pos.y,
		pos.z,
		w + pos.x,
		-h + pos.y,
		pos.z
	];

	const uvs = [0, 1, 0, 0, 1, 1, 1, 0];

	for (var i = 0; i < 4; i++) {
		const idx = i * 3;
		const uvIdx = i * 2;

		verticesTexCoords.push(
			verts[idx], verts[idx + 1], verts[idx + 2],
			uvs[uvIdx], uvs[uvIdx + 1]
		);
	}
	console.log(JSON.stringify(verticesTexCoords));
	return new Float32Array(verticesTexCoords);
	// return new Float32Array([
	// 	-1,1,	0,1,
	// 	-1,-1,  0,0,
		
	// 	1,1,	1,1,
	// 	1,-1,	1,0
	// ]);
}
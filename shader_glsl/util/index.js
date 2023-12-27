async function loadShaderFile(vUrl, fUrl) {
    let vShader = await fetch(vUrl);
    let fShader = await fetch(fUrl);
  
    vShader = await vShader.text();
    fShader = await fShader.text();

    return [vShader, fShader];
}

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
        pos.z,
    ];

    const uvs = [0, 1, 0, 0, 1, 1, 1, 0];

    for (var i = 0; i < 4; i++) {
        const idx = i * 3;
        const uvIdx = i * 2;

        verticesTexCoords.push(
            verts[idx],
            verts[idx + 1],
            verts[idx + 2],
            uvs[uvIdx],
            uvs[uvIdx + 1]
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

function makePowerOfTwo(image) {
    // 获取输入图片的宽度和高度
    var originalWidth = image.width;
    var originalHeight = image.height;

    // 计算最接近的2的次幂的宽度和高度
    var newWidth = Math.pow(2, Math.ceil(Math.log2(originalWidth)));
    var newHeight = Math.pow(2, Math.ceil(Math.log2(originalHeight)));

    // 创建一个新的Canvas元素
    var canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    var context = canvas.getContext('2d');

    // 将图片绘制到Canvas上，多余部分会是纯透明的
    context.clearRect(0, 0, newWidth, newHeight); // 清空画布
    context.drawImage(image, 0, 0, originalWidth, originalHeight);

    // 创建一个新的Image元素来保存结果
    var resultImage = new Image();
    resultImage.src = canvas.toDataURL(); // 将Canvas内容转化为DataURL

    return resultImage;
}
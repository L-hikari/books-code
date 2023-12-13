async function loadShaderFile(vUrl, fUrl) {
    let vShader = await fetch(vUrl);
    let fShader = await fetch(fUrl);
  
    vShader = await vShader.text();
    fShader = await fShader.text();

    return [vShader, fShader];
}
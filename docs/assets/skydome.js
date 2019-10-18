
//スカイドームの生成
function skydome() {
  var skydome = {
    enabled : true,         //スカイドーム利用の有無
    radius  : 300,           //スカイドームの半径
    topColor : 0x2E52FF,     //ドーム天頂色
    bottomColor : 0xFFFFFF,  //ドーム底面色
    exp : 0.8,               //混合指数
    offset : 20               //高さ基準点
  };

  //バーテックスシェーダー
  var vertexShader = `
    //頂点シェーダーからフラグメントシェーダーへの転送する変数
    varying vec3 vWorldPosition;
    void main() {
      //ワールド座標系における頂点座標
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `
  //フラグメントシェーダ―
  var fragmentShader = `
    //カスタムuniform変数の取得
    uniform vec3 topColor;     //ドーム頂点色
    uniform vec3 bottomColor;  //ドーム底辺色
    uniform	float exp;         //減衰指数
    uniform	float offset;      //高さ基準点
    //バーテックスシェーダーから転送された変数
    varying vec3 vWorldPosition;
    void main() {
      //高さの取得
      float h = normalize(vWorldPosition + vec3(0, offset, 0)).y;
      if( h < 0.0) h = 0.0;
      gl_FragColor = vec4(mix(bottomColor, topColor, pow(h, exp)), 1.0);
    }
  `
  var geometry = new THREE.SphereGeometry(skydome.radius, 100, 100);
  var uniforms = {
    topColor:  { type: "c", value: new THREE.Color().setHex(skydome.topColor) },
    bottomColor:  { type: "c", value: new THREE.Color().setHex(skydome.bottomColor) },
    exp:{ type: "f", value : skydome.exp  },
    offset:{ type: "f", value :skydome.offset } //高さ基準点
  };
  //材質オブジェクトの宣言と生成
  var material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms : uniforms,
    side: THREE.BackSide,
    depthWrite: false
  });
  //スカイドームの生成
	return new THREE.Mesh(geometry, material)
}
export default skydome
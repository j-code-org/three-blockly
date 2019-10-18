// 芝生を作る
function grass() {
  // ground
  var loader = new THREE.TextureLoader();
  
  var groundTexture = loader.load( './three/examples/textures/terrain/grasslight-big.jpg' );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 25, 25 );
  groundTexture.anisotropy = 16;

  var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 500, 500 ), groundMaterial );
  mesh.position.y = 0.1;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh
}
class myClass {
	constructor() {
		return grass();
	}
}

export default myClass
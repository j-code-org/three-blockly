function light() {

  var group = new THREE.Group();
  var hemiLight = new THREE.HemisphereLight(0x0c00d9, 0xffffff, 0.18);
  hemiLight.position.set(0, 500, 0);
  group.add(hemiLight) 

  // add DirectionalLight for the shadows
  var directionalLight = new THREE.DirectionalLight("#ffffff");
  directionalLight.position.set( 100, 100, 100);
  directionalLight.castShadow = true;
  directionalLight.intensity = 1.2;

  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 400;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 200;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  group.add(directionalLight) 
  return group;
}
class myClass {
	constructor() {
		return light();
	}
}

export default myClass
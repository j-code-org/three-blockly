/*
  たま
*/
import obj from "./obj.js"

// create a Sphere
function myMesh() {
	var sphereGeometry = new THREE.SphereGeometry(2, 20, 20);
	var material = new THREE.MeshLambertMaterial({color: 0x7777ff});
	var mesh = new THREE.Mesh(sphereGeometry, material);
	mesh.position.y = 2;
	mesh.castShadow = true;
	return mesh;
}
// define class
class myClass {
	constructor(group) {
		var myobj = new obj(group);
		myobj.add(new myMesh())
		return myobj;
	}
}

export default myClass;


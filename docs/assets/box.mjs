/*
  はこ
*/
import obj from "./obj.js"

// create a box
function myMesh() {
	var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
	var material = new THREE.MeshLambertMaterial({color: 0xff0000});
	var mesh = new THREE.Mesh(cubeGeometry, material);
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

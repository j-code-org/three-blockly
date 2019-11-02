/*
  Demo
*/

async function movebox() {
	var box  = new THREE.box();
	THREE.scene.add(box)
	for (var i=0; i<3; i++) {
		await box.moveForward(20);
		await box.turnRight(240);
	}
}
async function movepin() {
	var box = new THREE.pin();
	THREE.scene.add(box)
	await box.moveForward(60);
}
async function movesphere() {
	var box = new THREE.sphere();
	THREE.scene.add(box)
	for (var i=0; i<6; i++) {
		await box.moveForward(30);
		await box.turnRight(60);
	}
}

// define class
class myClass {
	constructor() {
  }
  static run() {
   	//var box = new THREE.snowfall();
    //THREE.scene.add(box)
    movebox()
    movepin();
    movesphere();
  }
}

export default myClass;

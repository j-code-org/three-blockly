/*
  Demo
*/
async function movebox(obj) {
	for (var i = 0; i < 3; i++) {
		await obj.moveForward(12);
		await obj.turnRight(120);
	}
}
async function movepin(obj) {
	await obj.moveForward(33);
}
async function movesphere(obj) {
	var sphere = new THREE.library["sphere"];
	THREE.scene.add(sphere)
	for (var i = 0; i < 6; i++) {
		await sphere.moveForward(10);
		await sphere.turnRight(60);
	}
}

// Run ボタンのイベント リスナー
window.addEventListener('onrun', function(e) {
	var pin = new THREE.library["pin"];
	THREE.scene.add(pin)
	var box = new THREE.library["box"];
	THREE.scene.add(box)
	movebox(box)
	movepin(pin);
	movesphere();
}, false);

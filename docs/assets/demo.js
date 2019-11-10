/*
  Demo
*/

// Run ボタンのイベント リスナー
window.addEventListener('onrun', function(e) {
	var obj, x;

	function colourRandom() {
		var num = Math.floor(Math.random() * Math.pow(2, 24));
		return '#' + ('00000' + num.toString(16)).substr(-6);
	}
	
	function mathRandomInt(a, b) {
		if (a > b) {
			// Swap a and b to ensure a is smaller.
			var c = a;
			a = b;
			b = c;
		}
		return Math.floor(Math.random() * (b - a + 1) + a);
	}
	
	/**
	 * この関数の説明…
	 */
	async function aaa(obj) {
		obj.setColor(colourRandom());
		await obj.turnRight(mathRandomInt(0, 359));
		await obj.lookUpward(mathRandomInt(0, 90));
		await obj.moveForward(mathRandomInt(5, 70));
	}
	
	
	for (var count = 0; count < 5; count++) {
		obj = new THREE.library["pin"]();
		THREE.scene.add (obj);
		aaa(obj);
	}
	for (var count2 = 0; count2 < 5; count2++) {
		obj = new THREE.library["box"]();
		THREE.scene.add (obj);
		aaa(obj);
	}
	for (var count3 = 0; count3 < 1; count3++) {
		obj = new THREE.library["snowfall"]();
		THREE.scene.add (obj);
	}
}, false);

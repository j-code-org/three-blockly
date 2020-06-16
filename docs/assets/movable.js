/*
  動かせる 3D オブジェクト
*/
class Movable extends THREE.Object3D {
	constructor() {
		super();
		this.speed = 1;
	}
	setColor(){};
	setTransparent(){};
	// 大きさ
	setScale( s ) {
		super.scale.set( s, s, s );
		return this;
	}
	// 速さ
	setSpeed( s ) {
		this.speed = s;
		return this;
	}
	
	// 前に d センチうごかす
	moveForward(d) {
		var mesh = this;
		var speed = this.speed;
		var msec = Math.max(100, Math.abs(d * 100/speed));
		//var highlightBlockId = JCODE.highlightBlockId;
		//arrow.visible = true;

		//Code.workspace.highlightBlock(highlightBlockId);
		return new Promise(function (resolve, reject) {
			var dir = new THREE.Vector3( 0, 0, 5 );
			var origin = new THREE.Vector3( 0, 4, 4 );
			var arrow = new THREE.ArrowHelper( dir, origin, 5, 0xffff00, 2, 1 ); // len=5, color 0xffff00
			mesh.add(arrow)
			setTimeout(function(){
				mesh.remove(arrow);
				resolve();
			}, msec);
			var coords = mesh.position.clone();
			var direction = mesh.position.clone();
			var forward = new THREE.Vector4(0, 0, 1, 0);
			forward.applyMatrix4(mesh.matrix).normalize();
			direction.addVectors( coords, forward.multiplyScalar( d ) );
	
			new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
			.to( direction , msec * 0.9) // Move to (300, 200) in 1 second.
			.easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
			.onUpdate(function() { // Called after tween.js updates 'coords'.
					// Move 'box' to the position described by 'coords' with a CSS translation.
					mesh.position.x = coords.x;
					mesh.position.y = coords.y;
					mesh.position.z = coords.z;
				})
			.start(); // Start the tween immediately.
		});
	}
	// 右に d 度まがる(アニメ無し)
	MturnRight(d) {
		var mesh = this;
		return new Promise(function (resolve, reject) {
			//全体を右に曲げる
			var coords2 = mesh.quaternion.clone();
			var axis = new THREE.Vector4(0, 1, 0, 0);
			axis.applyMatrix4(mesh.matrix).normalize();
			var direction = new THREE.Quaternion();
			direction.setFromAxisAngle(axis, Math.PI * -d / 180).multiply(coords2);
			mesh.quaternion.copy(direction);
			setTimeout(function(){
				resolve();
			}, 100);
		});
	}
	// 上に d 度まがる(アニメ無し)
	lookUpward(d) {
		var mesh = this;
		return new Promise(function (resolve, reject) {
			setTimeout(function(){
				resolve();
			}, 100);
			//全体を上に曲げる
			var coords2 = mesh.quaternion.clone();
			var axis = new THREE.Vector4(1, 0, 0, 0);
			axis.applyMatrix4(mesh.matrix).normalize();
			var direction = new THREE.Quaternion();
			direction.setFromAxisAngle(axis, Math.PI * -d / 180).multiply(coords2);
			mesh.quaternion.copy(direction);
		});
	}

}

export default Movable;

/*
  はこ
*/
import Movable from "./movable.js"

// create a box
class Cube extends Movable {
	constructor(color) {
		super();
		if ( color === undefined ) color = 0xffff00;
		var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
		var material = new THREE.MeshLambertMaterial({color: color});
		this.mesh = new THREE.Mesh(cubeGeometry, material);
		this.add( this.mesh );
		this.mesh.position.y = 2;
		this.mesh.castShadow = true;
	}
	// 色を変える
	setColor ( color ) {
		this.mesh.material.color.set( color );
	};
	// 透明度
	setTransparent( t ) {
		var opacity = t ? 1 - (t / 100) : 1;
		this.mesh.material.transparent = true;
		this.mesh.material.opacity = opacity;
		this.mesh.castShadow = false;
		return this;  
	}
}

export default Cube;

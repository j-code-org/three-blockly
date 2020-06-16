/*
  たま
*/
import Movable from "./movable.js"

class Sphere extends Movable {
	constructor(color) {
		super();
		if ( color === undefined ) color = 0xffff00;
		var sphereGeometry = new THREE.SphereGeometry(2, 20, 20);
		var material = new THREE.MeshLambertMaterial({color: color});
		this.mesh = new THREE.Mesh(sphereGeometry, material);
		this.add( this.mesh );
		this.mesh.position.y = 2;
		this.mesh.castShadow = true;
	}
	// 色を変える
	setColor ( color ) {
		this.mesh.material.color.set( color );
	};
}

export default Sphere;

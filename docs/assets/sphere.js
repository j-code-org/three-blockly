/*
  たま
*/
import movable from "./movable.js"

// create a box
function Sphere( color ) {

	movable.call( this );
	if ( color === undefined ) color = 0xffff00;

	var sphereGeometry = new THREE.SphereGeometry(2, 20, 20);
	var material = new THREE.MeshLambertMaterial({color: color});
	this.mesh = new THREE.Mesh(sphereGeometry, material);
  this.add( this.mesh );
  this.mesh.position.y = 2;
	this.mesh.castShadow = true;

}
Sphere.prototype = Object.create( movable.prototype );
Sphere.prototype.constructor = Sphere;
// 色を変える
Sphere.prototype.setColor = function ( color ) {
	this.mesh.material.color.set( color );
};

export default Sphere;

/*
  はこ
*/
import movable from "./movable.js"

// create a box
function Cube( color ) {

	movable.call( this );
	if ( color === undefined ) color = 0xffff00;

  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
	var material = new THREE.MeshLambertMaterial({color: color});
	this.mesh = new THREE.Mesh(cubeGeometry, material);
  this.add( this.mesh );
  this.mesh.position.y = 2;
	this.mesh.castShadow = true;

}
Cube.prototype = Object.create( movable.prototype );
Cube.prototype.constructor = Cube;

// 色を変える
Cube.prototype.setColor = function ( color ) {
	this.mesh.material.color.set( color );
	return this;
};
// 透明度
Cube.prototype.setTransparent = function( t ) {
  var opacity = t ? 1 - (t / 100) : 1;
	this.mesh.material.transparent = true;
	this.mesh.material.opacity = opacity;
	this.mesh.castShadow = false;
  return this;  
}
export default Cube;

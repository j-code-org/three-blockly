/*
  降雪モジュール  
  Need ojects:
    THREE
    JCODE
*/
import obj from "./obj.js"

function snowfall() {

	var geometry = new THREE.Geometry();
	var vertex = new THREE.Vector3(0, 0, 0);
	geometry.vertices.push( vertex );
	for (var i = 0; i < 2000; i ++ ) {
		var vertex = new THREE.Vector3(0, 40, 0);
		geometry.vertices.push( vertex );
	}

	var textureLoader = new THREE.TextureLoader();
	var sprite2 = textureLoader.load( "./examples/textures/sprites/snowflake2.png" );
	var material = new THREE.PointsMaterial({
		opacity: 0.9,
		fog: false,
		map:sprite2, 
		size:2,
		blending:THREE.AdditiveBlending, depthTest:true, transparent:true
	});
	material.color.setHSL( 0.95, 0, 0.8 );

	var particles = new THREE.Points( geometry, material );

	function random2(base, spread) {
		return base + ((Math.random() - 0.5) * spread);
	}

	function velocity() {
		var v = geometry.vertices.find(function(x) {
			return !x.velocity;
		});
		if (v) {
			v.x = random2( 0, 80);
			v.y = random2(40, 20);
			v.z = random2( 0, 80);
			v.velocity = new THREE.Vector3(random2(0, 50), random2(-60, 20), random2(0, 50));
		}
	}
	
	function render() {
		
		var delta = 0.001;
		geometry.vertices.forEach(function(v) {
			if (v.velocity) {
				v.x = v.x + (v.velocity.x) * delta;
				v.y = v.y + (v.velocity.y) * delta;
				v.z = v.z + (v.velocity.z) * delta;
				if (v.y < 0.5) {
					//v.y = 40;
					v.velocity.x = 0;
					v.velocity.y = 0;
					v.velocity.z = 0;
				}
			}
		});
		geometry.verticesNeedUpdate = true;
	}
	setInterval(velocity, 30);
	setInterval(render, 20);
	return particles;
}

// define class
class myClass {
	constructor(group) {
		var myobj = new obj(group);
		myobj.add(new snowfall())
		return myobj;
	}
}

export default myClass;

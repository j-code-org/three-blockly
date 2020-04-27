// 床を書く
function createFloor() {

  var floor = new THREE.Group();
  var planeGeometry = new THREE.PlaneGeometry(10, 10);
  function newmesh (color) {
    var planeMaterial1 = new THREE.MeshPhongMaterial({color: color, opacity:0.8, transparent:true});
    var plane1 = new THREE.Mesh(planeGeometry, planeMaterial1);
    plane1.receiveShadow = true;
    // rotate and position the plane
    plane1.rotation.x = -0.5 * Math.PI;
    plane1.position.x = 0;
    plane1.position.y = 0;
    plane1.position.z = 0;
    return plane1;
  }
  var plane1 = newmesh(0xFFFFFF); // 白
  var plane2 = newmesh(0x303030); // 黒
  //var plane2 = newmesh(0); // 黒
  var plane3 = newmesh(0x000080); // 青
  for (var x=0; x<10; x++) {
    for (var z=0; z<10; z++) {
      var p = (x == 5 && z ==5) ? plane3.clone() : (( x + z) % 2) ? plane1.clone() : plane2.clone();
      p.position.z = z * 10 - 50;
      p.position.x = x * 10 - 50;
      floor.add(p);
    }
  }
  return floor;
}

class myClass {
	constructor() {
		return createFloor();
	}
}

export default myClass

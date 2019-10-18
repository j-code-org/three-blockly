/*
カメラ、レンダラー
シーンを作って返す
*/
function initThreejs(domElement) {

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 80, 500);

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0));
  renderer.shadowMap.enabled = true;
  // add the output of the renderer to the html element
  domElement.appendChild(renderer.domElement);

  // カメラ
  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, domElement.clientWidth / domElement.clientHeight, 0.01, 2000);
  // position and point the camera to the center of the scene
  camera.position.set(15, 25, 45);
  camera.lookAt(scene.position);

  // resize 処理
  var onresize = function(e) {
    var width = domElement.clientWidth;
    var height = domElement.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  onresize();
  window.addEventListener('resize', onresize, false);

  // マウスのコントロール
  var controls = new THREE.OrbitControls( camera, domElement );
  // render using requestAnimationFrame
  function renderScene() {
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  requestAnimationFrame(renderScene);
  return scene;
}

export default initThreejs;

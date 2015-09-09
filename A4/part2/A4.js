// initializing variables
var camera, cubeCamera, scene, renderer, controls;

// background texture with callback founctions initialize() and animate()
var texture = THREE.ImageUtils.loadTexture('images/room.jpg', THREE.UVMapping, function() {
  initialize();
  animate();
});

// initailize function sets camera, cubecamera, and objects
function initialize() {
  scene = new THREE.Scene();
  
  // set camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 100, 200);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // set background
  var mesh = new THREE.Mesh(
    new THREE.SphereGeometry(500, 65, 45), 
    new THREE.MeshBasicMaterial({map: texture})
  );
  mesh.scale.x = -1;
  scene.add(mesh);

  // create renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);

  // set cubecamera
  cubeCamera = new THREE.CubeCamera(1, 1000, 256);
  cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
  scene.add(cubeCamera);

  document.body.appendChild(renderer.domElement);

  // set camera controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  // set material for reflective objects 
  var material = new THREE.MeshBasicMaterial(
    {envMap: cubeCamera.renderTarget}
  );

  // leftmost sphere (Reflective)
  sphere = new THREE.Mesh(new THREE.SphereGeometry(25, 30, 15), material);
  sphere.position.set(-120,20,0);
  scene.add(sphere);

  // Reflective tetrahedron
  tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(25, 0), material);
  tetrahedron.position.set(-40,20,0);
  scene.add(tetrahedron);
  
  // Reflective cube
  cube = new THREE.Mesh(new THREE.BoxGeometry(25, 25, 25), material);
  cube.position.set(40,20,0)
  scene.add(cube);

  // ShaderFiles for the rightmost sphere
  var shaderFiles = [
    'glsl/normal.vs.glsl',
    'glsl/normal.fs.glsl',
  ];

  // loading shader files for the rightmost sphere
  new THREE.SourceLoader().load(shaderFiles, function(shaders) {
    sphere2Material.vertexShader = shaders['glsl/normal.vs.glsl'];
    sphere2Material.fragmentShader = shaders['glsl/normal.fs.glsl'];
    sphere2Material.needsUpdate = true;
  })

  // Setting the rightmost sphere
  var sphere2Texture = new THREE.ImageUtils.loadTexture('images/texture.jpg');
  var sphere2Material = new THREE.ShaderMaterial({
    uniforms: {
      texture1 : {type: 't', value: sphere2Texture},
      scale: {type: "f", value: 5.0},
    },
  });

  sphere2 = new THREE.Mesh( new THREE.SphereGeometry(25, 80, 80), sphere2Material);
  sphere2.position.set(120,20,0);
  scene.add(sphere2);

  window.addEventListener('resize', onWindowResized, false);
  onWindowResized(null);
}

// onWindowResized function: resizing projection aspect ratio and window
function onWindowResized(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.projectionMatrix.makePerspective(70, window.innerWidth / window.innerHeight, 1, 1100);
}

// animate function: allows control for camera perspective and object movements
function animate() {
        controls.update();
        requestAnimationFrame(animate);
        render();
}

// render function: object translation and rotation, removes self-reflection for the leftmost sphere
function render() {
  var time = Date.now();

  sphere.position.y = 50*Math.sin(0.001*time);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  tetrahedron.position.z = 50*Math.sin(0.001*time);
  tetrahedron.rotation.x += 0.01;
  tetrahedron.rotation.y += 0.01;

  cube.position.z = -50*Math.sin(0.001*time);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere2.position.y = -50*Math.sin(0.001*time);
  sphere2.rotation.x += 0.01;
  sphere2.rotation.y += 0.01;

  sphere.visible = false;

  cubeCamera.updateCubeMap(renderer, scene);

  sphere.visible = true;

  renderer.render(scene, camera);
}

/**
 * UBC CPSC 314, Vjan2015
 * Assignment 2 Template
 */

var scene = new THREE.Scene();

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,15,40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// UNIFORMS
var gemPosition = {type: 'v3', value: new THREE.Vector3(0,5,10)};
var gemRadius = {type: 'f', value: 1.0};

// MATERIALS
var normalMaterial = new THREE.MeshNormalMaterial();
var redMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
// added: for eyes
var whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

var gemMaterial = new THREE.ShaderMaterial({
   uniforms: {
    gemRadius : gemRadius,
  },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/gem.vs.glsl',
  'glsl/gem.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  gemMaterial.vertexShader = shaders['glsl/gem.vs.glsl'];
  gemMaterial.fragmentShader = shaders['glsl/gem.fs.glsl'];
})

// GEOMETRY
var parallelepiped = new THREE.BoxGeometry(4, 6, 4); // centered on origin
var sphere = new THREE.SphereGeometry(1, 32, 32); // centered on origin
var eye = new THREE.CircleGeometry(0.3, 64); // added: for eye sphere

var elipse = new THREE.SphereGeometry(1, 64, 64); // placed with lowest y point on origin
for (var i = 0; i < elipse.vertices.length; i++) 
    elipse.vertices[i].y = (elipse.vertices[i].y + 1) * 1.5;

var thinCylinder = new THREE.CylinderGeometry(.1, .1, 2, 16); // placed with lowest y point on origin
for (var i = 0; i < thinCylinder.vertices.length; i++)
    thinCylinder.vertices[i].y += 1;

// STATIC MATRICES
var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);
var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);

// added: added for arm

var rightupperarmMatrix = new THREE.Matrix4().set(
  Math.cos(-135*Math.PI/180),-Math.sin(-135*Math.PI/180),0,2, 
  Math.sin(-135*Math.PI/180),Math.cos(-135*Math.PI/180),0,3, 
  0,0,1,0, 
  0,0,0,1);

var rightforearmMatrix = new THREE.Matrix4().set(
  Math.cos(-45*Math.PI/180),-Math.sin(-45*Math.PI/180),0,0, 
  Math.sin(-45*Math.PI/180),Math.cos(-45*Math.PI/180),0,3, 
  0,0,1,0, 
  0,0,0,1);

// added: for eyes
var righteyeMatrix = new THREE.Matrix4().set(1,0,0,0.5, 0,1,0,1.5, 0,0,1,1, 0,0,0,1);
var lefteyeMatrix = new THREE.Matrix4().set(1,0,0,-0.5, 0,1,0,1.5, 0,0,1,1, 0,0,0,1);

var headtorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, headMatrix);

// added: matrix for left and right eyes
var lefteyeheadMatrix = new THREE.Matrix4().multiplyMatrices(headtorsoMatrix, lefteyeMatrix);
var righteyeheadMatrix = new THREE.Matrix4().multiplyMatrices(headtorsoMatrix, righteyeMatrix);

// CREATE GEOMETRY
var gem = new THREE.Mesh(sphere, gemMaterial);
scene.add(gem);

var lefteye = new THREE.Mesh(eye, whiteMaterial);
lefteye.setMatrix(lefteyeheadMatrix);
scene.add(lefteye);

var righteye = new THREE.Mesh(eye, whiteMaterial);
righteye.setMatrix(righteyeheadMatrix);
scene.add(righteye);

var torso = new THREE.Mesh(parallelepiped, normalMaterial);
torso.setMatrix(torsoMatrix)
scene.add(torso);

var head = new THREE.Mesh(elipse, normalMaterial);
head.setMatrix(headtorsoMatrix);
scene.add(head);

// complete body here
// added: for upperarm and forearm

var rightupperarm = new THREE.Mesh(elipse, normalMaterial);
scene.add(rightupperarm);

var rightforearm = new THREE.Mesh(elipse, normalMaterial);
scene.add(rightforearm);

var leftBeam = new THREE.Mesh(thinCylinder, redMaterial);
scene.add(leftBeam);

var rightBeam = new THREE.Mesh(thinCylinder, redMaterial);
scene.add(rightBeam);

// MOVE BODY
var clock = new THREE.Clock(true);
function updateBody() {
  var t = clock.getElapsedTime(); // current time

// added: Right Arm rotation matrix
  if (Math.cos(t/2) > 0 && Math.sin(t/2) > 0) {
	  var rotMatrixZ = new THREE.Matrix4().set(
	    Math.cos(t/2),-Math.sin(t/2),0,0,
	    Math.sin(t/2),Math.cos(t/2),0,0,
	    0,0,1,0,
	    0,0,0,1);
  } else if (Math.cos(t/2) < 0 && Math.sin(t/2) > 0) {
  	var rotMatrixZ = new THREE.Matrix4().set(
      Math.cos(-t/2-Math.PI),-Math.sin(-t/2-Math.PI),0,0,
	    Math.sin(-t/2-Math.PI),Math.cos(-t/2-Math.PI),0,0,
	    0,0,1,0,
	    0,0,0,1);
  } else if (Math.cos(t/2) < 0 && Math.sin(t/2) < 0) {
  	var rotMatrixZ = new THREE.Matrix4().set(
      Math.cos(t/2-Math.PI),-Math.sin(t/2-Math.PI),0,0,
	    Math.sin(t/2-Math.PI),Math.cos(t/2-Math.PI),0,0,
	    0,0,1,0,
	    0,0,0,1);
  } else if (Math.cos(t/2) > 0 && Math.sin(t/2) < 0) {
  	var rotMatrixZ = new THREE.Matrix4().set(
      Math.cos(-t/2),-Math.sin(-t/2),0,0,
	    Math.sin(-t/2),Math.cos(-t/2),0,0,
	    0,0,1,0,
	    0,0,0,1);
  }

// added: new matrix set for right upper and forearm
  var rightupperarmtorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, rightupperarmMatrix);
  var rotatingrightupperarm = new THREE.Matrix4().multiplyMatrices(rightupperarmtorsoMatrix, rotMatrixZ);

  var rightforearmrightupperarmMatrix = new THREE.Matrix4().multiplyMatrices(rotatingrightupperarm, rightforearmMatrix);

  rightupperarm.setMatrix(rotatingrightupperarm);
  rightforearm.setMatrix(new THREE.Matrix4().multiplyMatrices(rightforearmrightupperarmMatrix, rotMatrixZ));

  // move elements here

  gem.setMatrix(new THREE.Matrix4().set(
      1,0,0,gemPosition.value.x,
      0,1,0,gemPosition.value.y,
      0,0,1,gemPosition.value.z,
      0,0,0,1
  ));

  // added: matrix for left and right beams
  var rho = Math.sqrt(
  	Math.pow(gemPosition.value.x-0.5, 2) +
  	Math.pow(7.5-gemPosition.value.y, 2) +
  	Math.pow(gemPosition.value.z-1, 2));

  var phi1 = Math.atan((gemPosition.value.z-0.5)/(8-gemPosition.value.y));
  var phi2 = Math.atan(0.5/gemPosition.value.z);
  var phi3 = Math.atan((-0.5)/gemPosition.value.z);
  var phi4 = Math.atan((gemPosition.value.x)/gemPosition.value.z);
  var phi5 = Math.atan((-gemPosition.value.x)/gemPosition.value.z);

  var beamMatrix0 = new THREE.Matrix4().set(
    1,0,0,0,
    0,rho/2,0,0,
    0,0,1,0,
    0,0,0,1);

  var beamMatrix1 = new THREE.Matrix4().set(
    1,0,0,0,
    0,Math.cos(-phi1-Math.PI),-Math.sin(-phi1-Math.PI),0,
    0,Math.sin(-phi1-Math.PI),Math.cos(-phi1-Math.PI),0,
    0,0,0,1);

  var beamMatrix2 = new THREE.Matrix4().set(
    Math.cos(phi2),-Math.sin(phi2),0,0,
    Math.sin(phi2),Math.cos(phi2),0,0,
    0,0,1,0,
    0,0,0,1);

  var beamMatrix3 = new THREE.Matrix4().set(
    Math.cos(phi3),-Math.sin(phi3),0,0,
    Math.sin(phi3),Math.cos(phi3),0,0,
    0,0,1,0,
    0,0,0,1);

  var beamMatrix4 = new THREE.Matrix4().set(
    Math.cos(phi4),-Math.sin(phi4),0,0,
    Math.sin(phi4),Math.cos(phi4),0,0,
    0,0,1,0,
    0,0,0,1);

  var beamMatrix5 = new THREE.Matrix4().set(
    Math.cos(phi5),-Math.sin(phi5),0,0,
    Math.sin(phi5),Math.cos(phi5),0,0,
    0,0,1,0,
    0,0,0,1);

  var lefteyebeamMatrix  = new THREE.Matrix4().multiplyMatrices(lefteyeheadMatrix, beamMatrix1);
  lefteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(lefteyebeamMatrix, beamMatrix3);
  lefteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(lefteyebeamMatrix, beamMatrix5);
  lefteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(lefteyebeamMatrix, beamMatrix0);

  var righteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(righteyeheadMatrix, beamMatrix1);
  righteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(righteyebeamMatrix, beamMatrix2);
  righteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(righteyebeamMatrix, beamMatrix5);
  righteyebeamMatrix = new THREE.Matrix4().multiplyMatrices(righteyebeamMatrix, beamMatrix0);

  leftBeam.setMatrix(lefteyebeamMatrix);
  rightBeam.setMatrix(righteyebeamMatrix);

}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    gemPosition.value.z -= 0.1;
  else if (keyboard.pressed("S"))
    gemPosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    gemPosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    gemPosition.value.x += 0.1;

  if (keyboard.pressed("R"))
    gemRadius.value += 0.1;
  else if (keyboard.pressed("F"))
    gemRadius.value -= 0.1;

  gemMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();
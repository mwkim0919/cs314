/**
 * UBC CPSC 314, Vjan2015
 * Assignment 4 Template
 */

var scene = new THREE.Scene();

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

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5) ;
scene.add(worldFrame);

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
floor.parent = worldFrame;

// BASIC LIGHTING
var ambientLight = new THREE.AmbientLight( 0x5f5f5f );
scene.add( ambientLight );

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(70,100,70);
scene.add(pointLight);    

// TODO: DEFINE SHADER FILES
var shaderFiles = [
  'glsl/basic.vs.glsl',
  'glsl/basic.fs.glsl',
  'glsl/projector.vs.glsl',
  'glsl/projector.fs.glsl',
];


new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  octaMaterial.vertexShader = shaders['glsl/basic.vs.glsl'];
  octaMaterial.fragmentShader = shaders['glsl/basic.fs.glsl'];
  octaMaterial.needsUpdate = true;

  projMaterial.vertexShader = shaders['glsl/projector.vs.glsl'];
  projMaterial.fragmentShader = shaders['glsl/projector.fs.glsl'];
  projMaterial.needsUpdate = true;
})

//////BASIC TEXTURING//////
var bGeom = new THREE.OctahedronGeometry(1, 1, 1);

// TODO: REPLACE THIS with a ShaderMaterial for basic texturing. Add
// necessary shader files to glsl directory. If you want, you can add
// Phong shading using your code from Assignment 3
// loading image
var octaTexture = new THREE.ImageUtils.loadTexture('images/gravel-rocks-texture.jpg');
var octaMaterial = new THREE.ShaderMaterial({
	uniforms: {
     textOct : {type : 't', 
                value: octaTexture},
 	},
});

// Define Mesh, position it appropriately, and add to scene
var bMesh = new THREE.Mesh(bGeom, octaMaterial);

bMesh.position.set(-2.5, 2.5, 2.5);
bMesh.parent = worldFrame;
scene.add(bMesh);

//////REFLECTION MAPS //////
var rGeom = new THREE.SphereGeometry(1, 32, 32);

// TODO: Load cube environment map using THREE.ImageUtils.loadTextureCube
// set Texure.format  THREE.RGBFormat;
var textImgs = ['images/cubemap_real/cube1.png','images/cubemap_real/cube2.png','images/cubemap_real/cube3.png',
'images/cubemap_real/cube4.png','images/cubemap_real/cube5.png','images/cubemap_real/cube6.png'];
var textImgs2 = ['images/cubemap_debug/right1.png','images/cubemap_debug/left.png','images/cubemap_debug/sky.png',
'images/cubemap_debug/ground.png','images/cubemap_debug/middle.png','images/cubemap_debug/right2.png'];

var textureCube = new THREE.ImageUtils.loadTextureCube(textImgs);
textureCube.format = THREE.RGBFormat;

// TODO: Add environment map to the Three.js material
var rMat = new THREE.MeshBasicMaterial({envMap: textureCube});

var rMesh = new THREE.Mesh(rGeom, rMat);

rMesh.position.set(0, 2.5, 2.5);
rMesh.parent = worldFrame;
scene.add(rMesh);

//////PROJECTOR MAPS //////

// Geometry
var pGeom = new THREE.SphereGeometry(1,32,32);
var pMPos = new THREE.Vector3(2.5,2.5,2.5); //Mesh position in world
var pPPos = new THREE.Vector3(2.5,2.5,10); //Projector position in world

// TODO: Construct Projector's  "View" matrix, using Matrix4.lookAt. 
// Don't forget the translation component of the matrix!
var up1 = new THREE.Vector3(0,1,0);
var lookMat = new THREE.Matrix4().lookAt(pPPos, pMPos, up1);
var viewMat = lookMat.makeTranslation(-2.5,-2.5,-10);

// TODO: Construct Projector's "Projection" matrix
// Create the projection matrix in texture space
var projMat = new THREE.Matrix4().makeTranslation(new THREE.Vector3(0.5,0.5,0.5)).makeScale(new THREE.Vector3(0.5,0.5,1)).makePerspective(10, 1, 0.1, 10);

// TODO: REPLACE the following line with a ShaderMaterial, pass texture and
// projector related matrices to the vertex shader
var projTexture = new THREE.ImageUtils.loadTexture('images/logoUBC.jpg');
var projMaterial = new THREE.ShaderMaterial({
  uniforms: {
     textProj : {type : 't', value: projTexture},
     viewMat : {type : 'm4', value: viewMat},
     projMat : {type : 'm4', value: projMat},
  },
});

var pMesh = new THREE.Mesh(pGeom, projMaterial);
pMesh.position.set(pMPos.x,pMPos.y,pMPos.z);
pMesh.parent = worldFrame;
scene.add(pMesh);

// SETUP UPDATE CALL-BACK
function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();

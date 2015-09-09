/**
 * UBC CPSC 314, Vjan2015
 * Assignment 3 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
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

// LIGHTING UNIFORMS
var lightColor = new THREE.Color(1,1,1);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightPosition = new THREE.Vector3(70,100,70);

// MATERIALS
var gem_toonMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var gem_gouraudMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var gem_phongMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var gem_phong_blinnMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var armadilloMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/example.vs.glsl',
  'glsl/example.fs.glsl',
  'glsl/gouraud.vs.glsl',
  'glsl/gouraud.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/example.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/example.fs.glsl'];
  armadilloMaterial.needsUpdate = true;

  gem_gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
  gem_gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
  gem_gouraudMaterial.needsUpdate = true;

  gem_phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  gem_phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  gem_phongMaterial.needsUpdate = true;

  gem_phong_blinnMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
  gem_phong_blinnMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
  gem_phong_blinnMaterial.needsUpdate = true;

  gem_toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  gem_toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
  gem_toonMaterial.needsUpdate = true;
})

// LOAD ARMADILLO
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader()
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = floor;
    scene.add(object);

  }, onProgress, onError);
}

loadOBJ('obj/armadillo.obj', armadilloMaterial, 3, 0,3,-2, 0,Math.PI,0);

// CREATE SPHERES
var sphere = new THREE.SphereGeometry(1, 32, 32);
var gem_gouraud = new THREE.Mesh(sphere, gem_gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, gem_phongMaterial);
gem_phong.position.set(-1, 1, -1);
scene.add(gem_phong);
gem_phong.parent = floor;

var gem_phong_blinn = new THREE.Mesh(sphere, gem_phong_blinnMaterial);
gem_phong_blinn.position.set(1, 1, -1);
scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

var gem_toon = new THREE.Mesh(sphere, gem_toonMaterial);
gem_toon.position.set(3, 1, -1);
scene.add(gem_toon);
gem_toon.parent = floor;

// SETUP UPDATE CALL-BACK
var keyboard = new THREEx.KeyboardState();
var render = function() {
 // tip: change armadillo shading here according to keyboard
  new THREE.SourceLoader().load(shaderFiles, function(shaders) {

    if (keyboard.pressed("1")) {
      armadilloMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
      armadilloMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
      armadilloMaterial.needsUpdate = true;
    } else if (keyboard.pressed("2")) {
      armadilloMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
      armadilloMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
      armadilloMaterial.needsUpdate = true;
    } else if (keyboard.pressed("3")) {
      armadilloMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
      armadilloMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
      armadilloMaterial.needsUpdate = true;
    } else if (keyboard.pressed("4")) {
      armadilloMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
      armadilloMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
      armadilloMaterial.needsUpdate = true;
    } else if (keyboard.pressed("0")) {
      armadilloMaterial.vertexShader = shaders['glsl/example.vs.glsl'];
      armadilloMaterial.fragmentShader = shaders['glsl/example.fs.glsl'];
      armadilloMaterial.needsUpdate = true;
    }
  })
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
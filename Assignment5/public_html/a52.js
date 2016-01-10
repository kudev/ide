/* global data, THREE */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x404040));

light = new THREE.DirectionalLight(0xffffff);
light.position.set(-200, 20, 50);
scene.add(light);

var geometry = new THREE.PlaneGeometry(5, 20, 32); 
var material = new THREE.MeshLambertMaterial( {
    side: THREE.DoubleSide,
    map: THREE.ImageUtils.loadTexture("MRI/axial_stack/slice_001.png")
}); 


var plane = new THREE.Mesh(geometry, material);
scene.add(plane);



camera.position.x = -200;
camera.position.y = 20;
camera.position.z = 50;

scene.add(new THREE.AxisHelper(200));

controls = new THREE.OrbitControls(camera, renderer.domElement);
//controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();
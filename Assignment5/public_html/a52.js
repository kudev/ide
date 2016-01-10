/* global data, THREE */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x404040));

light = new THREE.DirectionalLight(0xffffff);
light.position.set(-200, 20, 50);
scene.add(light);

var geometry = new THREE.PlaneGeometry(20, 20);

function pad(x) {
    return ("000" + x).substr(("" + x).length);
}

var PI = 3.14159265;
for (var i = 1; i < 182; ++i) {
    var material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        map: THREE.ImageUtils.loadTexture("MRI/axial_stack/slice_" + pad(i) + ".png")
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i * 10, 0, 0);
    mesh.rotation.y = PI / 2;
    scene.add(mesh);

    var material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        map: THREE.ImageUtils.loadTexture("MRI/coronal_stack/slice_" + pad(i) + ".png")
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, i * 10, 0);
    mesh.rotation.x = PI / 2;
    scene.add(mesh);

    var material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        map: THREE.ImageUtils.loadTexture("MRI/sagittal_stack/slice_" + pad(i) + ".png")
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, i * 10);
    mesh.rotation.z = PI / 2;
    scene.add(mesh);
}


camera.position.x = -200;
camera.position.y = 20;
camera.position.z = 50;

scene.add(new THREE.AxisHelper(200));

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();
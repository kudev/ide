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

function cylinderMesh(pointX, pointY, material) {
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
            0, 0, 1, 0,
            0, -1, 0, 0,
            0, 0, 0, 1));
    var edgeGeometry = new THREE.CylinderGeometry(.2, .2, direction.length(), 8, 1);
    var edge = new THREE.Mesh(edgeGeometry, material);
    edge.applyMatrix(orientation);
    // position based on midpoints - there may be a better solution than this
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;
    return edge;
}

var colours = {
    C: new THREE.MeshPhongMaterial({color: 0x808080, shininess: 60, shading: THREE.FlatShading}),
    N: new THREE.MeshPhongMaterial({color: 0x0000FF, shininess: 60, shading: THREE.FlatShading}),
    O: new THREE.MeshPhongMaterial({color: 0xFF0000, shininess: 60, shading: THREE.FlatShading}),
    S: new THREE.MeshPhongMaterial({color: 0xFFFF00, shininess: 60, shading: THREE.FlatShading}),
    H: new THREE.MeshPhongMaterial({color: 0xFFFFFF, shininess: 60, shading: THREE.FlatShading})
};

for (var i = 0; i < data.length; ++i) {
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3), colours[data[i].type]);
    sphere.position.set(data[i].x, data[i].y, data[i].z);
    scene.add(sphere);

    for (var j = i + 1; j < data.length; ++j) {
        var d = Math.sqrt(
                (data[i].x - data[j].x) * (data[i].x - data[j].x) +
                (data[i].y - data[j].y) * (data[i].y - data[j].y) +
                (data[i].z - data[j].z) * (data[i].z - data[j].z));
        if (d < 1.9) {
            var p1 = new THREE.Vector3(data[i].x, data[i].y, data[i].z);
            var p2 = new THREE.Vector3(data[j].x, data[j].y, data[j].z);
            scene.add(cylinderMesh(p1, p2, colours.O));
        }
    }
}

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
// Add orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 30);
controls.update();
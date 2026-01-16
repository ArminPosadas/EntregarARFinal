//declaracion de escena
const scene = new THREE.Scene();
scene.backgroud = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set (0, 2, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
const point = new THREE.PointLight(0xffffff, 1);
point.position.set(2, 3, 2);
scene.add(point);
function arbolNivel(y, scale){
    const geometry = new THREE.BoxGeometry(scale, scale, scale);
    const material = new THREE.MeshStandardMaterial({ color: 0x067D00 });

    const cubo = new THREE.Mesh(geometry, material);
    cubo.position.y = y;
    scene.add(cubo);
}
const tronco = new THREE.BoxGeometry(0.7,1.5, 0.7);
const maTronco = new THREE.MeshStandardMaterial({color: 0x592200});
const troncoMesh = new THREE.Mesh(tronco, maTronco);
scene.add(tronco);
const puntaArbol = arbolNivel(0, 4);
const medioArbol = arbolNivel(1.5, 3);
const baseArbol = arbolNivel(3, 2);
const star = new THREE.Mesh(
    new THREE.BoxGeometry(0.8,0.8,0.8),
    new THREE.MeshStandardMaterial({color: 0xF4FF00})
);
star.position.y = 4;
scene.add(star);

let rotar = true;

document.getElementById("rotate").addEventListener("click", () => {
    rotar = !rotar;
    document.getElementById("rotate").textContent = rotar ? "desactivar" : "activar";
});

function animate() {
    requestAnimationFrame(animate);
    if (rotar) scene.rotation.y += 0.003;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
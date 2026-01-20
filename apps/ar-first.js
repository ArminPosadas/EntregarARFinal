import * as THREE from 'three';
import { ARButton } from 'js/ARButton.js';
import { GLTFLoader } from 'js/GLFTLoader.js';
import { PerspectiveCamera } from `js/three.module`;

let camera, scene, renderer, model;
let controller;
let reticle;

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));
    
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.1, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    window.addEventListener('resize', onWindowResize);
    
    loadModel();
}

function loadModel() {
    const loader = new GLTFLoader();
    loader.load('models/Slime.glb', function (gltf) {
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.visible = false;
        model.name = 'slime_model';
        
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });
}

function onSelect() {
    if (model && !model.parent) {
        const placedModel = model.clone();
        placedModel.visible = true;
        
        if (reticle.visible) {
            placedModel.position.copy(reticle.position);
            placedModel.quaternion.copy(reticle.quaternion);
        } else {
            placedModel.position.setFromMatrixPosition(controller.matrixWorld);
            placedModel.quaternion.setFromRotationMatrix(controller.matrixWorld);
        }
        
        scene.add(placedModel);
    }
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();
        
        if (session && referenceSpace) {
            updateReticle(frame);
        }
    }
    
    renderer.render(scene, camera);
}

function updateReticle(frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const hitTestSource = renderer.xr.getHitTestSource(0);
    
    if (hitTestSource && frame) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        
        if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            
            reticle.visible = true;
            reticle.matrix.fromArray(pose.transform.matrix);
        } else {
            reticle.visible = false;
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



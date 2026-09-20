

<script setup>

    /*
        npm run lint
        npm run build
        npm run dev
    */


import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import {createAxes} from '../Scripts/createAxes.js';
import {createStickman} from '../Scripts/Practice1/stickman.js';

import * as MyMatrix from '../Scripts/matrixOperations.js';


// ============================================================
// VUE
// ============================================================

const container = ref(null)


// ============================================================
// THREE.JS - VARIABLES PRINCIPALES
// ============================================================

let renderer = null;
let scene;
let camera = null;
let controls = null;
let animationId;

let scaleMatrix = new THREE.Matrix4();
let rotationMatrix = new THREE.Matrix4();
let translationMatrix = new THREE.Matrix4();

let modelMatrix = new THREE.Matrix4();


// ============================================================
// GUI
// ============================================================

const params = {
    axis: true,
    
    type: 'Translation',
    x:0,
    y:0,
    z:0,
    
}

let gui;

function createGUI() {

    gui = new GUI({
        container: container.value
    });

    gui.add(params, "axis").name("Axis")
    .onChange(() => { reloadScene(); });

    const transformFolder = gui.addFolder('Transformations');

    transformFolder.add(params, 'type',
        [
            'Scale',
            'Rotation',
            'Translation'
        ]
    ).name('Transformation');

    transformFolder.add(params, 'x').name('X');
    transformFolder.add(params, 'y').name('Y');
    transformFolder.add(params, 'z').name('Z');

    const actions = { apply() { applyTransformation(); } };

    transformFolder.add(actions, 'apply').name('Apply');

}


function applyTransformation() {

    let _x = params.x;
    let _y = params.y;
    let _z = params.z;


    switch (params.type) {

        case 'Translation':{

            const t = MyMatrix.getTranslationMatrix (_x, _y, _z);
            translationMatrix.multiply(t);
            break;
        }

        case 'Scale':{

            if(_x<=0) _x = 1;
            if(_y<=0) _y = 1;
            if(_z<=0) _z = 1;

            const s = MyMatrix.getScaleMatrix (_x, _y, _z);
            scaleMatrix.multiply(s);

            console.log('Scale values:', _x, _y, _z)
            console.log('S:', s.elements)

            break;
        }

        case 'Rotation':{

            const Rx = MyMatrix.getRotationXmatrix(_x);
            const Ry = MyMatrix.getRotationYmatrix(_y);
            const Rz = MyMatrix.getRotationZmatrix(_z);

            rotationMatrix
                .identity()
                .multiply(Rx)
                .multiply(Ry)
                .multiply(Rz);

            break
        }
    }

    reloadScene();

    // Reset parameters
    params.x=0;
    params.y=0;
    params.z=0;
}


// ============================================================
// INICIALIZACIÓN
// ============================================================

onMounted(() => {

    initRenderer();

    createCamera();

    createControls();

    loadScene();

    createGUI();

    registerEvents();

    startRenderLoop();

})

// ============================================================
// RENDERER
// ============================================================

function initRenderer() {

    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setSize(width, height);

    container.value.appendChild(renderer.domElement);

}

// ============================================================
// CAMERA
// ============================================================

function createCamera() {

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    let aspect = width / height

    camera = new THREE.PerspectiveCamera(
        50,
        aspect,
        0.1,
        1000
    )    

    camera.position.set(9, 5, 9);

    camera.lookAt(0, 0, 0);

}

function createControls() {

    controls = new OrbitControls(
        camera,
        renderer.domElement
    )

    controls.target.set(0, 0, 0)

    controls.enableRotate = true
    controls.enableZoom = false
    controls.enablePan = false

    controls.enableDamping = true
    controls.dampingFactor = 0.05

    controls.update()
}


// ============================================================
// LIGHTS
// ============================================================

function addLights(scene) {

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

    directionalLight.position.set(0, 10, 0)

    directionalLight.target.position.set(-5, 0, 0)

    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(directionalLight.target)
}


// ============================================================
// SCENE
// ============================================================

function loadScene() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color('white');

    addLights(scene);

    //----- EJES -----
    if(params.axis){
        scene.add(createAxes());
    }

    const stickman = createStickman();

    // Tansformaciones
    const newModelMatrix = new THREE.Matrix4();
    modelMatrix.identity();

    // M = T · R · S
    newModelMatrix.multiply(translationMatrix).multiply(rotationMatrix).multiply(scaleMatrix);

    stickman.applyMatrix4(newModelMatrix);

    scene.add(stickman);
}

// ============================================================
// RENDER LOOP
// ============================================================

function startRenderLoop() { 
    
    function render() {
        
        animationId = requestAnimationFrame(render)

        controls.update();

        const width = container.value.clientWidth;
        const height = container.value.clientHeight;

        renderer.setViewport(
            0,
            0,
            width,
            height
        );

        renderer.render(
            scene,
            camera
        );

    }

    render()
}


// ============================================================
// EVENTS
// ============================================================

function registerEvents() {

    window.addEventListener(
        'resize',
        handleResize
    )
}


// ============================================================
// RELOAD SCENE
// ============================================================

function reloadScene() {

    disposeScene(scene);
    loadScene();
}

// ============================================================
// WINDOW RESIZE
// ============================================================

function handleResize() {

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    const aspect = width / height;

    renderer.setSize(width, height);

    camera.aspect = aspect;

    camera.updateProjectionMatrix();
}


// ============================================================
// MEMORY CLEANUP
// ============================================================

function disposeScene(scene) {

    if (!scene) {
        return
    }

    scene.traverse((object) => {


         if (object.isCSS2DObject) {
            object.element.remove()
        }

        if (object.geometry) {
            object.geometry.dispose()
        }

        if (object.material) {

            if (Array.isArray(object.material)) {

                object.material.forEach(
                    material => material.dispose()
                )

            } else {

                object.material.dispose()
            }
        }
    })
}

// ============================================================
// VUE CLEANUP
// ============================================================

onUnmounted(() => {

    cancelAnimationFrame(animationId)

    window.removeEventListener(
        'resize',
        handleResize
    )

    disposeScene(scene)

    renderer?.dispose()
})
</script>

<template>
    <div
        ref="container"
        class="three-container"
    ></div>
</template>

<style scoped>
.three-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.three-container :deep(.lil-gui.root) {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}
</style>
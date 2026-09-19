<script setup>

/*
    npm run lint
    npm run build
    npm run dev
*/

import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

import { createScene1 } from '../Scripts/Practice2/createScene1.js'
import { createScene2 } from '../Scripts/Practice1/createScene2.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// ============================================================
// VUE
// ============================================================

const container = ref(null)


// ============================================================
// THREE.JS - VARIABLES PRINCIPALES
// ============================================================

let renderer;
let camera;
let activeScene;
let animationId;

let controls = null;



// ============================================================
// ESTADO DE LA APLICACIÓN
// ============================================================

const params = {
    
    selectedScene: "Mesh",

    radius: 1,
    height: 1.5,
    radialSegments: 12, 
    heightSegments: 1,

    rotX: 0,
    rotY:0,
    rotZ:0    
}


// ============================================================
// GUI
// ============================================================

let gui

function createGUI() {

    gui = new GUI({
        container: container.value
    });

    
    const sceneFolder = gui.addFolder('Scene');
    const meshFolder = gui.addFolder('Mesh');
    const rotateFolder = gui.addFolder('Rotate')

    sceneFolder.add(params, 'selectedScene', ["Mesh", "Proyections"]).name("Selected Scene")
        .onChange(() => {
            reloadScene();
        });
    
    
    meshFolder.add(params, 'radius', 0.5, 4, 0.1).name("Radius")
        .onChange(() => {
            reloadScene();
        });

    meshFolder.add(params, 'height', 0.5, 4, 0.1).name("Height")
        .onChange(() => {
            reloadScene();
        });

    meshFolder.add(params, 'radialSegments', 6, 20, 1).name("Radial Segments")
        .onChange(() => {
            reloadScene();
        });

    meshFolder.add(params, 'heightSegments', 1, 4, 1).name("Height Segments")
        .onChange(() => {
            reloadScene();
        });

    rotateFolder.add(params, 'rotX', 0, 180, 1).name("x")
        .onChange(() => {
            reloadScene();
        });

    rotateFolder.add(params, 'rotY', 0, 180, 1).name("y")
        .onChange(() => {
            reloadScene();
        });

    rotateFolder.add(params, 'rotZ', 0, 180, 1).name("z")
        .onChange(() => {
            reloadScene();
        });


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

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setSize(width, height)

    container.value.appendChild(renderer.domElement)
}

// ============================================================
// CAMERA
// ============================================================

function createCamera() {
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    let aspect = width / height;

    camera = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        1000
    ); 

    camera.position.set(10, 5, 10);

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
// SCENES
// ============================================================

function loadScene() {

    activeScene = new THREE.Scene()

    activeScene.background = new THREE.Color('white')

    addLights(activeScene)

    switch (params.selectedScene) {

        case "Mesh":
            activeScene.add(createScene1( params.radius, params.height, 
                                        params.radialSegments, params.heightSegments,
                                        params.rotX, params.rotY, params.rotZ))
            break

        case "Proyections":
            activeScene.add(createScene2())
            break
    }
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
// RENDER LOOP
// ============================================================

function startRenderLoop() { 
    
    function render() {

        animationId = requestAnimationFrame(render)

        controls.update();    

        renderer.setScissorTest(false)

        const width = container.value.clientWidth
        const height = container.value.clientHeight

        renderer.setViewport(
            0,
            0,
            width,
            height
        )

        renderer.render(
            activeScene,
            camera
        )
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

    disposeScene(activeScene)
    loadScene()
}


// ============================================================
// WINDOW RESIZE
// ============================================================

function handleResize() {

    const width = container.value.clientWidth;
    const height = container.value.clientHeight;

    const aspect = width / height;

    renderer.setSize(
        width,
        height
    );
 
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

    cancelAnimationFrame(animationId);

    window.removeEventListener(
        'resize',
        handleResize
    );

    disposeScene(activeScene);

    renderer?.dispose();
})

</script>


<template>
    <div ref="container" class="three-container"/>
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
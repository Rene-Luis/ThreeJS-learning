<script setup>

/*
    npm run lint
    npm run build
    npm run dev
*/

import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

import { createScene1 } from '../Scripts/Practice1/createScene1.js'
import { createScene2 } from '../Scripts/Practice1/createScene2.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'


// ============================================================
// VUE
// ============================================================

const container = ref(null)


// ============================================================
// THREE.JS - VARIABLES PRINCIPALES
// ============================================================

let renderer
let activeCamera 
let orthographicCamera
let perspectiveCamera
let activeScene
let animationId

let cameraFront
let cameraSide
let cameraTop
let cameraPerspective


// ============================================================
// ESTADO DE LA APLICACIÓN
// ============================================================

const params = {
    
    selectedScene: "Boxes",

    valueX: 1,
    valueY: 1,
    valueZ: 1,

    cameraType: "Perspective",
    position: "3D",
    active4views: false,    
}


let lastPosition = new THREE.Vector3(9,5,9);


// ============================================================
// GUI
// ============================================================

let gui;
let sceneControlsFolder;
let opticControlFolder;

function createGUI() {

    gui = new GUI({
        container: container.value
    });

    
    const sceneFolder = gui.addFolder('Scene')

    sceneFolder.add(params, 'selectedScene', ["Boxes", "Projections"]).name("Selected Scene")
        .onChange(() => {
            reloadScene();
            rebuildSceneControls();
        });    

    rebuildSceneControls();
}

function rebuildSceneControls() {

    // Elimina la carpeta anterior si existe
    if (sceneControlsFolder) {
        sceneControlsFolder.destroy();
        sceneControlsFolder = null;
        opticControlFolder = null
    }


    // Crea una nueva según la escena seleccionada
    switch (params.selectedScene) {

        case 'Boxes':

            sceneControlsFolder = gui.addFolder('Boxes')

            sceneControlsFolder.add(params, 'valueX', 1, 4, 1).name("X-axis")
                .onChange(() => {
                    reloadScene();
                });

            sceneControlsFolder.add(params, 'valueY', 1, 4, 1).name("Y-axis")
                .onChange(() => {
                    reloadScene();
                });

            sceneControlsFolder.add(params, 'valueZ', 1, 4, 1).name("Z-axis")
                .onChange(() => {
                    reloadScene();
                });

            break;


        case 'Projections':

            sceneControlsFolder = gui.addFolder('Projection Controls')

            sceneControlsFolder.add(params, 'cameraType', [
                'Perspective',
                'Orthographic'
            ]).name("Camera type").onChange(() => { 
                toggleCamera();
                createOpticsControls();
            });

            sceneControlsFolder.add(params, 'position', ["3D", "Floor", "Elevation", "Section"]).name("View")
                .onChange(() => {
                    changeCameraPosition();
                });

            sceneControlsFolder.add(params, 'active4views').name("4 viewports")
            .onChange(() => {
                    createOpticsControls();
                });

            createOpticsControls();

            break;
    }
}

function createOpticsControls(){

    if (opticControlFolder) {
        opticControlFolder.destroy()
        opticControlFolder = null
    }

    if(!params.active4views){

        opticControlFolder = sceneControlsFolder.addFolder('Optics')

        if(params.cameraType == 'Perspective') {
            
            opticControlFolder.add( activeCamera, 'fov', 10, 180, 1 )
            .onChange(() => {
                activeCamera.updateProjectionMatrix()
            });
        
        }else if (params.cameraType == 'Orthographic'){
            
            opticControlFolder.add( activeCamera, 'zoom', 0.01, 3, 0.01 ).listen()
            .onChange(() => {
                activeCamera.updateProjectionMatrix()
            });
        }

        opticControlFolder.add(activeCamera, 'near', 0.1, 30, 0.1).onChange(() => {
                if(activeCamera.near >= activeCamera.far)
                     activeCamera.near = activeCamera.far - 0.1;

                activeCamera.updateProjectionMatrix()
            });

        opticControlFolder.add(activeCamera, 'far', activeCamera.near, 30, 0.1).onChange(() => {

                if(activeCamera.near >= activeCamera.far)
                     activeCamera.far = activeCamera.near + 0.1;

                activeCamera.updateProjectionMatrix()
            });
    }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

onMounted(() => {

    initRenderer();

    createCamera();

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

    // ============================================================
    // Cámaras principales: una perspectiva y otra orgonal

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    let aspect = width / height

    const size = 5

    orthographicCamera = new THREE.OrthographicCamera(
        -size * aspect,
        size * aspect,
        size,
        -size,
            0.1,
            30
    )

    perspectiveCamera = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        30
    )    

    perspectiveCamera.position.set(10, 5, 10)
    orthographicCamera.position.set(10, 5, 10)

    perspectiveCamera.lookAt(0, 0, 0)
    orthographicCamera.lookAt(0, 0, 0)

    activeCamera = perspectiveCamera

    // ============================================================
    // 4 cámaras secundarias: para generar la multivista

    const halfWidth = width / 2
    const halfHeight = height / 2

    aspect = halfWidth / halfHeight

    // 1. Vista frontal
    cameraFront = new THREE.OrthographicCamera(
        -size * aspect,
         size * aspect,
         size,
        -size,
         0.1,
         30
    )

    cameraFront.position.set(0, 0, 10)
    cameraFront.lookAt(0, 0, 0)

    // 2. Vista lateral
    cameraSide = new THREE.OrthographicCamera(
        -size * aspect,
         size * aspect,
         size,
        -size,
         0.1,
         30
    )

    cameraSide.position.set(10, 0, 0)
    cameraSide.lookAt(0, 0, 0)

    // 3. Vista superior
    cameraTop = new THREE.OrthographicCamera(
        -size * aspect,
         size * aspect,
         size,
        -size,
         0.1,
         30
    )

    cameraTop.position.set(0, 10, 0)
    cameraTop.lookAt(0, 0, 0)

    // 4. Perspectiva
    cameraPerspective = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        30
    )

    cameraPerspective.position.set(8, 6, 8)
    cameraPerspective.lookAt(0, 0, 0)
}


function toggleCamera() {
    if(params.selectedScene == "Projections"){
        if (params.cameraType == "Orthographic") {
            activeCamera = orthographicCamera
        } else {
            activeCamera = perspectiveCamera
        }

        activeCamera.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
        activeCamera.lookAt(0, 0, 0);
    }
}


function changeCameraPosition(){
    if(params.selectedScene == "Projections"){
        switch (params.position) {
            case "Elevation":
                lastPosition = new THREE.Vector3(6,0,0);
                break;
            
            case "Floor": 
                lastPosition = new THREE.Vector3(0,6,0);
                break;

            case "Section": 
                lastPosition = new THREE.Vector3(0,0,6);
                break;

            case "3D":
            default:
                lastPosition = new THREE.Vector3(9,5,9);
        }

        activeCamera.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
        activeCamera.lookAt(0, 0, 0);
    }
}



// ============================================================
// SCENES
// ============================================================

function loadScene() {

    activeScene = new THREE.Scene()

    activeScene.background = new THREE.Color('white')

    addLights(activeScene)

    switch (params.selectedScene) {

        case "Boxes":
            perspectiveCamera.fov = 60;
            perspectiveCamera.near = 0.1;
            perspectiveCamera.far = 30;
            perspectiveCamera.updateProjectionMatrix();

            activeCamera = perspectiveCamera;

            activeScene.add(createScene1( params.valueX, params.valueY, params.valueZ ))
            break

        case "Projections":
            toggleCamera();
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
        
        if(!params.active4views || params.selectedScene=="Boxes"){

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
                activeCamera
            )

        }else if (params.selectedScene == "Projections"){

            const width = container.value.clientWidth
            const height = container.value.clientHeight

            const halfWidth = Math.floor(width / 2)
            const halfHeight = Math.floor(height / 2)

            renderer.setScissorTest(true)

            // --------------------------------------------------
            // Vista 1 - arriba izquierda

            renderer.setViewport(
                0,
                halfHeight,
                halfWidth,
                halfHeight
            )

            renderer.setScissor(
                0,
                halfHeight,
                halfWidth,
                halfHeight
            )

            renderer.render(
                activeScene,
                cameraFront
            )


            // --------------------------------------------------
            // Vista 2 - arriba derecha

            renderer.setViewport(
                halfWidth,
                halfHeight,
                halfWidth,
                halfHeight
            )

            renderer.setScissor(
                halfWidth,
                halfHeight,
                halfWidth,
                halfHeight
            )

            renderer.render(
                activeScene,
                cameraSide
            )


            // --------------------------------------------------
            // Vista 3 - abajo izquierda

            renderer.setViewport(
                0,
                0,
                halfWidth,
                halfHeight
            )

            renderer.setScissor(
                0,
                0,
                halfWidth,
                halfHeight
            )

            renderer.render(
                activeScene,
                cameraTop
            )


            // --------------------------------------------------
            // Vista 4 - abajo derecha

            renderer.setViewport(
                halfWidth,
                0,
                halfWidth,
                halfHeight
            )

            renderer.setScissor(
                halfWidth,
                0,
                halfWidth,
                halfHeight
            )

            renderer.render(
                activeScene,
                cameraPerspective
            )
        }
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

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    const aspect = width / height

    renderer.setSize(
        width,
        height
    )

    if (activeCamera.isPerspectiveCamera) {

        activeCamera.aspect = aspect

    } else if (activeCamera.isOrthographicCamera) {

        const size = 5

        activeCamera.left = -size * aspect
        activeCamera.right = size * aspect
        activeCamera.top = size
        activeCamera.bottom = -size
    }

    activeCamera.updateProjectionMatrix()
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
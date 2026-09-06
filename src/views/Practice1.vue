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


// ============================================================
// ESTADO DE LA APLICACIÓN
// ============================================================

let selectedScene = 1

let valueX = 1
let valueY = 1
let valueZ = 1

let positionNumber = 0;
let lastPosition = new THREE.Vector3(9,5,9);

// ============================================================
// INICIALIZACIÓN
// ============================================================

onMounted(() => {

    initRenderer()

    createCamera()

    loadScene()

    registerEvents()

    startRenderLoop()

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

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    const aspect = width / height

    const size = 5

    orthographicCamera = new THREE.OrthographicCamera(
        -size * aspect,
        size * aspect,
        size,
        -size,
            0.1,
            1000
    )

    perspectiveCamera = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        1000
    )    

    perspectiveCamera.position.set(9, 5, 9)
    orthographicCamera.position.set(9, 5, 9)

    perspectiveCamera.lookAt(0, 0, 0)
    orthographicCamera.lookAt(0, 0, 0)

    activeCamera = perspectiveCamera
}


function toggleCamera() {
    if (activeCamera === perspectiveCamera) {
        activeCamera = orthographicCamera
    } else {
        activeCamera = perspectiveCamera
    }

    activeCamera.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
    activeCamera.lookAt(0, 0, 0);
}

function changeCameraPosition(){
    switch (positionNumber) {
        case 0:
            lastPosition = new THREE.Vector3(6,0,0);
            positionNumber++;
            break;
        
        case 1: 
            lastPosition = new THREE.Vector3(0,6,0);
            positionNumber++;
            break;

        case 2: 
            lastPosition = new THREE.Vector3(0,0,6);
            positionNumber++;
            break;

        case 3:
        default:
            lastPosition = new THREE.Vector3(9,5,9);
            positionNumber = 0;
    }

    activeCamera.position.set(lastPosition.x, lastPosition.y, lastPosition.z);
    activeCamera.lookAt(0, 0, 0);
}


// ============================================================
// SCENES
// ============================================================

function loadScene() {

    activeScene = new THREE.Scene()

    activeScene.background = new THREE.Color('white')

    addLights(activeScene)

    switch (selectedScene) {

        case 1:
            activeScene.add(createScene1( valueX, valueY, valueZ ))
            break

        case 2:
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

        renderer.render(
            activeScene,
            activeCamera
        )
    }

    render()
}


// ============================================================
// EVENTS
// ============================================================

function registerEvents() {

    window.addEventListener(
        'keydown',
        handleKeyDown
    )

    window.addEventListener(
        'resize',
        handleResize
    )
}


// ============================================================
// KEYBOARD
// ============================================================

function handleKeyDown(event) {

    switch (event.key) {

        // ----------------------------------------------------
        // Scene 1 dimensions
        // ----------------------------------------------------

        case 'X':
            if (valueX < 5) {
                valueX++
                reloadScene()
            }
            break


        case 'x':
            if (valueX > 1) {
                valueX--
                reloadScene()
            }
            break


        case 'Y':
            if (valueY < 5) {
                valueY++
                reloadScene()
            }
            break


        case 'y':
            if (valueY > 1) {
                valueY--
                reloadScene()
            }
            break


        case 'Z':
            if (valueZ < 5) {
                valueZ++
                reloadScene()
            }
            break


        case 'z':
            if (valueZ > 1) {
                valueZ--
                reloadScene()
            }
            break


        // ----------------------------------------------------
        // Camera
        // ----------------------------------------------------

        case 'p':
        case 'P':
            toggleCamera()
            break

        case 'v':
        case 'V':
            changeCameraPosition();
            break;


        // ----------------------------------------------------
        // Scenes
        // ----------------------------------------------------

        case '1':
            selectedScene = 1
            reloadScene()
            break


        case '2':
            selectedScene = 2
            reloadScene()
            break
    }
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

    cancelAnimationFrame(animationId)

    window.removeEventListener(
        'keydown',
        handleKeyDown
    )

    window.removeEventListener(
        'resize',
        handleResize
    )

    disposeScene(activeScene)

    renderer?.dispose()
})

</script>


<template>
    <div ref="container" class="three-container"/>
</template>


<style scoped>
.three-container {
    width: 100%;
    height: 100%;
}
</style>
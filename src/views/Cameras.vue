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

import { createAxes } from '../Scripts/createAxes'

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

let activeCamera;
let orthographicCamera;
let perspectiveCamera;
let cameraHelper;


// ============================================================
// GUI
// ============================================================

const params = {
    axis: true,
    cameraType: "Perspective",
}

let gui;
let cameraFolder;
let opticControlFolder;

function createGUI() {

    gui = new GUI({
        container: container.value
    });

    gui.add(params, "axis").name("Axis")
    .onChange(() => { reloadScene(); });

    cameraFolder = gui.addFolder('Camera');

    cameraFolder.add(params, 'cameraType', [
            'Perspective',
            'Orthographic'
        ]).name("Camera type").onChange(() => { 
            toggleCamera();
            createOpticsControls();
        });

    createOpticsControls();
}


function createOpticsControls(){

    if (opticControlFolder) {
        opticControlFolder.destroy()
        opticControlFolder = null
    }

    if(!params.active4views){

        opticControlFolder = cameraFolder.addFolder('Optics')

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

    let aspect = (width / 2) / height;

    camera = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        1000
    );
    camera.position.set(15, 5, 15);
    camera.lookAt(0, 0, 0);


    perspectiveCamera= new THREE.PerspectiveCamera(
        50,
        aspect,
        1,
        30
    );
    perspectiveCamera.position.set(-6, 3, 6);
    perspectiveCamera.lookAt(0, 0, 0);


    const size = 5

    orthographicCamera = new THREE.OrthographicCamera(
        -size * aspect,
        size * aspect,
        size,
        -size,
        1,
        30
    )
    orthographicCamera.position.set(6, 3, 6);
    orthographicCamera.lookAt(0, 0, 0);

    activeCamera = perspectiveCamera;
}


function createControls() {

    controls = new OrbitControls(
        activeCamera,
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


function toggleCamera() {

    if (params.cameraType == "Orthographic") {

        activeCamera = orthographicCamera;

        activeCamera.position.set(
            perspectiveCamera.position.x,
            perspectiveCamera.position.y,
            perspectiveCamera.position.z
        );

    } else {

        activeCamera = perspectiveCamera;

        activeCamera.position.set(
            orthographicCamera.position.x,
            orthographicCamera.position.y,
            orthographicCamera.position.z
        );
    }

    activeCamera.lookAt(0, 0, 0);
    createControls();
    
    updateCameraHelper();
}

function updateCameraHelper() {
    cameraHelper.camera = activeCamera
    cameraHelper.update()
}


// ============================================================
// LIGHTS
// ============================================================

function addLights(scene) {

    const ambientLight = new THREE.AmbientLight(0x888888, 1)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

    directionalLight.position.set(10, 20, 5)

    directionalLight.target.position.set(0, 0, 0)

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

    if(params.axis)
        scene.add(createAxes());

    addLights(scene);

    // ------ Spheres ------
    const radius = 1;
    const widthSegments = 16;
    const heightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );

    // Toon Material
    const colors = new Uint8Array([
        80,   // oscuro
        170,  // medio
        255   // claro
    ]);

    const gradientMap = new THREE.DataTexture(
        colors,
        3,
        1,
        THREE.RedFormat
    );

    gradientMap.needsUpdate = true;

    gradientMap.minFilter = THREE.NearestFilter
    gradientMap.magFilter = THREE.NearestFilter

    const sphereMaterial1 = new THREE.MeshToonMaterial({ color: 0xF54927, gradientMap: gradientMap });
    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
    sphere1.position.set(-3.2, 1.5, 0);
    scene.add(sphere1);

    const sphereMaterial2 = new THREE.MeshToonMaterial({ color: 0xD3F527, gradientMap: gradientMap });
    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    sphere2.position.set(-1.1, 1.5, 0);
    scene.add(sphere2);

    const sphereMaterial3 = new THREE.MeshToonMaterial({ color: 0x27D3F5, gradientMap: gradientMap });
    const sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial3);
    sphere3.position.set(1.1, 1.5, 0);
    scene.add(sphere3);

    const sphereMaterial4 = new THREE.MeshToonMaterial({ color: 0x4927F5, gradientMap: gradientMap });
    const sphere4 = new THREE.Mesh(sphereGeometry, sphereMaterial4);
    sphere4.position.set(3.2, 1.5, 0);
    scene.add(sphere4);

    // ------ Spheres ------

    const ground = createGround(10, 10);
    scene.add(ground);


    // ------ Camera Helper ------
    cameraHelper = new THREE.CameraHelper( activeCamera );
    scene.add(cameraHelper);
}

function createGround(numX, numY){
    const ground = new THREE.Group();

    const planeGeometry = new THREE.PlaneGeometry( 1, 1, 1, 1 ); 

    for(let i=0; i<numX; i++){
        const posX = i - (numX - 1) / 2;

        for(let j=0; j<numY; j++){
            const posY = j - (numY - 1) / 2;  
            
            const color = new THREE.Color().setRGB( i/10, 0.5, j/10 );

            const planeMaterial = new THREE.MeshBasicMaterial({ color: color });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            
            plane.rotation.x = -Math.PI / 2;
            plane.position.set(
                posX,
                0,
                posY
            );

            ground.add(plane);
        }
    }   

    return ground;
}

// ============================================================
// RENDER LOOP
// ============================================================

function startRenderLoop() { 
    
    function render() {
        
        animationId = requestAnimationFrame(render)

        controls.update();

        cameraHelper.update();

        const width = container.value.clientWidth;
        const height = container.value.clientHeight;

        renderer.setScissorTest(true);

        // -------------

        cameraHelper.visible = false;

        renderer.setViewport(
            0,
            0,
            width/2,
            height
        );

        renderer.setScissor(
            0,
            0,
            width/2,
            height
        );

        renderer.render(
            scene,
            activeCamera
        );

        // -------------

        cameraHelper.visible = true;

        renderer.setViewport(
            width/2,
            0,
            width - width/2,
            height
        );

        renderer.setScissor(
            width/2,
            0,
            width - width/2,
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

    const aspect = (width / 2) / height;

    renderer.setSize(width, height);

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    orthographicCamera.aspect = aspect;
    orthographicCamera.updateProjectionMatrix();
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
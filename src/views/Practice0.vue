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
let controls = null
let animationId;


// ============================================================
// GUI
// ============================================================

const params = {
    sizeX: 1,
    sizeY: 1,
    sizeZ: 1,
    wireframe: false,
    triangles: true,
}

let gui;

function createGUI() {

    gui = new GUI({
        container: container.value
    });

    const sizeFolder = gui.addFolder('Dimensiones');

    sizeFolder.add(params, 'sizeX', 1, 3, 0.1).name("x")
    .onChange(() => { reloadScene(); });

    sizeFolder.add(params, 'sizeY', 1, 3, 0.1).name("y")
    .onChange(() => { reloadScene(); });

    sizeFolder.add(params, 'sizeZ', 1, 3, 0.1).name("z")
    .onChange(() => { reloadScene(); });

    gui.add(params, "wireframe").onChange(() => { reloadScene(); });

    gui.add(params, "triangles").name("Triángulos").onChange(() => { reloadScene(); });

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

    const width = container.value.clientWidth
    const height = container.value.clientHeight

    let aspect = width / height

    camera = new THREE.PerspectiveCamera(
        45,
        aspect,
        0.1,
        1000
    )    

    camera.position.set(5, 3, 5)

    camera.lookAt(0, 0, 0)

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

    // Colores
    const lineMaterialX = new THREE.LineBasicMaterial({ color: 0xC11007 });
    const lineMaterialY = new THREE.LineBasicMaterial({ color: 0x178236 });
    const lineMaterialZ = new THREE.LineBasicMaterial({ color: 0x1447E6 });

    // Coordenadas
    const pointsX = [];
    pointsX.push( new THREE.Vector3(-25, 0, 0) );
    pointsX.push( new THREE.Vector3(25, 0, 0) );

    const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);

    const pointsY = [];
    pointsY.push( new THREE.Vector3(0, -25, 0) );
    pointsY.push( new THREE.Vector3(0, 25, 0) );

    const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);

    const pointsZ = [];
    pointsZ.push( new THREE.Vector3(0, 0, -25) );
    pointsZ.push( new THREE.Vector3(0, 0, 25) );
    const geometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);

    const lineX = new THREE.Line( geometryX, lineMaterialX );
    const lineY = new THREE.Line( geometryY, lineMaterialY );
    const lineZ = new THREE.Line( geometryZ, lineMaterialZ );

    scene.add( lineX );
    scene.add( lineY );
    scene.add( lineZ );

    // ----- -----

    // ----- CUBO -----

    // Geometría
    const geometry = new THREE.BoxGeometry(params.sizeX, params.sizeY, params.sizeZ);

    // Material
    const material = new THREE.MeshPhongMaterial({ color: 0xEEEEEE });

    material.wireframe = params.wireframe;

    // Objeto
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    //----- -----

    // ----- Triangulos -----
    if(params.triangles){

        const positions = geometry.getAttribute('position')

        const v0 = new THREE.Vector3()
        const v1 = new THREE.Vector3()
        const v8 = new THREE.Vector3()
        const v10 = new THREE.Vector3()

        v0.fromBufferAttribute(positions, 0)
        v1.fromBufferAttribute(positions, 1)
        v8.fromBufferAttribute(positions, 8)
        v10.fromBufferAttribute(positions, 10)


        const triangle1 = createTriangleFromVertices(
            v0,
            v1,
            v10,
            0xE7180B
        )

        const triangle2 = createTriangleFromVertices(
            v1,
            v8,
            v10,
            0x155DFC
        )

        scene.add(triangle1);
        scene.add(triangle2);
    }

}

function createTriangleFromVertices(v1, v2, v3, color) {

    const vertices = new Float32Array([
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z,
        v3.x, v3.y, v3.z
    ])

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3)
    )

    const material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    })

    return new THREE.Mesh(
        geometry,
        material
    )
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

    disposeScene(scene)
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

    camera.aspect = aspect

    camera.updateProjectionMatrix()
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
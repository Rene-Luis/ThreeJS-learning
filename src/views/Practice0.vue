<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'

    const container = ref(null)

    let renderer
    let animationId

    onMounted(() => {
    // Escena
    const scene = new THREE.Scene()

    // Cámara
    const camera = new THREE.PerspectiveCamera(
        45,
        container.value.clientWidth / container.value.clientHeight,
        0.1,
        1000
    )

    camera.position.x = 5
    camera.position.y = 3
    camera.position.z = 5

    camera.lookAt(0, 0, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })

    renderer.setSize(
        container.value.clientWidth,
        container.value.clientHeight
    )

    container.value.appendChild(renderer.domElement)

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
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Material
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    material.wireframe = true;

    // Objeto
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    //----- -----

    // ----- Triangulos -----

    // 1. Triangulo Rojo
    const geometryT1 = new THREE.BufferGeometry();

    const verticesT1 = new Float32Array([
        0.5, 0.5, -0.5,  
        -0.5, 0.5, 0.5,  
        0.5,  0.5, 0.5   
    ]);

    geometryT1.setAttribute(
        'position',
        new THREE.BufferAttribute(verticesT1, 3)
    );

    const materialT1 = new THREE.MeshBasicMaterial({
        color: 0xE7180B,
        side: THREE.DoubleSide
    });

    const triangle1 = new THREE.Mesh(geometryT1, materialT1);

    scene.add(triangle1);

    // 2. Triangulo Azul
    const geometryT2 = new THREE.BufferGeometry();

    const verticesT2 = new Float32Array([
        0.5, 0.5, -0.5,  
        -0.5, 0.5, -0.5,  
        -0.5,  0.5, 0.5   
    ]);

    geometryT2.setAttribute(
        'position',
        new THREE.BufferAttribute(verticesT2, 3)
    );

    const materialT2 = new THREE.MeshBasicMaterial({
        color: 0x155DFC,
        side: THREE.DoubleSide
    });

    const triangle2 = new THREE.Mesh(geometryT2, materialT2);

    scene.add(triangle2);

    //----- -----

    // ----- Rendering Loop -----
    function loop() {
        animationId = requestAnimationFrame(loop)

        //cube.rotation.x += 0.01
        //cube.rotation.y += 0.01

        renderer.render(scene, camera)
    }

    loop();

    })

    onUnmounted(() => {
        cancelAnimationFrame(animationId)
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
    width: 100%;
    height: 100vh;
    }
</style>
<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'
    import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

    import { createScene1 } from '../Scripts/Practice1/createScene1.js'
    import { createScene2 } from '../Scripts/Practice1/createScene2.js'
    import { createScene3 } from '../Scripts/Practice1/createScene3.js'

    const container = ref(null);

    let renderer = null;
    let camera = null;
    let animationId = null;

    let activeScene = null;

    let scene1 = null;
    let scene2 = null;
    let scene3 = null;

    function resizeScene() {
        if (!renderer || !camera || !container.value) {
            return
        };

        const width = container.value.clientWidth;
        const height = container.value.clientHeight;

        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    onMounted(() => {

        const width = container.value.clientWidth;
        const height = container.value.clientHeight;

        renderer = new THREE.WebGLRenderer({
            antialias: true
        })

        renderer.setSize(width, height);
        container.value.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        );

        camera.position.set(6, 5, 6);
        camera.lookAt(0, 0, 0);

        scene1 = createScene1();
        scene2 = createScene2();
        scene3 = createScene3();

        activeScene = scene1;

        window.addEventListener('resize', onResize);

        animate();
    })
    

    function animate() {
        animationId = requestAnimationFrame(animate)

        renderer.render(activeScene, camera)
    }


    function onResize() {
        const width = container.value.clientWidth
        const height = container.value.clientHeight

        renderer.setSize(width, height)

        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }


    onUnmounted(() => {
        cancelAnimationFrame(animationId)
        window.removeEventListener('resize', resizeScene)
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
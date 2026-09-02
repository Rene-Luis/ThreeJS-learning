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

    let valueX = 1;
    let valueY = 1;
    let valueZ = 1;


    function addLights(scene) {
        const color = 0xFFFFFF;
        const intensity = 1;

        const ambientLight = new THREE.AmbientLight(
            color,
            intensity
        );

        const light = new THREE.DirectionalLight(
            color,
            intensity
        );

        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);

        scene.add(ambientLight);
        scene.add(light);
        scene.add(light.target);
    }


    function updateScene1() {
        scene1 = createScene1(valueX, valueY, valueZ);
        scene1.background = new THREE.Color('white');
        addLights(scene1);
        activeScene = scene1;
    }


    function handleKeyDown(event) {
        switch (event.key){
            case 'X':
                if(valueX < 3){
                    valueX++;
                }
                updateScene1();
                break;

            case 'x':
                if(valueX > 0){
                    valueX--;
                }
                updateScene1();
                break;

            case 'Y':
                if(valueY < 3){
                    valueY++;
                }
                updateScene1();
                break;

            case 'y':
                if(valueY > 0){
                    valueY--;
                }
                updateScene1();
                break;

            case 'Z':
                if(valueZ < 3){
                    valueZ++;
                }
                updateScene1();
                break;

            case 'z':
                if(valueZ > 0){
                    valueZ--;
                }
                updateScene1();
                break;
        }
    }


    onMounted(() => {

        const width = container.value.clientWidth;
        const height = container.value.clientHeight;

        // ----- EVENTS -----
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', onResize);

        // ----- RENDER -----
        renderer = new THREE.WebGLRenderer({
            antialias: true
        })

        renderer.setSize(width, height);
        container.value.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            0.1,
            1000
        );

        camera.position.set(9, 5, 9);
        camera.lookAt(0, 0, 0);

        scene1 = createScene1(valueX, valueY, valueZ);
        scene2 = createScene2();
        scene3 = createScene3();

        activeScene = scene1;
        addLights(activeScene);
        activeScene.background = new THREE.Color('white');

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
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', handleKeyDown);
        renderer?.dispose();
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
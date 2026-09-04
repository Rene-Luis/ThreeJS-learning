<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import * as THREE from 'three'
    import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

    import { createScene1 } from '../Scripts/Practice1/createScene1.js'
    import { createScene2 } from '../Scripts/Practice1/createScene2.js'

    const container = ref(null);

    let renderer = null;
    let camera = null;
    let animationId = null;

    let activeScene = null;
    let selectedScene = 1;

    let scene1 = null;
    let scene2 = null;

    let valueX = 1;
    let valueY = 1;
    let valueZ = 1;

    let orthoCamera = false;
    let sceneChange = false;


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


    function changeCamera(activeOrtho){
        const width = container.value.clientWidth;
        const height = container.value.clientHeight;

        if(activeOrtho){
            const aspect = width / height;
            const size = 5;

            camera = new THREE.OrthographicCamera(
                -size * aspect,
                size * aspect,
                size,
                -size,
                0.1,
                1000
            );

        }else{
            camera = new THREE.PerspectiveCamera(
                60,
                width / height,
                0.1,
                1000
            );
            
        }

        camera.position.set(9, 5, 9);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();

        console.log(
            "Ortho:",
            camera.isOrthographicCamera,
            "Perspective:",
            camera.isPerspectiveCamera,
            "Position:",
            camera.position
        );
    }

    function updateScene(){
        if (selectedScene == 1){
            scene1 = new THREE.Scene();
            scene1.add(createScene1(valueX, valueY, valueZ));
            addLights(scene1);
            scene1.background = new THREE.Color('white');
            activeScene = scene1;
        }else if (selectedScene == 2){
            scene2 = new THREE.Scene();
            scene2.add(createScene2());
            addLights(scene2);
            scene2.background = new THREE.Color('white');
            activeScene = scene2;
        }
    }


    function handleKeyDown(event) {
        switch (event.key){
            case 'X':
                if(valueX < 5){
                    valueX++;
                    sceneChange = true;
                }
                break;

            case 'x':
                if(valueX > 1){
                    valueX--;
                    sceneChange = true;
                }
                break;

            case 'Y':
                if(valueY < 5){
                    valueY++;
                    sceneChange = true;
                }
                break;

            case 'y':
                if(valueY > 1){
                    valueY--;
                    sceneChange = true;
                }
                break;

            case 'Z':
                if(valueZ < 5){
                    valueZ++;
                    sceneChange = true;
                }
                break;

            case 'z':
                if(valueZ > 1){
                    valueZ--;
                    sceneChange = true;
                }
                break;

            case 'p':
            case 'P':
                orthoCamera = !orthoCamera;
                changeCamera(orthoCamera);
                break;

            case '1':
                if(selectedScene != 1){
                    sceneChange = true;
                    selectedScene = 1;
                }
                break;

            case '2':
                if(selectedScene != 2){
                    sceneChange = true;
                    selectedScene = 2;
                }                
                break;
        }

        if(sceneChange)
            updateScene();

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

        // ----- CAMERA -----
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

        // Initialice scene 1
        scene1 = new THREE.Scene();
        scene1.add(createScene1(valueX, valueY, valueZ));
        addLights(scene1);
        scene1.background = new THREE.Color('white');

        scene2 = new THREE.Scene();
        scene2.add(createScene2());
        addLights(scene2);
        scene2.background = new THREE.Color('white');

        activeScene = scene1;        

        animate();
    })


    function animate() {
        animationId = requestAnimationFrame(animate)
        renderer.render(activeScene, camera)
    }


    function onResize() {
        const width = container.value.clientWidth
        const height = container.value.clientHeight
        const aspect = width / height;

        renderer.setSize(width, height)

        if (camera.isPerspectiveCamera) {
            camera.aspect = aspect;
        } else if (camera.isOrthographicCamera) {
            const size = 10;
            camera.left = -size * aspect;
            camera.right = size * aspect;
            camera.top = size;
            camera.bottom = -size;
        }

        camera.updateProjectionMatrix();
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
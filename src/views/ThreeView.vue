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
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )

  camera.position.z = 5

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })

  renderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  )

  container.value.appendChild(renderer.domElement)

  // Geometría
  const geometry = new THREE.BoxGeometry(1, 1, 1)

  // Material
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

  // Objeto
  const cube = new THREE.Mesh(geometry, material)

  scene.add(cube)

  // Animación
  function animate() {
    animationId = requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
  }

  animate()
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
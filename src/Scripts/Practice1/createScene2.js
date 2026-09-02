import * as THREE from 'three'
import { createAxes } from '../createAxes'

export function createScene2() {
  const scene = new THREE.Scene()

  scene.add(createAxes())

  const geometry = new THREE.SphereGeometry(1, 32, 16)

  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true
  })

  const sphere = new THREE.Mesh(geometry, material)

  sphere.position.set(-2, 1, 0)

  scene.add(sphere)

  return scene
}
import * as THREE from 'three'
import { createAxes } from '../createAxes'

export function createScene3() {
  const scene = new THREE.Scene()

  scene.add(createAxes())

  const geometry = new THREE.ConeGeometry(1, 2, 32)

  const material = new THREE.MeshBasicMaterial({
    color: 0xff00ff
  })

  const cone = new THREE.Mesh(geometry, material)

  cone.position.set(0, 2, -2)

  scene.add(cone)

  return scene
}
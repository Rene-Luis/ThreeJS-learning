import * as THREE from 'three'
import { createAxes } from '../createAxes'

export function createScene1() {
  const scene = new THREE.Scene()

  scene.add(createAxes())

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00
  })

  const cube = new THREE.Mesh(geometry, material)

  cube.position.set(2, 1, 0)

  scene.add(cube)

  return scene
}
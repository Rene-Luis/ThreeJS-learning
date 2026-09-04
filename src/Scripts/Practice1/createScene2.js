import * as THREE from 'three'
import { createAxes } from '../createAxes'

function drawObjects(){
  const group = new THREE.Group();

  const boxGeometry = new THREE.BoxGeometry(1, 2, 4);
  const boxMaterial = new THREE.MeshPhongMaterial({color: 0x58D58E});
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  const radiusTop = 0.2;
  const radiusBottom = 0.2;
  const height = 5;
  const radialSegments = 12;
  const cylinderGeometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments );
  const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0x0E88E5});

  const cylinder1 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  const cylinder2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

  cylinder1.rotateX(Math.PI / 4);
  cylinder2.rotateX(- Math.PI / 4);

  group.add(box);
  group.add(cylinder1);
  group.add(cylinder2);

  return group;
}

export function createScene2() {
  const scene = new THREE.Group()

  scene.add(createAxes());

  scene.add(drawObjects());

  return scene;
}
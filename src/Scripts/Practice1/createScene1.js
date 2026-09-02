import * as THREE from 'three'
import { createAxes } from '../createAxes'

function drawBox(x, y, z){
  const group = new THREE.Group();
  
  const color = new THREE.Color().setRGB( (x+1)/10, (y+1)/10, (z+1)/10 );

  const material = new THREE.MeshPhongMaterial({ color: color });

  const geometryCover = new THREE.BoxGeometry(1.1, 0.1, 2.1);  
  const cover = new THREE.Mesh(geometryCover, material);
  cover.position.set(x*1.2, (y+0.45), z*2.2);

  const geometryBox = new THREE.BoxGeometry(1, 1, 2);
  const box = new THREE.Mesh(geometryBox, material);
  box.position.set(x*1.2, y, z*2.2);


  group.add(cover);
  group.add(box);

  return group;
}

export function createScene1(valueX, valueY, valueZ) {
  const scene = new THREE.Scene()

  scene.add(createAxes())  

  for(let i=0; i<valueX; i++){
    for(let j=0; j<valueY; j++){
      for(let k=0; k<valueZ; k++){
          scene.add(drawBox(i, j, k));
      }    
    }
  }

  return scene;
}
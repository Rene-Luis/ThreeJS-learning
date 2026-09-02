import * as THREE from 'three'

export function createAxes() {

    const group = new THREE.Group();

    // Colors
    const lineMaterialX = new THREE.LineBasicMaterial({ color: 0xC11007 });
    const lineMaterialY = new THREE.LineBasicMaterial({ color: 0x178236 });
    const lineMaterialZ = new THREE.LineBasicMaterial({ color: 0x1447E6 });

    // Coordinates
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

    // Axes
    const lineX = new THREE.Line( geometryX, lineMaterialX );
    const lineY = new THREE.Line( geometryY, lineMaterialY );
    const lineZ = new THREE.Line( geometryZ, lineMaterialZ );

    group.add(lineX, lineY, lineZ);

    return group;
}
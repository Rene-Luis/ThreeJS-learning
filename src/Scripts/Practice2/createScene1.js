import * as THREE from 'three'
import { createAxes } from '../createAxes'

export function createScene1(radius, height, radialSegments, heightSegments, rotX, rotY, rotZ) {
    const scene = new THREE.Group()

    const radiansX = rotX * Math.PI / 180;
    const radiansY = rotY * Math.PI / 180;
    const radiansZ = rotZ * Math.PI / 180;

    const axisX = new THREE.Vector3(1, 0, 0);
    const axisY = new THREE.Vector3(0, 1, 0);
    const axisZ = new THREE.Vector3(0, 0, 1);

    scene.add(createAxes());

    // Cylinder
    const geometry = new THREE.CylinderGeometry(
        radius, radius, height,
        radialSegments, heightSegments,
        true,
        0.0, Math.PI * 2.00 );

    const material = new THREE.MeshNormalMaterial();
    material.side = THREE.DoubleSide;

    const cylender = new THREE.Mesh(geometry, material);

    // Wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(
        geometry
    );

    const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF
    });

    const wireframe = new THREE.LineSegments(
        wireframeGeometry,
        wireframeMaterial
    );

    cylender.add(wireframe);

    cylender.rotateOnWorldAxis(axisX, radiansX);
    cylender.rotateOnWorldAxis(axisY, radiansY);
    cylender.rotateOnWorldAxis(axisZ, radiansZ);

    cylender.translateOnAxis(axisY, height/2);

    scene.add(cylender);

    return scene;
}
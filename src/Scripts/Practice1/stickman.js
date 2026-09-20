import * as THREE from 'three'

export function createStickman(){

    const stickman = new THREE.Group();

    const material = new THREE.MeshNormalMaterial();

    // Head
    const radius = 0.5;
    const widthSegments = 12;
    const heightSegments = 8;
    const sphere = new THREE.SphereGeometry( radius, widthSegments, heightSegments );

    const head = new THREE.Mesh(sphere, material);
    head.translateY(1);
    
    // Body
    const radiusTop = 0.3;
    const radiusBot = 0.3;
    const height = 2;
    const radialSegments = 12;
    const cylinder = new THREE.CylinderGeometry(radiusTop, radiusBot, height, radialSegments );

    const body = new THREE.Mesh(cylinder, material);

    // Arms
    const radiusTop2 = 0.15;
    const radiusBot2 = 0.2;
    const height2 = 1.5;
    const radialSegments2 = 8;
    const cylinder2 = new THREE.CylinderGeometry(radiusTop2, radiusBot2, height2, radialSegments2 );

    const arm1 = new THREE.Mesh(cylinder2, material);
    const arm2 = new THREE.Mesh(cylinder2, material);

    arm1.rotateZ(45*Math.PI/180);
    arm1.translateY(0.75);

    arm2.rotateZ(-45*Math.PI/180);
    arm2.translateY(0.75);

    // Legs
    const leg1 = new THREE.Mesh(cylinder2, material);
    const leg2 = new THREE.Mesh(cylinder2, material);

    leg1.translateY(-1.5);
    leg1.translateX(0.35);
    leg1.rotateZ(25*Math.PI/180);
    
    leg2.translateY(-1.5);
    leg2.translateX(-0.35);
    leg2.rotateZ(-25*Math.PI/180);

    stickman.add(head);
    stickman.add(body);
    stickman.add(arm1);
    stickman.add(arm2);
    stickman.add(leg1);
    stickman.add(leg2);

    return stickman;
}
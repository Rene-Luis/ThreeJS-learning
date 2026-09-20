import * as THREE from 'three'


export function getScaleMatrix(valueX, valueY, valueZ){

    if (valueX === undefined) {
        valueX = 1;
    }

    if (valueY === undefined) {
        valueY = 1;
    }

    if (valueZ === undefined) {
        valueZ = 1;
    }

    const scale = new THREE.Matrix4();

    scale.set(
        valueX,     0,      0,      0,
        0,      valueY,     0,      0,
        0,          0,  valueZ,     0,
        0,          0,      0,      1
    );

    return scale;
}


export function getTranslationMatrix (valueX, valueY, valueZ){

    if (valueX === undefined) {
        valueX = 0;
    }

    if (valueY === undefined) {
        valueY = 0;
    }

    if (valueZ === undefined) {
        valueZ = 0;
    }

    const translation = new THREE.Matrix4();

    translation.set(
        1,  0,  0,  valueX,
        0,  1,  0,  valueY,
        0,  0,  1,  valueZ,
        0,  0,  0,      1
    );

    return translation;
}


export function getRotationXmatrix (angle){

    if (angle === undefined) {
        angle = 0;
    }

    const rad = angle * Math.PI / 180.0;


    const rotationX = new THREE.Matrix4();

    rotationX.set(
        1,      0,                  0,      0,
        0,  Math.cos(rad),  -Math.sin(rad), 0,
        0,  Math.sin(rad),  Math.cos(rad),  0,
        0,      0,                  0,      1
    )

    return rotationX;
}

export function getRotationYmatrix (angle){

    if (angle === undefined) {
        angle = 0;
    }

    const rad = angle * Math.PI / 180.0;


    const rotationY = new THREE.Matrix4();

    rotationY.set(
        Math.cos(rad),  0,  Math.sin(rad),    0,
        0,              1,      0,            0,
        -Math.sin(rad), 0,  Math.cos(rad),    0,
        0,              0,      0,            1
    )

    return rotationY;
}

export function getRotationZmatrix (angle){

    if (angle === undefined) {
        angle = 0;
    }

    const rad = angle * Math.PI / 180.0;


    const rotationZ = new THREE.Matrix4();

    rotationZ.set(
        Math.cos(rad), -Math.sin(rad), 0, 0,
        Math.sin(rad),  Math.cos(rad), 0, 0,
        0,                0,           1, 0,
        0,                0,           0, 1
    )

    return rotationZ;
}



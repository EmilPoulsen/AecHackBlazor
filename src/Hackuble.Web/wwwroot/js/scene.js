﻿var scene;
var camera;
var cube;
var renderer;
var material;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var caller;
var controls;

function createScene(reference) {
    //window.addEventListener('click', onDocumentMouseDown, false);
    window.addEventListener('dblclick', onDocumentMouseDown, false);
    caller = reference;
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xfafafa);

    const light1 = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
    scene.add(light1);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(0, 0, 50);

    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("canvas"),
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var size = 50;
    var divisions = 25;

    var gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.name = "GridHelper";
    gridHelper.geometry.rotateX(Math.PI / 2);
    scene.add(gridHelper);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xff0000);
        }
        /*intersects.forEach(x => {
            if (x.object.callback) {
                x.object.callback();
            }
        });*/

    }
}

function addCube(locX, locY, locZ, width, height, depth, color) {
    //Create the cube.
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var color1 = new THREE.Color(color);

    var material = new THREE.MeshPhongMaterial({ color: color1 });

    cube = new THREE.Mesh(geometry, material);

    //Create edges
    const thresholdAngle = 15;
    var edgesGeometry = new THREE.EdgesGeometry(geometry, thresholdAngle)
    const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 2,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin: 'round' //ignored by WebGLRenderer
    });
    const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    //Add the two to a group
    const group = new THREE.Group();
    group.add(cube);
    group.add(edgesMesh);

    //Set the set the position
    group.position.set(locX, locY, locZ);

    scene.add(group);
}

function addSphere(r, u, v, color) {
    var geometry = new THREE.SphereGeometry(r, u, v);
    var color1 = new THREE.Color(color);
    var material = new THREE.MeshPhongMaterial({ color: color1 });
    sphere = new THREE.Mesh(geometry, material);
    //cube.callback = function () { caller.invokeMethodAsync('OnClickCube', cube); };
    scene.add(sphere);
    console.log("Sphere Added");
}

function createCube() {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    //cube.callback = function () { caller.invokeMethodAsync('OnClickCube', cube); };
    scene.add(cube);
    //camera.position.z = 5;
}

function healthy() {
    cube.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
}

function unhealthy() {
    cube.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
}

function clickCube() {
    cube.material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
}

function loadCodeEditor(dontNetObjRef) {
    var codemirrorEditor = CodeMirror.fromTextArea(document.getElementById('exampleFormControlTextarea1'), {
        lineNumbers: true,
        autoRefresh: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "text/x-csharp",
        extraKeys: {
            "F11": function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function (cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        }
    });
    codemirrorEditor.refresh();
    //codemirrorEditor.setSize(900, 500);
    codemirrorEditor.on("change", editor => {
        dontNetObjRef.invokeMethodAsync("UpdateField", editor.getValue());
        console.log(editor.getValue());
    });
}

function clearScene() {

    var tempList = [];
    for (var i = 0; i < scene.children.length; i++) {
        var child = scene.children[i];
        tempList.push(child);
    }

    for (var i = 0; i < tempList.length; i++) {
        var currObj = tempList[i];
        //avoid deleting the gridhelper and the light
        if (!(currObj.name == "GridHelper" || currObj.type == "HemisphereLight")) {
            scene.remove(currObj);
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


var animate = function() {
    requestAnimationFrame(animate);
    controls.update();
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};

function clickFileUpload() {
    document.getElementById("upload-library").click();
}
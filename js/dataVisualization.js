//import * as THREE from 'three';
//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from './THREE.MeshLine';
'use strict'

var container = document.getElementById( 'container' );

// Global constants
var plotRange = 10;
var scaleMax = 2.25;
var scaleMin = 0.5;
var frustumSize = 1000;
var axisThickness = 10;
var axisColors = [0x00ff00, 0x0000ff, 0xff0000] // x, y ,z

// Global variables
let scaleSpeed = .005;

// Scene and camera initialisation
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 1000 );
camera.position.set( 0, 20, 20 );
var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

// Renderer initialisation
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

// Camera orbit and mouse control
var controls = new THREE.OrbitControls( camera, renderer.domElement );

// Global gometry groups
var axesGroup;
var modelPivot = new THREE.Group();
var dataPivot = new THREE.Group();
var dataGeometries = new THREE.Group();

init();

function drawLine(points, color, thickness=10) {
    const line = new MeshLine();
    line.setPoints(points);

    var material = new MeshLineMaterial( {
		useMap: false,
		color: new THREE.Color( color ),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: false,
		lineWidth: thickness,
    });
    
    const lineMesh = new THREE.Mesh(line, material);

    return lineMesh;
}

function plotPoint(x=0, y=0, z=0, radius = 0.3, color = 0x000000) {
    const geometry = new THREE.SphereGeometry( radius, 32, 32 );
    const material = new THREE.MeshBasicMaterial( {color: color} );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    dataGeometries.add( sphere );

    return sphere
}

function drawCartesianAxes(axisLength = 6, axisArrow = false) {
    let xAxisPoints = [axisLength,0,0,0,0,0];
    let xAxis = drawLine(xAxisPoints,axisColors[0],axisThickness);

    let yAxisPoints = [0,axisLength,0,0,0,0];
    let yAxis = drawLine(yAxisPoints,axisColors[1],axisThickness);

    let zAxisPoints = [0,0,axisLength,0,0,0];
    let zAxis = drawLine(zAxisPoints,axisColors[2],axisThickness);
    
    axesGroup = new THREE.Group();
    axesGroup.add(xAxis);
    axesGroup.add(yAxis);
    axesGroup.add(zAxis);

    scene.add(axesGroup);
    return axesGroup;
}

function drawRandomPoints(count=10,color=null,size=0.2) {
    let randomColor = false;
    if (color === null) {
        randomColor = true;
    }
    var randomPointsGroup = new THREE.Group();
    for (let i = 0; i < count; i ++) {
        var randomX = Math.random() * (plotRange - 0) + 0;
        var randomY = Math.random() * (plotRange - 0) + 0;
        var randomZ = Math.random() * (plotRange - 0) + 0;

        if (randomColor) {
            var greenValue = parseInt((randomX / plotRange) * 255);
            var blueValue = parseInt((randomY / plotRange) * 255);
            var redValue = parseInt((randomZ / plotRange) * 255);
            color = "#" + ((1 << 24) + (redValue << 16) + (greenValue << 8) + blueValue).toString(16).slice(1);
        }
        var newPoint = plotPoint(randomX, randomY, randomZ, size, color);
        randomPointsGroup.add(newPoint);
    }

    dataGeometries.add(randomPointsGroup);
    return randomPointsGroup;
}

function init() {
    axesGroup = drawCartesianAxes(plotRange);
    let randomPoints = drawRandomPoints(15,null,0.3);

    scene.add(modelPivot);
    scene.add(dataPivot);

    // Resets rotation pivot to center of the entire group instead of 0,0,0
    modelPivot.add(dataGeometries);
    dataPivot.add(dataGeometries);
    modelPivot.add(axesGroup);
    axesGroup.position.set(-plotRange/2,-plotRange/2,-plotRange/2);
    dataGeometries.position.set(-plotRange/2,-plotRange/2,-plotRange/2);
    
    animate();
}

onWindowResize();

function onWindowResize() {

	var w = container.clientWidth;
	var h = container.clientHeight;

	var aspect = w / h;

	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();

	renderer.setSize( w, h );

	resolution.set( w, h );
}

function rotateModel(speed=.02) {
    modelPivot.rotation.y += speed;
}

function rotateData(speed=.02) {
    dataPivot.rotation.y += speed;
}

function scaleData(speed=-.01) {
    dataPivot.scale.x += speed;
    dataPivot.scale.y += speed;
    dataPivot.scale.z += speed;
}

function scaleShowcase() {
    if (dataPivot.scale.x >= scaleMax || dataPivot.scale.x <= scaleMin) {
        scaleSpeed *= -1;
        scaleData(scaleSpeed);
    } else {
        scaleData(scaleSpeed);
    }
}

//window.addEventListener( 'resize', onWindowResize );
function animate() {

    requestAnimationFrame( animate );
    //rotateData();
    //rotateModel(.01);
    //scaleShowcase();
    controls.update();

	renderer.render( scene, camera );

}
//import * as THREE from 'three';
//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from './THREE.MeshLine';
'use strict'

var container = document.getElementById( 'container' );

var plotRange = 10;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 1000 );
camera.position.set( 0, 20, 20 );

var frustumSize = 1000;
var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );

var clock = new THREE.Clock();
var axesGroup;

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
    scene.add( sphere );

    return sphere
}

function drawCartesianAxes(axisLength = 6) {
    let xAxisPoints = [axisLength,0,0,0,0,0];
    let xAxis = drawLine(xAxisPoints,0x00ff00,5);

    let yAxisPoints = [0,axisLength,0,0,0,0];
    let yAxis = drawLine(yAxisPoints,0x0000ff,5);

    let zAxisPoints = [0,0,axisLength,0,0,0];
    let zAxis = drawLine(zAxisPoints,0xff0000,5);

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

    scene.add(randomPointsGroup);
    return randomPointsGroup;
}

function init() {
    axesGroup = drawCartesianAxes(plotRange);
    let randomPoints = drawRandomPoints(300,null,0.3);
    render();
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

//window.addEventListener( 'resize', onWindowResize );

function render() {

    requestAnimationFrame( render );
    controls.update();

	renderer.render( scene, camera );

}
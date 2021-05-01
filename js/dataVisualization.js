//import * as THREE from 'three';
//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from './THREE.MeshLine';
'use strict'
var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 1000 );
camera.position.set( 0, 0, 10 );

var frustumSize = 1000;
var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

var clock = new THREE.Clock();

init()
render();

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
    
    const mesh = new THREE.Mesh(line, material);
    scene.add(mesh);
}

function init() {
    let points = [];
    points.push(0,4,0);
    points.push(0,0,0);
    let black = 0x000000
    drawLine(points,black,5);
}

function render() {

	requestAnimationFrame( render );
	renderer.render( scene, camera );

}
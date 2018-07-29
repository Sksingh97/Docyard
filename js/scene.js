
//sample data for dat.gui placeholder in the starting
var data={Rack: "Rack name", Compartment: "Compartment Number", Division: "Column Number"}



//variable declaration
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		scene_data=JSON.parse(xhttp.responseText);
		init();																					//init function responsible for creating scene placing ref axis,camera,controllers
		animate();
    }
};
xhttp.open("GET", "scene.json", true);
xhttp.send();




var scene = new THREE.Scene();															//Creating 3D scene
var renderer = new THREE.WebGLRenderer();												//creating Renderer
var axes = new THREE.AxisHelper( 20 );													//Object for refrence axis
var raycaster = new THREE.Raycaster();													//Raycaster object
var mouse = new THREE.Vector2();														//Mouse object to capture user hover event
var gui = new dat.GUI(); 																//creating dat.gui object to set the fields
var x = gui.add(data, 'Rack');															//Setting fields and its value to Gui
var y = gui.add(data, 'Compartment');
var z = gui.add(data, 'Division');														
				




function init(){																		//initiating animate loop used to render scene every 100ms
	camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
	window.addEventListener( 'mousemove', onMouseMove, false );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.render(scene, camera);
	camera.position.set(4,4,-40);
	window.addEventListener("resize", onWindowResize, false);
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = false;
	controls.enableZoom = true;
	controls.zoomSpeed = 1.2;
	controls.minDistance = 0
	controls.maxDistance = 50
	controls.target.set( 4, 4, 4 );
	// scene.add(axes);
	add_cube();
}

//creating Cell and Placing Data Cube in Cell  
function add_cube(){
	for(i=0;i<scene_data.length;i++){
		if((scene_data[i].compartment==0 && scene_data[i].division==0)||(scene_data[i].compartment==0 || scene_data[i].division==0)){
			continue;
		}
		var geometry = new THREE.BoxGeometry(scene_data[i].division, scene_data[i].compartment, 1);
		color=`0x${scene_data[i].color.split('#')[1]}`
		color=hexToRgb(color);
		var material = new THREE.MeshBasicMaterial( {transparent:true, opacity:0.1, side: THREE.DoubleSide} );
		material.color=color
		var containerm = new THREE.Mesh(geometry, material);
		containerm.position.set(scene_data[i].division/2,scene_data[i].compartment/2,i*2);
		containerm.name=`${i}`
		scene.add(containerm);
		for(j=0;j<scene_data[i].division;j++){
			for(k=0;k<scene_data[i].compartment;k++){
				child_color={r:(color.r*255+i*20)/255,g:(color.g*255+j*25)/255,b:(color.b*255+k*30)/255}
				var geometry_obj = new THREE.BoxGeometry(.5, .5, .5);
				var material_obj = new THREE.MeshBasicMaterial( {color: 0x445566} );
				material_obj.color=child_color;
				var object = new THREE.Mesh(geometry_obj, material_obj);
				object.name={Rack:scene_data[i].name,Compartment:`Compartment-${k+1}`,Division:`Column-${j+1}`};
				object.position.set(j+.5-scene_data[i].division/2,k+.5-scene_data[i].compartment/2,0);
				containerm.add(object);
			}
		}
	}
}



function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}



function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}



function hexToRgb(hex) {
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;
	return{r:r/255,g:g/255,b:b/255};
}




function animate() {
	x.updateDisplay()
	y.updateDisplay()
	z.updateDisplay()
	requestAnimationFrame( animate );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	if(intersects.length>0){
		var cube = intersects[0];
		if(cube){
			var	chil_intersects = raycaster.intersectObjects( cube.object.children );
			if(chil_intersects.length>0){
				var cube_chil=chil_intersects[0]
				data.Rack=cube_chil.object.name.Rack
				data.Compartment=cube_chil.object.name.Compartment
				data.Division=cube_chil.object.name.Division
			}

		}
	}
	renderer.render( scene, camera );
	controls.update();
}
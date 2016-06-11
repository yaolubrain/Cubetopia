var container, stats;

var camera, renderer;

var scenes = [];
var groups = [];
var positions = [];

var radius = 5, theta = 0;

var frameNum = 0;

var startTime;

init();
var audio = new Audio('cpu_mood_cut.mp3');
audio.play();
animate();


function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.001, 10000 );
    camera.position.x = radius;           
    camera.position.y = radius;           
    camera.position.z = radius;            
    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));         
    camera.up = new THREE.Vector3(0,0,1);


    for (var i = 0; i < 6; ++i) {

        scenes.push(new THREE.Scene());
        scenes[i].fog = new THREE.Fog( 0xffffff, 1, 10000 );
        scenes[i].add( new THREE.AmbientLight( 0x505050 ) );

        var light = new THREE.SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 500, 2000 );
        light.castShadow = true;
        light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
        light.shadow.bias = - 0.00022;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        scenes[i].add( light );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        
        groups.push(new THREE.Object3D());

        var pos_group = [];

        var material;
        if (i == 0)
            material = new THREE.MeshLambertMaterial( { color: 0x0000ff } ) ;            
        else if (i == 1)
            material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } ) ;    
        else if (i == 2)
            material = new THREE.MeshLambertMaterial( { color: 0xff0000 } ) ;    
        else if (i == 3)
            material = new THREE.MeshLambertMaterial( { color: 0x0000ff  } ) ;    
        else if (i == 4)
            material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } ) ;    
        else
            material = new THREE.MeshLambertMaterial( { color: 0xff0000 } ) ;    

        var cubeNum;
        if (i < 3) {
            cubeNum = 50;
        } else {
            cubeNum = 5;
        }

        for (var j = 0; j < cubeNum; ++j) {
            
            var mesh = new THREE.Mesh( geometry, material );

            var pos = new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15);
            pos_group.push(pos);

            groups[i].add(mesh)                
        }

        positions.push(pos_group);
        
        scenes[i].add( groups[i] );

        startTime = Date.now();    

    }


    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, preserveDrawingBuffer: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 1);
    renderer.sortObjects = false
    renderer.autoClear = false;

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );    

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function loading() {
    var randX = (Math.random()-0.5) * 0.1;  
    var randY = (Math.random()-0.5) * 0.1;  
    var randZ = (Math.random()-0.5) * 0.1;  
    for (var i = 0; i < 6; i++) {
        groups[i].position.x += randX;
        groups[i].position.y += randY;
        groups[i].position.z += randZ;
    }
}

function expandingX() {
    for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < groups[i].children.length; ++j) {
            groups[i].children[j].position.x += (positions[i][j].x - groups[i].children[j].position.x) *0.05;
        }        
    }
}

function expandingY() {
    for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < groups[i].children.length; ++j) {
            groups[i].children[j].position.y += (positions[i][j].y - groups[i].children[j].position.y) *0.05;
        }        
    }
}

function expandingZ() {
    for (var i = 0; i < 6; ++i) {
        for (var j = 0; j < groups[i].children.length; ++j) {
            groups[i].children[j].position.z += (positions[i][j].z - groups[i].children[j].position.z) *0.05;
        }        
    }
}

function rotateGroup() {

    groups[0].rotation.z += 0.05;   
    groups[3].rotation.z += 0.05;   
    groups[1].rotation.y += 0.02;   
    groups[4].rotation.y += 0.02;   
    groups[2].rotation.x += 0.02; 
    groups[5].rotation.x += 0.02; 
}

function rotateCameraZ() {
    var rotSpeed = 0.03;
    var x = camera.position.x,
        y = camera.position.y,
        z = camera.position.z;
    camera.position.x = x * Math.cos(rotSpeed) + y * Math.sin(rotSpeed);
    camera.position.y = y * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);    
}

function rotateCameraX() {
    var rotSpeed = 0.03;
    var x = camera.position.x,
        y = camera.position.y,
        z = camera.position.z;
    camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) - y * Math.sin(rotSpeed);    
}

function rotateCameraY() {
    var rotSpeed = 0.03;
    var x = camera.position.x,
        y = camera.position.y,
        z = camera.position.z;
    camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);    
}

var d = 0.5;

function shock() {
    if (shock_direct == 0) {

        

        if (shock_dist > 0.7) {
            shock_direct = 1;
        }

        for (var i = 0; i < 6; i++) {
            groups[i].position.y += shock_dist * shock_dist;   
        }

        shock_dist += 0.1;
    } else {
        

        if (shock_dist < -0.5) {
            shock_direct = 0;
        }

        for (var i = 0; i < 6; i++) {
            groups[i].position.y -= shock_dist * shock_dist;    
        }       

        shock_dist -= 0.1;

    }

        
}

var R = 1;
var sec = 0;
var shock_dist = 0;
var shock_direct = 0;

function animate() {
    

    // camera.rotation.x += 0.01;
    // camera.lookAt(new THREE.Vector3( 0, 0, 0 ));     

    ++frameNum;
  
    sec = (Date.now() - startTime) / 1000;

    if (sec < 1 * R) {
        ;
    } else if (sec < 7 * R) {
        loading();
    } else if (sec < 9.5 * R) {
        ;
    } else if (sec < 11.2 * R) {
        expandingX();
    } else if (sec < 12.9 * R) {
        expandingZ();
    } else if (sec < 14.7 * R) {
        expandingY();
    } else if (sec < 18 * R) {
        rotateCameraZ();
    } else if (sec < 25 * R) {
        shock();
        camera.position.y -= 0.1;
    } else if (sec < 30 * R) {
        rotateGroup();
        camera.position.y += 0.1;
    } else {
        rotateGroup();
        rotateCameraZ();
    }

    

    requestAnimationFrame( animate );

    

    renderer.clear();              

    for (var i = 0; i < 6; i++) {
        renderer.render( scenes[i], camera );    // render scene 2
        renderer.clearDepth();                // clear depth buffer    
    };

    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));   

    
    //camera.rotation.x += 0.01;
    
    //camera.up = new THREE.Vector3(0,0,1);
    //camera.lookAt(new THREE.Vector3( 0, 0, 0 ));  
}

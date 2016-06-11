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
        //scenes[i].fog = new THREE.Fog( 0xffffff, 1, 10000 );
        scenes[i].add( new THREE.AmbientLight( 0x505050 ) );

        var light = new THREE.SpotLight( 0xffffff, 1.2 );
        light.position.set( 0, 5, 20 );
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
            material = new THREE.MeshPhongMaterial( { color: 0x2194ce } );            
        else if (i == 1)
            material = new THREE.MeshPhongMaterial( { color: 0x0000ff } ) ;    
        else if (i == 2)
            material = new THREE.MeshPhongMaterial( { color: 0xffffff } ) ;    
        else if (i == 3)
            material = new THREE.MeshPhongMaterial( { color: 0x2194ce } ) ;    
        else if (i == 4)
            material = new THREE.MeshPhongMaterial( { color: 0x0000ff } ) ;    
        else
            material = new THREE.MeshPhongMaterial( { color: 0xffffff } ) ;    

        var cubeNum;
        if (i < 3) {
            cubeNum = 125;
        } else {
            cubeNum = 10;
        }

        for (var j = 0; j < cubeNum; ++j) {
            
            var mesh = new THREE.Mesh( geometry, material );

            var pos = new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15);
            pos_group.push(pos);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            groups[i].add(mesh)                
        }

        positions.push(pos_group);
        
        scenes[i].add( groups[i] );

        startTime = Date.now();    

    }


    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, preserveDrawingBuffer: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xbababa , 1);
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

function converge() {
    for (var i = 0; i < 6; ++i) {
        if (i == 0 || i == 3) {
            for (var j = 0; j < groups[i].children.length; ++j) {
                groups[i].children[j].position.x += (-1 - groups[i].children[j].position.x) *0.05;
                groups[i].children[j].position.y += (0. - groups[i].children[j].position.y) *0.05;
                groups[i].children[j].position.z += (0. - groups[i].children[j].position.z) *0.05;
            }        
        }

        if (i == 1 || i == 4) {
            for (var j = 0; j < groups[i].children.length; ++j) {
                groups[i].children[j].position.x += (1 - groups[i].children[j].position.x) *0.05;
                groups[i].children[j].position.y += (0 - groups[i].children[j].position.y) *0.05;
                groups[i].children[j].position.z += (0 - groups[i].children[j].position.z) *0.05;
            }        
        }

        if (i == 2 || i == 5) {
            for (var j = 0; j < groups[i].children.length; ++j) {
                groups[i].children[j].position.x += (0 - groups[i].children[j].position.x) *0.05;
                groups[i].children[j].position.y += (0 - groups[i].children[j].position.y) *0.05;
                groups[i].children[j].position.z += (0 - groups[i].children[j].position.z) *0.05;
            }        
        }                
    }
}

function diverge() {
    for (var i = 0; i < 6; ++i) {
        
        if (i == 0 || i == 3) {
            for (var j = 0; j < groups[i].children.length; ++j) {
                var x = j / 25;
                var y = (j % 25) / 5;
                var z = j % 5;

                groups[i].children[j].position.x += (0.2*x - 0.2 - groups[i].children[j].position.x) *0.01;
                groups[i].children[j].position.y += (0.2*y - groups[i].children[j].position.y) *0.01;
                groups[i].children[j].position.z += (0.2*z - groups[i].children[j].position.z) *0.01;

                if (Math.random() > 0.7) {
                    groups[i].children[j].rotation.x = Math.random();
                    groups[i].children[j].rotation.y = Math.random();
                    groups[i].children[j].rotation.z = Math.random();
                }

            }        
        }        

        if (i == 1 || i == 4) {
            for (var j = 0; j < groups[i].children.length; ++j) {
                var x = j / 25;
                var y = (j % 25) / 5;
                var z = j % 5;

                groups[i].children[j].position.x += (0.2*x + 0.2 - groups[i].children[j].position.x) * 0.01;
                groups[i].children[j].position.y += (0.2*y - groups[i].children[j].position.y) * 0.01;
                groups[i].children[j].position.z += (0.2*z - groups[i].children[j].position.z) * 0.01;
                if (Math.random() > 0.7) {
                    groups[i].children[j].rotation.x = Math.random();
                    groups[i].children[j].rotation.y = Math.random();
                    groups[i].children[j].rotation.z = Math.random();
                }                
            }        
        }

        if (i == 2 || i == 5) {
            for (var j = 0; j < groups[i].children.length; ++j) {
                var x = j / 25;
                var y = (j % 25) / 5;
                var z = j % 5;
                groups[i].children[j].position.x += (0.2*x - groups[i].children[j].position.x) *0.01;
                groups[i].children[j].position.y += (0.2*y - groups[i].children[j].position.y) *0.01;
                groups[i].children[j].position.z += (0.2*z - groups[i].children[j].position.z) *0.01;
                if (Math.random() > 0.7) {
                    groups[i].children[j].rotation.x = Math.random();
                    groups[i].children[j].rotation.y = Math.random();
                    groups[i].children[j].rotation.z = Math.random();
                }

            }        
        }            
            
    }
}

function expand(r) {
    for (var i = 0; i < 6; ++i) {    
        for (var j = 0; j < groups[i].children.length; ++j) {
            groups[i].children[j].position.x *= r;
            groups[i].children[j].position.y *= r;
            groups[i].children[j].position.z *= r;
        }        
    }
}



function cameraOrigin() {
    camera.position.x += (radius - camera.position.x) *0.05;
    camera.position.y += (radius - camera.position.y) *0.05;
    camera.position.z += (radius - camera.position.z) *0.05;
}


var R =    1;
var sec = 0;
var shock_dist = 0;
var shock_direct = 0;

function animate() {
    
    ++frameNum;
  
    sec = (Date.now() - startTime) / 1000.0;

    if (sec <= 1 * R) {
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
    } else if (sec < 25 * R) {
        rotateCameraZ();
    } else if (sec < 33 * R) {
        shock();
        camera.position.y -= 0.05;
    } else if (sec < 45 * R) {
        rotateGroup();
        camera.position.y += 0.05;
    } else if (sec < 50 * R) {
        converge();     
        cameraOrigin();        
    } else if (sec < 55 * R) {
        rotateGroup();
        rotateCameraZ();
    } else if (sec < 65 * R) {
        diverge();        
        rotateCameraZ();
    } else if (sec < 75 * R) {    
        expand(1.01);    
    } else if (sec < 88 * R) {    
        expand(0.99);    
    } else if (sec >= 90 * R) {
        expand(1.2);
        cameraOrigin();        
    }

    requestAnimationFrame( animate );

    renderer.clear();              

    for (var i = 0; i < 6; i++) {
        if (i < 30) {

            renderer.render( scenes[i], camera );    
            renderer.clearDepth();              
        } 
    };

    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));   
    
}

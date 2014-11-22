
function buildScene(objectPath,objectImagePath,elementID, backgroundColor, backColor, bendingFactor){
    var container, scene, camera, renderer, stats;
    var jsonLoader = new THREE.JSONLoader(); 
    var loadedMesh;
    var SCREEN_WIDTH = window.innerWidth; 
    var SCREEN_HEIGHT = window.innerHeight; 
    var VIEW_ANGLE = 15, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 5000;
    var projector = new THREE.Projector();
    var mouseVector = new THREE.Vector3();
    var intersection = undefined;
    var rayPickCollector = new THREE.Object3D();
    var isUpdating = false;
    var tween;
    //var exageration = interpolate(1,bendingFactor,10,-1000,-10);
    var exageration = 1/bendingFactor*2000;

    init(); 

    function init()
        {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR); 
            camera.position.set(0,500,0); 
            camera.lookAt(scene.position);   
            scene.add(camera); 
            // RENDERER
            if (window.WebGLRenderingContext) 
                renderer = new THREE.WebGLRenderer({antialias:true });
            else
                renderer = new THREE.CanvasRenderer({antialias:true});

            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); 
            renderer.setClearColor(backgroundColor)
            container = document.getElementById( elementID ); 
            container.appendChild( renderer.domElement ); 
            container.addEventListener( 'mousemove', onDocumentMouseMove, false );
            container.addEventListener( 'mouseout', onDocumentMouseOut, false );
            container.addEventListener( 'mouseenter', onDocumentMouseEnter, false );

            

            jsonLoader.load(objectPath, callBackFunction)


            var plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshNormalMaterial());
            plane.geometry.applyMatrix( new THREE.Matrix4().makeRotationX(-Math.PI/2) );
            plane.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,exageration,0) );

              rayPickCollector.add(plane);
            var light = new THREE.PointLight( 0xffffff, 1, 1000 );
                light.position.set( 250, 250, 250 );
                scene.add( light );

            var light1 = new THREE.PointLight( 0xffffff, 1, 1000 );
                light1.position.set( -250, 250, -250 );
                scene.add( light1 );

            var light2 = new THREE.PointLight( 0xffffff, 1, 1000 );
                light2.position.set( -250, -250, 250 );
                scene.add( light2 );

            var light3 = new THREE.PointLight( 0xffffff, 1, 1000 );
                light3.position.set( 250, -250, -250 );
                scene.add( light3 );
            var ambientLight = new THREE.AmbientLight(0xffffff); 
            scene.add(ambientLight);
            //var tween = new TWEEN.Tween(position).to(target, 2000);
            animate();
        }

    function animate() 
        {
            requestAnimationFrame( animate ); 
            renderer.render( scene, camera );   
            if(intersection && loadedMesh && isUpdating)
            {
                loadedMesh.lookAt(new THREE.Vector3(intersection.point.x,intersection.point.y,intersection.point.z))
                loadedMesh.rotation.z = Math.PI/2;
            }  
            TWEEN.update();  
        }
    function callBackFunction( geometry, materials ) 
        {   
            var map = THREE.ImageUtils.loadTexture(objectImagePath);
            var material = new THREE.MeshFaceMaterial(materials)
            material.materials[0].side = THREE.DoubleSide;
            material.materials[1].side = THREE.DoubleSide;
            material.materials[0].color = new THREE.Color( backColor );
            material.materials[1].map = map;
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX(-Math.PI/2) );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationY(Math.PI) );
            geometry.computeVertexNormals();
            loadedMesh = new THREE.Mesh( geometry, material); 
            loadedMesh.lookAt(new THREE.Vector3(0,exageration,0))
            loadedMesh.rotation.z = Math.PI/2;
            scene.add( loadedMesh ); 
        }  
    function onDocumentMouseMove( event ) 
    {   
    /*
        var triggerFunction = setTimeout(function(){
            clearInterval(triggerFunction)
            isUpdating = true;
        },300)
        */
        if(tween)
            tween.stop()
        isUpdating = true;
        mouseVector.x = 2 * (event.clientX / SCREEN_WIDTH ) - 1  ;
        mouseVector.y = 1 - 2 * ( event.clientY / SCREEN_HEIGHT );
        var raycaster = projector.pickingRay( mouseVector.clone(), camera );
        var intersects = raycaster.intersectObjects( rayPickCollector.children );
        for( var i = 0; i < intersects.length; i++ ) 
        {
            intersection = intersects[ i ],
            obj = intersection.object;
        }
    }
    function onDocumentMouseOut( event ) 
    {
        isUpdating = false
        tween = new TWEEN.Tween(loadedMesh.rotation)
        .to({x:-Math.PI/2, y:0, z:Math.PI/2 }, 1000)
        .start();
    }
    function onDocumentMouseEnter( event ){
        /*
        mouseVector.x = 2 * (event.clientX / SCREEN_WIDTH ) - 1  ;
        mouseVector.y = 1 - 2 * ( event.clientY / SCREEN_HEIGHT );
        var raycaster = projector.pickingRay( mouseVector.clone(), camera );
        var intersects = raycaster.intersectObjects( rayPickCollector.children );
        for( var i = 0; i < intersects.length; i++ ) 
        {
            intersection = intersects[ i ]
        }
        var timer = 0;
        var intrval = setInterval(function(){
            timer = timer + 0.01;
            if(timer<=1){
                loadedMesh.lookAt(new THREE.Vector3(
                     mouseVector.x * timer + intersection.x * (1-timer),
                     mouseVector.y * timer + intersection.y * (1-timer),
                     mouseVector.z * timer + intersection.z * (1-timer)
                    ))
            }
            else{
                isUpdating = true;
            }                
        },10)
        //setTimeout(function(){isUpdating = true;},1000)
*/
    }
    function interpolate(x1,x2,x3,y1,y3){
        var y2 = (((x2 - x1)*(y3 - y1))/(x3 - x1)) + y1;
        return(y2);
    }
}
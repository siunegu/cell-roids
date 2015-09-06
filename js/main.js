    var scene, camera, renderer;
    var geometry, material, mesh;
    var camera, cameraControl;

    init();
    animate();

    function init() {

        if (Detector.webgl) {
            renderer = new THREE.WebGLRenderer({
                antialias: true, // to get smoother output
                preserveDrawingBuffer: true // to allow screenshot
            });
            renderer.setClearColor(0xbbbbbb);
        } else {
            Detector.addGetWebGLMessage();
            return true;
        }
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


        // create a scene
        scene = new THREE.Scene();

        // put a camera in the scene
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 15;
        scene.add(camera);

        // create a camera control
        cameraControls = new THREEx.DragPanControls(camera)

				// transparently support window resize
				THREEx.WindowResize.bind(renderer, camera);

				// here we add the objects
        var verticesOfCube = [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, ];

        var indicesOfFaces = [
            2, 1, 0, 0, 3, 2,
            0, 4, 7, 7, 3, 0,
            0, 1, 5, 5, 4, 0,
            1, 2, 6, 6, 5, 1,
            2, 3, 7, 7, 6, 2,
            4, 5, 6, 6, 7, 4
        ];

        var geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 6, 2);
        material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    // animation loop
    function animate() {

        requestAnimationFrame(animate);

        // do the render
        render();       
    }

    function render() {
				// variable which is increase by Math.PI every seconds - usefull for animation
				var PIseconds	= Date.now() * Math.PI; 
				
				// update camera controls 
				cameraControls.update();

				// animate mesh
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render(scene, camera);
    }
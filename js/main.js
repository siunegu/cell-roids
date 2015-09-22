var scene, camera, renderer;
var geometry, material, mesh;
var camera, cameraControl;
var mouse;

var scoreBoard = document.querySelector(".score");
var finalScore = document.querySelector('.final-score');
var score;

var player;
var playerAlive;
var playerSpeed = 0.6;
var playerColor = 0x24fe8f;

var hitBox = 2.4;
var enemies = [];
var enemyColor = 0xef1b3f;
var enemySpeed = 1.8;

init();
animate();

function init() {

    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({
            antialias: true, // to get smoother output
            preserveDrawingBuffer: true // to allow screenshot
        });
        renderer.setClearColor(0xbbb4b7);
    } else {
        Detector.addGetWebGLMessage();
        return true;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // setup raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 250;
    scene.add(camera);

    // create a camera control
    cameraControls = new THREEx.DragPanControls(camera)

    // transparently support window resize
    THREEx.WindowResize.bind(renderer, camera);

    // Enemy Field
    obstacleField(250, 1000);

    // player
    player = player();

    // player movement
    document.addEventListener('keypress', movementUp, false);
    document.addEventListener('keypress', movementDown, false);
    document.addEventListener('keypress', movementLeft, false);
    document.addEventListener('keypress', movementRight, false);


    // check for start game
    var startButton = document.querySelector(".start-game").childNodes[1]
    document.addEventListener('click', startGame, false);

}

function startGame() {

    var startScreen = document.querySelector(".start-screen");
    startScreen.setAttribute("style", "display: none");

    playerAlive = true
    setInterval(function() {
        increaseScore();
    }, 500)

}

function movementUp(event) {

    if (event.keyCode === 119) {
        // 'w'
        player.translateY(10)
    } 
}

function movementDown(event) {

    if (event.keyCode === 115) {
        // 's'
        player.translateY(-10)    

    } 
}

function movementLeft(event) {

    if (event.keyCode === 97) {
        // 'a'
        player.translateX(-10)
    } 
}

function movementRight(event) {

    if (event.keyCode === 100) {
        // 'd'
        player.translateX(10)        

    }
}

function player() {

    var geometry = new THREE.BoxGeometry(7, 7, 7),
        material = new THREE.MeshBasicMaterial( {color: playerColor} );

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;

}

function bullet() {

    var geometry = new THREE.BoxGeometry(7, 7, 7),
        material = new THREE.MeshBasicMaterial( {color: playerColor} );

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;    

}

function shootBullet() {
    var bullet = bullet()
}

function obstacleField(amount, radius) {
    // spawn enemies
    for (var i = 0; i < 250; i++) {
        var obstacle = this.obstacle(6);
        obstacle.position.set(
            radius / 2 - radius * Math.random(),
            radius / 2 - radius * Math.random(),
            0.0
        )
        enemies.push(obstacle);
    }
}

function obstacle(pyramidSideTileSize) {
    var pyramidGeometry = new THREE.CylinderGeometry( 1, pyramidSideTileSize, pyramidSideTileSize, 4 );
    var pyramidMaterial = new THREE.MeshBasicMaterial( {color: enemyColor} )
    pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramidMesh.position.set(-1.5, 0.0, 4.0);
    scene.add(pyramidMesh);

    return pyramidMesh;

}

function increaseScore(score) {

    score = parseInt(scoreBoard.innerHTML)

    if ( playerAlive === true ) {
    
        score += 1

    } else {

        score = 0

    }

    scoreBoard.innerHTML = score

}

function stopScore() {

    scoreBoard.innerHTML = 0
    score = 0

}

function showFinalScore(score) {

    finalScore.textContent = score;

}

function stopGame() {

    var gameOverScreen = document.querySelector(".game-over");
    var startAgainButton = document.querySelector(".start-again");
    var score = scoreBoard.innerHTML;        

        playerAlive = false;
        gameOverScreen.setAttribute("style", "display: block");
        startAgainButton.addEventListener('click', function() {
            gameOverScreen.setAttribute("style", "display: none");
        }, false);

        showFinalScore(score);
        stopScore();

}

function scrollEnemies() {

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].position.y < -500) {

            // set position top
            enemies[i].position.y = 500

        } else {

            // hit detection
            if (enemies[i].position.distanceTo( player.position ) < 2 * hitBox) {
                stopGame();
                console.log("hit!");
            }
            // scroll enemies
            enemies[i].position.y -= enemySpeed;
            
            // spin enemies
            enemies[i].rotation.x += Math.random() * 0.2; 
            enemies[i].rotation.z += Math.random() * 0.2;

        }
    }    

}

function destroyEnemies() {
    enemies.empty
}

// animation loop
function animate() {

    requestAnimationFrame(animate);

    // do the render
    render();
}

function render() {

    // variable which is increase by Math.PI every seconds - usefull for animation
    var PIseconds = Date.now() * Math.PI;

    // update camera controls 
    cameraControls.update();

    // animate player
    // player.rotation.x += 0.02;

    // animate enemies
    if (playerAlive == true) {

        scrollEnemies();

    }

    renderer.render(scene, camera);
}
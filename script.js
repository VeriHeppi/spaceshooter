import Enemy from './enemy.js';
import Player from './player.js';
import BulletPool from './BulletPool.js';

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const playerSpeed = 0.002;

    let mousePosition = { x: 0, y: 0 };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let backgroundPosition = { x: 0, y: 0 };

    let bulletPool = new BulletPool(400);

    let enemies = [];
    let colors = [
        "#FF0000", 
        "#00FF00", 
        "#0000FF", 
        "#FFFF00", 
        "#00FFFF", 
        "#FF00FF", 
        "#C0C0C0", 
        "#808080", 
        "#800000"
    ];

    let enemyamount = 3;

    for (let i = 0; i < enemyamount; i++) {
        let x = Math.random() * canvasWidth;
        let y = Math.random() * 70;
        let width = 50;
        let height = 50;
        let color = colors[(Math.random() * colors.length) | 0];
        let speed = Math.random() * 0.5 + 0.5;
        let enemy = new Enemy(bulletPool, x, y, width, height, color, speed, canvasWidth);
        if (enemies.length > 0) {
            let enemy2 = enemies[enemies.length - 1];
            let distance = Math.abs(enemy.x - enemy2.x);
            if (distance < enemy2.width * 2) {
                enemy.x += enemy.width * 2;
            }
        }
        enemies.push(enemy);
    }

    // Set the movable square properties
    let player = new Player(canvasWidth / 2, canvasHeight / 2, 50, 50, 'white', playerSpeed, 10, canvasWidth);
    function wrapAroundScreen(objects) {
        objects.forEach(object => {
            if (object.x < 0) {
                object.x = canvasWidth;
            } else if (object.x > canvasWidth) {
                object.x = 0;
            }
    
            if (object.y < 0) {
                object.y = canvasHeight;
            } else if (object.y > canvasHeight) {
                object.y = 0;
            }
        });
    }

    let stars = [];
    for (let i = 0; i < 100; i++) { // 100 stars
        stars.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight
        });
    }

    function spawnEnemy() {
        const safeDistance = 2000; // Minimum distance between the player and the enemy

        // Calculate a random position around the player
        let x = player.x + (Math.random() * 2 - 1) * safeDistance;
        let y = player.y + (Math.random() * 2 - 1) * safeDistance;

        // Make sure the enemy spawns within the canvas
        x = Math.max(Math.min(x, canvas.width), 0);
        y = Math.max(Math.min(y, canvas.height), 0);

        // Create a new enemy
        let width = 50;
        let height = 50;
        let color = colors[(Math.random() * colors.length) | 0];
        let speed = Math.random() * 0.5 + 0.5;
        let enemy = new Enemy(bulletPool, x, y, width, height, color, speed, canvas.width);

        // Add the new enemy to the enemies array
        enemies.push(enemy);
    }

    let dx = 0; let dy= 0;
        let playerVelocity = { dx: 0, dy: 0 };
        let targetVelocity = { dx: 0, dy: 0 };

        function keyDown(e) {

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                    targetVelocity.dy = -playerSpeed;
                    break;
                case 'ArrowDown':
                case 's':
                    targetVelocity.dy = playerSpeed;
                    break;
                case 'ArrowLeft':
                case 'a':
                    targetVelocity.dx = -playerSpeed;
                    break;
                case 'ArrowRight':
                case 'd':
                    targetVelocity.dx = playerSpeed;
                    break;
            }                 
        }

        function keyUp(e) {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'ArrowDown':
                case 's':
                    targetVelocity.dy = 0;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'ArrowRight':
                case 'd':
                    targetVelocity.dx = 0;
                    break;
            }
        
            if (e.key === ' ') {
                player.isShooting = false;
            }
        }

    function lerp(v0, v1, t) {
        return v0 * (1 - t) + v1 * t;
    }

     // Set up event listeners for key presses
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
        // Add a mousemove event listener to update the mouse position
        canvas.addEventListener('mousemove', function(e) {
            mousePosition.x = e.clientX - canvas.offsetLeft;
            mousePosition.y = e.clientY - canvas.offsetTop;
        });
        // Add a mousedown event listener to shoot bullets
        canvas.addEventListener('mousedown', function(e) {
            player.shoot();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === ' ') {
                player.isShooting = true;
                console.log('Spacebar pressed'); // Add this line
            }
        });
        document.addEventListener('keyup', function (e) {
            if (e.key === ' ') {
                player.isShooting = false;
            }
        });
    
    // Update the canvas and player position
    function update() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        let gameArea = document.getElementById('gameArea');
        gameArea.style.backgroundPosition = `${backgroundPosition.x}px ${backgroundPosition.y}px`;

        if (enemies.length < enemyamount) {
            spawnEnemy();
        }

        // Draw stars
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.fillRect(star.x, star.y, 2, 2); // 2x2 pixel star
        });

        player.update();
        player.updateAngle(mousePosition);
        player.draw(ctx);

        // Update the player's position based on their velocity
        player.x += playerVelocity.dx;
        player.y += playerVelocity.dy;
    
        player.bullets.forEach((bullet, i) => {
            enemies.forEach((enemy, j) => {
                if (bullet.isCollidingWith(enemy)) {
                    if (enemy.takeDamage()) {
                        enemy.bullets.forEach((bullet, b) => {
                            bulletPool.returnBullet(bullet);
                        });
                        enemies.splice(j, 1);
                    }
                    player.bullets.splice(i, 1);
                    return;
                }
            });
        });

        // Move each enemy towards the player
        for (let enemy of enemies) {
            enemy.move(player);
        }

        enemies.forEach((enemy, i) => {
            enemy.update();
            enemy.draw(ctx);
            enemy.updateAndDrawBullets(ctx);
        
            enemy.bullets.forEach((bullet, j) => {
                // Remove the bullet if it's outside the canvas
                if (bullet.y < 0 || bullet.y > canvasHeight || bullet.x < 0 || bullet.x > canvasWidth) {
                    enemy.bullets.splice(j, 1);
                    return;
                }
        
                // Check for collision with the player
                if (player.isHitByBullet(bullet)) {
                    player.health--;
                    enemy.bullets.splice(j, 1);
                    if (player.health <= 0) {
                        alert('Game Over!');
                        window.location.reload();
                    }
                } 
            });
        });

        player.updateAndDrawBullets(ctx);
        
        player.checkBoundaryCollision();   
        
        // Gradually change player velocity towards target velocity
        playerVelocity.dx = lerp(playerVelocity.dx, targetVelocity.dx, 0.1);
        playerVelocity.dy = lerp(playerVelocity.dy, targetVelocity.dy, 0.1);

        // Update the player's position based on their velocity
        player.x += playerVelocity.dx * 1000; // Multiply by 1000 to convert from pixels per millisecond to pixels per second
        player.y += playerVelocity.dy * 1000; // Multiply by 1000 to convert from pixels per millisecond to pixels per second

        // Adjust enemy and bullet positions based on player velocity
        enemies.forEach(enemy => {
            enemy.x -= playerVelocity.dx;
            enemy.y -= playerVelocity.dy;

            enemy.bullets.forEach(bullet => {
                bullet.x -= playerVelocity.dx;
                bullet.y -= playerVelocity.dy;
            });
        });

        player.bullets.forEach(bullet => {
            bullet.x -= playerVelocity.dx;
            bullet.y -= playerVelocity.dy;
        });
        
        // Also move the background in the opposite direction
        backgroundPosition.x -= playerVelocity.dx;
        backgroundPosition.y -= playerVelocity.dy;

        // Also move the stars in the opposite direction
        let starSpeedScale = 0.7; // Adjust this value to change the speed of the stars
        // Update the stars' positions based on the player's velocity
        stars.forEach(star => {
            star.x -= playerVelocity.dx * 1000 * starSpeedScale; // Multiply by 1000 to convert from pixels per millisecond to pixels per second
            star.y -= playerVelocity.dy * 1000 * starSpeedScale; // Multiply by 1000 to convert from pixels per millisecond to pixels per second

            // Wrap stars around the edges of the screen
            if (star.x < 0) star.x = canvasWidth;
            else if (star.x > canvasWidth) star.x = 0;
            if (star.y < 0) star.y = canvasHeight;
            else if (star.y > canvasHeight) star.y = 0;
        });

        // Wrap game objects around the edges of the screen
        wrapAroundScreen(enemies); 
    
        requestAnimationFrame(update);
    }
  
    update(); // Start the loop 
  });
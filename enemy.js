import Bullet from './bullet.js';

class Enemy {
    constructor (bulletPool, x, y, width, height, color, speed, canvasWidth) {
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.vx = 0;
        this.width = width; 
        this.height = height;
        this.hitboxWidth = width * 1.2; // Increase the hitbox size by 20%
        this.hitboxHeight = height * 1.2; // Increase the hitbox size by 20%
        this.color = color;
        this.speed = speed;
        this.dx = speed;
        this.canvasWidth = canvasWidth;
        this.health = 3;
        this.maxHealth = 3;
        this.bullets = [];
        this.shootInterval = null;
        this.startShooting();
        this.bulletPool = bulletPool;
    }

    move(player) {
        // Calculate the direction vector
        let dx = player.x - this.x;
        let dy = player.y - this.y;

        // Calculate the angle between the enemy and the player
        this.angle = Math.atan2(dy, dx);

        // Move the enemy towards the player
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        dx /= magnitude;
        dy /= magnitude;

        this.vx = dx * this.speed;
        this.vy = dy * this.speed;
    }



    stop() {
        this.vx *= 0.9; 
        this.vy *= 0.9; 
    }

    startShooting() {
        this.shootInterval = setInterval(() => {
            this.shoot();
        }, this.getRandomShootInterval());
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            return true;
        }
        return false;
    }

    getRandomShootInterval() {
        // Returns a random number between 1000 and 2000 (1-2 seconds)
        return Math.random() * (2000 - 1000) + 1000;
    }

    // Update enemy position
    update() {
        // Update the enemy's x and y position
        this.x += this.vx;
        this.y += this.vy;

        // If the enemy hits the right wall or the left wall, reverse its x direction
        if (this.x + this.width > this.canvasWidth || this.x < 0) {
            this.vx = -this.vx;
        }

        // If the enemy hits the top wall or the bottom wall, reverse its y direction
        if (this.y + this.height > this.canvasHeight || this.y < 0) {
            this.vy = -this.vy;
        }
    }

    // Draw the enemy on the canvas

    draw(context) {
        // Save the current context state
        context.save();

        // Translate to the enemy's position
        context.translate(this.x, this.y);

        // Rotate the context
        context.rotate(this.angle);

        // Draw the enemy
        context.fillStyle = this.color;
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Restore the context state
        context.restore();

        // Draw the health bar
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y - 10, this.width, 5);

        // Draw the current health
        context.fillStyle = 'green';
        context.fillRect(this.x, this.y - 10, this.width * (this.health / this.maxHealth), 5);
    }

    shoot() {
        // Create a new bullet
        const bullet = this.bulletPool.getBullet();
        if (bullet) {
            bullet.x = this.x + this.width / 2 - 2.5;
            bullet.y = this.y + this.height;
            bullet.dx = Math.cos(this.angle);
            bullet.dy = Math.sin(this.angle);
        }

        // Set the bullet's direction
        bullet.dx = Math.cos(this.angle);
        bullet.dy = Math.sin(this.angle);

        // Add the new bullet to the bullets array
        this.bullets.push(bullet);

        // Clear the current shooting interval and start a new one
        clearInterval(this.shootInterval);
        this.startShooting();
    }

    updateAndDrawBullets(context, dx, dy) {
        let i = 0;
        while (i < this.bullets.length) {
            
            this.bullets[i].move(dx, dy);
            // Remove the bullet if it goes offscreen or hits the bottom of the map
            if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
                this.bulletPool.returnBullet(this.bullets[i]);
                this.bullets.splice(i, 1);
            } else {
                i++;
            }
        }
    
        // Draw each bullet
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(context);
        }
    }

} 
export default Enemy;
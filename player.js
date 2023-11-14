import Bullet from './bullet.js';

class Player {
    constructor(x, y, width, height, color, speed, health, canvasWidth) {
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
        this.health = health;
        this.maxHealth = health;
        this.canvasWidth = canvasWidth;
        this.bullets = [];
        this.isShooting = false;
        this.angle = 0;
    }

    updateAngle(mousePosition) {
        this.angle = Math.atan2(mousePosition.y - this.y, mousePosition.x - this.x);
    }

    shoot() {
        if (!this.isShooting) {
            let bullet = new Bullet(this.x, this.y, 5, 10, 'red', 5, -1);
            bullet.dx = Math.cos(this.angle) * bullet.speed;
            bullet.dy = Math.sin(this.angle) * bullet.speed;
            bullet.angle = this.angle - Math.PI / 2; // Subtract Math.PI / 2 from the angle
    
            this.bullets.push(bullet);
            this.isShooting = true;
    
            setTimeout(() => {
                this.isShooting = false;
            }, 200);
        }
    }

    isHitByBullet(bullet) {
        return (
            bullet.x < this.x + this.width &&
            bullet.x + bullet.width > this.x &&
            bullet.y < this.y + this.height &&
            bullet.y + bullet.height > this.y
        );
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    move(direction) {
        if (direction === 'left') {
            this.dx = -this.speed;
        } else if (direction === 'right') {
            this.dx = this.speed;
        } else if (direction === 'up') {
            this.dy = -this.speed;
        } else if (direction === 'down') {
            this.dy = this.speed;
        }
    }

    stop() {
        this.dx *= 0.9; // Gradually decrease the velocity
        this.dy *= 0.9; // Gradually decrease the velocity
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.checkBoundaryCollision();
    }
    checkBoundaryCollision() {
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }
    }

    updateAndDrawBullets(context) {
        let i = 0;
        while (i < this.bullets.length) {
            this.bullets[i].move();
    
            // Remove the bullet if it goes offscreen or hits the bottom of the map
            if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
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
export default Player;
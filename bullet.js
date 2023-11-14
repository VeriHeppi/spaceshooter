import Enemy from './enemy.js';
import Player from './player.js';

class Bullet {
    constructor(x, y, width, height, color, speed, direction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.direction = direction;
        this.dx = 0;
        this.dy = 0;
        this.angle = 0;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    isCollidingWith(actor) {
        // Use hitbox dimensions if they exist, otherwise use the actor's dimensions
        const actorWidth = actor.hitboxWidth || actor.width;
        const actorHeight = actor.hitboxHeight || actor.height;
    
        return (
            this.x < actor.x + actorWidth &&
            this.x + this.width > actor.x &&
            this.y < actor.y + actorHeight &&
            this.y + this.height > actor.y
        );
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.fillStyle = this.color;
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        context.restore();
    }
}
export default Bullet;
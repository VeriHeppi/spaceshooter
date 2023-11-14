import Bullet from './bullet.js';
class BulletPool {
    constructor(size) {
        this.size = size;
        this.pool = [];
        this.active = [];

        for (let i = 0; i < size; i++) {
            this.pool.push(new Bullet(0, 0, 5, 5, 'red', 100, 1));
        }
    }

    getBullet() {
        if (this.pool.length > 0) {
            const bullet = this.pool.pop();
            this.active.push(bullet);
            console.log('Bullet was retrieved from pool');
            return bullet;
        } else {
            console.warn('Bullet pool is empty!');
            return null;
        }
    }

    returnBullet(bullet) {
        const index = this.active.indexOf(bullet);
        if (index !== -1) {
            this.active.splice(index, 1);
            this.pool.push(bullet);
        }
    }

    updateAndDrawBullets(context, dx, dy) {
        for (let i = 0; i < this.active.length; i++) {
            const bullet = this.active[i];
            bullet.move(dx, dy);
            bullet.draw(context);
            if (bullet.y < 0 || bullet.y > canvasHeight) {
                this.returnBullet(bullet);
            }
        }
    }
}

export default BulletPool;
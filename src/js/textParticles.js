let canvas,
    ctx,
    message = 'hello',
    w,
    h,
    gridX = 11,
    gridY = 15,
    color = '#f36',
    shape;
window.onload = () => {
    canvas = document.getElementById('textParticle');
    ctx = canvas.getContext('2d');

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    shape = new Shape(w / 2, h / 2);

    shape.draw();
    bindEvent();
}

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    
}, false);

function bindEvent() {
    let messageInput = document.getElementById('text');
    messageInput.addEventListener('change', function() {
        message = this.value;
        shape.getParticles(message)
        shape.draw();
        // console.log(message);
    }, false)
}

class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];

        this.draw = this.draw.bind(this);
        this.getParticles = this.getParticles.bind(this);
    }

    getParticles(message) {
        ctx.clearRect(0, 0, w, h);
        shape.particles = [];
        
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = '200px arial';
        ctx.fillText(message, w / 2, h / 2);
        ctx.fill();
        ctx.restore()

        let data = ctx.getImageData(0, 0, w, h),
            buffer32 = new Uint32Array(data.data.buffer);
        
        for(let n = 0; n < h; n += gridY) {
            for(let i = 0; i < w; i += gridX) {
                if(buffer32[n * w + i]) {
                    this.particles.push(new Particle(new Vector2(i, n), 0, 5, 10, color));
                }
            }
        }
        console.log(this.particles)
    }

    draw() {
        requestAnimationFrame(this.draw);
        ctx.clearRect(0, 0, w, h);
        let len = this.particles.length;
        ctx.fillStyle = 'balck';
        for(let i = 0; i < len; ++i) {
            this.particles[i].update(ctx);
        }
    }
}

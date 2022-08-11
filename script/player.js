import { Object } from '/script/object.js';

export class Player extends Object {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; // vx0
        this.speedy = -1000; // vy0

        this.gravity = 10;

        this.ctx = this.root.gamemap.ctx;
        this.pressed_keys = this.root.gamemap.controller.pressed_keys;
        this.staus = 3; // 0 :idle 1 : qian 2: hou 3 : tiao

        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    oncreate() {

    }

    control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        }
        else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        if (this.staus === 0 || this.staus === 1) {
            if (space) {
                this.staus = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if (w) {
                if (d) {
                    this.vx = this.speedx;
                }
                else if (a) {
                    this.vx = -this.speedx;
                }
                else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.staus = 3;
            }
            else if (d) {
                this.vx = this.speedx;
                this.staus = 1;
            }
            else if (a) {
                this.vx = -this.speedx;
                this.staus = 1;
            }
            else {
                this.vx = 0;
                if (this.staus === 1) this.staus = 0;
            }
        }
    }

    move() {
        if (this.staus == 3)
            this.vy += this.gravity;

        this.x += this.vx * this.dt / 1000;
        this.y += this.vy * this.dt / 1000;

        if (this.y > 450) {
            this.vy = 0;
            this.y = 450;
            if (this.staus === 3) this.staus = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        }
        else if (this.x + this.width > this.root.gamemap.$canvas.width()) {
            this.x = this.root.gamemap.$canvas.width() - this.width;
        }
    }

    flush_direction() {
        if (this.staus === 6) return;

        let players = this.root.player;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    flush() {
        this.control();
        this.move();
        this.flush_direction();
        this.render();
    }

    render() {
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        let staus = this.staus;

        if (this.staus === 1 && this.direction * this.vx < 0) staus = 2;

        let obj = this.animations.get(staus);
        if (obj && obj.loaded) {

            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
            else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.gamemap.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.gamemap.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        }

        if (staus === 4 || staus === 5 || staus === 6) {
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                this.staus = 0;
            }
        }
        this.frame_current_cnt++;
    }
}
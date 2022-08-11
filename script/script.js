import { gameMap } from '/script/map.js';
import { Kyo } from '/script/kyo.js';

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);

        this.gamemap = new gameMap(this);
        // console.log(this.$kof);

        this.player = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
            })
        ]
    }
}

export {
    KOF
}
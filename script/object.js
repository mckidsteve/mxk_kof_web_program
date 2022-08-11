let OBJECTS = [];

class Object {
    constructor() {
        OBJECTS.push(this);

        this.dt = 0;
        this.has_create = false;
    }

    oncreate() { // create object

    }

    flush() { // update object

    }

    del() { // delete object
        for (let i in OBJECTS) {
            if (OBJECTS[i] === this) {
                OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp = 0;
let OBJECTS_FRAME = (timestamp) => {
    for (let obj of OBJECTS) {
        if (!obj.has_create) {
            obj.oncreate();
            obj.has_create = true;
        }
        else {
            obj.dt = timestamp - last_timestamp;
            obj.flush();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(OBJECTS_FRAME);
}
requestAnimationFrame(OBJECTS_FRAME);

export {
    Object
}
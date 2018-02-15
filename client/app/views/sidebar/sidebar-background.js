import {
    Color,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Geometry,
    Group,
    LineBasicMaterial,
    Line,
    Vector3
} from 'three';

let ResObserver = null;
if ((typeof ResizeObserver) === "undefined") {
    ResObserver = class ResizeObserver {
        constructor(cb) {
            this.cb = cb;
            this.entries = [];
            window.addEventListener('resize', this.shot(this));
        }
        shot(context) { return () => { context.cb(context.entries); }; }
        observe(entry) { this.entries.push(entry); }
    }
}
else {
    ResObserver = ResizeObserver;
}

class GridCube {
    constructor() {
        this.pos = new Vector3(0.5, 0.5, 0.5);
        this.dir = GridCube.randomDir();
    }

    static get scale() { return 0.02; }

    static randomDir() {
        return new Vector3(
            (Math.random()-0.5) * GridCube.scale,
            (Math.random()-0.5) * GridCube.scale,
            (Math.random()-0.5) * GridCube.scale);
    }

    static reflectPoint(point) {
        if (point > 1)
            return GridCube.reflectPoint(1 - (point - 1));
        else if(point < 0)
            return GridCube.reflectPoint(-point);
        else return point;
    }

    update() {
        this.pos.add(this.dir);
        if (this.pos.x > 1 || this.pos.y > 1 || this.pos.z > 1 ||
            this.pos.x < 0 || this.pos.y < 0 || this.pos.z < 0) {
            this.pos.x = GridCube.reflectPoint(this.pos.x);
            this.pos.y = GridCube.reflectPoint(this.pos.y);
            this.pos.z = GridCube.reflectPoint(this.pos.z);
        }
        return this.pos;
    }

    get point() { return this.pos; }
}

class Grid {
    constructor(x, y, color) {
        this.grid = [];
        this.color = color;
        this.xLength = x;
        this.yLength = y;

        for(let i = 0; i < x; i++) {
            this.grid[i] = [];
            for (let j = 0; j < y; j++) {
                this.grid[i][j] = new GridCube();
            }
        }
    }

    get objects() {
        if (!this.threeObjects) {
            this.threeObjects = [];
            for (let i = 0; i < (this.grid.length - 1); i++) {
                this.threeObjects[i] = [];
                for (let j = 0; j < (this.grid[i].length - 1); j++) {
                    let geometry = new Geometry();
                    let material = new LineBasicMaterial( { color: this.color } );
                    this.updateGeometry(geometry, i, j);
                    this.threeObjects[i][j] = new Line(geometry, material);
                }
            }
        }
        return this.threeObjects;
    }

    get group() {
        if (!this.threeGroup) {
            let threeObjects = this.objects;
            this.threeGroup = new Group();
            for (let i in threeObjects) {
                for (let j in threeObjects[i]) {
                    this.threeGroup.add(threeObjects[i][j]);
                }
            }
        }
        return this.threeGroup;
    }

    animate() {
        for (let i in this.threeObjects) {
            for (let j in this.threeObjects[i]) {
                this.updateGeometry(this.threeObjects[i][j].geometry, i, j);
            }
        }
    }

    updateGeometry(geometry, x, y) {
        x = Number(x);
        y = Number(y);

        geometry.vertices = [];

        // Update point values
        if (x === 0) {
            if (y === 0) this.grid[x][y].update();
            this.grid[x][y+1].update();
        }
        if (y === 0) this.grid[x+1][y].update();
        this.grid[x+1][y+1].update();

        // Update objects
        if (x === 0) {
            geometry.vertices.push(this.grid[x][y].point.add(new Vector3(x, y, 0)));
        }

        geometry.vertices.push(this.grid[x][y + 1].point.add(new Vector3(x, y + 1, 0)));
        geometry.vertices.push(this.grid[x + 1][y + 1].point.add(new Vector3(x + 1, y + 1, 0)));
        geometry.vertices.push(this.grid[x + 1][y].point.add(new Vector3(x + 1, y, 0)));

        if (y === 0) {
            geometry.vertices.push(this.grid[x][y].point.add(new Vector3(x, y, 0)));
        }

        geometry.verticesNeedUpdate = true;
        return geometry;
    }
}

class SidebarAnimation {
    constructor() {
        this.container = document.getElementById("sidebar-background");
        this.color = window.getComputedStyle(this.container).getPropertyValue('color');
        this.backgroundColor = window.getComputedStyle(this.container).getPropertyValue('background-color');

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.scene = new Scene();
        this.scene.background = new Color(this.backgroundColor);

        this.camera = new PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
        this.camera.position.z = 25;

        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize( this.width, this.height );

        this.resizeObserver = new ResObserver(SidebarAnimation.onWindowResize(this));
        this.resizeObserver.observe(this.container);

        this.container.appendChild( this.renderer.domElement );

        this.sceneObjs = {};
        this.setup();
    }

    setup() {
        this.sceneObjs.grid = new Grid(100, 100, this.color);
        this.sceneObjs.grid.group.position.set(-this.sceneObjs.grid.xLength/4*3,-this.sceneObjs.grid.yLength/4*3,0);
        this.sceneObjs.grid.group.rotation.y = -Math.PI / 2 / 30;
        this.sceneObjs.grid.group.rotation.x = -Math.PI / 2 / 10;
        this.scene.add(this.sceneObjs.grid.group);
    }

    animate() { SidebarAnimation.animateContext(this)(); }

    static animateContext(context) { return () => {
        requestAnimationFrame(() => { setTimeout(SidebarAnimation.animateContext(context), 100); });

        context.sceneObjs.grid.animate();

        context.renderer.render(context.scene, context.camera);
    };}

    static onWindowResize(context) { return() => {
        context.width = context.container.offsetWidth;
        context.height = context.container.offsetHeight;

        SidebarAnimation.log("onResize event handled. New size: " + context.width + "x" + context.height);

        context.camera.aspect = context.width / context.height;
        context.camera.updateProjectionMatrix();

        context.renderer.setSize( context.width, context.height );
    };}

    static log(str) {
        console.log("[SidebarScene] " + str.toString());
    }
}

$(document).ready(() => {
    let animation = new SidebarAnimation();
    animation.animate();
});
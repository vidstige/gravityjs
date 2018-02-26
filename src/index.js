require("../static/style.css");

const G = 0.005;

function draw(stars, region) {
    const canvas = document.getElementById('target');
    const ctx = canvas.getContext("2d");
    
    const cx = canvas.clientWidth / 2;
    const cy = canvas.clientHeight / 2;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const r = 0.1;
    const d = r * 2;
    const gradient = ctx.createRadialGradient(r, r, r, r, r, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;

    const s = Math.min(
        canvas.clientWidth / region.w,
        canvas.clientHeight / region.h);
    ctx.setTransform(s, 0, 0, s, cx, cy);
    for (var i = 0; i < stars.length; i++) {
        ctx.save();
        ctx.translate(
            stars[i].p.x,
            stars[i].p.y,
        );
        ctx.fillRect(
            0, 0,
            d, d);
        ctx.restore();
    }
}

function randomPoint() {
    return {x: Math.random() - 0.5, y: Math.random() - 0.5};
}

function diff(a, b) {
    return {x: a.x - b.x, y: a.y - b.y};
}
function norm2(v) {
    return v.x*v.x + v.y*v.y;
}

function gravity(a, b) {
    const d = diff(b.p, a.p);
    const r2 = norm2(d);
    return {
        x: G * d.x * a.m * b.m / r2,
        y: G * d.y * a.m * b.m / r2
    };
}

function step(stars, dt) {
    var f = []; // force vectors

    for (var i = 0; i < stars.length; i++) {
        f[i] = {x: 0, y: 0};
        for (var j = 0; j < stars.length; j++) {
            if (i != j) {
                const g = gravity(stars[i], stars[j]);
                f[i].x += g.x;
                f[i].y += g.y;
            }
        }   
    }

    for (var i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.p.x += star.v.x * dt;
        star.p.y += star.v.y * dt;
        star.v.x += f[i].x * dt / star.m;
        star.v.y += f[i].y * dt / star.m;
    }
}

function energy(stars) {
    var E = 0;
    for (var i = 0; i < stars.length; i++) {
        // kinetic energy
        const m = stars[i].m;
        const v2 = norm2(stars[i].v);
        E += 0.5 * m * v2;
    
        // potential energy
        for (var j = i+1; j < stars.length; j++) {
            const r = Math.sqrt(norm2(diff(stars[i].p, stars[j].p)));
            E += -G * stars[i].m * stars[j].m / r;
        }
    }
    return E;
}

const energyHistory = [];
const historySize = 200;
var frame = 0;
function drawEnergy(stars) {
    frame++;
    var min = Math.min.apply(null, energyHistory);
    var max = Math.max.apply(null, energyHistory);

    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.beginPath();
    ctx.moveTo(0, 40);
    for (var i = 0; i < energyHistory.length; i++) {
        const y = 40 - 40 * (energyHistory[i] - min) / (max - min);
        ctx.lineTo(i * 4, y);
    }
    ctx.stroke();

    if (frame % 50 == 0) {
        const E = energy(stars);
        energyHistory.push(E);
        energyHistory.splice(0, energyHistory.length - historySize);
    }
}

function findRegion(stars) {
    const max = {
        x: Math.max.apply(null, stars.map(function(star) { return star.p.x; })),
        y: Math.max.apply(null, stars.map(function(star) { return star.p.y; }))
    };
    const min = {
        x: Math.min.apply(null, stars.map(function(star) { return star.p.x; })),
        y: Math.min.apply(null, stars.map(function(star) { return star.p.y; }))
    };
    return {
        x: min.x,
        y: min.y,
        w: max.x - min.x,
        h: max.y - min.y
    };
}

function body(p, m, factor) {
    return {
        p: p,
        v: {
            x: factor *  G * p.y,
            y: factor * -G * p.x
        },
        m: m
    };
}

function offset(v, o) {
    v.x += o.x;
    v.y += o.y;
}
function cross(v) {
    return {x: v.y, y: -v.x};
}
function mul(v, scalar) {
    return {x: v.x * scalar, y: v.y * scalar};
}

function galaxy(stars, n, center) {
    const radialVelocity = 1.1 * n;
    const blackHole = body({x: 0, y: 0}, n*2.5, radialVelocity);
    offset(blackHole.p, center);
    offset(blackHole.v, mul(cross(center), 0.2));
    stars.push(blackHole);
    for (var i = 1; i < n; i++) {
        //const p = randomPoint();
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random();
        const p = {
            x: Math.cos(theta) + Math.cos(theta) * r,
            y: Math.sin(theta) + Math.sin(theta) * r};
        const star = body(p, 0.5, radialVelocity);
        offset(star.p, center);
        offset(star.v, mul(cross(center), 0.2));
        stars.push(star);
    }
}

function simulate(n) {
    var stars = [];
    galaxy(stars, n/2, {x: -5, y: 0});
    galaxy(stars, n/2, {x: 5, y: 0});

    var lastTime = null;
    function animate(time) {
        if (lastTime) {
            const dt = lastTime - time;
            step(stars, dt / 1000);
            //draw(stars, findRegion(stars));
            const s = 6;
            draw(stars, {x: -s, y: -s, w: s*2, h: s*2});
            drawEnergy(stars);
        }
        
        lastTime = time;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function load() {
    simulate(400);
}

document.addEventListener("DOMContentLoaded", load);

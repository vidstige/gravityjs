require("../static/style.css");

function draw(stars) {
    const canvas = document.getElementById('target');
    const ctx = canvas.getContext("2d");
    const cx = canvas.clientWidth / 2;
    const cy = canvas.clientHeight / 2;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (var i = 0; i < stars.length; i++) {
        ctx.fillRect(
            cx + stars[i].p.x * 400,
            cy + stars[i].p.y * 400,
            2, 2);
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
    const d = diff(a.p, b.p);
    const r2 = norm2(d);
    return {
        x: d.x / r2,
        y: d.y / r2
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
        star.v.x += 0.00000001 * f[i].x;
        star.v.y += 0.00000001 * f[i].y;
    }
}

function simulate(n) {
    var stars = [];
    for (var i = 0; i < n; i++) {
        stars[i] = {p: randomPoint()};
        stars[i].v = {
            x: stars[i].p.y / 1000,
            y: -stars[i].p.x / 1000
        }
    }

    var lastTime = null;
    function animate(time) {
        if (lastTime) {
            const dt = lastTime - time;
            step(stars, dt);
            draw(stars);
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

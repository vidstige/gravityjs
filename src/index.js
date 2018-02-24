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

function step(stars, dt) {
    for (var i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.p.x += 0.0001 * star.v.x * dt;
        star.p.y += 0.0001 * star.v.y * dt;
    }
}

function simulate(n) {
    var stars = [];
    for (var i = 0; i < n; i++) {
        stars[i] = {p: randomPoint(), v: randomPoint()};
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
    simulate(100);
}

document.addEventListener("DOMContentLoaded", load);

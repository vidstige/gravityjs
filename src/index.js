require("../static/style.css");

function draw(stars) {
    const canvas = document.getElementById('target');
    const ctx = canvas.getContext("2d");
    const cx = canvas.clientWidth / 2;
    const cy = canvas.clientHeight / 2;
    for (var i = 0; i < stars.length; i++) {
        ctx.fillRect(
            cx + stars[i].x * 400,
            cy + stars[i].y * 400,
            2, 2);
    }
}

function simulate(n) {
    var stars = [];
    for (var i = 0; i < n; i++) {
        stars[i] = {x: Math.random()-0.5, y: Math.random()-0.5};
    }

    function animate(time) {
        draw(stars);
        requestAnimationFrame(animate);
    }
    

    requestAnimationFrame(animate);
}

function load() {
    simulate(100);
}

document.addEventListener("DOMContentLoaded", load);

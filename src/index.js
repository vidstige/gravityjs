require("../static/style.css");

function animate() {
    requestAnimationFrame(animate);
}

function load() {
    requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", load);

const images = document.querySelectorAll(".hero-bg img");
let index = 0;

function changeSlide() {
    images[index].classList.remove("active");
    index = (index + 1) % images.length;
    images[index].classList.add("active");
}

setInterval(changeSlide, 6000); // change every 6 seconds

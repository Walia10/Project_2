let currentIndex = 0;

function startCarousel() {
  const slides = document.getElementsByClassName("mySlides");
  hideAllSlides(slides);
  showSlide(slides, currentIndex);
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    startCarousel();
  }, 2000);
}

function hideAllSlides(slides) {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
}

function showSlide(slides, index) {
  if (index >= 0 && index < slides.length) {
    slides[index].style.display = "block";
  }
}

startCarousel();
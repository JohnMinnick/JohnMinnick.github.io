// scripts.js
// Adds interactivity to the animated garden.

document.addEventListener('DOMContentLoaded', () => {
  console.log("Welcome to the Garden!");

  // Clicking on any GIF will toggle a zoom effect.
  const gifImages = document.querySelectorAll('.gif-container img');
  gifImages.forEach((img) => {
    img.addEventListener('click', () => {
      img.classList.toggle('zoom');
    });
  });
});

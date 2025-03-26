// scripts.js
// This file adds a bit of interactive flair to the homepage.

document.addEventListener('DOMContentLoaded', () => {
  console.log("Welcome to John Minnick's Engineering Hub!");

  // Add a simple interaction: clicking the gear speeds up its rotation briefly.
  const gear = document.querySelector('.gear');
  if (gear) {
    gear.addEventListener('click', () => {
      console.log("Gear clicked! Engineering in motion.");
      gear.style.animationDuration = "2.5s";
      setTimeout(() => {
        gear.style.animationDuration = "5s";
      }, 1000);
    });
  }
});

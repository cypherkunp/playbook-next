const initApp = () => {
  const hamburger = document.querySelector("#hamburger-button");
  const mobileMenu = document.querySelector("#mobile-menu");

  const toggleMenu = () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
    hamburger.classList.toggle("toggle-btn");
  };

  hamburger.addEventListener("click", toggleMenu);
  mobileMenu.addEventListener("click", toggleMenu);
};

document.addEventListener("DOMContentLoaded", initApp);


const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const cocktailContainer = document.getElementById('cocktailContainer');


mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});


// Menu active

const menuBar= document.querySelector(".menu-bar");
const menuNav = document.querySelector(".menu");

menuBar.addEventListener('click',()=>{
    menuNav.classList.toggle("menu-active")
})


// scrolling
const navBar = document.querySelector(".navbar");
window.addEventListener('scroll',() => {
    const windowPosition = window.scrollY>0;
    navBar.classList.toggle("scrolling-active",windowPosition)
})
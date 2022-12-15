const arrows = document.getElementById('arrows');
const scroll_to = document.getElementById('scroll_to');
arrows.addEventListener('click', () => {
    scroll_to.scrollIntoView();
})


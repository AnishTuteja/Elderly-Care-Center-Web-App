const to_top = document.getElementById('return-to-top');
to_top.addEventListener('click', () => {
    console.log('clicked');
    window.scrollTo(0, 0);
})

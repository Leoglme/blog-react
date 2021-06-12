$(document).ready(function(){
    // Lift card and show stats on Mouseover
    $('.product__card').hover(function(){
        $(this).addClass('animate');
        $('div.carouselNext, div.carouselPrev').addClass('visible');
    }, function(){
        $(this).removeClass('animate');
        $('div.carouselNext, div.carouselPrev').removeClass('visible');
    });

    const allUser = document.querySelectorAll('.product__card');
    const options = {
        valueNames: ['price', 'name', 'category']
    };
    let hackerList = new List('results', options);
    for (let i = 0; i < allUser.length; i++) {
        const id = allUser[i].getAttribute("data-id")
        allUser[i].addEventListener('click', function () {
            window.location = "/shop/" + id;
        })
    }
});

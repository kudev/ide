/**
 * Refreshes the top right image's position according to the current window width.
 */
function updateTopRightImage() {
    $('img').css('top', '0px');
    $('img').css('right', '0px');
}

$(function () {
    // Bottom right image
    $('body').addClass('task2');

    // Top right image
    $('body').append('<img src="http://www.oriooli.com/wp-content/uploads/2013/08/random-pic-01.jpg" />');
    $('img').css('position', 'fixed');
    $('img').css('width', '30%');
    updateTopRightImage();
});

$(window).scroll(updateTopRightImage);
$(window).resize(updateTopRightImage);
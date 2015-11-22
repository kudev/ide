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
    $('body').append('<img src="https://www.redditstatic.com/secret-santa-present.png" />');
    $('img').css('position', 'fixed');
    updateTopRightImage();
});

$(window).scroll(updateTopRightImage);
$(window).resize(updateTopRightImage);
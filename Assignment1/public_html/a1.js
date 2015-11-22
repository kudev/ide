/**
 * Refreshes the top right image's position according to the current window width.
 */
function updateTopRightImage() {
    $('#task2js').css('top', '0px');
    $('#task2js').css('right', '0px');
}

$(function () {
    // Bottom right image
    $('body').addClass('task2css');

    // Top right image
    $('body').append('<img id="task2js" src="http://www.oriooli.com/wp-content/uploads/2013/08/random-pic-01.jpg" />');
    $('#task2js').css('position', 'fixed');
    $('#task2js').css('width', '15%');
    updateTopRightImage();
});

$(window).scroll(updateTopRightImage);
$(window).resize(updateTopRightImage);
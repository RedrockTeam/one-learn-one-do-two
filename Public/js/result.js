$(function() {

    $('.rank-list').css('line-height', $('.rank-list').height() - 4 + 'px');
    $('.restart').css('line-height', $('.restart').height() - 4 + 'px');

    $.get('getRank', function(response) {
        if (response.status == 200) {

        }
    });

});
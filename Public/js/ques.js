$(function() {

    $('#choose').css({
        height: $(window).height() * 0.759
    });

    $('.answer-box .answer-option').find('span').css('line-height', ($('.answer-box .answer-option').eq(0).height() - 2) + 'px');

    for (var i = 0; i < $('.answer-box .answer-text').length; i++) {
        $('.answer-box .answer-text').eq(i).css(
            'top',
            (($('.answer-box').height() - 6 - $('.answer-box .answer-text').eq(i).height()) / 2) + 'px'
        );
    }

    // 文字居中
    $('.submit-answer').css('line-height', $('.submit-answer').height() - 4 + 'px');


    // 选择题是否选择答案flag
    var isSelected = false;

    // 选择题选项点击逻辑
    $('#choose').on('click', '.answer-box', function(event) {
        var box = $(event.currentTarget);
        // 如果未选择任何选项
        if (!isSelected) {
            box.addClass('answer-box-selected');
            box.find('.answer-text').addClass('answer-text-selected');
            box.find('.answer-option').addClass('answer-option-selected');
            isSelected = !isSelected;
        } else {
            // 如果选择的是别的选项
            if (box.hasClass('answer-box-selected')) {
                box.removeClass('answer-box-selected');
                box.find('.answer-text').removeClass('answer-text-selected');
                box.find('.answer-option').removeClass('answer-option-selected');
                isSelected = !isSelected;
            } else {
                // 先把被选中的去除
                for (var i = 0; i < $('.answer-box').length; i++) {
                    var _box = $('.answer-box').eq(i);
                    if (_box.hasClass('answer-box-selected')) {
                        _box.removeClass('answer-box-selected');
                        _box.find('.answer-text').removeClass('answer-text-selected');
                        _box.find('.answer-option').removeClass('answer-option-selected');
                    }
                }
                box.addClass('answer-box-selected');
                box.find('.answer-text').addClass('answer-text-selected');
                box.find('.answer-option').addClass('answer-option-selected');
            }
        }
    });

    // 如果选择了答案
    if (isSelected) {
        $('.submit-answer').on('click', function(event) {

        });
    }

});
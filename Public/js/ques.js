$(function() {

    var screen = {
        width: $(window).width(),
        height: $(window).height()
    };

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
    // 做的题目数
    var quesCount = 0;

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
                isSelected = true;
            }
        }
    });

    // 如果选择了答案
    $('.submit-answer').on('click', function(event) {
        if (isSelected) {
            $('#choose').addClass('animated bounceOut');
            $('#choose').css('display', 'none');
            initFillBlank('为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是', mock())
        }
    });

    // $('#choose').addClass('animated bounceOut');
    // $('#choose').css('display', 'none');
    // initFillBlank('为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是为了健康红烧鸡块你好但是', mock().options, mock().answer)

    function mock() {
        var str = '为了健康红烧鸡块你好但我活动活动';
        var options = '';
        var length = Math.floor(Math.random() * 8) + 1;
        for (var i = 0; i < length; i++) {
            options += str[i];
        }
        var answer = '';
        for (var i = 0; i < options.length; i++) {
            if (i % 2 == 0) {
                answer += options[i];
            }
        }
        return {
            answer: answer,
            options: options
        };
    }


    function initFillChoose(ques, )

    // 初始化填字题
    function initFillBlank(ques, options, answer) {

        // 未点击确认前为false
        // 点击确认之后就锁住
        var lock = false;

        // 先显示页面
        $('#fillblank').addClass('animated bounceIn');
        $('#fillblank').css('display', 'block');

        if (!ques || options < 3 || options > 8) {
            return;
        }

        // 题目文字
        var answerText = '',
            chooseText = '',
            answerFrame = '';

        // 题目空格文字
        for (var i = 0; i < answer.length; i++) {
            // 题目文字
            answerFrame += '<div class="text-frame" style="height: ' + screen.height * 0.034 + 'px"></div>';
        }
        $('#fillblank .ques-text').prepend(answerFrame + ques);

        // 供选择的字
        for (var i = 0; i < options.length; i++) {
            // 供选择的字
            chooseText += '<div class="choose-text" style="height: ' + screen.height * 0.07 + 'px; line-height: ' + screen.height * 0.07 + 'px">' + options[i] + '</div>';
        }

        // 供选择的字
        $('.choose-text-wrapper').prepend(chooseText);


        // 正确答案
        $('.right-answer span').text(answer);


        // 已选择的字
        var selectedText = [];

        // 供选择的字点击事件
        $('.choose-text-wrapper').on('click', '.choose-text', function(event) {
            if (!lock) {
                var text = $(event.currentTarget);
                var index = text.attr('data-index');
                // 取消选择的操作
                if (text.hasClass('choose-text-selected')) {
                    // 如果点击的是上一个选中的文字，可以取消
                    if (index == selectedText.length - 1) {
                        selectedText.pop();
                        $('#fillblank .text-frame').eq(index).text('').removeClass('text-frame-filled');
                        text.attr('data-index', '').removeClass('choose-text-selected');
                    }
                } else { // 选中的操作
                    $('#fillblank .text-frame').eq(selectedText.length).text(text.text()).addClass('text-frame-filled');
                    text.attr('data-index', selectedText.length).addClass('choose-text-selected');
                    selectedText.push(text.text());
                }
            }
        });


        // 确认按钮
        $('#fillblank .submit-answer').on('click', function() {
            // 全部填满且未点击过才能点击确认
            if (selectedText.length == answer.length && !lock) {
                lock = true;
                var choosedText = '';
                for (var i = 0; i < selectedText.length; i++) {
                    choosedText += selectedText[i];
                }

                // 答案正确
                if (choosedText == answer) {
                    $('#fillblank .text-frame').addClass('text-frame-filled-right');
                    for (var i = 0; i < $('.choose-text').length; i++) {
                        if ($('.choose-text').eq(i).hasClass('choose-text-selected')) {
                            $('.choose-text').eq(i).addClass('choose-text-selected-right');
                        }
                    }
                    $('.submit-answer p').css('color', '#00b615').text('回答正确');
                } else { // 答案错误
                    var errorPoint = [];
                    for (var i = 0; i < choosedText.length; i++) {
                        if (choosedText[i] !== answer[i]) {
                            errorPoint.push(i);
                        }
                    }

                    // 字框错误显示
                    for (var i = 0; i < $('#fillblank .text-frame').length; i++) {
                        if (errorPoint.indexOf(i) !== -1) {
                            $('#fillblank .text-frame').eq(i).addClass('text-frame-filled-error');
                        } else {
                            $('#fillblank .text-frame').eq(i).addClass('text-frame-filled-right');
                        }
                    }

                    // 供选择的字错误显示
                    for (var i = 0; i < $('.choose-text').length; i++) {
                        var index = $('.choose-text').eq(i).attr('data-index');
                        if ($('.choose-text').eq(i).hasClass('choose-text-selected')) {
                            if (errorPoint.indexOf(Number(index)) !== -1) {
                                $('.choose-text').eq(i).addClass('choose-text-selected-error');
                            } else {
                                $('.choose-text').eq(i).addClass('choose-text-selected-right');
                            }
                        }
                    }
                    // 显示正确答案
                    $('.right-answer').css('visibility', 'visible');
                    $('.submit-answer p').css('color', '#ff001d').text('回答错误');
                }
            }
        });

    }

});
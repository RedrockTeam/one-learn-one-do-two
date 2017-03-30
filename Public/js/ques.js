$(function() {

    // 样式调整
    var screen = {
        width: $(window).width(),
        height: $(window).height()
    };
    // 定高
    $('#choose').css({
        height: $(window).height() * 0.759
    });

    var totalScore = 0;

    // 首次进入页面请求问题
    $.get('question', function(response) {
        if (response.status == 200) {
            addCookie('current', response.data.current);
            loadNextQues(response.data.question);
        } else if (response.status == 403) {
            layer.open({
                content: response.error,
                btn: '查看榜单',
                shadeClose: false,
                yes: function() {
                    location.href = 'Rank';
                }
            });
        }
    });


    function addCookie(name, value, expiresHours) {
        var cookieString = name + "=" + escape(value);
        //判断是否设置过期时间,0代表关闭浏览器时失效
        if (expiresHours > 0) {
            var date = new Date();
            date.setTime(date.getTime + expiresHours * 3600 * 1000);
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
        document.cookie = cookieString;
    }

    function setCookie(name, value, expiresHours) {
        var cookieString = name + "=" + escape(value);
        //判断是否设置过期时间,0代表关闭浏览器时失效
        if (expiresHours > 0) {
            var date = new Date();
            date.setTime(date.getTime + expiresHours * 3600 * 1000); //单位是多少小时后失效
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
        document.cookie = cookieString;
    }

    function getCookie(name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=")
            if (c_start != -1) {
                c_start = c_start + name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }

    // 加载下一题
    function loadNextQues(quesInfo) {
        if (quesInfo.type == 'choose') {
            initFillChoose(quesInfo.question, quesInfo.options, quesInfo.answer, quesInfo.image);
        } else {
            initFillBlank(quesInfo.question, quesInfo.options, quesInfo.answer, quesInfo.image);
        }
    }

    // 初始化选择题
    function initFillChoose(ques, options, answer, image) {

        var chooseLock = false;
        var isRight = false;
        // 题目文字
        $('#choose .ques-text').text(ques).css({
            height: screen.height * 0.24
        });

        // 题目最前面添加图片
        $('#choose .ques-text').prepend('<img class="ques-image" src="' + image + '">');

        // 选项模板
        var optionTpl = '';
        for (var letter in options) {
            optionTpl += '<div class="answer-box" data-option="' + letter + '">';
            optionTpl += '<div class="answer-option"><span>' + letter.toUpperCase() + '</span></div>';
            optionTpl += '<div class="answer-text">' + options[letter] + '</div></div>';
            if (letter == 'a') {
                optionTpl += '<div class="left-join"></div>';
            }

            if (letter == 'b') {
                optionTpl += '<div class="right-join"></div>';
            }
        }
        $('#choose .answer-wrapper').append(optionTpl);


        // 选择题是否选择答案flag
        var selectedAnswer = '';
        // 选择题选项点击逻辑
        $('#choose .answer-box').off('click').on('click', function(event) {
            if (!chooseLock) {
                var box = $(event.currentTarget);
                // 如果未选择任何选项
                if (!selectedAnswer) {
                    box.addClass('answer-box-selected');
                    box.find('.answer-text').addClass('answer-text-selected');
                    box.find('.answer-option').addClass('answer-option-selected');
                    selectedAnswer = box.attr('data-option');
                } else {
                    // 如果是取消选择
                    if (box.hasClass('answer-box-selected')) {
                        box.removeClass('answer-box-selected');
                        box.find('.answer-text').removeClass('answer-text-selected');
                        box.find('.answer-option').removeClass('answer-option-selected');
                        selectedAnswer = '';
                    } else {
                        // 如果选择的是别的选项 先把被选中的去除
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
                        selectedAnswer = box.attr('data-option');
                    }
                }
            }
        });


        // 如果选择了答案
        $('#choose .submit-answer').off('click').on('click', function(event) {
            if (selectedAnswer && !chooseLock) {
                chooseLock = true;

                // 判断选择正误操作
                if (selectedAnswer == answer) {
                    isRight = true;
                    var index = 0;
                    if (selectedAnswer == 'b') {
                        index = 1;
                    } else if (selectedAnswer == 'c') {
                        index = 2;
                    }
                    $('.answer-box').eq(index).addClass('answer-box-selected-right');
                    // 按钮文字改变
                    $('#choose .submit-answer p').css('color', '#1fa500').text('回答正确');
                    // 选项改变
                    $('.answer-box').eq(index).find('.answer-option').text('').addClass('answer-option-selected-right');
                } else {
                    for (var i = 0; i < $('.answer-box .answer-text').length; i++) {
                        var answerBox = $('.answer-box').eq(i);
                        // 错误答案标红
                        if (answerBox.hasClass('answer-box-selected')) {
                            answerBox.find('.answer-option').text('').addClass('answer-option-selected-error');
                        }
                        // 正确答案标绿
                        if (answerBox.attr('data-option') == answer) {
                            answerBox.addClass('answer-box-selected-right');
                            answerBox.find('.answer-option').text('').addClass('answer-option-selected answer-option-selected-right');
                        }
                    }
                    $('#choose .submit-answer p').css('color', '#ff0000').text('回答错误');
                }


                // 如果本道题已经是本组最后一道，就跳转到Rank页面
                if (getCookie('current') == 5) {
                    // 把本题结果返回，不请求下一题
                    $.post('question', {
                        isRight: isRight,
                        current: getCookie('current')
                    }, function(response) {
                        if (response.status == 200) {
                            setTimeout(function() {
                                location.href = 'Result';
                            }, 1500);
                        }
                    });
                } else {
                    // 请求下一题
                    $.post('question', {
                        isRight: isRight,
                        current: getCookie('current')
                    }, function(response) {
                        if (response.status == 200) {
                            setCookie('current', response.data.current);
                            setTimeout(function() {
                                // 题目文字清空
                                $('#choose .ques-text').text('');
                                // 题目选项清空
                                $('#choose .answer-wrapper').text('');
                                // 确认按钮变回原样
                                $('.submit-answer p').css('color', '#1c3eba').text('确认');
                                // 选择答案清空
                                selectedAnswer = '';
                                chooseLock = false;
                                loadNextQues(response.data.question);
                            }, 3000);
                        }
                    });
                }
            }
        });

        if ($('#choose').css('display') == 'none') {
            // 隐藏填字题页面
            $('#fillblank').removeClass('bounceIn');
            $('#fillblank').css('display', 'none');
            // 显示选择题页面
            $('#choose').addClass('animated bounceIn');
            $('#choose').css('display', 'block');
        }

        // 样式调整
        $('.answer-box').css('height', screen.height * 0.077);
        $('.answer-box .answer-option').css('height', screen.height * 0.055);

        $('.answer-box .answer-text').css({
            'height': screen.height * 0.077,
            'line-height': screen.height * 0.077 + 'px'
        });

        $('.answer-box .answer-option').find('span').css('line-height', (screen.height * 0.055 - 2) + 'px');

        $('#choose .submit-answer').css({
            'height': screen.height * 0.09,
            'line-height': screen.height * 0.09 - 8 + 'px'
        });
    }

    // 初始化填空题
    function initFillBlank(ques, options, answer, image) {

        // 未点击确认前为false
        // 点击确认之后就锁住
        var fillBlacnkLock = false;
        var isRight = false;

        // 题目文字
        var answerText = '',
            chooseText = '',
            answerFrame = '';

        // 题目空格文字
        for (var i = 0; i < answer.length; i++) {
            // 题目文字
            answerFrame += '<div class="text-frame" style="height: ' + screen.height * 0.034 + 'px"></div>';
        }
        $('#fillblank .ques-text').css('height', screen.height * 0.4 + 'px').prepend('<div>' + ques.replace(/___/, answerFrame) + '</div>');
        // 最前面需要添加图片
        $('#fillblank .ques-text').prepend('<img class="ques-image" src="' + image + '">');
        // 供选择的字
        for (var i = 0; i < options.length; i++) {
            // 供选择的字
            chooseText += '<div class="choose-text" style="height: ' + screen.height * 0.07 + 'px; line-height: ' + screen.height * 0.07 + 'px">' + options[i] + '</div>';
        }

        // 供选择的字
        $('.choose-text-wrapper').prepend(chooseText);

        // 显示正确答案
        $('.right-answer span').text(answer);

        $('#choose .submit-answer p').css('color', '#1c3eba').text('确认');

        // 已选择的字
        var selectedText = [];

        // 供选择的字点击事件
        $('.choose-text-wrapper .choose-text').off('click').on('click', function(event) {
            if (!fillBlacnkLock) {
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
                    // 在未选满字的情况下才能点击
                    if (selectedText.length < answer.length) {
                        $('#fillblank .text-frame').eq(selectedText.length).text(text.text()).addClass('text-frame-filled');
                        text.attr('data-index', selectedText.length).addClass('choose-text-selected');
                        selectedText.push(text.text());
                    }
                }
            }
        });


        // 确认按钮
        $('#fillblank .submit-answer').off('click').on('click', function() {
            // 全部填满且未点击过才能点击确认
            if (selectedText.length == answer.length && !fillBlacnkLock) {
                fillBlacnkLock = true;
                var choosedText = '';
                for (var i = 0; i < selectedText.length; i++) {
                    choosedText += selectedText[i];
                }

                // 答案正确
                if (choosedText == answer) {
                    isRight = true;
                    $('#fillblank .text-frame').addClass('text-frame-filled-right');
                    for (var i = 0; i < $('.choose-text').length; i++) {
                        if ($('.choose-text').eq(i).hasClass('choose-text-selected')) {
                            $('.choose-text').eq(i).addClass('choose-text-selected-right');
                        }
                    }
                    $('.submit-answer p').css('color', '#1fa500').text('回答正确');
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
                    $('.right-answer').css('visibility', 'visible').addClass('animated pulse');
                    $('#fillblank .submit-answer p').css('color', '#ff001d').text('回答错误');
                }
                if (getCookie('current') == 5) {
                    // 把本题结果返回，不请求下一题
                    $.post('question', {
                        isRight: isRight,
                        current: getCookie('current')
                    }, function(response) {
                        if (response.status == 200) {
                            setTimeout(function() {
                                location.href = 'Result';
                            }, 1500);
                        }
                    });
                } else {
                    // 请求下一题
                    $.post('question', {
                        isRight: isRight,
                        current: getCookie('current')
                    }, function(response) {
                        if (response.status == 200) {
                            setCookie('current', response.data.current);
                            setTimeout(function() {
                                // 清空操作
                                answerText = chooseText = answerFrame = '';
                                // 题目文字清空
                                $('#fillblank .ques-text').text('');
                                // 正确答案隐藏并清空
                                $('.right-answer').css('visibility', 'hidden').removeClass('pulse').find('span').text('');
                                // 供选择的字清空
                                $('.choose-text-wrapper').text('');
                                // 已选择的字清空
                                selectedText = [];
                                // 确认按钮变回原样
                                $('#fillblank .submit-answer p').css('color', '#1c3eba').text('确认');
                                loadNextQues(response.data.question);
                            }, 3000);
                        }
                    });
                }
            }
        });

        if ($('#fillblank').css('display') == 'none') {
            // 隐藏选择题页面
            $('#choose').removeClass('bounceIn');
            $('#choose').css('display', 'none');

            // 显示填字题页面
            $('#fillblank').addClass('animated bounceIn');
            $('#fillblank').css('display', 'block');
        }

        $('#fillblank .submit-answer').css('height', screen.height * 0.09);

        $('#fillblank .submit-answer').css('line-height', screen.height * 0.09 - 8 + 'px');

    }

});
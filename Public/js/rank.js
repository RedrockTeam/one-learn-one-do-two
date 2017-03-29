$(function() {

    $('.return-index').css('line-height', $('.return-index').height() - 4 + 'px');

    $.get('getRank', function(response) {
        if (response.status == 200) {
            var data = response.data;
            $('.my-name').text(data.nickname);
            $('.my-ranking').text(data.rank);
            var list = [{
                rank: 'http://placeholder.qiniudn.com/42x42/34AADC/fff',
                nickname: '测试用户1'
            }, {
                rank: 'http://placeholder.qiniudn.com/26x26/FFCC00/000',
                nickname: '测试用户12'
            }, {
                rank: 'http://placeholder.qiniudn.com/42x42/34AADC/fff',
                nickname: '测试用户3'
            }, {
                rank: 4,
                nickname: '测试用户4'
            }];
            var rankListTpl = '';
            for (var i = 0; i < list.length; i++) {
                rankListTpl += '<div class="rank-column">';
                if (list[i]['rank'] != Number(list[i]['rank'])) {
                    rankListTpl += '<div class="ranking"><img src="' + list[i]['rank'] + '"></div>';
                } else {
                    rankListTpl += '<div class="ranking">' + list[i]['rank'] + '</div>';
                }
                rankListTpl += '<div class="nickname">' + list[i]['nickname'] + '</div>';
                rankListTpl += '</div>';
            }

            $('.rank-list').append(rankListTpl);
        }
    });

});
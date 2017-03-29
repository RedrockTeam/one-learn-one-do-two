$(function() {

    $('.return-index').css('line-height', $('.return-index').height() - 4 + 'px');

    $.get('getRank', function(response) {
        if (response.status == 200) {
            var data = response.data;
            $('.my-name').text(data.nickname);
            $('.my-ranking').text(data.rank);
            var list = [{
                rank: 'top1.png',
                nickname: '测试用户1'
            }, {
                rank: 'top2.png',
                nickname: '测试用户12'
            }, {
                rank: 'top3.png',
                nickname: '测试用户3'
            }, {
                rank: 4,
                nickname: '测试用户4'
            }];
            var rankListTpl = '';
            for (var i = 0; i < list.length; i++) {
                rankListTpl += '<div class="rank-column">';
                if (list[i]['rank'] != Number(list[i]['rank'])) {
                    rankListTpl += '<div class="ranking"><img style="width: 62%; height: 52%;" src="../../../Public/images/' + list[i]['rank'] + '"></div>';
                } else {
                    rankListTpl += '<div class="ranking" style="text-indent: 4px;">' + list[i]['rank'] + '</div>';
                }
                rankListTpl += '<div class="nickname">' + list[i]['nickname'] + '</div>';
                rankListTpl += '</div>';
            }

            $('.rank-list').append(rankListTpl);
        }
    });

});
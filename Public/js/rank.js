$(function() {

    $('.return-index').css('line-height', $('.return-index').height() - 4 + 'px');

    $.get('getRank', function(response) {
        if (response.status == 200) {
            var data = response.data;
            var list = data.list;
            $('.my-name').text(data.nickname.length > 12 ? data.nickname.substr(0, 12) + '...' : data.nickname);
            $('.my-ranking').text(data.rank);
            var rankListTpl = '';
            for (var i = 0; i < list.length; i++) {
                rankListTpl += '<div class="rank-column">';
                if (list[i]['rank'] != Number(list[i]['rank'])) {
                    rankListTpl += '<div class="ranking"><img style="width: 62%; height: 52%;" src="' + list[i]['rank'] + '"></div>';
                } else {
                    rankListTpl += '<div class="ranking" style="text-indent: 4px;">' + list[i]['rank'] + '</div>';
                }
                if (list[i]['nickname'].length > 15) {
                    var nickname = list[i]['nickname'].substr(0, 15) + '...';
                } else {
                    var nickname = list[i]['nickname'];
                }
                rankListTpl += '<div class="nickname">' + nickname + '</div>';
                rankListTpl += '</div>';
            }

            $('.rank-list').append(rankListTpl);
        }
    });

});
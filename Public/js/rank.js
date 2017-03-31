$(function() {

    $('.return-index').css('line-height', $('.return-index').height() - 4 + 'px');

    $.get('getRank', function(response) {
        if (response.status == 200) {
            var data = response.data;
            var list = data.list;
            $('.my-name').text(data.nickname.length > 12 ? data.nickname.substr(0, 12) + '...' : data.nickname);
            $('.my-ranking').text(data.rank);
            $('.my-avatar').attr('src', data.avatar);
            var rankListTpl = '';
            for (var i = 0; i < list.length; i++) {
                rankListTpl += '<div class="rank-column">';
                if (list[i]['nickname'].length >= 10) {
                    var nickname = list[i]['nickname'].substr(0, 9) + '...';
                } else {
                    var nickname = list[i]['nickname'];
                }
                rankListTpl += '<div class="nickname"><img src="' + list[i]['avatar'] + '"><div style="margin-left: 4%; float: left; font-size: 14px;">' + nickname + '</div></div>';

                if (list[i]['rank'] != Number(list[i]['rank'])) {
                    rankListTpl += '<div class="ranking"><img style="width: 55%; height: 52%;" src="' + list[i]['rank'] + '"></div>';
                } else {
                    rankListTpl += '<div class="ranking"><span>' + list[i]['rank'] + '</span></div>';
                }
                rankListTpl += '</div>';
            }

            $('.rank-list').append(rankListTpl);
        }
    });

});
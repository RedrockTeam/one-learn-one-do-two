<?php
namespace Home\Controller;

use Think\Controller;

class BaseController extends Controller {
    public function _initialize() {
        if (APP_DEBUG) {
            session('nickname', 'test');
            session('openid', 'asdf');
        }
        $openid = session('openid');
        $nickname = session('nickname');
        if (!$openid || !$nickname) {
            $openid = I('get.openid');
            $nickname = urldecode(I('get.nickname'));//'知识混子周政';//
        }
        if (!$openid || !$nickname) {
            $uri = 'http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/oauth&redirect='.urlencode('https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
            redirect($uri);
        }
        session('openid', $openid);
        session('nickname', $nickname);
        $users = M('users');
        $num = $users->where(array('openid' => $openid))->count();
        if ($num == 0) {
            $data = array(
                'openid' => $openid,
                'nickname' => $nickname,
                'date'   => date('Y-m-d', time()),
                'count'  => 0,
                'current'  => 0,
                'today_learn_group'  => 0,
                'today_learn_id'  => 0,
                'imgurl' => urldecode(I('get.headimgurl')),
            );
            $users->add($data);
        } else {
            $img = I('get.headimgurl');
            if ($nickname && $img) {
                $data['nickname'] = $nickname;
                $data['imgurl'] = urldecode($img);
                $users->where(array('openid' => $openid))->save($data);
            }
        }
    }
}
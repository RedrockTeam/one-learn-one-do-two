<?php
namespace Home\Controller;
 use Org\Util\String;

class IndexController extends BaseController {
    private $total = 5;
    private $chooseCount = 3;
    private $appid = 'wx81a4a4b77ec98ff4';
    private $acess_token = 'gh_68f0a1ffc303';
    public function index() {
        $this->display();
    }

    public function ques() {
        $this->display();
    }

    public function rank() {
        $this->display();
    }

    public function result() {
        $this->assign('rightCount', I('get.rightCount', 0));
        $this->display();
    }

    public function question() {
        $openid = session('openid');
        $users = M('users');
        $user = $users->where(array('openid' => $openid))->find();

        //todo 学习限制

        //访问时检查是否为第二天, 重置状态
        if ($user['date'] != date('Y-m-d', time())) {
            $user['date'] = date('Y-m-d', time());
            $user['time'] = time();
            $user['current'] = 0;
            $user['today_learn_groups'] = 0;
            $user['today_learn_id'] = json_encode(array('choose'=>array(), 'fillblank'=>array()));
        }

        //检查学习题目上限
        if ($user['today_learn_groups'] == 5) {
            $this->ajaxReturn(array(
                'status' => 403,
                'error'  => '每天最多只能学五组题'
            ));
        }

        $currentLearn = json_decode($user['today_learn_id']);
        if ($user['current'] < $this->chooseCount) {
            $data['question'] = $this->fillblank($currentLearn, $user['current']);
        } elseif ($user['current'] >= $this->chooseCount && $user['current'] < $this->total){
            $data['question'] = $this->choose($currentLearn);
        } else {
            $this->ajaxReturn(array(
                'status' => 500,
                'error' => '当前题目未知'
            ));
        }
        $user['today_learn_id'] = json_encode($currentLearn);
        $user['current'] += 1;
        $data['current'] = $user['current'];
        if ($user['current'] == $this->total) {
            $user['current'] = 0;
            $user['count'] += 1;
            $user['today_learn_groups'] += 1;
        }
        $data['total'] = $this->total;
        $users->where(array('openid' => $openid))->save($user);
        $this->ajaxReturn(array(
            'status' => 200,
            'data'  => $data
        ));
    }

    public function getRank() {
        $users = M('users');
        $openid = session('openid');
        $user = $users->where(array('openid' => $openid))->find();
        $map['count'] = array('EGT', $user['count']);
        $rank = $users->where($map)->count();
        $list = $users->order('count desc')->field('nickname, imgurl as avatar')->limit(10)->select();
        if ($rank <= 10) {
            $real = $users->order('count desc')->field('nickname, imgurl')->limit(10)->select();
        }
        foreach ($real as $key => $value) {
            if ($value['nickname'] == $user['nickname']) {
                $rank = $key+1;
            }
        }
        if ($user['count'] == 0) {
            $rank = '∞';
        }
        $num = 1;
        foreach ($list as &$v) {
            if ($num < 4) {
                $v['rank'] = __APP__.'/Public/images/top'.$num.'.png';
            } else {
                $v['rank'] = $num;
            }
            $num++;
        }
        $this->ajaxReturn(array(
            'status' => 200,
            'data'   => array(
                'list' => $list,
                'rank' => $rank,
                'nickname' => $user['nickname'],
                'avatar' => $user['imgurl'],
                'count' => $user['count'],
            )
        ));
    }

    private function choose(&$currentData) {
        if ($currentData->choose) {
            $map['id'] = array('NOT IN', $currentData->choose);
            $question = M('chooses')->where($map)->order('rand()')->find();
        } else {
            $question = M('chooses')->order('rand()')->find();
        }
        array_push($currentData->choose, $question['id']);
        $data = array(
            'type' => 'choose',
            'question' => $question['question'],
            'options' => array(
                'a' => $question['a'],
                'b' => $question['b'],
                'c' => $question['c']
            ),
            'answer' => $question['answer'],
            'image' => __APP__.'/Public/images/'.rand(1, 22).'.png'
        );
        return $data;
    }

    private function fillblank(&$currentData, $current) {
        if ($current == 0) {
            $map['special_type'] = 'congyanzhidang';
        }
        if ($current == 1) {
            $map['special_type'] = 'qingniangongzuo';
        }
        if ($currentData->fillblank) {
            $map['id'] = array('NOT IN', $currentData->fillblank);
            $question = M('fillblank')->where($map)->order('rand()')->find();
        } else {
            $question = M('fillblank')->order('rand()')->find();
        }
        array_push($currentData->fillblank, $question['id']);
        $options = preg_split('/(?<!^)(?!$)/u', $question['answer']);
        $num = 8 - count($options);
        if ($num != 0) {
            $cmap['chracter'] =  array('NOT IN', $options);
            $add = M('chracters')->where($cmap)->order('rand()')->limit($num)->field('chracter')->select();
            foreach ($add as $v) {
                $options = array_merge($options, array($v['chracter']));
            }
        }
        shuffle($options);
        $data = array(
            'type' => 'fillblank',
            'question_type' => $question['type'],
            'question' => $question['question'],
            'options' => $options,
            'answer' => $question['answer']
        );
        if ($question['type'] == 'gushidiangu') {
            $data['image'] = __APP__.'/Public/images/'.rand(1, 22).'.png';
        }
        return $data;
    }

    public function JSSDKSignature(){
         $string = new String();
        $jsapi_ticket =  $this->getTicket();
        $data['jsapi_ticket'] = $jsapi_ticket['data'];
        $data['noncestr'] = $string->randString();
        $data['timestamp'] = time();
        $data['url'] = 'https://'.$_SERVER['HTTP_HOST'].__SELF__;//生成当前页面url
        $data['signature'] = sha1($this->ToUrlParams($data));
        return $data;
    }
    private function ToUrlParams($urlObj){
        $buff = "";
        foreach ($urlObj as $k => $v) {
            if($k != "signature") {
                $buff .= $k . "=" . $v . "&";
            }
        }
        $buff = trim($buff, "&");
        return $buff;
    }


    /*curl通用函数*/
    private function curl_api($url, $data=''){
        // 初始化一个curl对象
        $ch = curl_init();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
        // 运行curl，获取网页。
        $contents = json_decode(curl_exec($ch), true);
        // 关闭请求
        curl_close($ch);
        return $contents;
    }

    private function getTicket() {
        $time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $string='';
        for($i=0;$i<16;$i++){
            $num = mt_rand(0,61);
            $string .= $str[$num];
        }
        $secret =sha1(sha1($time).md5($string)."redrock");
        $t2 = array(
            'timestamp'=>$time,
            'string'=>$string,
            'secret'=>$secret,
            'token'=>$this->acess_token,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket";
        return $this->curl_api($url, $t2);
    }
}
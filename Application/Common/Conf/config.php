<?php
return array(
    //'配置项'=>'配置值'
    //显示调试日志
    'SHOW_PAGE_TRACE' => true,
    //路由对大小写不敏感
    'URL_CASE_INSENSITIVE' => true,
    'URL_MODEL' => '2',
    'DEFAULT_CHARSET' => 'utf-8',
    //'SESSION_PREFIX'        =>  'date_', // session 前缀
    'SESSION_OPTIONS' => array('use_only_cookies' => 0, 'use_trans_sid' => 1),
    'DEFAULT_FILTER' => 'htmlspecialchars,trim,strip_tags',
    /*
     * 数据库配置
    */
    'DB_TYPE' => 'mysql',     // 数据库类型
    'DB_HOST' => 'localhost', // 服务器地址
    'DB_NAME' => 'one_learn_one_do_two', // 数据库名
    'DB_USER' => 'root',      // 用户名
    'DB_PWD' => 'root',    // 密码
    'DB_PORT' => '3306',     // 端口
    'DB_PREFIX'             =>  '',    	// 数据库表前缀
    'DB_FIELDTYPE_CHECK' => false,       // 是否进行字段类型检查
    'DB_FIELDS_CACHE' => false,        // 启用字段缓存
    'DB_CHARSET' => 'utf8mb4',
);
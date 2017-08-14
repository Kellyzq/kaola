<?php
/**
 * @ controller Index.class.php
 *
 */

defined('IN_APP') or exit('Denied Access!');

class IndexController extends Controller {

	public function index() {
		echo '<p>欢迎</p>';
		//$result = $this->db->get("select * from users", 1);
		//dump($result);
	}

	/**
	 * @ interface 用户名验证
	 */
	public function verifyUserName() {
		
		$username = trim(isset($_REQUEST['username']) ? $_REQUEST['username'] : '');
		
		switch ($this->_verifyUserName($username)) {
			case 0:
				$this->sendByAjax(array('message'=>''));
				break;
			case 1:
				$this->sendByAjax(array('code'=>1,'message'=>'账号需由6-18个字符组成'));
				break;
			case 2:
				$this->sendByAjax(array('code'=>2,'message'=>'该账号已注册'));
				break;
			default:
				break;
		}
		
	}

	/**
	 * @ interface 用户注册
	 */
	public function reg() {
		$username = trim(isset($_REQUEST['username']) ? $_REQUEST['username'] : '');
		$password = trim(isset($_REQUEST['password']) ? $_REQUEST['password'] : '');
		$avatar = trim(isset($_REQUEST['avatar']) && in_array($_REQUEST['avatar'], array(1,2,3,4,5,6,7,8,9)) ? intval($_REQUEST['avatar']) : 1);

		if ($this->_verifyUserName($username) !== 0 || strlen($password)<6 || strlen($password) > 16) {
			$this->sendByAjax(array('code'=>1,'message'=>'注册失败！'));
		}
		$password = md5($password);
		if (false === $this->db->query("INSERT INTO `users` (`username`, `password`, `avatar`) VALUES ('{$username}', '{$password}', {$avatar})")) {
			$this->sendByAjax(array('code'=>1,'message'=>'注册失败！'));
		} else {
			$this->sendByAjax(array('message'=>'注册成功！'));
		}
	}

	/**
	 * @ 用户登陆
	 */
	public function login() {
		$username = trim(isset($_REQUEST['username']) ? $_REQUEST['username'] : '');
		$password = trim(isset($_REQUEST['password']) ? $_REQUEST['password'] : '');

		if (isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'您已登录，请不要重复登录！'));
		}

		if ($rs = $this->db->get("SELECT * FROM `users` WHERE `username`='{$username}'")) {
			if ($rs['password'] != md5($password)) {
				$this->sendByAjax(array('code'=>1,'message'=>'登陆失败！'));
			} else {
				setcookie('uid', $rs['uid'], time() + 3600*60, '/');
				setcookie('username', $rs['username'], time() + 3600*60, '/');
				$this->sendByAjax(array('code'=>0,'message'=>'登陆成功！'));
			}
		} else {
			$this->sendByAjax(array('code'=>1,'message'=>'账号或密码错误！'));
		}
	}

	/**
	 * @ 用户退出
	 */
	public function logout() {
		if (!isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'你还没有登陆！'));
		} else {
			setcookie('uid', 0, time() - 3600*60, '/');
			setcookie('username', 0, time() - 3600*60, '/');
			$this->sendByAjax(array('code'=>0,'message'=>'退出成功！'));
		}
	}

	/**
	 * 用户留言保存
	 */
	public function send() {
		if (!isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'你还没有登陆！'));
		} else {
			$content = trim(isset($_POST['content']) ? $_POST['content'] : '');
			if (empty($content)) {
				$this->sendByAjax(array('code'=>1,'message'=>'留言内容不能为空！'));
			}
			$dateline = time();
			$this->db->query("INSERT INTO `contents` (`uid`, `content`, `dateline`) VALUES ({$_COOKIE['uid']}, '{$content}', {$dateline})");
			$returnData = array(
				'cid'		=>	$this->db->getInsertId(),
				'uid'		=>	$_COOKIE['uid'],
				'username'	=>	$_COOKIE['username'],
				'content'	=>	$content,
				'dateline'	=>	$dateline,
				'support'	=>	0,
				'oppose'	=>	0,
			);
			$this->sendByAjax(array('code'=>0,'message'=>'留言成功！','data'=>$returnData));
		}
	}

	/**
	 * @ 顶
	 */
	public function doSupport() {
		if (!isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'你还没有登陆！'));
		} else {
			$cid = isset($_REQUEST['cid']) ? intval($_REQUEST['cid']) : 0;
			if (!$cid) $this->sendByAjax(array('code'=>1,'message'=>'无效留言cid！'));
			$content = $this->db->get("SELECT cid FROM `contents` WHERE `cid`={$cid}");
			if (!$content) $this->sendByAjax(array('code'=>1,'message'=>'不存在的留言cid！'));
			$this->db->query("UPDATE `contents` SET `support`=support+1 WHERE `cid`={$cid}");
			$this->sendByAjax(array('code'=>0,'message'=>'顶成功！'));
		}
	}

	/**
	 * @ 踩
	 */
	public function doOppose() {
		if (!isset($_COOKIE['uid'])) {
			$this->sendByAjax(array('code'=>1,'message'=>'你还没有登陆！'));
		} else {
			$cid = isset($_REQUEST['cid']) ? intval($_REQUEST['cid']) : 0;
			if (!$cid) $this->sendByAjax(array('code'=>1,'message'=>'无效留言cid！'));
			$content = $this->db->get("SELECT cid FROM `contents` WHERE `cid`={$cid}");
			if (!$content) $this->sendByAjax(array('code'=>1,'message'=>'不存在的留言cid！'));
			$this->db->query("UPDATE `contents` SET `oppose`=oppose+1 WHERE `cid`={$cid}");
			$this->sendByAjax(array('code'=>0,'message'=>'踩成功！'));
		}
	}

	/**
	 * @ 获取留言列表
	 */
	public function getList() {
		$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;	//当前页数
		$n = isset($_REQUEST['n']) ? intval($_REQUEST['n']) : 10;	//每页显示条数
		//获取总记录数
		$result_count = $this->db->get("SELECT count('cid') as count FROM `contents`");
		$count = $result_count['count'] ? (int) $result_count['count'] : 0;
		if (!$count) {
			$this->sendByAjax(array('code'=>1,'message'=>'还没有任何留言！'));
		}
		$pages = ceil($count / $n);
		if ($page > $pages) {
			$this->sendByAjax(array('code'=>2,'message'=>'没有数据了！'));
		}
		$start = ( $page - 1 ) * $n;
		$result = $this->db->select("SELECT c.cid,c.uid,u.username,c.content,c.dateline,c.support,c.oppose FROM `contents` as c, `users` as u WHERE u.uid=c.uid ORDER BY c.cid DESC LIMIT {$start},{$n}");
		$data = array(
			'count'	=>	$count,
			'pages'	=>	$pages,
			'page'	=>	$page,
			'n'		=>	$n,
			'list'	=>	$result
		);
		$this->sendByAjax(array('code'=>0,'message'=>'','data'=>$data));
	}

	/**
	 * @ 用户名验证
	 */
	private function _verifyUserName($username='') {
		if (strlen($username) < 14 || strlen($username) > 26) {
			return 1;
		}
		$rs = $this->db->get("SELECT `username` FROM `users` WHERE `username`='{$username}'");
		if ($rs) return 2;
		return 0;
	}
	
	
	/**
	 * @ 二级菜单JSON数据
	 */
	public function jsonall(){
		$this->sendByAjax(
			array(
				'box'=>array(
					//box1
					array('line'=>array(
						//box1-line1
						array(
							'cont'=>array(
								//box1-line1-cont1
								array(
									'title'=>'奶粉','link'=>array(
										//link
										array('name'=>'爱他美','color'=>'1'),
										array('name'=>'牛栏','color'=>'1'),
										array('name'=>'Hero Baby','color'=>'1'),
										array('name'=>'喜宝','color'=>'1'),
										array('name'=>'贝拉米','color'=>'1'),
										array('name'=>'美素佳儿','color'=>'1'),
										array('name'=>'美林','color'=>'0'),
										array('name'=>'a2','color'=>'1'),
										array('name'=>'惠氏','color'=>'0'),
										array('name'=>'雅培','color'=>'1'),
										array('name'=>'美赞臣','color'=>'0'),
										array('name'=>'贝尔','color'=>'0'),
										array('name'=>'合生元','color'=>'1'),
										array('name'=>'Pre段','color'=>'1'),
										array('name'=>'1段','color'=>'1'),
										array('name'=>'2段','color'=>'1'),
										array('name'=>'3段','color'=>'0'),
										array('name'=>'5段（2+）','color'=>'0'),
										array('name'=>'4段（1+）','color'=>'0'),
										array('name'=>'6段','color'=>'0')
									)
								),
								//box1-line1-cont2
								array(
									'title'=>'纸尿裤/拉拉裤','link'=>array(
										//link
										array('name'=>'花王','color'=>'1'),
										array('name'=>'尤妮佳','color'=>'1'),
										array('name'=>'大王','color'=>'1'),
										array('name'=>'好奇','color'=>'1'),
										array('name'=>'妈咪宝贝','color'=>'0'),
										array('name'=>'帮宝适','color'=>'0'),
										array('name'=>'班博','color'=>'0'),
										array('name'=>'丽贝乐','color'=>'0'),
										array('name'=>'科克兰','color'=>'0'),
										array('name'=>'宝松怡','color'=>'0'),
										array('name'=>'NB号','color'=>'0'),
										array('name'=>'S号','color'=>'0'),
										array('name'=>'M号','color'=>'0'),
										array('name'=>'L号','color'=>'0'),
										array('name'=>'XL号','color'=>'0'),
										array('name'=>'XXL号','color'=>'0')
									),
								)
							)
						),
						//box1-line2
						array(
							'cont'=>array(
								//box1-line2-cont1
								array(
									'title'=>'3333','link'=>array(
										//link
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
									)
								),
								array(
								//box1-line2-cont2
									'title'=>'2222','link'=>array(
										//link
										array('name'=>'XXL号','color'=>'0')
									),
								)
							)
						),
						//box1-line3
						array(
							'cont'=>array(
								//box1-line2-cont1
								array(
									'title'=>'3333','link'=>array(
										//link
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
										array('name'=>'花王','color'=>'1'),
									)
								),
								array(
								//box1-line2-cont2
									'title'=>'2222','link'=>array(
										//link
										array('name'=>'XXL号','color'=>'0')
									),
								)
							)
						),
					)
				),
				array('line'=>array(
					array('cont'=>array(
						'title'=>'4444','link'=>array(
							array('name'=>'花王','color'=>'1'),
						)
					)),
			array('cont'=>array(
				'title'=>'45555','link'=>array(
					array('name'=>'XXL号','color'=>'0')
				)
				)
			)
		))
		)));
	}
}
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
					array('line'=>array(//line1
						array(
							'cont'=>array(
								array(
									'title'=>'奶粉','link'=>array(
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
								array(
									'title'=>'纸尿裤/拉拉裤','link'=>array(
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
						array(
							'cont'=>array(
								array(
									'title'=>'营养辅食','link'=>array(
										array('name'=>'辅食泥','color'=>'1'),
										array('name'=>'米粉迷糊','color'=>'1'),
										array('name'=>'泡芙','color'=>'1'),
										array('name'=>'溶溶豆','color'=>'0'),
										array('name'=>'营养品','color'=>'0'),
										array('name'=>'饼干','color'=>'0'),
										array('name'=>'肉松面仔','color'=>'0'),
										array('name'=>'调味品','color'=>'0'),
										array('name'=>'其他副食','color'=>'0'),
										array('name'=>'其他零食','color'=>'0'),
									)
								),
								array(
									'title'=>'宝宝用品','link'=>array(
										array('name'=>'洗漱护肤','color'=>'1'),
										array('name'=>'护理','color'=>'1'),
										array('name'=>'喂养','color'=>'1'),
										array('name'=>'出行','color'=>'0'),
										array('name'=>'清洁消毒','color'=>'0'),
										array('name'=>'图书文具','color'=>'0'),
										array('name'=>'积木','color'=>'0'),
										array('name'=>'益智玩具','color'=>'0'),
										array('name'=>'其他玩具','color'=>'0'),
										array('name'=>'宝宝家居','color'=>'0'),
										array('name'=>'小家电','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'童装童鞋','link'=>array(
										array('name'=>'童装','color'=>'1'),
										array('name'=>'儿童配饰','color'=>'0'),
										array('name'=>'童鞋','color'=>'1'),
									)
								),
								array(
									'title'=>'孕妈必备','link'=>array(
										array('name'=>'营养','color'=>'1'),
										array('name'=>'洗护','color'=>'1'),
										array('name'=>'待产新生','color'=>'0'),
										array('name'=>'穿戴','color'=>'0'),
										array('name'=>'塑身','color'=>'0'),
									),
								)
							)
						),
					)),
					array('line'=>array(//line2
						array(
							'cont'=>array(
								array(
									'title'=>'护肤','link'=>array(
										array('name'=>'洁面','color'=>'1'),
										array('name'=>'卸妆','color'=>'0'),
										array('name'=>'爽肤水','color'=>'1'),
										array('name'=>'面霜','color'=>'1'),
										array('name'=>'眼部护理洁面','color'=>'0'),
										array('name'=>'精华','color'=>'1'),
										array('name'=>'乳液/凝胶','color'=>'1'),
										array('name'=>'手/足护理','color'=>'0'),
										array('name'=>'身体护理','color'=>'0'),
										array('name'=>'唇部护理','color'=>'0'),
										array('name'=>'护肤套装','color'=>'1'),
										array('name'=>'男士面膜','color'=>'1'),
										array('name'=>'精油芳疗','color'=>'0'),
										array('name'=>'面部护肤','color'=>'0'),
										array('name'=>'男士护肤','color'=>'1'),
									)
								),
								array(
									'title'=>'面膜','link'=>array(
										array('name'=>'可莱丝','color'=>'1'),
										array('name'=>'森田药妆','color'=>'0'),
										array('name'=>'Montagne jeunesse','color'=>'1'),
										array('name'=>'丽得姿','color'=>'0'),
										array('name'=>'SNP','color'=>'0'),
										array('name'=>'Elizavecca','color'=>'0'),
										array('name'=>'我的心机','color'=>'0'),
										array('name'=>'自然晨露','color'=>'1'),
										array('name'=>'THE BODY SHOP','color'=>'0'),
										array('name'=>'我的美丽日记','color'=>'0'),
										array('name'=>'BEYOND','color'=>'0'),
										array('name'=>'其他面膜','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'彩妆','link'=>array(
										array('name'=>'BB霜/CC霜','color'=>'1'),
										array('name'=>'唇膏/唇彩','color'=>'0'),
										array('name'=>'隔离/妆前','color'=>'0'),
										array('name'=>'粉底','color'=>'0'),
										array('name'=>'粉饼/散粉','color'=>'0'),
										array('name'=>'美甲','color'=>'1'),
										array('name'=>'眼线','color'=>'1'),
										array('name'=>'眉笔','color'=>'0'),
										array('name'=>'睫毛膏','color'=>'1'),
										array('name'=>'眼影','color'=>'0'),
										array('name'=>'腮红','color'=>'0'),
										array('name'=>'遮瑕','color'=>'0'),
										array('name'=>'高光/修剪','color'=>'0'),
										array('name'=>'香水','color'=>'1'),
										array('name'=>'化妆工具','color'=>'0'),
										array('name'=>'彩妆工具','color'=>'0'),

									)
								),
								array(
									'title'=>'防晒修复','link'=>array(
										array('name'=>'水宝宝','color'=>'1'),
										array('name'=>'露得清','color'=>'0'),
										array('name'=>'香蕉船','color'=>'0'),
										array('name'=>'高丝','color'=>'0'),
										array('name'=>'近江兄弟','color'=>'0'),
										array('name'=>'曼秀雷敦','color'=>'0'),
										array('name'=>'碧柔','color'=>'0'),
										array('name'=>'高丽雅娜','color'=>'0'),
										array('name'=>'Ego','color'=>'0'),
										array('name'=>'其他防晒','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'香水/香氛','link'=>array(
										array('name'=>'女士香水','color'=>'1'),
										array('name'=>'男士香水','color'=>'0'),
										array('name'=>'香水套装','color'=>'0'),
										array('name'=>'Q版香水','color'=>'0'),
									)
								),
								
							)
						),
					)),
					array('line'=>array(//line3
						array(
							'cont'=>array(
								array(
									'title'=>'精选大牌','link'=>array(
										array('name'=>'MICHAEL KORS','color'=>'1'),
										array('name'=>'COACH 蔻驰','color'=>'0'),
										array('name'=>'SWAROVSKI','color'=>'0'),
										array('name'=>'FURLA 芙拉','color'=>'1'),
										array('name'=>'Kipling 凯浦林','color'=>'0'),
										array('name'=>'Salvatore Ferragamo','color'=>'0'),
										array('name'=>'LONGCHAMP 珑骧','color'=>'0'),
										array('name'=>'BOTTEGA VENETA','color'=>'0'),
										array('name'=>'Kate Spade','color'=>'1'),
										array('name'=>'Rebecca Minkoff','color'=>'0'),
										array('name'=>'土拨鼠','color'=>'0'),
									)
								),
								array(
									'title'=>'手表配饰','link'=>array(
										array('name'=>'墨镜','color'=>'1'),
										array('name'=>'眼镜','color'=>'0'),
										array('name'=>'腰带','color'=>'1'),
										array('name'=>'项链','color'=>'1'),
										array('name'=>'手镯','color'=>'0'),
										array('name'=>'大牌手表','color'=>'0'),
										array('name'=>'流行饰品','color'=>'0'),
										array('name'=>'围巾/丝巾','color'=>'0'),
										array('name'=>'Zippo 打火机','color'=>'0'),
										array('name'=>'Ray·Ban 雷朋','color'=>'1'),
										array('name'=>'GENTLE MONSTER','color'=>'1'),
										array('name'=>'KAREN WALKER','color'=>'0'),
										array('name'=>'军刀','color'=>'0'),
										array('name'=>'其他配件','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'女士箱包','link'=>array(
										array('name'=>'斜挎包','color'=>'1'),
										array('name'=>'手提包	','color'=>'0'),
										array('name'=>'手拿包','color'=>'0'),
										array('name'=>'双肩包','color'=>'0'),
										array('name'=>'化妆包','color'=>'0'),
										array('name'=>'钱包/卡包','color'=>'0'),
										array('name'=>'附件包','color'=>'0'),
									)
								),
								array(
									'title'=>'服饰内衣','link'=>array(
										array('name'=>'男装','color'=>'0'),
										array('name'=>'女装','color'=>'0'),
										array('name'=>'丝袜','color'=>'0'),
										array('name'=>'Calvin Klein 卡文克莱','color'=>'1'),
										array('name'=>'睡衣/家居服套装','color'=>'0'),
										array('name'=>'内衣','color'=>'1'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'男士箱包','link'=>array(
										array('name'=>'斜挎包','color'=>'1'),
										array('name'=>'手拿包','color'=>'0'),
										array('name'=>'双肩包','color'=>'0'),
										array('name'=>'商务包','color'=>'0'),
										array('name'=>'钱包/卡包','color'=>'0'),
										array('name'=>'网易考拉拉杆箱','color'=>'1'),
										array('name'=>'手提包','color'=>'1'),
									)
								),
								array(
									'title'=>'鞋','link'=>array(
										array('name'=>'女鞋','color'=>'0'),
										array('name'=>'男鞋','color'=>'0'),
										array('name'=>'户外鞋','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line4
						array(
							'cont'=>array(
								array(
									'title'=>'洗护日用','link'=>array(
										array('name'=>'洗发水','color'=>'1'),
										array('name'=>'护发素','color'=>'0'),
										array('name'=>'发膜','color'=>'1'),
										array('name'=>'染发剂','color'=>'0'),
										array('name'=>'护发精油','color'=>'0'),
										array('name'=>'梳子','color'=>'1'),
										array('name'=>'沐浴露','color'=>'0'),
										array('name'=>'沐浴皂','color'=>'1'),
										array('name'=>'洗手液','color'=>'0'),
										array('name'=>'牙膏','color'=>'0'),
										array('name'=>'牙刷','color'=>'1'),
										array('name'=>'漱口水','color'=>'0'),
										array('name'=>'牙线','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line5
						array(
							'cont'=>array(
								array(
									'title'=>'营养补充','link'=>array(
										array('name'=>'维生素','color'=>'1'),
										array('name'=>'鱼油','color'=>'0'),
										array('name'=>'酵素','color'=>'1'),
										array('name'=>'蛋白粉','color'=>'0'),
										array('name'=>'葡萄籽','color'=>'0'),
										array('name'=>'蔓越莓','color'=>'1'),
										array('name'=>'叶酸','color'=>'0'),
										array('name'=>'蜂蜜/蜂胶','color'=>'1'),
										array('name'=>'铁','color'=>'0'),
										array('name'=>'钙','color'=>'0'),
										array('name'=>'蛋白质/氨基酸','color'=>'1'),
										array('name'=>'大豆异黄酮','color'=>'0'),
										array('name'=>'大蒜提取物 ','color'=>'1'),
										array('name'=>'胶原蛋白','color'=>'0'),
										array('name'=>'参类','color'=>'1'),
										array('name'=>'蜂蜜','color'=>'0'),
										array('name'=>'奶蓟草','color'=>'1'),
										array('name'=>'月见草','color'=>'0'),
										array('name'=>'番茄红素','color'=>'1'),
										array('name'=>'芦荟','color'=>'0'),
										array('name'=>'卵磷脂','color'=>'1'),
										array('name'=>'银杏','color'=>'1'),
										array('name'=>'叶黄/蓝莓','color'=>'1'),
										array('name'=>'DHA','color'=>'1'),
										array('name'=>'维骨力','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line6
						array(
							'cont'=>array(
								array(
									'title'=>'洗护日用','link'=>array(
										array('name'=>'洗发水','color'=>'1'),
										array('name'=>'护发素','color'=>'0'),
										array('name'=>'发膜','color'=>'1'),
										array('name'=>'染发剂','color'=>'0'),
										array('name'=>'护发精油','color'=>'0'),
										array('name'=>'梳子','color'=>'1'),
										array('name'=>'沐浴露','color'=>'0'),
										array('name'=>'沐浴皂','color'=>'1'),
										array('name'=>'洗手液','color'=>'0'),
										array('name'=>'牙膏','color'=>'0'),
										array('name'=>'牙刷','color'=>'1'),
										array('name'=>'漱口水','color'=>'0'),
										array('name'=>'牙线','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line7
						array(
							'cont'=>array(
								array(
									'title'=>'洗护日用','link'=>array(
										array('name'=>'洗发水','color'=>'1'),
										array('name'=>'护发素','color'=>'0'),
										array('name'=>'发膜','color'=>'1'),
										array('name'=>'染发剂','color'=>'0'),
										array('name'=>'护发精油','color'=>'0'),
										array('name'=>'梳子','color'=>'1'),
										array('name'=>'沐浴露','color'=>'0'),
										array('name'=>'沐浴皂','color'=>'1'),
										array('name'=>'洗手液','color'=>'0'),
										array('name'=>'牙膏','color'=>'0'),
										array('name'=>'牙刷','color'=>'1'),
										array('name'=>'漱口水','color'=>'0'),
										array('name'=>'牙线','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line8
						array(
							'cont'=>array(
								array(
									'title'=>'洗护日用','link'=>array(
										array('name'=>'洗发水','color'=>'1'),
										array('name'=>'护发素','color'=>'0'),
										array('name'=>'发膜','color'=>'1'),
										array('name'=>'染发剂','color'=>'0'),
										array('name'=>'护发精油','color'=>'0'),
										array('name'=>'梳子','color'=>'1'),
										array('name'=>'沐浴露','color'=>'0'),
										array('name'=>'沐浴皂','color'=>'1'),
										array('name'=>'洗手液','color'=>'0'),
										array('name'=>'牙膏','color'=>'0'),
										array('name'=>'牙刷','color'=>'1'),
										array('name'=>'漱口水','color'=>'0'),
										array('name'=>'牙线','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line9
						array(
							'cont'=>array(
								array(
									'title'=>'洗护日用','link'=>array(
										array('name'=>'洗发水','color'=>'1'),
										array('name'=>'护发素','color'=>'0'),
										array('name'=>'发膜','color'=>'1'),
										array('name'=>'染发剂','color'=>'0'),
										array('name'=>'护发精油','color'=>'0'),
										array('name'=>'梳子','color'=>'1'),
										array('name'=>'沐浴露','color'=>'0'),
										array('name'=>'沐浴皂','color'=>'1'),
										array('name'=>'洗手液','color'=>'0'),
										array('name'=>'牙膏','color'=>'0'),
										array('name'=>'牙刷','color'=>'1'),
										array('name'=>'漱口水','color'=>'0'),
										array('name'=>'牙线','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
					array('line'=>array(//line0
						array(
							'cont'=>array(
								array(
									'title'=>'洗护日用','link'=>array(
										array('name'=>'洗发水','color'=>'1'),
										array('name'=>'护发素','color'=>'0'),
										array('name'=>'发膜','color'=>'1'),
										array('name'=>'染发剂','color'=>'0'),
										array('name'=>'护发精油','color'=>'0'),
										array('name'=>'梳子','color'=>'1'),
										array('name'=>'沐浴露','color'=>'0'),
										array('name'=>'沐浴皂','color'=>'1'),
										array('name'=>'洗手液','color'=>'0'),
										array('name'=>'牙膏','color'=>'0'),
										array('name'=>'牙刷','color'=>'1'),
										array('name'=>'漱口水','color'=>'0'),
										array('name'=>'牙线','color'=>'1'),
									)
								),
								array(
									'title'=>'女性护理','link'=>array(
										array('name'=>'卫生巾','color'=>'1'),
										array('name'=>'护垫','color'=>'0'),
										array('name'=>'卫生棉条	','color'=>'1'),
										array('name'=>'私处洗液','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'其他个护','link'=>array(
										array('name'=>'眼罩','color'=>'1'),
										array('name'=>'口罩	','color'=>'0'),
										array('name'=>'其他个护','color'=>'0'),
										array('name'=>'避孕套','color'=>'0'),
										array('name'=>'人体润滑','color'=>'0'),
										array('name'=>'男用器具','color'=>'1'),
										array('name'=>'女用器具','color'=>'1'),
										array('name'=>'情趣玩具','color'=>'1'),
									)
								),
								array(
									'title'=>'宠物生活','link'=>array(
										array('name'=>'宠物主粮','color'=>'1'),
										array('name'=>'宠物零食','color'=>'0'),
										array('name'=>'宠物洗护美容','color'=>'0'),
										array('name'=>'宠物玩具','color'=>'0'),
									),
								)
							)
						),
						array(
							'cont'=>array(
								array(
									'title'=>'居家用品','link'=>array(
										array('name'=>'杯子','color'=>'1'),
										array('name'=>'滤水壶/滤芯','color'=>'0'),
										array('name'=>'锅具刀具','color'=>'0'),
										array('name'=>'厨房餐饮','color'=>'0'),
										array('name'=>'纸品','color'=>'0'),
										array('name'=>'衣物清洁','color'=>'0'),
										array('name'=>'驱虫除臭','color'=>'0'),
										array('name'=>'家居清洁','color'=>'0'),
										array('name'=>'收纳整理','color'=>'0'),
										array('name'=>'创意礼品','color'=>'0'),
										array('name'=>'宠物生活','color'=>'0'),
									)
								),
								array(
									'title'=>'家装家纺','link'=>array(
										array('name'=>'枕头','color'=>'1'),
										array('name'=>'床上用品','color'=>'0'),
										array('name'=>'毛巾浴巾','color'=>'0'),
										array('name'=>'浴袍','color'=>'0'),
										array('name'=>'其他家纺用品','color'=>'0'),
									)
								),
							)
						),
					)),
				)
			)
		);
	}
}
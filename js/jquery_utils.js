/*
 * 自动跳转到location/项目名/页面.html
 */
// var toLocationHtmlHandler=setInterval(function(){
	// /*
	 // * 1.获取当前网页地址，转换成字符串
	 // * 2.在网址字符串中查找‘localhost’，用作判断
	 // * 3.将网址字符串分割，历遍字符串保留最后两位重组，改成localhost/+项目名/页面.html
	 // */
	// var url=window.location;
	// var urlstring=url+'';
	// var server=urlstring.indexOf('localhost');
	// var addr=urlstring.split('/');
	// var address='http://localhost';
	// for (var i=addr.length-2,len=addr.length;i<len;i++) {
		// address=address+'/'+addr[i];
	// }
	// if (urlstring!==address&&server<0) {
		// location.href=address;
	// }
	// clearInterval(toLocationHtmlHandler);
// },1);
/**
 * 
 * @param {Object} $obj			需要进行轮播的对象
 * @param {Object} type			轮播的类型，目前只做了两种'slide'和'fade'
 * @param {Object} $valtime		轮播间隔的时间，毫秒为单位
 * 
 * 布局例子如下：
 * 要进行轮播的对象为：'.carouselfigure'
 * 
 *	<div class="carouselfigure">
 *		<div class="carouselfigure_mask">
 *			<ul>
 *				<li><a href=""><img src="img/fresh_banner0.jpg"/></a></li>
 *				<li><a href=""><img src="img/fresh_banner1.jpg"/></a></li>
 *				<li><a href=""><img src="img/fresh_banner2.jpg"/></a></li>
 *			</ul>
 *		</div>
 *		<ol class="carouselfigure_point">
 *			<li class="carouselfigure_point_on"></li>
 *			<li></li>
 *			<li></li>
 *		</ol>
 *		<div class="prev">
 *		</div>
 *		<div class="next">
 *		</div>
 *	</div>
 * 
 */

/*
 * 样式例子如下
 */
/*.carouselfigure {
	width: auto;
	height: 400px;
	margin: 0px auto;
	overflow: hidden;
	position: relative;
}

.carouselfigure .carouselfigure_mask {
	width: auto;
	height: 400px;
	overflow: hidden;
	position: relative;
}

.carouselfigure .carouselfigure_mask ul {
	position: absolute;
	left: 0;
	width: 1350px;
	height: 400px;
}

.carouselfigure .carouselfigure_mask ul li {
	width: auto;
	height: 400px;
	float: left;
}

.carouselfigure .carouselfigure_mask ul li img {
	width: auto;
	height: 400px;
}

.carouselfigure_point {
	position: absolute;
	width: 78px;
	height: 28px;
	background: url(../img/kaola_fade_btn3.png);
	left: 50%;
	bottom: 18px;
	padding-top: 9px;
	padding-left: 14px;
	box-sizing: border-box;
}

.carouselfigure_point li {
	cursor: pointer;
	width: 10px;
	height: 10px;
	background: url(../img/kaola_icon1.png) no-repeat -8px -2px;
	border-radius: 50%;
	float: left;
	margin-right: 10px;
}

.carouselfigure_point .carouselfigure_point_on {
	background: url(../img/kaola_icon1.png) no-repeat -28px -2px;
}

.carouselfigure .next,
.carouselfigure .prev {
	width: 34px;
	height: 68px;
	position: absolute;
	left: 127px;
	top: 166px;
	cursor: pointer;
	background: url(../img/kaola_icon1.png) no-repeat;
	background-position-x: -626px;
	background-position-y: -68px;
	opacity: 0;
	filter: alpha(opacity:0);
}
.carouselfigure .next {
	background-position-x: -670px;
	background-position-y: -68px;
	left: auto;
	right: 127px;
}

.carouselfigure .prev:hover{
	background-position-y: -153px;
}
.carouselfigure .next:hover{
	background-position-y: -154px;
}*/

function carouselfigure($obj,type,$valtime) {
	if (type=='slide') {
//		获取对象属性和调整对象属性
		$oUl = $obj.children().eq(0).children().eq(0);
		$oOl = $obj.children().eq(1);
		$oPrev = $obj.children().eq(2);
		$oNext = $obj.children().eq(3);
		$valWidth = $oUl.children().eq(0).outerWidth();
		$oUl.css('width',$valWidth*$oUl.children().size());
		$oUl.html($oUl.html() + $oUl.html());
		$oUl.outerWidth($oUl.outerWidth() + $oUl.outerWidth());
		$oUlW = $oUl.outerWidth() * .5;
//		console.log($oOl.children().eq(0).attr('class'));
		$oOlLOn = $oOl.children().eq(0).attr('class');
		$i = 0;
		$CFActive = 1;
//		轮播图内禁止选中文字图片
		$obj.mousedown(function(e){
			e=e||event;
			if (e.preventDefault) {
				e.preventDefault();
			} else{
				return false;
			}
		})
//		给每个圆点按钮添加事件，点击轮播图播放到对应图片
		for ($j = 0, $len = $oUl.children().length * .5; $j < $len; $j++) {
			(function($k) {
				$oOl.children().eq($k).click(function() {
					if ($i==$oOl.children().length) {
						$oUl.css('left',0);
					}
					$x = $k - $i;
					if ($x > 0) {
						next($x);
					} else if ($x < 0) {
						prev($x);
					}
				});
			})($j);
		}
//		改变圆点按钮的颜色
		function oCFChoosePoint($i, fn) {
			for ($q = 0, $len = $oOl.children().length; $q < $len; $q++) {
				$oOl.children().eq($q).attr('class', '');
			}
			$oOl.children().eq($i).attr('class', $oOlLOn);
			if ($i == $oOl.children().length) {
				$oOl.children().eq(0).attr('class', $oOlLOn);
			}
			if (fn) {
				fn();
			}
		}
//		自动播放
		$obj.$carouselfigureHandler = setInterval(function() {
			next();
		}, $valtime);
//		鼠标在轮播图上，if判断解决mouseover和mouseout的bug，停止播放，显示左右按钮
		$obj.mouseover(function() {
			$CFActive = 0;
			if ($CFActive == 0) {
				setTimeout(function() {
					if ($CFActive == 0) {
						$oPrev.stop().animate({
							opacity: 100
						}, 200);
						$oNext.stop().animate({
							opacity: 100
						}, 200);
						clearInterval($obj.$carouselfigureHandler);
					}
				}, 1);
			}
		});
//		鼠标移出轮播图，if判断解决mouseover和mouseout的bug，开始播放，隐藏左右按钮
		$obj.mouseout(function() {
			$CFActive = 1;
			if ($CFActive == 1) {
				setTimeout(function() {
					if ($CFActive == 1) {
						$oPrev.stop().animate({
							opacity: 0
						}, 200);
						$oNext.stop().animate({
							opacity: 0
						}, 200);
						$obj.$carouselfigureHandler = setInterval(function() {
							next();
						}, $valtime);
					}
				}, 1);
			}
		});
//		按左边的按钮播放上一个
		$oPrev.click(function() {
			prev();
		});
//		按右边的按钮播放下一个
		$oNext.click(function() {
			next();
		});
//		播放上一个的函数
		function next($q) {
//			参数用于圆点按钮播放
			if ($q) {
				$i = $q - 1 + $i;
			}
			if ($i >= $oUl.children().length * .5) {
				$oUl.css('left', 0);
				$i = 0;
				$i++;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			} else {
				$i++;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			}
		}
//		播放下一个的函数
		function prev($q) {
//			参数用于圆点按钮播放
			if ($q) {
				$i = $q + 1 + $i;
			}
			if ($i <= 0) {
				$oUl.css('left', -$oUlW);
				$i = $oUl.children().length * .5;
				$i--;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			} else {
				$i--;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			}
		}
	} else if (type=='fade') {
//		获取对象属性和调整对象属性
		$oUl = $obj.children().eq(0).children().eq(0);
		$oUl.children().css({position:'absolute',opacity:0});
		$oUl.children().eq(0).css('opacity',100);
		$oOl = $obj.children().eq(1);
		$oPrev = $obj.children().eq(2);
		$oNext = $obj.children().eq(3);
//		console.log($oOl.children().eq(0).attr('class'));
		$oOlLOn = $oOl.children().eq(0).attr('class');
		$i = 0;
		$CFActive = 1;
//		轮播图内禁止选中文字图片
		$obj.mousedown(function(e){
			e=e||event;
			if (e.preventDefault) {
				e.preventDefault();
			} else{
				return false;
			}
		})
//		给每个圆点按钮添加事件，点击轮播图播放到对应图片
		for ($j = 0, $len = $oUl.children().length; $j < $len; $j++) {
			(function($k) {
				$oOl.children().eq($k).click(function() {
					$oUl.children().stop().animate({
						opacity:0
					},500);
					$oUl.children().eq($k).stop().animate({
						opacity:1
					},500);
					$i=$k;
					oCFChoosePoint($i);
				});
			})($j);
		}
//		改变圆点按钮的颜色
		function oCFChoosePoint($i, fn) {
			for ($q = 0, $len = $oOl.children().length; $q < $len; $q++) {
				$oOl.children().eq($q).attr('class', '');
			}
			$oOl.children().eq($i).attr('class', $oOlLOn);
			if ($i == $oOl.children().length) {
				$oOl.children().eq(0).attr('class', $oOlLOn);
			}
			if (fn) {
				fn();
			}
		}
//		自动播放
		$obj.$carouselfigureHandler = setInterval(function() {
			next();
		}, $valtime);
//		鼠标在轮播图上，if判断解决mouseover和mouseout的bug，停止播放，显示左右按钮
		$obj.mouseover(function() {
			$CFActive = 0;
			if ($CFActive == 0) {
				setTimeout(function() {
					if ($CFActive == 0) {
						$oPrev.stop().animate({
							opacity: 1
						}, 200);
						$oNext.stop().animate({
							opacity: 1
						}, 200);
						clearInterval($obj.$carouselfigureHandler);
					}
				}, 1);
			}
		});
//		鼠标移出轮播图，if判断解决mouseover和mouseout的bug，开始播放，隐藏左右按钮
		$obj.mouseout(function() {
			$CFActive = 1;
			if ($CFActive == 1) {
				setTimeout(function() {
					if ($CFActive == 1) {
						$oPrev.stop().animate({
							opacity: 0
						}, 200);
						$oNext.stop().animate({
							opacity: 0
						}, 200);
						$obj.$carouselfigureHandler = setInterval(function() {
							next();
						}, $valtime);
					}
				}, 1);
			}
		});
//		按左边的按钮播放上一个
		$oPrev.click(function() {
			prev();
		});
//		按右边的按钮播放下一个
		$oNext.click(function() {
			next();
		});
//		播放下一个的函数
		function next() {
			if ($i>=$oUl.children().length-1) {
				$oUl.children().eq($i).stop().animate({
					opacity:0
				},500);
				$oUl.children().eq(0).stop().animate({
					opacity:1
				},500);
				$i=0;
				oCFChoosePoint($i);
			} else{
				$i++;
				$oUl.children().eq($i-1).stop().animate({
					opacity:0
				},500);
				$oUl.children().eq($i).stop().animate({
					opacity:1
				},500);
				oCFChoosePoint($i);
			}
		}
//		播放上一个的函数
		function prev() {
			if ($i <= 0) {
				$oUl.children().eq($i).stop().animate({
					opacity:0
				},500);
				$oUl.children().eq($oUl.children().length-1).stop().animate({
					opacity:1
				},500);
				$i--;
				$i=$oUl.children().length-1;
				oCFChoosePoint($i);
			} else {
				$i--;
				$oUl.children().eq($i).stop().animate({
					opacity:1
				},500);
				$oUl.children().eq($i+1).stop().animate({
					opacity:0
				},500);
				oCFChoosePoint($i);
			}
		}
	}
}

//遮罩方式解决mouseover和mouseout的bug
function oMaskCreate(obj,mouseoverFn,mouseoutFn){
//	在对象内的末尾创建遮罩
	$oThisMask=$('<big></big>');
	obj.append($oThisMask);
//	console.log(obj.css('position'));
//	判点对象是否有定位，没有的话添加相对定位
	if (obj.css('position')=='static') {
		obj.css('position','relative');
	}
//	对遮罩进行属性调整
	obj.children(':last-child').css({
		height:obj.css('height'),
		width:obj.css('width'),
		position:'absolute',
		top:0,
		left:0
	});
//	mouseover回调函数
	if (mouseoverFn) {
		obj.children(':last-child').mouseover(mouseoverFn);
	}
//	mouseout回调函数
	if (mouseoutFn) {
		obj.children(':last-child').mouseout(mouseoutFn);
	}
}

/**
 * 设置cookie
 * @param {Object} name				cookie的名称
 * @param {Object} value			cookie的内容
 * @param {Object} expires			cookie到期时间
 * @param {Object} path				cookie的路径
 * @param {Object} domain			cookie的域名
 */
function setCookie(name, value, expires, path, domain) {
	var cookie = name + '=' + value + ';';
	if(expires) {
		cookie += 'expires=' + expires + ';';
	}
	if(path) {
		cookie += 'path=' + path + ';';
	}
	if(domain) {
		cookie += 'domain=' + domain + ';';
	}
	document.cookie = cookie;
}

/**
 * 依据cookie的name获取内容
 * @param {Object} name		cookie的名称
 */
function getCookie(name) {
	var cookie=document.cookie;
	var cookies = cookie.split('; ');
	var rt = undefined;
	for (var i=0,len=cookies.length;i<len;i++){
		cookie = cookies[i].split('=');
		cookie[0].trim();
		if (cookie[0] == name){
			rt = cookie[1];
			break;
		}
	}
	return rt;
}

/**
 * 根据cookie的name删除cookie
 * @param {String} name		cookie的名称
 */
function deleteCookie(name) {
	var date = new Date();
	date.setDate(date.getDate()-1);
	document.cookie = name + '=1;expires=' + date;
}

$(function(){
//	设定需要添加进购物车的对象属性
	var setAttrHandler=setInterval(function(){
		$('.cnt>.goodlist>.goods').css('cursor','pointer');
		$('.cnt>.goodlist>.goods').find('a').attr('href','shoppingCart.html');
		$('.cnt>.goodlist>.goods').find('a').attr('target','_blank');
		$('.fresh_con_list>.fresh_con_wrap>.fresh_con_goods').css('cursor','pointer');
		$('.fresh_con_list>.fresh_con_wrap>.fresh_con_goods').find('a').attr('href','shoppingCart.html');
		$('.fresh_con_list>.fresh_con_wrap>.fresh_con_goods').find('a').attr('target','_blank');
		$('.fresh_second_kill>.fresh_second_kill_goods').css('cursor','pointer');
		$('.fresh_second_kill>.fresh_second_kill_goods').find('a').attr('href','shoppingCart.html');
		$('.fresh_second_kill>.fresh_second_kill_goods').find('a').attr('target','_blank');
		$('.sport_con>.sport_con_wrap>.sport_con_goods').css('cursor','pointer');
		$('.sport_con>.sport_con_wrap>.sport_con_goods').find('a').attr('href','shoppingCart.html');
		$('.sport_con>.sport_con_wrap>.sport_con_goods').find('a').attr('target','_blank');
		$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods').css('cursor','pointer');
		$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods').find('a').attr('href','shoppingCart.html');
		$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods').find('a').attr('target','_blank');
		$('.new>.item_box>.item_wrap>.itm_goods').css('cursor','pointer');
		$('.new>.item_box>.item_wrap>.itm_goods').find('a').attr('href','shoppingCart.html');
		$('.new>.item_box>.item_wrap>.itm_goods').find('a').attr('target','_blank');
		$('.party>.prolist>.item_group>.item_sale').css('cursor','pointer');
		$('.party>.prolist>.item_group>.item_sale').find('a').attr('href','shoppingCart.html');
		$('.party>.prolist>.item_group>.item_sale').find('a').attr('target','_blank');
		$('.party>.prolist>.groups>.item_sale').css('cursor','pointer');
		$('.party>.prolist>.groups>.item_sale').find('a').attr('href','shoppingCart.html');
		$('.party>.prolist>.groups>.item_sale').find('a').attr('target','_blank');
		$('.detailwrap').css('cursor','pointer');
		$('.detailwrap').find('a').attr('href','shoppingCart.html');
		$('.detailwrap').find('a').attr('target','_blank');
		$('.m_goods').css('cursor','pointer');
		$('.m_goods').find('a').attr('href','shoppingCart.html');
		$('.m_goods').find('a').attr('target','_blank');
		$('.goods').css('cursor','pointer');
		$('.goods').find('a').attr('href','shoppingCart.html');
		$('.goods').find('a').attr('target','_blank');
		$('.shoppingCart_ad>.shoppingCart_ad_wrap>p').css('cursor','pointer');
		clearInterval(setAttrHandler);
	},1);
/*
 * 添加到购物车的点击事件
 * 1.对象className添加序号，转换成字符串，用作cookie的name
 * 2.获取对象的属性，转换成字符串
 * 3.新建一个数组把对象属性添加进去
 * 4.添加cookie（对象的ClassName+序号，对象的属性的字符串数组）
 */
	$('.fresh_second_kill>.fresh_second_kill_goods').click(function(){
		var oName='fresh_second_kill_goods'+$(this).index();
		var oTitle=$(this).children().eq(1).children().eq(0).text().replace(/\s/g,"");
		var oSpecialPrice=$(this).children().eq(1).find('i').text().substring(1);
		var oOriginPrice=$(this).children().eq(1).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.fresh_con_list>.fresh_con_wrap>.fresh_con_goods').click(function(){
		var oName='fresh_con_goods'+$(this).index();
		var oTitle=$(this).children().eq(1).children().eq(0).text().replace(/\s/g,"");
		var oSpecialPrice=$(this).children().eq(1).find('i').text();
		var oOriginPrice=$(this).children().eq(1).find('del').text().substring(1);
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.sport_con>.sport_con_wrap>.sport_con_goods').click(function(){
		var oName='sport_con_goods'+$(this).index();
		var oTitle=$(this).children().eq(1).children().eq(0).text().replace(/\s/g,"");
		var oSpecialPrice=$(this).children().eq(1).find('i').text();
		var oOriginPrice=$(this).children().eq(1).find('del').text().substring(1);
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods').click(function(){
		var oName='Gourmet_con_goods'+$(this).index();
		var oTitle=$(this).children().eq(1).children().eq(0).text().replace(/\s/g,"");
		var oSpecialPrice=$(this).children().eq(1).find('i').text();
		var oOriginPrice=$(this).children().eq(1).find('del').text().substring(1);
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.shoppingCart_ad>.shoppingCart_ad_wrap').eq(0).find('p').click(function(){
		var oName='shoppingCart_ad'+$(this).index();
		var oTitle=$(this).children().eq(1).text().replace(/\s/g,"");
		var oSpecialPrice=$(this).find('.sale_big').text().substring(1);
		var oOriginPrice=$(this).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.shoppingCart_ad>.shoppingCart_ad_wrap').eq(1).find('p').click(function(){
		var oName='shoppingCart_ad'+($(this).index()+5);
		var oTitle=$(this).children().eq(1).text().replace(/\s/g,"");
		var oSpecialPrice=$(this).find('.sale_big').text().substring(1);
		var oOriginPrice=$(this).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.cnt>.goodlist>.goods').click(function(){
		var oName='cnt_goodlist_goods'+$(this).index();
		var oTitle=$(this).find('.title').text().replace(/\s/g,"");
		var oSpecialPrice=$(this).find('.price').text().replace(/\s/g,"").split('￥')[1];
		var oOriginPrice=$(this).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.new>.item_box>.item_wrap>.itm_goods').click(function(){
		var oName='new_item_box_item_wrap_itm_goods'+$(this).index();
		var oTitle=$(this).find('.tit').text().replace(/\s/g,"");
		var oSpecialPrice=$(this).find('b').text();
		var oOriginPrice=$(this).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
	});
	$('.party>.prolist>.item_group>.item_sale').click(function(){
		var oName='party_prolist_item_group_item_sale'+$(this).index();
		var oTitle=$(this).find('.tit').text().replace(/\s/g,"");
		var oSpecialPrice=$(this).find('strong').text();
		var oOriginPrice=$(this).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);;
	});
	$('.party>.prolist>.groups>.item_sale').click(function(){
		var oName='party_prolist_groups_item_sale'+$(this).index();
		var oTitle=$(this).find('.tit').text().replace(/\s/g,"");
		var oSpecialPrice=$(this).find('strong').text();
		var oOriginPrice=$(this).find('del').text();
		var oPic=$(this).find('img').attr('src')+'';
		var arrayO=[];
		arrayO.push(oPic);
		arrayO.push(oTitle);
		arrayO.push(oSpecialPrice);
		arrayO.push(oOriginPrice);
		setCookie(oName,arrayO);
//		console.log(oSpecialPrice);
//		console.log(oOriginPrice);
//		console.log(oTitle);
//		console.log(oPic);
//		console.log(arrayO);
	});
//	console.log($('title').text()=='环球够-考拉国家馆');
	if ($('title').text()=='环球够-考拉国家馆') {
		for (var i=0;i<$('.goodswrap').length;i++) {
			(function(j){
				$('.goodswrap').eq(j).find('.detailwrap').click(function(){
					var oName='countryDetailwrap'+j+$(this).index();
					var oTitle=$(this).find('.titlink').text().replace(/\s/g,"");
					var oSpecialPrice=$(this).find('.price').text().substring(1);
					var oOriginPrice=$(this).find('.price').text().substring(1);
					var oPic=$(this).find('.proimg').attr('src')+'';
					var arrayO=[];
					arrayO.push(oPic);
					arrayO.push(oTitle);
					arrayO.push(oSpecialPrice);
					arrayO.push(oOriginPrice);
					setCookie(oName,arrayO);
				});
			})(i);
		}
	}else if ($('title').text()=='美容彩妆-美颜彩妆-美容护肤化妆品-美容化妆品-直邮化妆品-化妆品海外代购-考拉海购') {
//		console.log($('.goodswrap').length);
		for (var i=0;i<$('.goodswrap').length;i++) {
			(function(j){
				$('.goodswrap').eq(j).find('.detailwrap').click(function(){
					var oName='MZDetailwrap'+j+$(this).index();
					var oTitle=$(this).find('.titlink').text().replace(/\s/g,"");
					if ($(this).find('strong').text()) {
						var oSpecialPrice=$(this).find('strong').text().substring(1);
					}else{
						var oSpecialPrice=$(this).find('.price').text().replace(/[\u4E00-\u9FA5\uF900-\uFA2D]/g,"").split('￥')[1];
					}
					if ($(this).find('del').text()) {
						var oOriginPrice=$(this).find('del').text();
						if ($(this).find('del').text().indexOf('￥')>-1) {
							var oOriginPrice=$(this).find('del').text().substring(1);
						}
					}else{
						var oOriginPrice=oSpecialPrice;
					}
					var oPic=$(this).find('.proimg').attr('src')+'';
					var arrayO=[];
					arrayO.push(oPic);
					arrayO.push(oTitle);
					arrayO.push(oSpecialPrice);
					arrayO.push(oOriginPrice);
//					console.log(oName);
//					console.log(oSpecialPrice);
//					console.log(oOriginPrice);
//					console.log(oTitle);
//					console.log(oPic);
//					console.log(arrayO);
					setCookie(oName,arrayO);
				});
			})(i);
		}
		for (var i=0;i<$('.brandWrap').length;i++) {
			(function(j){
				$('.brandWrap').eq(j).find('.detailwrap').click(function(){
					var oName='MZBrandWrapDetailwrap'+j+$(this).index();
					var oTitle=$(this).find('.titlink').text().replace(/\s/g,"");
					if ($(this).find('strong').text()) {
						var oSpecialPrice=$(this).find('strong').text().substring(1);
					}else{
						var oSpecialPrice=$(this).find('.price').text().replace(/[\u4E00-\u9FA5\uF900-\uFA2D]/g,"").split('￥')[1];
					}
					if ($(this).find('del').text()) {
						var oOriginPrice=$(this).find('del').text();
						if ($(this).find('del').text().indexOf('￥')>-1) {
							var oOriginPrice=$(this).find('del').text().substring(1);
						}
					}else{
						var oOriginPrice=oSpecialPrice;
					}
					var oPic=$(this).find('.proimg').attr('src')+'';
					var arrayO=[];
					arrayO.push(oPic);
					arrayO.push(oTitle);
					arrayO.push(oSpecialPrice);
					arrayO.push(oOriginPrice);
//					console.log(oName);
//					console.log(oSpecialPrice);
//					console.log(oOriginPrice);
//					console.log(oTitle);
//					console.log(oPic);
//					console.log(arrayO);
					setCookie(oName,arrayO);
				});
			})(i);
		}
	}else if ($('title').text()=='每日上新-网易考拉海购') {
		for (var i=0;i<$('.goods_list').length;i++) {
			(function(j){
				$('.goods_list').eq(j).find('.goods').click(function(){
					var oName='new_goods_list_goods'+j+$(this).index();
					var oTitle=$(this).find('.tlt').text().replace(/\s/g,"");
					var oSpecialPrice=$(this).find('.crtprice').text().substring(1);
					var oOriginPrice=$(this).find('del').text();
					var oPic=$(this).find('img').attr('src')+'';
					var arrayO=[];
					arrayO.push(oPic);
					arrayO.push(oTitle);
					arrayO.push(oSpecialPrice);
					arrayO.push(oOriginPrice);
					setCookie(oName,arrayO);
				});
			})(i);
		}
		$('.m_goods').click(function(){
			var oName='new_brand_list_m_goods'+$(this).index();
			var oTitle=$(this).find('.tlt').text().replace(/\s/g,"");
			var oSpecialPrice=$(this).find('.crtprice').text().substring(1);
			var oOriginPrice=$(this).find('del').text();
			var oPic=$(this).find('img').attr('src')+'';
			var arrayO=[];
			arrayO.push(oPic);
			arrayO.push(oTitle);
			arrayO.push(oSpecialPrice);
			arrayO.push(oOriginPrice);
			setCookie(oName,arrayO);
		});
	}else if ($('title').text()=='全球旗舰 大牌') {
		for (var i=0;i<$('.goodswrap').length;i++) {
			(function(j){
				$('.goodswrap').eq(j).find('.detailwrap').click(function(){
					var oName='world_goodswrap_detailwrap'+j+$(this).index();
					var oTitle=$(this).find('.titlink').text().replace(/\s/g,"");
					var oSpecialPrice=$(this).find('.price').text().substring(1);
					var oOriginPrice=$(this).find('.price').text().substring(1);
					var oPic=$(this).find('.proimg').attr('src')+'';
					var arrayO=[];
					arrayO.push(oPic);
					arrayO.push(oTitle);
					arrayO.push(oSpecialPrice);
					arrayO.push(oOriginPrice);
					setCookie(oName,arrayO);
//					console.log(oSpecialPrice);
//					console.log(oOriginPrice);
//					console.log(oTitle);
//					console.log(oPic);
//					console.log(arrayO);
				});
			})(i);
		}
	}
});

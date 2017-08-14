$(function() {

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
	function getck(key) {
//		var ck = document.cookie.split('; ');
//		console.log(ck)
//		var data = ck[1].split('=');
//		console.log(data);
		getCookie('username')
		if (getCookie('username')) {
			return data;
		}
		
	}
	if (document.cookie) {
		$('.header_default').hide();
		$('.header_cookie').show();
		$('#header_username').html(getCookie('username'));
	} else {
		$('.header_cookie').hide();
		$('.header_default').show();
	}

	$('#header_logout').click(function() {
		$.ajax({
			type: "post",
			url: "/project/guestbook/index.php",
			async: true,
			data: {
				'm': 'index',
				'a': 'logout'
			},
			success: function() {
				$('.header_cookie').hide();
				$('.header_default').show();
			},
			error: function() {
				alert('ajax请求失败！');
			}
		});
	});
	$.ajax({
		type:"get",
		url:"http://v.juhe.cn/weather/index",
		async:true,
		dataType:'jsonp',
		jsonp:'callback',
		data:{
			'cityname':'广州',
			'dtype':'json',
			'format':'1',
			'key':'9eafa02ee581549531b85c9c099afa5c'
		},
		success:function(str){
			var data=str.result;
			$('#header_weathercity').html(data.today.city);
			$('#header_weatherstate').html(data.today.weather);
			$('#header_weathertemp').html(data.today.temperature);
			$('#header_weather_day').html(data.today.date_y);
			$('#header_weather_message').html(data.today.dressing_advice);
		},
		error:function(){
			alert('ajax请求失败！');
		}
	});
	$.ajax({
		type: "get",
		url: "/project/guestbook/index.php",
		async: true,
		data: {
			'm': 'index',
			'a': 'jsonall'
		},
		success: function(str) {
			var json=JSON.parse(str);
			for(var i=0;i<json.box.length;i++){//循环列表项
				var oDivmore=document.createElement('div');
				var oDivleft=document.createElement('div');
				var oDivright=document.createElement('div');
				oDivmore.className='headerlist_more';
				oDivleft.className='headermore_left';
				oDivright.className='headermore_right';
				for(var j=0;j<json.box[i].line.length;j++){//循环一个项目里面的行数
					var oDivbox=document.createElement('div');
					oDivbox.className='headermore_box';
					for(var k=0;k<json.box[i].line[j].cont.length;k++){//循环一行里面有几块
						var oDivboxm=document.createElement('div');
						oDivboxm.className='headermore_boxm';
						var oH4=document.createElement('h4');
						oH4.className='header_boxp';
						oH4.innerHTML=json.box[i].line[j].cont[k].title;
						oDivboxm.appendChild(oH4);
						var oP=document.createElement('p');
						oP.className='header_boxcont';
						for(var l=0;l<json.box[i].line[j].cont[k].link.length;l++){//循环超链接个数
							var oA = document.createElement('a');
							oA.href = '#';
							oA.className = 'header_boxa';
							if (json.box[i].line[j].cont[k].link[l].color == 1) {
								oA.className = 'header_boxa header_ared';
							}
							oA.innerHTML = json.box[i].line[j].cont[k].link[l].name;
							oP.appendChild(oA);
							oDivboxm.appendChild(oP);
						}
						oDivbox.appendChild(oDivboxm);
						
					}
					oDivleft.appendChild(oDivbox);
					oDivmore.appendChild(oDivleft);
					oDivmore.appendChild(oDivright);
					var oDvi=document.createElement('div');
					oDvi.className='clearfix';
					oDivbox.appendChild(oDvi);
				}
				var oTable=document.createElement('table');
				oTable.className='header_mright_imgs';
				for(var j=0;j<3;j++){//循环tr
					var oTr=document.createElement('tr');
					for(var k=0;k<3;k++){//循环td
						var oTd=document.createElement('td');
						var oTbA=document.createElement('a');
						var oAImg=document.createElement('img');
						oAImg.src='img/header_imgbox'+i+j+k+'.jpg';
						oAImg.alt='';
						oTbA.href='#';
						oTbA.appendChild(oAImg);
						oTd.appendChild(oTbA);
						oTr.appendChild(oTd);
					}
					oTable.appendChild(oTr);
				}
				oDivright.appendChild(oTable);
				var oImgbox=document.createElement('a');
				oImgbox.href='#';
				oImgbox.className='header_mboxi';
				var oImgboxi=document.createElement('img');
				oImgboxi.src='img/header_imgbox_box0'+i+'.jpg';
				oImgboxi.alt='';
				oImgbox.appendChild(oImgboxi);
				oDivright.appendChild(oImgbox);
				$("#header_allbox").append(oDivmore);
			}
			
			
			$('.headerlist_more').mouseleave(function(){
				$('.headerlist_more').hide();
				$('.header_list_ul').hide();
			});
			
			
		},
		error: function() {
		//	alert('ajax请求失败！');
		}
	});
	function addHeaderListTitle(str){
		var json = JSON.parse(str);
		var title = document.createElement('h4');
		title.className = 'header_boxp';
		title.innerHTML = json.title;
		return title;
	}
	function addHeaderList(str) {
		var json = JSON.parse(str);
		var p = document.createElement('p');
		p.className = 'header_boxcont';
		for (var i = 0; i < json.link.length; i++) {
			var a = document.createElement('a');
			a.href = '#';
			a.className = 'header_boxa';
			if (json.link[i].color == 1) {
				a.className = 'header_boxa header_ared';
			}
			a.innerHTML = json.link[i].name;
			p.appendChild(a);
		}
		return p;
	}
	$('.header_list_ul li').mouseenter(function(){
		var index=$(this).index();
		$('.headerlist_more').hide();
		$('.headerlist_more').eq(index).show();
	});
	$('.header_list_ul').mouseleave(function(e){
		var hdip=$('#header_important').offset();
		var hdipw=$('#header_important').width();
		var hdiph=$('#header_important').height();
		if(e.pageX<hdip.left||e.pageX>hdip.left+hdipw||e.pageY<hdip.top||e.pageY>hdip.top+hdiph){
			$('.headerlist_more').hide();
		}
	});
	$('.header_nav_level').mouseenter(function(){
		$('.header_list_ul').show();
	}).mouseleave(function(){
		$('.header_list_ul').hide();
	});
	$('.header_list_ul').mouseenter(function(){
		$('.header_list_ul').show();
	}).mouseleave(function(e){
		var hdip=$('#header_important').offset();
		var hdipw=$('#header_important').width();
		var hdiph=$('#header_important').height();
		if(e.pageX<hdip.left||e.pageX>hdip.left+hdipw||e.pageY<hdip.top||e.pageY>hdip.top+hdiph){
			$('.header_list_ul').hide();
		}
		
	});
});
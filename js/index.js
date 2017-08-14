

(function(){
	window.onload = function(){
		// var url=window.location;
		// var urlstring=url+'';
		// var server=urlstring.indexOf('localhost');
		// if (server>0) {
			//弹框广告
			var oAd = document.querySelector('#ad');
			var oClose = document.querySelector('.close');
			var oBox = document.querySelector('.box');
			oAd.style.display = 'block';
			oAd.style.transition = 'all 0.3s linear';
			oAd.style.transform = 'scale(1)';
			oClose.onclick = function(){
				oAd.style.transform = 'scale(0.3)';
				setTimeout(function(){
					oAd.style.display = 'none';
					oBox.style.display = 'none'
				},300);
			}
		// }
//		限时抢购
		setInterval(function(){
				var times = document.querySelectorAll('.time');
				var now = new Date();
				var hours = now.getHours();
				var setCount = parseInt(hours*.5)+1;
				var oldTime = new Date();
				oldTime.setHours(setCount*2+1);
				oldTime.setMinutes(0);
				oldTime.setSeconds(0);
				oldTime.setMilliseconds(0);
				var countDown = oldTime - now;
				var cHours = parseInt(countDown/3600000);
				if(cHours<10){
					cHours = '0' + cHours;
				}
				times[0].innerHTML = cHours;
				var cMintues = parseInt((countDown%3600000)/60000);
				if(cMintues<10){
					cMintues = '0' + cMintues;
				}
				times[1].innerHTML = cMintues;
				var cSeconds = parseInt(((countDown%3600000)%60000)/1000);
				if(cSeconds<10){
					cSeconds = '0' + cSeconds;
				}
				times[2].innerHTML = cSeconds;
			},1);
	}
})();

$(document).ready(function(){
//	插件轮播图
	$('#marquee1').Marquee({
		distance:1920,
		direction:'left',
		time:5,
		navId:'#btn',
		btnGo:{
			left:"#right",
			right:"#left"
		}
	});
//	鼠标移上去显示左右按钮
	$('#carousel').mouseenter(function(){
		$('#left').show();
		$('#right').show();
	});
//	鼠标移上去隐藏左右按钮
	$('#carousel').mouseleave(function(){
		$('#left').hide();
		$('#right').hide();
	});
//	鼠标移到左右按钮更换按钮背景
	$('#left').mouseenter(function(){
		$(this).css('background-position','-625px -153px');
	});
	$('#right').mouseenter(function(){
		$(this).css('background-position','-670px -153px');
	});
	$('#left').mouseleave(function(){
		$(this).css('background-position','-625px -68px');
	});
	$('#right').mouseleave(function(){
		$(this).css('background-position','-670px -67px');
	});
//	顶部菜单栏
	$(window).scroll(function(){
		if($(window).scrollTop()>60){
			$('.head').show();
		}else{
			$('.head').hide();
		}
	});
	//侧边栏
	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();
		if(scrollTop>600){
			$('.index_left').css('position','fixed');
			$('.index_left').css('top',66 + 'px');
			$('.rightBar').css('position','fixed');
			$('.rightBar').css('top',66 + 'px');
		}else{
			$('.index_left').css('position','absolute');
			$('.index_left').css('top',0);
			$('.rightBar').css('position','absolute');
			$('.rightBar').css('top',0);
		}
	});
	//回到顶部
	$('.scrolltop').click(function(){
		//$('body').animate({scrollTop:0},300,'linear');
		$(window).scrollTop(0);
	});
	//左侧栏单击定位
	$('#scale_con').click(function(){
		$('body,html').animate({scrollTop:$('.sale').offset().top-72});
	});
	$('#new_con').click(function(){
		$('body,html').animate({scrollTop:$('.new').offset().top-72});
	});
	$('#hot_con').click(function(){
		$('body,html').animate({scrollTop:$('.hot').offset().top-72});
	});
	$('#by_con').click(function(){
		$('body,html').animate({scrollTop:$('.by').offset().top-72});
	});
	$('#mz_con').click(function(){
		$('body,html').animate({scrollTop:$('.mz').offset().top-72});
	});
	
	//内容区轮播图
	var banner = 0;
	var interv;
	$('.banner_li:eq(0)').addClass('banner_show');
	$('.item_group:eq(0)').addClass('banner_show');
	$('.groups:eq(0)').addClass('groups_show');
	next();
	interv = setInterval(next,3000);
	$('.fixe_brandWrap').mouseover(function(){
		clearInterval(interv);
	}).mouseleave(function(){
		interv=setInterval(next,3000);
	});
	$('.prolist').mouseover(function(){
		clearInterval(interv)
	}).mouseleave(function(){
		interv = setInterval(next,3000);
	});
	$('.banner_item').eq(banner).addClass('banner_item_active');
	$('.banner_item1').eq(banner).addClass('banner_item_active');
	function next(){
		if(banner==2){
			index = 0;
		}else{
			index = banner+1;
		}
		$('.banner_li').eq(banner).fadeOut();
		$('.banner_li').eq(index).fadeIn();
		$('.item_group').eq(banner).fadeOut();
		$('.item_group').eq(index).fadeIn();
		$('.banner_item').eq(index).addClass('banner_item_active');
		$('.banner_item').eq(banner).removeClass('banner_item_active');
		$('.groups').eq(banner).fadeOut();
		$('.groups').eq(index).fadeIn();
		$('.banner_item1').eq(index).addClass('banner_item_active');
		$('.banner_item1').eq(banner).removeClass('banner_item_active');
		if(banner==2){
			banner=0;
		}else{
			banner++;
		}
		$('.banner_item').mouseover(function(){
			if($(this).index()==banner){
				return false;
			}else{
				$('.item_group').eq(banner).fadeOut();
				$('.item_group').eq($(this).index()).fadeIn();
				banner=$(this).index();
				$('.banner_item').removeClass('banner_item_active');
				$('.banner_item').eq(banner).addClass('banner_item_active');
			}
		});
		$('.banner_item1').mouseover(function(){
			if($(this).index()==banner){
				return false;
			}else{
				$('.groups').eq(banner).fadeOut();
				$('.groups').eq($(this).index()).fadeIn();
				banner=$(this).index();
				$('.banner_item1').removeClass('banner_item_active');
				$('.banner_item1').eq(banner).addClass('banner_item_active');
			}
		});
	}
});
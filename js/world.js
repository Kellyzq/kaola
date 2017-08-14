$(function(){
	$('.tab').each(function(){
		$(this).mouseover(function(){
			var index = $(this).index();
			$('.tab').removeClass('active');
			$(this).addClass('active');
			$('.brand_content').css('display','none');
			$('.brand_content').eq(index).css('display','block');
		});
	});
	
	$('.tab1').each(function(){
		$(this).mouseover(function(){
			var dex = $(this).index();
			$('.tab1').removeClass('active');
			$(this).addClass('active');
			$('.linefour').css('display','none');
			$('.linefour').eq(dex).css('display','block');
		});
	});
	
	$('.tab2').each(function(){
		$(this).mouseover(function(){
			var index3 = $(this).index();
			$('.tab2').removeClass('active');
			$(this).addClass('active');
			$('.linefive').css('display','none');
			$('.linefive').eq(index3).css('display','block');
		});
	});
	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();
		if(scrollTop>300){
			$('.deslip').show();
		}else{
			$('.deslip').hide();
		}
		$('.bottompart').click(function(){
			$(window).scrollTop(0);
		});
	});
	
	$('.rnav').each(function(){
		$(this).click(function(){
			var index = $(this).index();
			var top = $('.wrap').eq(index).offset().top;
			$('body,html').animate({scrollTop:top});
		});
	});
	$('.brand_desc').mouseenter(function(){
		$(this).animate({top:-48});
	}).mouseleave(function(){
		$(this).animate({top:0});
	});
	
//	轮播图
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
});

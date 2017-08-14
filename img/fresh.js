$(function() {
//	设置页面样式
	var setCssHandler = setInterval(function() {
		$cssWidth = ($(window).width() - $('.carouselfigure>div>ul>li>img').outerWidth()) / 2
		$('.carouselfigure>div>ul>li>img').css('margin-left', $cssWidth);
		$('.carouselfigure>.carouselfigure_point').css('left',($(window).width() - $('.carouselfigure>.carouselfigure_point').outerWidth()) / 2);
		$('.fresh_con_list>.fresh_con_wrap>.fresh_con_goods>p>b:empty').css('border','1px dotted #ffffff');
		$('.fresh_con_list>.fresh_con_wrap>.fresh_con_goods>a>.fresh_con_union_tags:empty').css('background-color','transparent');
		clearInterval(setCssHandler);
	}, 1);
//	轮播图
	$oCF = $('.carouselfigure');
	carouselfigure($oCF, 'fade', 3000);
//	右边栏显示隐藏
	$(window).scroll(function(){
		$windowTop=$(window).scrollTop();
		if ($windowTop>=600) {
			$('.right_side_bar').fadeIn();
		} else{
			$('.right_side_bar').fadeOut();
		}
	});
});
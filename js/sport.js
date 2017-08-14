$(function() {
//	设置页面样式
	var setCssHandler = setInterval(function() {
		$cssWidth = ($(window).width() - $('.carouselfigure>div>ul>li>img').outerWidth()) / 2
		$('.carouselfigure>div>ul>li>img').css('margin-left', $cssWidth);
		$('.carouselfigure>.carouselfigure_point').css('left',($(window).width() - $('.carouselfigure>.carouselfigure_point').outerWidth()) / 2);
		$('.sport_con>.sport_con_wrap>.sport_con_goods>p>b:empty').css('border','1px dotted #ffffff');
		$('.sport_con>.sport_con_wrap>.sport_con_goods>a>.sport_con_union_tags:empty').css('background-color','transparent');
		$('.sport_con').eq(1).find('li').css('width',143);
		$('.sport_con').eq(1).children().eq(1).children().eq(0).css('width',142);
		$('.sport_con').eq(2).find('li').css('width',167);
		$('.sport_con').eq(2).children().eq(1).children().eq(0).css('width',166);
		$('.sport_con').eq(2).children().eq(1).children().eq(1).css('width',166);
		$('.sport_con').eq(3).find('li').css('width',500);
		for (var i=0;i<$('.sport_con>.sport_con_wrap>.sport_con_goods>a>.sell_out').size();i++) {
			$('.sport_con>.sport_con_wrap>.sport_con_goods>a>.sell_out').eq(i).parent().parent().children().eq(1).children().eq(4).html('已抢光');
			$('.sport_con>.sport_con_wrap>.sport_con_goods>a>.sell_out').eq(i).parent().parent().children().eq(1).children().eq(4).css('background-color','#cccccc');
		}
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
//	商品品牌选项卡
	for (var i=0;i<$('.sport_brand>ul>li').size();i++) {
		(function(j){
			$('.sport_brand>ul>li').eq(j).mouseover(function(){
				$('.sport_brand>ul>li').attr('class','');
				$('.sport_brand>ul>li').eq(j).attr('class','sport_brand_type_active');
				$('.sport_brand_wrap').css('display','none');
				$('.sport_brand_wrap').eq(j).css('display','block');
			});
		})(i)
	}
//	商品列表选项卡
	for (var k=0;k<$('.sport_con').size();k++) {
		(function(x){
			for (var i=0;i<$('.sport_con').eq(x).children().eq(1).children().size();i++) {
				(function(j){
					$('.sport_con').eq(x).children().eq(1).children().eq(j).mouseover(function(){
						$('.sport_con').eq(x).children().eq(1).children().attr('class','');
						$('.sport_con').eq(x).children().eq(1).children().eq(j).attr('class','sport_con_type_active');
						$('.sport_con').eq(x).find('.sport_con_wrap').css('display','none');
						$('.sport_con').eq(x).find('.sport_con_wrap').eq(j).css('display','block');
					});
				})(i)
			}
		})(k)
	}
	
	
});
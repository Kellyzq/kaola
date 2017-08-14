$(function() {
//	设置页面样式
	var setCssHandler = setInterval(function() {
		$cssWidth = ($(window).width() - $('.carouselfigure>div>ul>li>img').outerWidth()) / 2
		$('.carouselfigure>div>ul>li>img').css('margin-left', $cssWidth);
		$('.carouselfigure>.carouselfigure_point').css('left',($(window).width() - $('.carouselfigure>.carouselfigure_point').outerWidth()) / 2);
		$('.Gourmet_classify').css('background-position-x',(1000-1920)/2);
		$('.Gourmet_life>h1').css('background-position-x',(1000-1920)/2);
		$('.Gourmet_brand>h1').css('background-position-x',(1000-1920)/2);
		$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>p>b:empty').css('border','1px dotted #ffffff');
		for (var i=0;i<$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>p>b').size();i++) {
			(function(j){
				var x=$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>p>b').eq(j).text();
				var reg=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
				var y=x.replace(reg,'00');
				$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>p>b').eq(j).css('width',y.length*.5+1+'em');
			})(i);
		}
		$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>a>.Gourmet_con_union_tags:empty').css('background-color','transparent');
		for (var i=0;i<$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>a>.sell_out').size();i++) {
			$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>a>.sell_out').eq(i).parent().parent().children().eq(1).children().eq(4).html('已抢光');
			$('.Gourmet_con>.Gourmet_con_wrap>.Gourmet_con_goods>a>.sell_out').eq(i).parent().parent().children().eq(1).children().eq(4).css('background-color','#cccccc');
		}
		clearInterval(setCssHandler);
	}, 1);
//	轮播图
	$oCF = $('.carouselfigure');
	carouselfigure($oCF, 'fade', 1000);
//	右边栏显示隐藏
	$(window).scroll(function(){
		$windowTop=$(window).scrollTop();
		if ($windowTop>=600) {
			$('.right_side_bar').fadeIn();
		} else{
			$('.right_side_bar').fadeOut();
		}
	});
//	历遍'.Gourmet_brand_wrap'，给每个'.Gourmet_brand_wrap'里的商品品牌a标签添加动画
	for (var i=0;i<$('.Gourmet_brand_wrap').size();i++) {
		(function(j){
			for (var k=0;k<$('.Gourmet_brand_wrap').eq(j).children().length;k++) {
				(function(q){
//					自定义function防止mouseover和mouseout的bug
					oMaskCreate($('.Gourmet_brand_wrap').eq(j).children().eq(q),function(){
						$('.Gourmet_brand_wrap').eq(j).children().eq(q).children().eq(1).stop().animate({
							bottom:0
						},300);
					},function(){
						$('.Gourmet_brand_wrap').eq(j).children().eq(q).children().eq(1).stop().animate({
							bottom:-48
						},300);
					});
				})(k)
			}
		})(i)
	}
//	选项卡
	for (var i=0;i<$('.Gourmet_brand>ul>li').size();i++) {
		(function(j){
			$('.Gourmet_brand>ul>li').eq(j).mouseover(function(){
				$('.Gourmet_brand>ul>li').attr('class','');
				$('.Gourmet_brand>ul>li').eq(j).attr('class','Gourmet_brand_type_active');
				$('.Gourmet_brand_wrap').css('display','none');
				$('.Gourmet_brand_wrap').eq(j).css('display','block');
			});
		})(i)
	}
	
	
});
$(function() {
//	鼠标移动改变按钮图标
	$('.banner_wrap>.banner>.iphone_download').mouseover(function(){
		$('.banner_wrap>.banner>.iphone_download').css('background-position-y',-1238);
	});
	$('.banner_wrap>.banner>.iphone_download').mouseout(function(){
		$('.banner_wrap>.banner>.iphone_download').css('background-position-y',-1132);
	});
	$('.banner_wrap>.banner>.android_download').mouseover(function(){
		$('.banner_wrap>.banner>.android_download').css('background-position-y',-1291);
	});
	$('.banner_wrap>.banner>.android_download').mouseout(function(){
		$('.banner_wrap>.banner>.android_download').css('background-position-y',-1185);
	});
});
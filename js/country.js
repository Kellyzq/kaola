$(function(){
	var top = $('.tabbar_bg').offset().top;
	//回到顶部
	$(window).scroll(function(){
		$('.totop').click(function(){
			$(window).scrollTop(0);
		});
		var scrollTop = $(window).scrollTop();
		for (var i=0;i<$('.wrap').length;i++){
			(function(j){
				var wTop = $('.wrap').eq(j).offset().top-$('.wrap').eq(j).outerHeight();
				if(scrollTop>wTop){
					$('.tab').css('background','#f49d35');
					$('.tab').find('span').attr('class','');
					$('.tab').eq(j).css('background','#98a0c4');
					$('.tab').eq(j).find('span').attr('class','active');
				}
			})(i);
		}
		
		if(scrollTop>=top){
			$('.tabbar_bg').addClass('fixed');
		}
		else if(scrollTop<top){
			$('.tabbar_bg').removeClass('fixed');
		}
	});
	$('.tab').each(function(){
		$(this).click(function(){
			var index = $(this).index();
			var imgTOP = $('.wrap').eq(index).offset().top - $('.tabbar_bg').outerHeight()-10;
			$('body,html').animate({scrollTop:imgTOP});
		});
	});
	
});

(function(){
	window.onload = function(){
		var oTab = document.querySelectorAll('.tab');
		for(var i=0;i<oTab.length;i++){
			(function(j){
				oTab[j].onclick = function(){
					for(var k=0;k<oTab.length;k++){
						oTab[k].style.background = '#f49d35';
					oTab[k].children[0].className = '';
					}
					oTab[j].style.background = '#98a0c4';
					oTab[j].children[0].className = 'active';
				}
			})(i);
		}
	}
})();

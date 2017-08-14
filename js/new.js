(function(){
	window.onload=function(){
		//获取当前时间
	var date = new Date();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var aMonth = document.getElementById('m_month');
	var aDay = document.getElementById('m_day');
	var months = parseInt(month);
	var days = parseInt(day);
	if(months<10){
		months = '0'+ months;
	}
	aMonth.innerHTML = months;
	if(days<10){
		days = '0' + days;
	}
	aDay.innerHTML = days;
	}
})();

$(function(){
	if($('#tabnav').currentStyle){
		var zoneH = $('#tabnav').offset().top;
	}else{
		var zoneH = $('#tabnav').offset().top+170;
	}
	//回到顶部
	$(window).scroll(function(){
		$('.totop').click(function(){
			$(window).scrollTop(0);
		});
		var top = $(window).scrollTop();
		if(top>=zoneH){
			$('#tabnav').addClass('fixed');
		}else if(top<zoneH){
			$('#tabnav').removeClass('fixed');
		}
	});
});

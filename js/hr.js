$(function(){
	$('.hr_ul li').click(function(){
		var index=$(this).index();
		$('.content_list').removeClass('show');
		$('.content_list').eq(index).addClass('show');
		$('.hr_ul li a').removeClass('act');
		$('.hr_ul li a').eq(index).addClass('act');
		$('.left_tab li a').removeClass('act');
		$('.left_tab li a:eq(0)').addClass('act');
	});
	$('.left_tab li:eq(0)').click(function(){
		$('.left_tab li a').removeClass('act');
		$('.left_tab li a:eq(0)').addClass('act');
		$('.content_list').removeClass('show');
		$('.content_list:eq(0)').addClass('show');
		$('.hr_ul li a').removeClass('act');
		$('.hr_ul li a:eq(0)').addClass('act');
	});
	$('.left_tab li:eq(1)').click(function(){
		$('.left_tab li a').removeClass('act');
		$('.left_tab li a:eq(1)').addClass('act');
		$('.content_list').removeClass('show');
		$('.content_list:eq(6)').addClass('show');
		$('.hr_ul li a').removeClass('act');
	});
});

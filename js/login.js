$(function(){
	var remember_pwd=false;
	var li163='@163.com';
	var li126='@126.com';
	var liyeah='@yeah.net';
	$('#username').attr('ok','0');
	$('#password').attr('ok','0');
	/*-------------------------------------------username------------------------------------------*/
	$('#username').focus(function(){
		$('#username_box').removeClass('form_input_red');
		$('#username_box').addClass('input_focus');
		$('.login_tips').hide();
	}).blur(function(){
		$('#username').attr('ok','0');
		var size=$('#username').val().length;
		$('#username_box').removeClass('input_focus');
		if(size>0){
			var reg = /^[a-zA-Z][0-9a-zA-Z]{1,15}/;
			if(!reg.test($('#username').val())){
				$('.login_user_option').hide();
				$('.login_tips').show();
				$('.login_tips_text').html('邮箱格式错误');
				$('#username').focus();
				$('#username_box').addClass('form_input_red');
			}
			else{
				$('.login_tips').hide();
				$('#username').attr('ok','1');
			}
		}
		
	}).bind('input propertychange', function() {
		$('#username_box').removeClass('form_input_red');
	    if($('#username').val().length>0){
			$('#username_empty').parent().show();
			$('.login_user_option').show();
			$('#em163').html($('#username').val()+li163);
			$('#em126').html($('#username').val()+li126);
			$('#emyeah').html($('#username').val()+liyeah);
		}
		else{
			$('#username_empty').parent().hide();
			$('.login_user_option').hide();
		}
	});
	$('#username_empty').click(function(){
		$('#username').val('').focus();
		$(this).parent().hide();
	});
	
	/*-------------------------------------------password------------------------------------------*/
	$('#password').focus(function(){
		$('#password_box').addClass('input_focus');
		$('.login_tips').hide();
		$('.login_user_option').hide();
	}).blur(function(){
		$('#password').attr('ok','0');
		$('#password_box').removeClass('input_focus');
		if($('#password').val().length>0){
			$('#password_empty').parent().show();
			$('#password').attr('ok','1');
		}
	}).bind('input propertychange', function() {
	    if($('#password').val().length>0){
			$('#password_empty').parent().show();
		}
		else{
			$('#password_empty').parent().hide();
		}
	});
	$('#password_empty').click(function(){
		$('#password').val('').focus();
		$(this).parent().hide();
	});
	$('#remember_pwd').click(function(){
		if(!remember_pwd){
			$(this).addClass('remember_pwd_true');
		}
		else{
			$(this).removeClass('remember_pwd_true');
		}
		remember_pwd=!remember_pwd;
	});
	/*-------------------------------------------email_option------------------------------------------*/
	$('.login_user_option li').click(function(){
		var html = $(this).html();
		$('#username').val(html);
		var reg = /^[a-zA-Z][0-9a-zA-Z]{1,15}/;
		if(!reg.test($('#username').val())){
			$('.login_user_option').hide();
			$('.login_tips').show();
			$('.login_tips_text').html('邮箱格式错误');
			$('#username_box').addClass('form_input_red');
			$('#username').focus();
		}
		else{
			$('#username').val(html).blur();
			$('#password').focus();
			$('.login_user_option').hide();
			$('#username_box').removeClass('form_input_red');
			$('.login_tips').hide();
		}
	});
	
	/*-------------------------------------------login------------------------------------------*/
	$('#login_btn').click(function(){
		var u=$('#username').attr('ok');
		var p=$('#password').attr('ok');
		if(u==1&&p==1){
			$.ajax({
				type:"post",
				url:"/project/guestbook/index.php",
				async:true,
				data:{
					'm':'index',
					'a':'login',
					'username':$('#username').val(),
					'password':$('#password').val()
				},
				success:function(str){
					var json=JSON.parse(str);
					if(json.code==1){
						$('.login_tips').show();
						$('.login_tips_text').html(json.message);
					}
					else{
						window.location.href='http://127.0.0.1/project/index.html';
					}
				},
				error:function(){
					alert('ajax请求失败！');
				}
			});
		}
	});
	/**/
});

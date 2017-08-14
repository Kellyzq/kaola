$(function() {
	var g_submit = false;
	$('#sub').bind('input propertychange', function() {
		if ($('#sub').val().length > 0) {
			$('#sub_msg').addClass('have');
			g_submit = true;
		} else {
			$('#sub_msg').removeClass('have');
			g_submit = false;
		}
	});
	$('#sub_msg').click(function() {
		if (g_submit) {
			var userbox = document.createElement('div');
			userbox.className = 'cont_box';
			var userI = document.createElement('i');
			userI.className = 'cont_boximg user_img';
			var userImg = document.createElement('img');
			userImg.src = 'img/server_user.png';
			userImg.alt = '';
			userI.appendChild(userImg);
			var usercont = document.createElement('p');
			usercont.className = 'cont_text user_text';
			usercont.innerHTML = $('#sub').val();
			var cfix = document.createElement('div');
			cfix.className = 'clearfix';
			userbox.appendChild(userI);
			userbox.appendChild(usercont);
			userbox.appendChild(cfix);
			$('.content').append(userbox);
			var dta=$('#sub').val();
			$('#sub').val('');
			var ctmain=document.getElementById('msg_main');
			ctmain.scrollTop=ctmain.scrollHeight;
			$.ajax({
				type: "post",
				url: "http://www.tuling123.com/openapi/api",
				async: true,
				data: {
					'key': '0a7556252f02472eb4809ad1e41345af',
					'info': dta,
					'userid': '混沌的始末'
				},
				success: function(str) {
					var aibox = document.createElement('div');
					aibox.className = 'cont_box';
					var aiI = document.createElement('i');
					aiI.className = 'cont_boximg';
					var aiImg = document.createElement('img');
					aiImg.src = 'img/server_img.png';
					aiImg.alt = '';
					aiI.appendChild(aiImg);
					var aicont = document.createElement('p');
					aicont.className = 'cont_text';
					aicont.innerHTML = str.text;
					var cfix = document.createElement('div');
					cfix.className = 'clearfix';
					aibox.appendChild(aiI);
					aibox.appendChild(aicont);
					aibox.appendChild(cfix);
					$('.content').append(aibox);
					ctmain.scrollTop=ctmain.scrollHeight;
				},
				error: function() {
					alert('ajax请求失败！');
				}
			});
		}
	});
});
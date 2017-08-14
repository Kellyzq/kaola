$(function(){
	var num=100000000000;
	for(var i=0;i<20;i++){
		jp();
	}
	var roll;
	var start=true;
	roll=setInterval(function(){
		$('#users').animate({'top':'-38px'},function(){
			$('#users li').first().remove();
			$('#users').css('top','0');
			jp();
		});
	},3000);
	function jp(){
		var oLi=document.createElement('li');
		var prize;
		var random=parseInt(Math.ceil(Math.random()*8));
			switch(random){
				case 1:
				prize='2考拉豆';
				break;
				case 2:
				prize='N°21 猫咪包';
				break;
				case 3:
				prize='5考拉豆';
				break;
				case 4:
				prize='海蓝之谜 面霜';
				break;
				case 5:
				prize='18考拉豆';
				break;
				case 6:
				prize='虎牌 电饭煲';
				break;
				case 7:
				prize='88考拉豆';
				break;
				case 8:
				prize='科克兰 坚果';
				break;
			}
			oLi.innerHTML='用户'+num+'抽到了'+prize;
			num++;
			$('#users').append(oLi);
	}
	var cj;
	var jpn=-1;
	$('#cj').click(function(){
		if($('#header_username').html().length==0){
			alert('请您先登录！');
			return false;
		}
		if(start){
			var time=0;
			start=false;
			cj=setInterval(function(){
				$('.wrap .item').removeClass('item_s');
				jpn++;
				time++
				if(jpn==8){
					jpn=0;
				}
				$('.wrap .item').eq(jpn).addClass('item_s');
				if(time>50){
					var jpnum=parseInt(Math.ceil(Math.random()*8));
					if(jpnum==1){
						clearInterval(cj);
						start=true;
						var winner;
						switch(jpn){
							case 0:
							winner='2考拉豆';
							break;
							case 1:
							winner='N°21 猫咪包';
							break;
							case 2:
							winner='5考拉豆';
							break;
							case 3:
							winner='海蓝之谜 面霜';
							break;
							case 4:
							winner='18考拉豆';
							break;
							case 5:
							winner='虎牌 电饭煲';
							break;
							case 6:
							winner='88考拉豆';
							break;
							case 7:
							winner='科克兰 坚果';
							break;
						}
						var oLi=document.createElement('li');
						oLi.innerHTML='用户'+$('#header_username').html()+'抽到了'+winner;
						$('#users').append(oLi);
					}
				}
			},30);
		}
		else{
			return false;
		}
	});
});

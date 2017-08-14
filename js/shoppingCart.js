$(function(){
//	进入页面刷新数据
	var upDateCookieHandler=setInterval(function(){
		var html='';
//		自定义循环1000次
		for (var i=0;i<1000;i++) {
//			闭包保存每次获取的i放到j里
			(function(j){
//				用字符串+j 生成0到999排序的带序号名称
				//将字符串放进一个数组
				var aryCookieName=[];
				var oFreshSecondKillAry='fresh_second_kill_goods'+j;
				var oFreshConGoods='fresh_con_goods'+j;
				var oSportConGoods='sport_con_goods'+j;
				var oGourmetConGoods='Gourmet_con_goods'+j;
				var oShoppingCartAd='shoppingCart_ad'+j;
				var oCntGoodlistGoods='cnt_goodlist_goods'+j;
				var oNewItemboxItemwrapItmgoods='new_item_box_item_wrap_itm_goods'+j;
				var oPartyProlistItemgroupItemsale='party_prolist_item_group_item_sale'+j;
				var oPartyProlistGroupsItemsale='party_prolist_groups_item_sale'+j;
				var oNewBrandListMGoods='new_brand_list_m_goods'+j;
				//下面两cookie的页面布局比较特别还进行多一次排序所以要再循环一次
				for (var x=0;x<10;x++) {
					(function(y){
						var oCountryDetailwrap='countryDetailwrap'+y;
						var oMZDetailwrap='MZDetailwrap'+y;
						var oMZBrandWrapDetailwrap='MZBrandWrapDetailwrap'+y;
						var oNewGoodsListGoods='new_goods_list_goods'+y;
						var oWorldGoodswrapDetailwrap='world_goodswrap_detailwrap'+y;
						oCountryDetailwrap=oCountryDetailwrap+j;
						oCountryDetailwrap=oMZDetailwrap+j;
						oMZBrandWrapDetailwrap=oMZBrandWrapDetailwrap+j;
						oNewGoodsListGoods=oNewGoodsListGoods+j;
						oWorldGoodswrapDetailwrap=oWorldGoodswrapDetailwrap+j;
						aryCookieName.push(oCountryDetailwrap);
						aryCookieName.push(oMZDetailwrap);
						aryCookieName.push(oMZBrandWrapDetailwrap);
						aryCookieName.push(oNewGoodsListGoods);
						aryCookieName.push(oWorldGoodswrapDetailwrap);
					})(x);
				}
				aryCookieName.push(oFreshSecondKillAry);
				aryCookieName.push(oFreshConGoods);
				aryCookieName.push(oSportConGoods);
				aryCookieName.push(oGourmetConGoods);
				aryCookieName.push(oShoppingCartAd);
				aryCookieName.push(oCntGoodlistGoods);
				aryCookieName.push(oNewItemboxItemwrapItmgoods);
				aryCookieName.push(oPartyProlistItemgroupItemsale);
				aryCookieName.push(oPartyProlistGroupsItemsale);
				aryCookieName.push(oNewBrandListMGoods);
				/*
				 * 用循环历遍aryCookieName数组
				 * 闭包保存循环的下标
				 * 获取该下标的cookie进行dom操作
				 */
				//
				for(var k=0,kLen=aryCookieName.length;k<kLen;k++){
					(function(q){
						if (getCookie(aryCookieName[q])) {
		//					console.log(getCookie(oFreshSecondKillAry));
							var aryX=getCookie(aryCookieName[q]).split(',');
							html+='<p cookieId='+aryCookieName[q]+'><label><input type="checkbox"/><span></span>'+
							'<img src="'+aryX[0]+'"/></label><strong>'+aryX[1]+
							'</strong><b><i>'+aryX[2]+'</i><del>'+aryX[3]+
							'</del></b><b><big>-</big><em>1</em><big>+</big></b><b>'+
							aryX[2]+'</b><b>删除</b></p>';
						}
					})(k);
				}
//				判断每个带序号名称的cookie是否存在 存在的话 进行dom操作
			})(i);
		}
		$('#shoppingCart_list').html(html);
//		如果购物车没有商品时显示的dom操作
		if ($('#shoppingCart_list').find('p').length<1) {
			$('.shoppingCart').html('<div class="shoppingCart_empty"><img src="img/kaola_cartIcon.jpg"/><p>购物车里空空如也，赶紧去<a href="">逛逛吧&gt;</a></p><span>或者您可以先进行<a href="">登录&gt;</a></span></div>');
		}
//		判断全选
		function isAllChecked(){
		    var selected=0;
		    for (var i=0;i<$('#shoppingCart_list>p>label>input').length;i++){
		        if($('#shoppingCart_list>p>label>input').eq(i).is(':checked')){
		            selected+=1;
		        }
		    }
		    if(selected==$('#shoppingCart_list>p>label>input').length){
		        $('#checkAll').prop('checked',true);
				$('#bottomCheckAll').prop('checked',true);
		    }else{
		    	$('#checkAll').prop('checked',false);
				$('#bottomCheckAll').prop('checked',false);
		    }
		}
//		总价更新
		function totalUpDate(){
				var totalGoodsAmount=0;
				var	totalCost=0;
				var	totalDiscount=0;
			if($('#shoppingCart_list>p').find('input').is(':checked')){
				$('#shoppingCart_list_total_message').find('a').css('background-color','#e31436');
			}else{
				$('#shoppingCart_list_total_message').find('a').css('background-color','#CCCCCC');
				$('#shoppingCart_list_total').find('span').eq(0).html('商品应付总计：￥0.00');
				$('#shoppingCart_list_total').find('span').eq(1).html('活动优惠：-￥0.00');
				$('#shoppingCart_list_total_message').find('p').html('已选商品 0 件  活动优惠：-￥0.00  商品应付总计：￥0.00');
			}
			$('#shoppingCart_list>p').each(function(){
				var eqIndex=$(this).index();
				var thisGoodsAmount=0;
				var thisCost=0;
				var thisDiscount=0;
				if ($('#shoppingCart_list>p').eq(eqIndex).find('input').is(':checked')) {
					thisGoodsAmount=parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('em').text());
					thisCost=(parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('i').text())*thisGoodsAmount);
					thisDiscount=((parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('del').text())-parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('i').text()).toFixed(2))*thisGoodsAmount);
					totalGoodsAmount=totalGoodsAmount+thisGoodsAmount;
					totalCost=parseFloat(totalCost)+thisCost;
					totalDiscount=parseFloat(totalDiscount)+thisDiscount;
					$('#shoppingCart_list_total').find('span').eq(0).html('商品应付总计：￥'+totalCost.toFixed(2));
					$('#shoppingCart_list_total').find('span').eq(1).html('活动优惠：-￥'+totalDiscount.toFixed(2));
					$('#shoppingCart_list_total_message').find('p').html('已选商品'+totalGoodsAmount+' 件 活动优惠：-￥'+totalDiscount.toFixed(2)+'商品应付总计：￥'+totalCost.toFixed(2));
				}
			});	
		}
//		历遍'#shoppingCart_list>p'
		$('#shoppingCart_list>p').each(function(){
			var eqIndex=$(this).index();
//			商品数量减少按钮
			$('#shoppingCart_list>p').eq(eqIndex).find('big').eq(0).click(function(){
				var oEmT=parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('em').text());
				var oMoney=parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('i').text());
				oEmT-=1;
				if (oEmT==0) {
					return false;
				}else{
					var oCost=(oEmT*oMoney).toFixed(2);
					$('#shoppingCart_list>p').eq(eqIndex).find('em').html(oEmT);
					$('#shoppingCart_list>p').eq(eqIndex).find('b').eq(2).html(oCost);
				}
				totalUpDate();
			});
//			商品数量增加按钮
			$('#shoppingCart_list>p').eq(eqIndex).find('big').eq(1).click(function(){
				var oEmT=parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('em').text());
				var oMoney=parseFloat($('#shoppingCart_list>p').eq(eqIndex).find('i').text());
				oEmT+=1;
				var oCost=(oEmT*oMoney).toFixed(2);
				$('#shoppingCart_list>p').eq(eqIndex).find('em').html(oEmT);
				$('#shoppingCart_list>p').eq(eqIndex).find('b').eq(2).html(oCost);
				totalUpDate();
			});
//			单选框
			$('#shoppingCart_list>p').eq(eqIndex).find('input').click(function(){
				isAllChecked();
				totalUpDate();
			});
//			商品删除
			$('#shoppingCart_list>p').eq(eqIndex).children(':last-child').css('cursor','pointer');
			$('#shoppingCart_list>p').eq(eqIndex).children(':last-child').click(function(){
			 	deleteCookie($('#shoppingCart_list>p').eq(eqIndex).attr('cookieId'));
			 	location.replace(location);
			});
		});
//		console.log($('#shoppingCart_list>p>label>input:checked').length)
//		全选框
		$('#checkAll').click(function(){
			 $('#shoppingCart_list>p>label>input').prop('checked',this.checked);
			 $('#bottomCheckAll').prop('checked',this.checked);
			 totalUpDate();
		});
		$('#bottomCheckAll').click(function(){
			 $('#shoppingCart_list>p>label>input').prop('checked',this.checked);
			 $('#checkAll').prop('checked',this.checked);
			 totalUpDate();
		});
//		删除选择的商品
		$('#shoppingCart_list_total_message').children().eq(1).css('cursor','pointer');
		$('#shoppingCart_list_total_message').children().eq(1).click(function(){
			$('#shoppingCart_list>p').each(function(){
				var eqIndex=$(this).index();
				if ($('#shoppingCart_list>p').eq(eqIndex).find('input').is(':checked')) {
					deleteCookie($('#shoppingCart_list>p').eq(eqIndex).attr('cookieId'));
				}
				location.replace(location);
			});
		});
		clearInterval(upDateCookieHandler);
	},1);
});

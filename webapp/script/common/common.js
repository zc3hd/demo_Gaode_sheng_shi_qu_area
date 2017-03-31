/**
 * Created by wangpeng on 2016/8/8.
 */
var cLib = {};  //定义公共库全局变量
(function (lib) {
    base = {
		getCookie : function(c_name) {//获取cookie
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1)
						c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end))
				}
			}
			return ""
		},
		setCookie : function(c_name, value, expiredays, path) {//设置cookie
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ((path == null) ? "" : ";path=" + path + ";domain=capcare.com.cn");
		},
		clearCookie : function() {//清除cookie
			var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
			if (keys) {
				for (var i = keys.length; i--;)
					document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
			}
		},
		getParam : function(name) {//获取浏览器url的参数
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		},
        setLoading:function(fn){//设置loading,fn为回调函数
            var w=$(window).width();
            var h=$(window).height();
            $(document.body).append('<div id="overlay"></div>');
            $(document.body).append('<img id="xubox_loading2" src="../images/xubox_loading2.gif"/>');
            $('#overlay').css({
                "background": "#000",
                "filter": "alpha(opacity=50)", /* IE的透明度 */
                "opacity": 0.5,  /* 透明度 */
                "position": "absolute",
                "top": 0,
                "left": 0,
                "width": w,
                "height": h,
                "z-index": 10000 /* 此处的图层要大于页面*/
            })
            $('#xubox_loading2').css({
                'position':'absolute',
                'left':w/2,
                'top':h/2,
                'z-index':100000
            })
            fn && fn();
            return $('#overlay,#xubox_loading2');

        },
        removeLoading:function(obj,fn){//清除loading obj为需要删除的对象，fn为回调函数
            fn && fn();
            obj.remove();
        },
        setParentHigh:function(id){//自适应iframe的高度为内部body的高度，id为iframe的id
            if((parseInt($(document.body).height())+225<$(window.parent.document).find("#mainBody").height())||($('#pageTabWrap',window.parent.document).height()+20)>($(document.body).height()+30)){//如果内部页面高度小于左侧菜单，iframe高度等于菜单高度+20
                var allScreen=$(window.parent.document).find('#mainBody').height()-225+29;//285为除去iframe其他的高度和
                var keepTab=$('#pageTabWrap',window.parent.document).height()+20;
                $('#'+id, parent.document).height(allScreen>keepTab?allScreen:keepTab);
            }else{//否则等于内部页面高度
                $('#'+id, parent.document).height($(document.body).height()+30);
            }
        },
		//时间戳转日期
        formatterDateDay:function(date,flag){ //时间戳转日期
        	var me=this;
        	if(!date){;
        	return false;
        	}else{
        		if(flag && flag==true){
        			var dt = new Date(date);
        			return (dt.getFullYear()+"-"
        				   +me.checkNum(dt.getMonth()+1)+"-"
        				   +me.checkNum(dt.getDate()));
        		}else{
        			var dt = new Date(date);
        			return (dt.getFullYear()+"-"
        				   +me.checkNum(dt.getMonth()+1)+"-"
        				   +me.checkNum(dt.getDate())+" "
        				   
        				   +me.checkNum(dt.getHours())+":"
        				   +me.checkNum(dt.getMinutes()));
        		}
        	}       	
        },
        checkNum:function(num){//日期转换后，个位数加零
        	if(num < 10){
        		return "0"+num;
        	}
        	return num;
        },
        editForm:function(){//表单编辑，公共调用
        	var me=this;
        	$(".contractContainer").hide();
        	$(".contractEdit").show();
        	me.setParentHigh("contentIn");
        },
        backForm:function(){//表单返回，公共调用
        	var me=this;
        	$(".contractContainer").show();
        	$(".contractEdit").hide();
        	$(".contractSearch input:first").focus();
        	me.setParentHigh("contentIn");
        },
        selectBck:function(opts,type){  //编辑反选
			 for(var i=0;i<opts.length;i++){				   
	           if(opts.eq(i).attr('data-type') == type){
	                  opts[i].selected = 'selected';
	                  break;
	             }
	          }
        },
		//设置datagrid中文显示
		setLangChina: function (id) {
			$('#'+id+'').datagrid('getPager').pagination({        //分页栏下方文字显示
				beforePageText: '第',//页数文本框前显示的汉字
				afterPageText: '页    共 {pages} 页',
				displayMsg:'当前显示：从第{from}条到{to}条 共{total}条记录',
				onBeforeRefresh:function(pageNumber, pageSize){
					$(this).pagination('loading');
					//alert('pageNumber:'+pageNumber+',pageSize:'+pageSize);
					$(this).pagination('loaded');
				}
			});
		},
		//坐标转换
		convertWgsToGcj02: function (x, y) {
		var x1, tempx, y1, tempy;
		x1 = x * 3686400.0;
		y1 = y * 3686400.0;
		var gpsWeek = 0;
		var gpsWeekTime = 0;
		var gpsHeight = 0;

		var point = wgtochina_lb(1, Math.floor(x1), Math.floor(y1), Math.floor(gpsHeight),
			Math.floor(gpsWeek), Math.floor(gpsWeekTime));
		if(point == null) {
			return false
		} else {
			tempx = point.x;
			tempy = point.y;
			tempx = tempx / 3686400.0;
			tempy = tempy / 3686400.0;

			point.longitude = tempx;
			point.latitude = tempy;
			return point;
		}
	},
		convertGcj02ToBd09:function (gg_lon, gg_lat) {
		var x = gg_lon, y = gg_lat;
		var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
		var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);

		var p = {};
		p.longitude = z * Math.cos(theta) + 0.0065;
		p.latitude = z * Math.sin(theta) + 0.006;

		return p;
	},
		wgtochina_lb:function (wg_flag, wg_lng, wg_lat, wg_heit, wg_week, wg_time) {
		var x_add;
		var y_add;
		var h_add;
		var x_l;
		var y_l;
		var casm_v;
		var t1_t2;
		var x1_x2;
		var y1_y2;
		var point = null;
		if (wg_heit > 5000) {
			return point;
		}
		x_l = wg_lng;
		x_l = x_l / 3686400.0;
		y_l = wg_lat;
		y_l = y_l / 3686400.0;
		if (x_l < 72.004) {
			return point;
		}
		if (x_l > 137.8347) {
			return point;
		}
		if (y_l < 0.8293) {
			return point;
		}
		if (y_l > 55.8271) {
			return point;
		}
		if (wg_flag == 0) {
			IniCasm(wg_time, wg_lng, wg_lat);
			point = {};
			point.latitude = wg_lng;
			point.longitude = wg_lat;
			return point;
		}
		casm_t2 = wg_time;
		t1_t2 = (casm_t2 - casm_t1) / 1000.0;
		if (t1_t2 <= 0) {
			casm_t1 = casm_t2;
			casm_f = casm_f + 1;
			casm_x1 = casm_x2;
			casm_f = casm_f + 1;
			casm_y1 = casm_y2;
			casm_f = casm_f + 1;
		} else {
			if (t1_t2 > 120) {
				if (casm_f == 3) {
					casm_f = 0;
					casm_x2 = wg_lng;
					casm_y2 = wg_lat;
					x1_x2 = casm_x2 - casm_x1;
					y1_y2 = casm_y2 - casm_y1;
					casm_v = Math.sqrt(x1_x2 * x1_x2 + y1_y2 * y1_y2) / t1_t2;
					if (casm_v > 3185) {
						return (point);
					}
				}
				casm_t1 = casm_t2;
				casm_f = casm_f + 1;
				casm_x1 = casm_x2;
				casm_f = casm_f + 1;
				casm_y1 = casm_y2;
				casm_f = casm_f + 1;
			}
		}
		x_add = Transform_yj5(x_l - 105, y_l - 35);
		y_add = Transform_yjy5(x_l - 105, y_l - 35);
		h_add = wg_heit;
		x_add = x_add + h_add * 0.001
			+ yj_sin2(wg_time * 0.0174532925199433) + random_yj();
		y_add = y_add + h_add * 0.001
			+ yj_sin2(wg_time * 0.0174532925199433) + random_yj();
		point = {};
		point.x = (x_l + Transform_jy5(y_l, x_add)) * 3686400;
		point.y = (y_l + Transform_jyj5(y_l, y_add)) * 3686400;
		return point;
	},
		//获取窗口视口的大小
		getClient: function () {
			if (window.innerWidth != null) {
				return {
					width: window.innerWidth,
					height: window.innerHeight
				}
			} else if (document.compatMode == "CSS1Compat") {
				return {
					width: document.documentElement.clientWidth,
					height: document.documentElement.clientHeight
				}
			} else {
				return {
					width: document.body.clientWidth,
					height: document.body.clientHeight
				}
			}
		},
		ajax:function(URL,datas){ //编辑，添加保存时ajax请求
			var me=this;
			$.ajax({
              url : URL,
              dataType : "json",
              data:datas,
              type:"post",
              async : false,
				success : function(data) {
					if(data.ret==0){
						layer.msg(data.desc, {icon: 1,time: 1000});
						me.backForm();
						$('#contractList').datagrid('reload');
					}else if(data.ret<0){	
						layer.msg(data.desc, {icon: 0,time: 1000});
					}
				}
          });
		},
		commonBtn:function(key,url,id,renterId){//编辑，添加显示页面后公共处理
			var me=this;
			/*返回*/
			$("#carRentalBack").unbind().on('click',function(){
	    		me.backForm();
	    	});
			/*保存*/
			$("#carRentalSave").unbind().on('click',function(){
				var data = addInfoLayer(key,url,id,renterId);
				if(data.url){
					var oUrl = data.url;
					var oDate = data.datas;
					me.ajax(oUrl,oDate);				
				}
			});
		},
		//md5加密
        md5: function (psw) {
            return $.md5(psw.toLowerCase()).toLowerCase();
        },
		checkPhone:function(phone){ //验证手机号码
			if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){ 
				layer.msg('手机号码有误，请重新填写',{icon:0,time:1500});
				return false; 
			} 
			return true;
		},
       //数字保留两位小数 
        toDecimal:function (obj) {
          if(isNaN(obj.value)){
        	  obj.value=""
          }else{
        	  if(obj.getAttribute("data-name")==1){
            	  if(obj.value>=1000){
            		  obj.value="999.99"
            	  }
              }
          	  obj.value=obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
          }        
        },
        getParam : function(name) {alert(1212121211)
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		}
       
	}
    lib.base = base;
})(cLib)

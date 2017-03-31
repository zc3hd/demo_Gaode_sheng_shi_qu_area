/**
 * Item Name  : 
 *Creator         :cc
 *Email            :cc
 *Created Date:2017.3.29.
 *@pararm     :
 */
(function($, window) {
  function map_all_city(opts) {
    this.id = opts.id;

    // 鼠标点击的安全开关
    this.mouse_key = false;
  };
  map_all_city.prototype = {
    //面向对象初始化
    init: function() {
      var me = this;
      //开启控件
      me.init_Baner();
      // 开启进度条
      me.init_bar();
      setTimeout(function() {
        me.init_event();
      }, 500);
    },
    //控件默认初始化
    init_Baner: function() {
      var me = this;
      var map = me.map = new AMap.Map(me.id, {
        // mapStyle:'dark',
        // features:[]
      });
      // map.setZoomAndCenter(11, [116.404, 39.915]);
    },
    // 进度条开启
    init_bar: function() {
      var me = this;
      var bar = me.bar = new ProgressBar.Circle(container_bar, {
        color: 'black',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1000,
        text: {
          autoStyleContainer: false
        },
        from: {
          color: '#aaa',
          width: 1
        },
        to: {
          color: '#333',
          width: 3
        },
        // Set default step function for all animate calls
        step: function(state, circle) {

          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', 3);
          var value = Math.round(circle.value() * 100);
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText('加载进度：' + value);
          }

        }
      });
      bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
      bar.text.style.fontSize = '12px';

      // bar.animate(0);
    },
    init_event: function() {
      var me = this;
      me.area_bind();
      me.area();
    },
    area: function() {
      var me = this;
      me._init();
    },
    area_bind: function() {
      var me = this;
      var fn = {
        _init: function() {
          var me = this;
          me._map_e();
          me._map_loading({
            level: 'country',
            adcode: '中国'
          });
        },
        _map_e: function() {
          var me = this;
          me.map.setFeatures([]);
          me.map.on('mousemove', function(argument) {
            // console.log(argument.pixel.y);
            $("#info").css({ "top": (argument.pixel.y + 5) + "px", "left": (argument.pixel.x + 5) + "px" });
          });
        },
        // 设置数据搜索
        _map_loading: function(dom) {
          var me = this;
          // 设置未加载完成时不能点击
          me.mouse_key = false;
          AMap.service('AMap.DistrictSearch', function() {
            var district = new AMap.DistrictSearch({
              subdistrict: 1, //返回下一级行政区
              level: dom.level,
              showbiz: false, //是否显示商圈
              // 返回边界显示
              // extensions: 'all'
            });
            // 市编码
            district.search(dom.adcode, function(status, result) {
              if (status == 'complete') {
                me._load_data(result.districtList[0]);
              }
            });

          });
        },
        // 拿到数据
        _load_data: function(data) {
          var me = this;
          // console.log(data);
          me.subList = data.districtList;
          // me._load_select();
          me.gradient = new gradientColor('#ffff00', '#000000', me.subList.length);
          // 画地图前先清除地图
          me.map.clearMap();
          // 递归的形式进行模块渲染
          me._render_area(0);
        },
        // 占时不用
        // -------------------------------------------------------------加载选择框
        _load_select: function() {
          var me = this;

          var arr = me.subList;
          var contentSub = null;
          // 返回的是省的数据
          if (arr[0].level == 'province') {
            $('#province').html('');
            for (var i = 0; i < arr.length; i++) {
              if (i == 0) {
                $('#province').append(new Option('--请选择--'));
              }
              contentSub = new Option(arr[i].name);
              $(contentSub).attr('adcode', arr[i].adcode);
              $(contentSub).attr('level', arr[i].level);
              $('#province').append(contentSub);
            }
          }
          // 返回的是市的数据
          else if (arr[0].level == 'city') {
            $('#city').html('');
            for (var i = 0; i < arr.length; i++) {
              if (i == 0) {
                $('#city').append(new Option('--请选择--'));
              }
              contentSub = new Option(arr[i].name);
              $(contentSub).attr('adcode', arr[i].adcode);
              $(contentSub).attr('level', arr[i].level);
              $('#city').append(contentSub);
            }
          }
          me._option_change();
        },
        // 点击省改变的事件
        _option_change: function() {
          var me = this;
          $('#province option').off().on('click', function(e) {
            var adcode = $(e.target).attr('adcode');
            var level = $(e.target).attr('level');

            me._map_loading({
              level: level,
              adcode: adcode
            });
          });
          $('#city option').off().on('click', function(e) {
            var adcode = $(e.target).attr('adcode');
            var level = $(e.target).attr('level');

            me._map_loading({
              level: level,
              adcode: adcode
            });
          });
        },
        // ------------------------------------------------------------版块数据
        _render_area: function(index) {
          var me = this;
          var key = index;
          if (key == me.subList.length) {
            me.bar.animate(key / me.subList.length);
            me.mouse_key = true;
            return;
          }
          var level = me.subList[key].level;
          var opts = null;
          var district = null;

          opts = {
            subdistrict: 0, //返回下一级行政区
            level: level,
            showbiz: false, //是否显示商圈
            // 返回边界显示
            extensions: 'all'
          };
          district = new AMap.DistrictSearch(opts);
          district.search(me.subList[key].adcode, function(status, result) {
            if (status == 'complete') {
              // 
              me._render_area_done(result.districtList[0], me.gradient[key]);
              me.bar.animate(key / me.subList.length);
              // 计数器加一
              key++;
              me._render_area(key);
            }
          });
        },
        // 具体渲染版块
        _render_area_done: function(data, color) {
          var me = this;
          var bounds = data.boundaries;
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              var polygon = new AMap.Polygon({
                map: me.map,
                strokeWeight: 0,
                strokeColor: color,
                fillColor: color,
                fillOpacity: 1,
                path: bounds[i]
              });
              // 挂载名称
              polygon.name = data.name;
              // 挂载城市编码
              polygon.adcode = data.adcode;
              // 挂载等级
              polygon.level = data.level;

              polygon.on('mouseover', function(argument) {
                me.map.setDefaultCursor('pointer');
                $("#info").html(polygon.name);
                $("#info").show();
              });
              polygon.on('mouseout', function(argument) {
                me.map.setDefaultCursor('auto');
                $("#info").hide();
              });
              polygon.on('click', function(argument) {

                // 开关不能点击
                if (!me.mouse_key) {
                  layer.msg('地图未加载完全~请稍后点击~~！');
                  return;
                }
                if (polygon.level == 'district') {
                  layer.msg('地图已加载到区县模式，无法继续深入~');
                  return;
                }
                me.map.setDefaultCursor('auto');
                $("#info").hide();
                // 加载数据
                me._map_loading({
                  level: polygon.level,
                  adcode: polygon.adcode
                });
              });
              me.map.setFitView(); //地图自适应
            }
          }
        },




      };
      for (k in fn) {
        me[k] = fn[k];
      };
    },
  };
  window["map_all_city"] = map_all_city;
})(jQuery, window);

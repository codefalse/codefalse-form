"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Codefalse-Form module file.
 * use jquery 3.3.1
 */
(function ($) {
  function _initComponent(id, options) {
    var cf = '<div id="' + id + '" class="codefalse-file">' + '    <div class="codefalse-file-item file-add" style="height: ' + options.height + ';width: ' + options.width + ';">' + '        <i class="codefalse-font icon-add" style="line-height: ' + options.height + ';"></i>' + '    </div>' + '</div>';
    return cf;
  }

  function _createFileItem(options, codefalseId, src) {
    var item = '<div class="codefalse-file-item file-item" style="height: ' + options.height + ';width: ' + options.width + ';">' + '   <div class="codefalse-file-operation" style="width: ' + options.width + ';">' + '      <i class="codefalse-file-del codefalse-font icon-delete"></i>' + '      <i class="codefalse-file-yulan codefalse-font icon-yulan"></i>' + '   </div>' + '   <img src="' + src + '" />' + '   <input type="hidden" name="' + options.name + '" value="' + src + '"/>' + '</div>';
    var addDom = $('#' + codefalseId).find('.file-add');
    addDom.before(item); //绑定modaal

    addDom.prev().find('.codefalse-file-yulan').modaal({
      type: 'image',
      content_source: src
    });
  }

  $.fn.codefalseFile = function (options, callback) {
    var _this2 = this;

    var _this = $(this);

    var defaults = {
      width: '200px',
      height: '200px',
      name: 'codefalseFile'
    };
    var fileOptions = $.extend({}, defaults, options); //生成唯一对应ID

    var codefalseId = 'codefalse-file-' + parseInt(Math.random() * 100000 + '');

    _this.on('change', function () {
      var files = $(_this2)[0].files;

      for (var i = 0; i < files.length; i++) {
        var file = files[i]; //读取文件

        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = function (e) {
          _createFileItem(fileOptions, codefalseId, e.target.result);
        };
      }
    });

    var methods = {
      _init: function _init() {
        console.log('start codefalse file......'); //隐藏文件选择

        _this.attr("style", "display:none"); //初始化文件选择组件


        _this.after(_initComponent(codefalseId, fileOptions)); //监听添加事件


        $('.file-add>i').on('click', function () {
          _this.trigger('click');
        }); //监听文件项事件

        $('#' + codefalseId).on('mouseenter', '.file-item', function () {
          var fileOperation = $(this).find('.codefalse-file-operation');
          fileOperation.show();
        });
        $('#' + codefalseId).on('mouseleave', '.file-item', function () {
          var fileOperation = $(this).find('.codefalse-file-operation');
          fileOperation.hide();
        }); //图片删除

        $('#' + codefalseId).on('click', '.codefalse-file-del', function () {
          var fileDom = $(this).parent().parent();
          var img = fileDom.find('img');
          var src = img.attr('src');

          if (typeof callback === 'function') {
            callback(src);
          }

          fileDom.remove();
        });
      },
      adapter: function adapter(images) {
        if (_typeof(images) === "object") {
          var len = images.length;

          if (len === undefined) {
            console.error('adapter params error.');
            return;
          }

          for (var i = 0; i < images.length; i++) {
            _createFileItem(fileOptions, codefalseId, images[i]);
          }
        }
      }
    };

    methods._init();

    return methods;
  };
})(jQuery);

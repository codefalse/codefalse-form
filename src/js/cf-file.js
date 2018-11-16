(function ($) {

    function _initComponent(id, options) {
        let cf =
            '<div id="'+id+'" class="codefalse-file">' +
            '    <div class="codefalse-file-item codefalse-file-add" style="height: '+options.height+';width: '+options.width+';">' +
            '        <i class="codefalse-font icon-add" style="line-height: '+options.height+';"></i>' +
            '    </div>' +
            '</div>'
        return cf;
    }

    function _createFileItem(options) {
        let item =
            '<div class="codefalse-file-item" style="height: '+options.height+';width: '+options.width+';">' +
            '   <div class="codefalse-file-operation" style="width: '+options.width+';">'+
            '      <i class="codefalse-file-del codefalse-font icon-delete"></i>' +
            '      <i data-modaal-content-source="" class="codefalse-file-yulan codefalse-font icon-yulan"></i>' +
            '   </div>' +
            '   <img src="" />' +
            '</div>';
        return item;
    }

    $.fn.codefalseFile = function (options) {
        let _this = $(this);
        let codefalseId = 'codefalse-file-' + parseInt(Math.random() * 100000 + '');
        let defaults = {
            width: '200px',
            height: '200px',
            uploadType: 'normal'
        };
        let fileOptions = $.extend({}, defaults, options);

        //监控input选择文件
        _this.on('change', () => {
            let files = $(this)[0].files;
            console.log(files)
            for (let i = 0; i < files.length; i++){
                let file = files[i];
                // fileReader.readAsDataURL(file);
                let item = _createFileItem(fileOptions);
                let addDom = $('#'+codefalseId).find('.codefalse-file-add');
                addDom.before(item);
                //绑定modaal
                $('.codefalse-file-yulan').modaal({
                    type: 'image',
                    before_open: function (e) {
                        let url = window.URL.createObjectURL(file);
                        console.log('加载：'+url);
                        e.target.setAttribute('href', url);
                    },
                    before_close: function (e) {
                        let url = e.find('img').attr('src');
                        console.log('销毁：'+url);
                        window.URL.revokeObjectURL(url);
                    }
                });
                //监听文件块事件
                let fileDom = addDom.prev();
                //图片加载
                let img = fileDom.find('img');
                if (fileOptions.uploadType === 'normal') {
                    let url = window.URL.createObjectURL(file);
                    img.attr('src', url);
                    img.on('load', () => {
                        window.URL.revokeObjectURL(img.attr('src'));
                    });
                } else {
                    //其他类型
                }
                //图片删除
                fileDom.find('.codefalse-file-del').on('click', () => {
                    fileDom.remove();
                });
            }
        });

        let methods = {
            init: function () {
                console.log('start codefalse file......');
                //隐藏文件选择
                _this.attr("style", "display:none");
                //初始化文件选择组件
                _this.after(_initComponent(codefalseId, fileOptions))
                //监听添加事件
                $('.codefalse-file-add>i').on('click', () => {
                    _this.trigger('click');
                });
            }
        };
        methods.init();
    }
})(jQuery);
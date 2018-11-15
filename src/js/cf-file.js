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
            '      <i class="codefalse-file-del">删除</i>' +
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

        // let fileReader = new FileReader();
        // fileReader.onload = function(res){
        //     console.log(res)
        // };

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
                //监听文件块事件
                let fileDom = addDom.prev();
                //图片加载
                let img = fileDom.find('img');
                let url = window.URL.createObjectURL(file);
                img.attr('src', url);
                img.on('load', () => {
                    window.URL.revokeObjectURL(img.attr('src'));
                });
                //图片删除
                fileDom.find('.codefalse-file-del').on('click', () => {
                    fileDom.remove();
                });
                //图片预览
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
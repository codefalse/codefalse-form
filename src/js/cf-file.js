/**
 * Codefalse-Form module file.
 * use jquery 3.3.1
 */
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
            '      <i class="codefalse-file-yulan codefalse-font icon-yulan"></i>' +
            '   </div>' +
            '   <img src="" />' +
            '   <input type="hidden" name="'+options.name+'"/>' +
            '</div>';
        return item;
    }

    $.fn.codefalseFile = function (options, callback) {
        let _this = $(this);

        let defaults = {
            width: '200px',
            height: '200px',
            name: 'codefalseFile'
        };
        let fileOptions = $.extend({}, defaults, options);
        //生成唯一对应ID
        let codefalseId = 'codefalse-file-' + parseInt(Math.random() * 100000 + '');

        _this.on('change', () => {
            let files = $(this)[0].files;
            for (let i = 0; i < files.length; i++){
                let file = files[i];

                let item = _createFileItem(fileOptions);
                let addDom = $('#'+codefalseId).find('.codefalse-file-add');
                addDom.before(item);

                //绑定modaal
                $('.codefalse-file-yulan').modaal({type: 'image'});

                //监听文件块事件
                let fileDom = addDom.prev();
                //图片加载
                let img = fileDom.find('img');
                let yulan = fileDom.find('i.codefalse-file-yulan');
                let fileInput = fileDom.find('input');

                let fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = (e) => {
                    img.attr('src', e.target.result);
                    yulan.attr('href', e.target.result);
                    fileInput.val(e.target.result);
                };



                fileDom.on('mouseenter', () => {
                    let fileOperation = fileDom.find('.codefalse-file-operation');
                    fileOperation.show();
                });
                fileDom.on('mouseleave', () => {
                    let fileOperation = fileDom.find('.codefalse-file-operation');
                    fileOperation.hide();
                });
                //图片删除
                fileDom.find('.codefalse-file-del').on('click', function() {
                    let img = fileDom.find('img');
                    let src = img.src;
                    if (typeof(callback) === 'function') {
                        callback(src);
                    }
                    fileDom.remove();
                });
            }
        });

        let methods = {
            _init: function () {
                console.log('start codefalse file......');
                //隐藏文件选择
                _this.attr("style", "display:none");
                //初始化文件选择组件
                _this.after(_initComponent(codefalseId, fileOptions));
                //监听添加事件
                $('.codefalse-file-add>i').on('click', () => {
                    _this.trigger('click');
                });
            },
            adapter: function (images) {
                console.log(images)
            }
        };
        methods._init();
        return methods;
    }
})(jQuery);
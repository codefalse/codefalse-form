/**
 * Codefalse-Form module file.
 * use jquery 3.3.1
 */
(function ($) {

    function _initComponent(id, options) {
        let cf =
            '<div id="'+id+'" class="codefalse-file">' +
            '    <div class="codefalse-file-item file-add" style="height: '+options.height+';width: '+options.width+';">' +
            '        <i class="codefalse-font icon-add" style="line-height: '+options.height+';"></i>' +
            '    </div>' +
            '</div>'
        return cf;
    }

    function _createFileItem(options, codefalseId, src) {
        let item =
            '<div class="codefalse-file-item file-item" style="height: '+options.height+';width: '+options.width+';">' +
            '   <div class="codefalse-file-operation" style="width: '+options.width+';">'+
            '      <i class="codefalse-file-del codefalse-font icon-delete"></i>' +
            '      <i class="codefalse-file-yulan codefalse-font icon-yulan"></i>' +
            '   </div>' +
            '   <img type="'+options.type+'" src="'+src+'" />' +
            '   <input type="hidden" name="'+options.name+'" value="'+src+'"/>' +
            '</div>';
        let addDom = $('#'+codefalseId).find('.file-add');
        addDom.before(item);

        //绑定modaal
        addDom.prev().find('.codefalse-file-yulan').modaal({
            type: 'image',
            content_source: src
        });
    }

    $.fn.codefalseFile = function (options, callback) {
        let _this = $(this);

        let defaults = {
            width: '200px',
            height: '200px',
            name: 'codefalseAdd',
            deleteName: 'codefalseDelete'
        };
        let fileOptions = $.extend({}, defaults, options);

        //生成唯一对应ID
        let codefalseId = 'codefalse-file-' + parseInt(Math.random() * 100000 + '');

        _this.on('change', () => {
            let files = $(this)[0].files;
            for (let i = 0; i < files.length; i++){
                let file = files[i];
                //读取文件

                let fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = (e) => {
                    fileOptions.type = 'add';
                    _createFileItem(fileOptions, codefalseId, e.target.result);
                };
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
                $('.file-add>i').on('click', () => {
                    _this.trigger('click');
                });
                //监听文件项事件
                $('#'+codefalseId).on('mouseenter', '.file-item', function() {
                    let fileOperation = $(this).find('.codefalse-file-operation');
                    fileOperation.show();
                });
                $('#'+codefalseId).on('mouseleave', '.file-item', function() {
                    let fileOperation = $(this).find('.codefalse-file-operation');
                    fileOperation.hide();
                });
                //图片删除
                $('#'+codefalseId).on('click', '.codefalse-file-del', function() {
                    let fileDom = $(this).parent().parent();
                    let img = fileDom.find('img');
                    let src = img.attr('src');
                    let type = img.attr('type');
                    if (type === 'update'){
                        fileDom.parent().append('<input type="hidden" name="'+fileOptions.deleteName+'" value="'+src+'" />')
                        if (typeof(callback) === 'function') {
                            callback(src);
                        }
                    }

                    fileDom.remove();
                });
            },
            adapter: function (images) {
                if(typeof(images) === "object"){
                    let len = images.length;
                    if (len === undefined){
                        console.error('adapter params error.');
                        return;
                    }
                    fileOptions.type = 'update';
                    for (let i = 0; i < images.length; i++){
                        _createFileItem(fileOptions, codefalseId, images[i]);
                    }
                }

            }
        };
        methods._init();
        return methods;
    }
})(jQuery);
/**
 * Codefalse-Form module file.
 * use jquery 3.3.1
 */
(function ($) {

    function _validateOptions(self, options) {
        //过滤宽高
        if (typeof(options.width) === 'number') {
            options.width = options.width + 'px';
        }
        if (typeof(options.height) === 'number') {
            options.height = options.height + 'px';
        }
        //type => accept
        let accept = self.attr('accept');
        if (accept === undefined || accept === ''){
            if (options.type === 'image'){
                options.accept = 'image/*';
            }else if (options.type === 'video') {
                options.accept = 'video/*';
            }

            self.attr('accept', options.accept);
        }
    }

    function _initComponent(id, options) {
        let cf =
            '<div id="'+id+'" class="codefalse-file">' +
            '    <div class="codefalse-file-item file-add" style="height: '+options.height+';width: '+options.width+';">' +
            '        <i class="codefalse-font icon-add" style="line-height: '+options.height+';"></i>' +
            '    </div>' +
            '</div>'
        return cf;
    }

    function _createFileItem(codefalseId, src, status, options) {
        let typeItem = '';
        //image
        if (options.type === 'image') {
            typeItem = '<img status="'+status+'" src="'+src+'" />';
        }

        let item =
            '<div class="codefalse-file-item file-item" style="height: '+options.height+';width: '+options.width+';">' +
            '   <div class="codefalse-file-operation" style="width: '+options.width+';">'+
            '      <i class="codefalse-file-del codefalse-font icon-delete"></i>' +
            '      <i class="codefalse-file-yulan codefalse-font icon-yulan"></i>' +
            '   </div>' +
                typeItem +
            '   <input type="hidden" name="'+options.name+'" value="'+src+'"/>' +
            '</div>';
        let addDom = $('#'+codefalseId).find('.file-add');
        addDom.before(item);

        //绑定modaal => image
        if (options.type === 'image'){
            addDom.prev().find('.codefalse-file-yulan').modaal({
                type: 'image',
                content_source: src
            });
        }

    }

    $.fn.codefalseFile = function (options, callback) {
        let _this = $(this);

        let defaults = {
            show: true,
            type: 'image',
            accept: 'image/*',
            format: 'base64',
            max: 3,
            width: '200px',
            height: '200px',
            name: 'codefalseFile',
            deleteName: '',
        };
        let fileOptions = $.extend({}, defaults, options);
        _validateOptions(_this, fileOptions);

        //生成唯一对应ID
        let codefalseId = 'codefalse-file-' + parseInt(Math.random() * 100000 + '');

        _this.on('change', () => {
            let files = $(this)[0].files;
            for (let i = 0; i < files.length; i++){
                let file = files[i];
                //读取文件
                //default base64
                if (fileOptions.format === 'base64'){
                    let fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = (e) => {
                        _createFileItem(codefalseId, e.target.result, 'add', fileOptions);
                    };
                }

            }
        });

        let methods = {
            _init: function () {
                console.log('start codefalse file......');
                //隐藏文件选择
                _this.attr("style", "display:none");
                //初始化文件选择组件
                _this.after(_initComponent(codefalseId, fileOptions));
                if (!fileOptions.show){
                    this.hide();
                }
                //监听添加事件
                $('#'+codefalseId).find('.file-add>i').on('click', () => {
                    let fileSize = $('#'+codefalseId).find('.file-item').length;
                    if (fileSize >= fileOptions.max){
                        console.error("文件数量已经达到配置最大值");
                        return;
                    }
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
                    let status = img.attr('status');
                    if (status === 'update'){
                        if (fileOptions.deleteName !== ''){
                            let deleteInput = '<input type="hidden" name="'+fileOptions.deleteName+'" value="'+src+'" />';
                            fileDom.parent().append(deleteInput);
                        }
                        if (typeof(callback) === 'function') {
                            callback(src);
                        }
                    }

                    fileDom.remove();
                });
            },
            adapter: function (files, status) {
                if (status === undefined || status === '') {
                    status = 'update';
                }
                if (typeof(files) === 'string'){
                    _createFileItem(codefalseId, files, status, fileOptions);
                } else if(typeof(files) === "object"){
                    let len = files.length;
                    if (len === undefined){
                        throw ('parameters must be string|array');
                    }else if (len > fileOptions.max) {
                        len = fileOptions.max;
                        console.error('装载文件不能超过配置最大值');
                    }
                    for (let i = 0; i < len; i++){
                        _createFileItem(codefalseId, files[i], status, fileOptions);
                    }
                }
            },
            clear: function () {
                $('#'+codefalseId).find('.file-item').each(function () {
                    let img = $(this).find('img');
                    let src = img.attr('src');
                    let status = img.attr('status');
                    if (status === 'update'){
                        if (fileOptions.deleteName !== ''){
                            let deleteInput = '<input type="hidden" name="'+fileOptions.deleteName+'" value="'+src+'" />';
                            $(this).parent().append(deleteInput);
                        }
                        if (typeof(callback) === 'function') {
                            callback(src);
                        }
                    }
                    $(this).remove();
                });
            },
            show: function () {
                $('#'+codefalseId).show();
            },
            hide: function () {
                this.clear();
                $('#'+codefalseId).hide();
            }
        };
        methods._init();
        return methods;
    }
})(jQuery);
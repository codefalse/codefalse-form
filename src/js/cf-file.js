/**
 * Codefalse-Form module file.
 * use jquery 3.3.1
 */
(function ($) {

    function initComponent(codefalse) {
        let options = codefalse.options;
        let cf =
            '<div id="'+codefalse.id+'" class="codefalse-file">' +
            '    <div class="codefalse-file-item file-add" style="height: '+options.height+';width: '+options.width+';">' +
            '        <i class="codefalse-font icon-add" style="line-height: '+options.height+';"></i>' +
            '    </div>' +
            '</div>';
        return cf;
    }

    function initActions(fileOptions) {
        let actionItem = '<i class="codefalse-file-delete codefalse-font icon-delete"></i>';
        for (let i in fileOptions.actions){
            let action = fileOptions.actions[i];
            actionItem += '<i class="codefalse-file-'+action+' codefalse-font icon-'+action+'"></i>';
        }
        return actionItem;
    }

    function initViews(source, type, status) {
        let viewItem = '';
        switch (type) {
            case 'image':
                viewItem = '<img status="'+status+'" src="'+src+'" />';
                break;
            case 'video':
                viewItem = '<img status="'+status+'" src="'+src+'" />';
                break;
        }
        return viewItem;
    }

    function createFileItem(codefalseId, file, status, fileOptions) {
        let typeItem = '';

        //image
        if (options.type === 'image') {
            typeItem = '<img status="'+status+'" src="'+src+'" />';
        } else if (options.type === 'video'){
            typeItem = '<img status="'+status+'" src="'+src+'" />';
        }

        let item =
            '<div class="codefalse-file-item file-item" style="height: '+options.height+';width: '+options.width+';">' +
            '   <div class="codefalse-file-operation" style="width: '+options.width+';">'+
            '      <span class="codefalse-file-name">'+fileName+'</span> ' +
                initActions(options) +
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
        let codefalse = {};
        codefalse.$elem = $(this);
        //生成唯一对应ID
        let codefalseId = 'codefalse-file-' + parseInt(Math.random() * 100000 + '');
        codefalse.id = codefalseId;
        /**
         *  @type {{show: boolean, type: string, accept: string, format: string, max: number, width: string, height: string, name: string, deleteName: string, upload: upload}}
         *
         *  show: 是否显示，默认为true
         *  type: 选择文件类型，默认为image
         *  accept: 选择问价类型，默认image/*
         *  format: 文件格式，默认base64,(base64, Blob)
         *  max: 最大上传文件数量：默认3
         *  width: 组件宽度
         *  height: 组件高度
         *  name: 新增文件输入框名称<input name="name" />
         *  deleteName: 删除文件输入框名称<input name="deleteName" />
         */
        let defaults = {
            show: true,
            type: 'image',
            accept: '',
            format: 'base64',
            maxFiles: 3,
            width: '150px',
            height: '150px',
            name: 'codefalseFile',
            deleteName: '',
            actions: ['preview'],
            upload: function () {}
        };
        codefalse.options = $.extend({}, defaults, options);

        
        let fileArray = [];
        // _this.on('change', () => {
        //     let files = $(this)[0].files;
        //     for (let i = 0; i < files.length; i++){
        //         let file = files[i];
        //         fileArray.push(file);
        //         //读取文件
        //         //default base64
        //         if (fileOptions.format === 'base64'){
        //             let fileReader = new FileReader();
        //             fileReader.readAsDataURL(file);
        //             fileReader.onload = (e) => {
        //                 _createFileItem(codefalseId, file.name, e.target.result, 'add', fileOptions);
        //             };
        //         }else if (fileOptions.format === 'blob'){
        //             if (fileOptions.type === 'image'){
        //
        //             } else if (fileOptions.type === 'video'){
        //                 _createFileItem(codefalseId, file.name, '', 'add', fileOptions);
        //             }
        //         }
        //     }
        //     $(this).val("");
        // });

        let methods = {
            _init: function () {
                codefalse.$elem.hide();
                codefalse.$elem.on('change', function () {
                    let files = this.files;
                    for (let i in files){
                        if (!files.hasOwnProperty(i)) continue;
                        console.log(files[i])
                    }
                });

                console.log('init codefalse-file...');
                codefalse.$elem.after(initComponent(codefalse));
                codefalse.$container = $('#'+codefalse.id);
                //监听添加事件
                codefalse.$container.find('.file-add>i').on('click', () => {
                    let fileSize = $('#'+codefalseId).find('.file-item').length;
                    if (fileSize >= codefalse.options.maxFiles){
                        console.error("文件数量已经达到配置最大值");
                        return;
                    }
                    codefalse.$elem.trigger('click');
                });
                //监听文件项事件
                codefalse.$container.on('mouseenter', '.file-item', function() {
                    let fileOperation = $(this).find('.codefalse-file-operation');
                    fileOperation.show();
                });
                codefalse.$container.on('mouseleave', '.file-item', function() {
                    let fileOperation = $(this).find('.codefalse-file-operation');
                    fileOperation.hide();
                });
                //图片删除
                codefalse.$container.on('click', '.codefalse-file-delete', function() {
                    let fileDom = $(this).parent().parent();
                    let img = fileDom.find('img');
                    let src = img.attr('src');
                    let status = img.attr('status');
                    if (status === 'update'){
                        if (codefalse.options.deleteName !== ''){
                            let deleteInput = '<input type="hidden" name="'+codefalse.options.deleteName+'" value="'+src+'" />';
                            fileDom.parent().append(deleteInput);
                        }
                        if (typeof(callback) === 'function') {
                            callback(src);
                        }
                    }

                    fileDom.remove();
                });
                //文件上传
                codefalse.$container.on('click', '.codefalse-file-upload', function () {
                    let fileDom = $(this).parent().parent();
                    codefalse.options.upload(fileDom, fileArray);
                    fileArray = [];
                });
            },
            adapter: function (files, status) {
                if (status === undefined || status === '') {
                    status = 'update';
                }
                if (typeof(files) === 'string'){
                    _createFileItem(codefalseId, '', files, status, fileOptions);
                } else if(typeof(files) === "object"){
                    let len = files.length;
                    if (len === undefined){
                        throw ('parameters must be string|array');
                    }else if (len > fileOptions.max) {
                        len = fileOptions.max;
                        console.error('装载文件不能超过配置最大值');
                    }
                    for (let i = 0; i < len; i++){
                        _createFileItem(codefalseId, '', files[i], status, fileOptions);
                    }
                }
            },
            size: function () {
                let size = 0;
                $('#'+codefalseId).find('.file-item').each(function () {
                    let val = $(this).find('input').val();
                    if (val){
                        size++;
                    }
                });
                return size;
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
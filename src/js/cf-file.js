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
            '    <div class="codefalse-errors"></div> ' +
            '</div>';
        return cf;
    }

    function initActions(options) {
        let actionItem = '<i class="codefalse-file-delete codefalse-font icon-delete"></i>';
        for (let i in options.actions){
            let action = options.actions[i];
            actionItem += '<i class="codefalse-file-'+action+' codefalse-font icon-'+action+'"></i>';
        }
        return actionItem;
    }

    function initViews(source, options) {
        let viewItem = '';
        if (options.type === 'image'){
            viewItem = '<img src="'+source+'" />';
        }else if (options.type === 'video') {
            if (source){
                viewItem = '<img src="'+source+'" />';
            }else{
                viewItem = '<i class="codefalse-font icon-video" style="line-height: '+options.height+';"></i>';
            }

        }
        return viewItem;
    }

    function initItems(codefalse, fileName, base64File, base64Source, status) {
        let options = codefalse.options;
        let item =
            '<div class="codefalse-file-item file-item" status="'+status+'" style="height: '+options.height+';width: '+options.width+';">' +
            '   <div class="codefalse-file-operation" style="width: '+options.width+';">'+
            '      <span class="codefalse-file-name">'+fileName+'</span> ' +
            initActions(options) +
            '   </div>' +
            initViews(base64File, options) +
            '   <input type="hidden" name="'+options.name+'" value="'+base64Source+'"/>' +
            '</div>';

        let addDom = codefalse.$container.find('.file-add');
        addDom.before(item);
    }

    function initListener(codefalse, base64Source) {
        let type = codefalse.options.type;
        let lastItem = codefalse.$container.find('.file-item:last');
        let previewDom = lastItem.find('.codefalse-file-preview');
        if (previewDom) {
            if (type === 'image' || type === 'video'){
                previewDom.modaal({
                    type: type,
                    content_source: base64Source
                });
            }
        }

    }

    function createFileItem(codefalse, fileName, base64File, status) {
        let type = codefalse.options.type;
        if (type === 'image') {
            initItems(codefalse, fileName, base64File, base64File, status);
            initListener(codefalse, base64File);
        } else if (type === 'video'){
            if (codefalse.options.useCapture) {
                let video = document.createElement('video');
                video.onloadeddata = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    let base64Cover = canvas.toDataURL("image/png");
                    video = null;
                    canvas = null;
                    initItems(codefalse, fileName, base64Cover, base64File, status);
                    initListener(codefalse, base64File);
                };
                video.src = base64File;
            }else{
                initItems(codefalse, fileName, '', base64File, status);
                initListener(codefalse, base64File);
            }
        }
    }

    $.fn.codefalseFile = function (options) {
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
         *  accept: 选择问价类型，默认*
         *  maxFiles: 最大上传文件数量：默认3
         *  width: 组件宽度
         *  height: 组件高度
         *  name: 新增文件输入框名称<input name="name" />
         *  deleteName: 删除文件输入框名称<input name="deleteName" />
         *  actions: array,操作有preview, upload
         *  useCapture:是否截取视频文件一帧图片，只对type:video有用
         *  upload: function(fileItem, files),点击upload时回调
         */
        let defaults = {
            show: true,
            type: 'image',
            accept: '',
            maxFiles: 3,
            width: '150px',
            height: '150px',
            name: 'codefalseFile',
            deleteName: '',
            actions: [],
            useCapture: false,
            upload: function () {},
            setting: function () {}
        };
        codefalse.options = $.extend({}, defaults, options);

        let fileArray = [];
        let methods = {
            _init: function () {
                codefalse.$elem.hide();
                if (codefalse.options.accept) {
                    codefalse.$elem.attr('accept', codefalse.options.accept);
                }
                //监听文件变化
                codefalse.$elem.on('change', function () {
                    let files = this.files;
                    for (let i in files){
                        if (!files.hasOwnProperty(i)) continue;
                        let file = files[i];
                        //统计全部文件
                        fileArray.push(file);

                        //读取文件内容
                        let fileReader = new FileReader();
                        fileReader.onload = function (e) {
                            let base64File = e.target.result;
                            createFileItem(codefalse, file.name, base64File, 'add');
                        };
                        fileReader.readAsDataURL(file);
                    }
                    $(this).val("");
                });

                console.log('init codefalse-file...');
                codefalse.$elem.after(initComponent(codefalse));
                codefalse.$container = $('#'+codefalse.id);
                codefalse.$error = codefalse.$container.find('.codefalse-errors');

                if (!codefalse.options.show) {
                    codefalse.$container.hide();
                }

                //监听添加事件
                codefalse.$container.find('.file-add>i').on('click', () => {
                    let fileSize = $('#'+codefalseId).find('.file-item').length;
                    if (fileSize >= codefalse.options.maxFiles){
                        codefalse.$error.text('最多能添加'+codefalse.options.maxFiles+'个文件');
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
                //文件删除
                codefalse.$container.on('click', '.codefalse-file-delete', function() {
                    let fileItem = $(this).parent().parent();
                    let index = codefalse.$container.find('.file-item').index(fileItem);
                    methods.clear(index);
                });
                //文件上传
                codefalse.$container.on('click', '.codefalse-file-upload', function () {
                    let fileItem = $(this).parent().parent();
                    let index = codefalse.$container.find('.file-item').index(fileItem);
                    methods.upload(index);
                });
                //自定义操作
                codefalse.$container.on('click', '.codefalse-file-setting', function () {
                    codefalse.options.setting($(this).parent().parent());
                });
            },
            upload: function (index) {
                let fileItems = [];
                let files = [];
                if (index != undefined){
                    let fileItem = codefalse.$container.find('.file-item').eq(index);
                    let source = fileItem.find('input').val();
                    let a = source.split(',')[0];
                    let b1 = a.split(';')[1];
                    if (b1 !== undefined && b1 === 'base64') {
                        fileItems.push(fileItem);
                        files.push(fileArray[index]);
                        codefalse.options.upload(fileItems, files);
                    } else {
                        methods.error('此处没有要上传的文件');
                    }
                }else{
                    methods.error("暂时不支持多文件上传");
                    // codefalse.$container.find('.file-item').each(function (index) {
                    //     // let isRes = uploadArray[index];
                    //     // if (!isRes) {
                    //     //     fileItems.push($(this));
                    //     //     files.push(fileArray[index]);
                    //     // }
                    // });
                    // codefalse.options.upload(fileItems, files);
                }
            },
            error: function (err) {
                codefalse.$error.text(err);
            },
            adapter: function (files, status) {
                if (status === undefined) {
                    status = 'update';
                }
                if (typeof(files) === 'string'){
                    fileArray.push(files);
                    createFileItem(codefalse, '', files, status);
                } else if(typeof(files) === "object"){
                    let len = files.length;
                    if (len === undefined){
                        codefalse.$error.text('parameters must be string|array');
                    }else if (len > codefalse.options.maxFiles) {
                        files.splice(codefalse.options.maxFiles);
                        codefalse.$error.text('最多能添加'+codefalse.options.maxFiles+'个文件');
                    }
                    for (let i = 0; i < files.length; i++){
                        fileArray.push(files[i]);
                        createFileItem(codefalse, '', files[i], status);
                    }
                }
            },
            size: function () {
                return codefalse.$container.find('.file-item').length;
            },
            clear: function (index) {
                if (index != undefined) {
                    let fileItem = codefalse.$container.find('.file-item').eq(index);
                    let status = fileItem.attr('status');
                    let source = fileArray[index];
                    fileArray.splice(index, 1);
                    if (status === 'update' && codefalse.options.deleteName !== ''){
                        let deleteInput = '<input type="hidden" name="'+codefalse.options.deleteName+'" value="'+source+'" />';
                        codefalse.$container.append(deleteInput);
                    }
                    fileItem.remove();
                }else{
                    codefalse.$container.find('.file-item').each(function (index) {
                        let status = $(this).attr('status');
                        let source = fileArray[index];

                        if (status === 'update' && codefalse.options.deleteName !== ''){
                            let deleteInput = '<input type="hidden" name="'+codefalse.options.deleteName+'" value="'+source+'" />';
                            codefalse.$container.append(deleteInput);
                        }

                        $(this).remove();
                    });
                    fileArray = [];
                }
            },
            show: function () {
                codefalse.$container.show();
            },
            hide: function () {
                this.clear();
                codefalse.$container.hide();
            }
        };
        methods._init();
        return methods;
    }
})(jQuery);
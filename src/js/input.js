/**
 * ajax request data by input[type="text"]
 */
(function ($) {
    //private method
    function requestData(showId, options, params){
        let ajax = options.ajax;
        console.log(ajax.url + ': send ajax...');
        $.ajax({
            type: ajax.type,
            url: ajax.url,
            contentType: 'json',
            data: {
                codefalse: params
            },
            success: function (data) {
                adapter(showId, options, data);
            }
        });
    }

    function adapter(showId, options, data){
        $('#'+showId).find('.codefalse-input-options').show();
        let ul = $('#'+showId).find('.codefalse-input-options>ul');
        ul.empty();
        for (let n in data){
            let obj = data[n];
            let key = obj[options.key];
            let value = '';
            for (var i in options.value){
                let name = options.value[i];
                if(value != ''){
                    value += options.separator;
                }
                value += obj[name];
            }
            ul.append('<li value="'+key+'">'+value+'</li>');
        }
    }
    $.fn.codefalseInput = function (options, change) {
        console.log('codefalse input starting...');
        let _this = $(this);
        // default options
        let defaults = {
            placeholder: 'Please search...',
            key: 'id',
            value: ['name'],
            separator: '-',
            ajax: {
                type: 'GET',
                url: ''
            },
        };
        $.extend(defaults, options);

        let inputId = '';
        let methods = {
            init: function () {
                console.log('codefalse input init...');
                // hidden input
                _this.attr('type', 'hidden');
                // clone input
                let random = parseInt(Math.random() * 100000 + '');
                let searchId = 'codefalse-search' + random;
                let clazz = _this.attr('class');
                let searchInput = '<input id="'+searchId+'" type="text" class="'+clazz+'" placeholder="'+defaults.placeholder+'"/>';
                _this.after(searchInput);
                // add select option
                inputId = 'codefalse-input' + random;
                let selectOptionHtml = '<div id="'+inputId+'" class="codefalse-input">' +
                    '        <div class="codefalse-input-options">' +
                    '            <ul></ul>' +
                    '        </div>' +
                    '    </div>';
                $('#' + searchId).after(selectOptionHtml);
                //add event listener
                $('#'+searchId).on('input', function () {
                    //reset input
                    _this.val('');
                    //call change
                    if(change != undefined && typeof(change) == 'function'){
                        change($(this).val());
                    }
                    if(defaults.ajax.url != null && defaults.ajax.url != ''){
                        requestData(inputId, defaults, $(this).val());
                    }
                });
                let isHide = true;
                $('#'+ searchId).on('blur', function () {
                    if(isHide){
                        if(!_this.val()){
                            $(this).val('');
                        }
                        $('#'+inputId).find('.codefalse-input-options').hide();
                    }
                });
                $('#'+inputId + '>.codefalse-input-options').on('mouseenter', function () {
                    isHide = false;
                });
                $('#'+inputId + '>.codefalse-input-options').on('mouseleave', function () {
                    isHide = true;
                });
                $('#'+inputId + '>.codefalse-input-options>ul').on('click', 'li', function () {
                    let val = $(this).val();
                    let text = $(this).text();
                    _this.val(val);
                    $('#'+ searchId).val(text);
                    $('#'+inputId).find('.codefalse-input-options').hide();
                });
                return this;
            },
            adapter: function (data) {
                console.log('apapter update...');
                adapter(inputId, defaults, data);
                return this;
            },
        };

        methods.init();
        return methods;
    };
})(jQuery);
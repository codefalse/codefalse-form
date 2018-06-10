/**
 * ajax request data by input[type="text"]
 */
(function ($) {
    //private method
    function requestData(showId, ajax, params){
        console.log(ajax.url + ': send ajax...');
        $.ajax({
            type: ajax.type,
            url: ajax.url,
            contentType: 'json',
            data: {
                codefalse: params
            },
            success: function (data) {
                adapter(showId, data);
            }
        });
    }

    function adapter(showId, data){
        $('#'+showId).find('.codefalse-input-options').show();
        let ul = $('#'+showId).find('.codefalse-input-options>ul');
        ul.empty();
        for (let n in data){
            let obj = data[n];
            ul.append('<li value="'+obj.userId+'">'+obj.username+'</li>');
        }
    }
    $.fn.codefalseInput = function (options, change) {
        console.log('codefalse input starting...');
        let _this = $(this);
        // default options
        let defaults = {
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
                let searchInput = '<input id="'+searchId+'" type="text" class="'+clazz+'"/>';
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
                    //call change
                    if(change != undefined && typeof(change) == 'function'){
                        change($(this).val());
                    }
                    if(defaults.ajax.url != null && defaults.ajax.url != ''){
                        requestData(inputId, defaults.ajax, $(this).val());
                    }
                });
                let isHide = true;
                $('#'+ searchId).on('blur', function () {
                    if(isHide){
                        $(this).val('');
                        $('#'+inputId).find('.codefalse-input-options').hide();
                    }
                });
                $('#'+inputId + '>.codefalse-input-options').on('mouseenter', function () {
                    isHide = false;
                });
                $('#'+inputId + '>.codefalse-input-options').on('mouseleave', function (event) {
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
                console.log('apapter data:' + data);
                adapter(inputId, data);
                return this;
            },
        };

        methods.init();
        return methods;
    };
})(jQuery);
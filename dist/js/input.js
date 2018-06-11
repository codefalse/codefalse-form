"use strict";!function(c){function p(e,n,a){c("#"+e).find(".codefalse-input-options").show();var t=c("#"+e).find(".codefalse-input-options>ul");for(var o in t.empty(),a){var i=a[o],l=i[n.key],s="";for(var u in n.value){var r=n.value[u];""!=s&&(s+=n.separator),s+=i[r]}t.append('<li value="'+l+'">'+s+"</li>")}}c.fn.codefalseInput=function(e,l){console.log("codefalse input starting...");var s=c(this),u={placeholder:"Please search...",key:"id",value:["name"],separator:"-",ajax:{type:"GET",url:""}};c.extend(u,e);var r="",n={init:function(){console.log("codefalse input init..."),s.attr("type","hidden");var e=parseInt(1e5*Math.random()+""),a="codefalse-search"+e,n=s.attr("class"),t='<input id="'+a+'" type="text" class="'+n+'" placeholder="'+u.placeholder+'"/>';s.after(t);var o='<div id="'+(r="codefalse-input"+e)+'" class="codefalse-input">        <div class="codefalse-input-options">            <ul></ul>        </div>    </div>';c("#"+a).after(o),c("#"+a).on("input",function(){var n,a,e,t;s.val(""),null!=l&&"function"==typeof l&&l(c(this).val()),null!=u.ajax.url&&""!=u.ajax.url&&(n=r,a=u,e=c(this).val(),t=a.ajax,console.log(t.url+": send ajax..."),c.ajax({type:t.type,url:t.url,contentType:"json",data:{codefalse:e},success:function(e){p(n,a,e)}}))});var i=!0;return c("#"+a).on("blur",function(){i&&(c(this).val(""),c("#"+r).find(".codefalse-input-options").hide())}),c("#"+r+">.codefalse-input-options").on("mouseenter",function(){i=!1}),c("#"+r+">.codefalse-input-options").on("mouseleave",function(e){i=!0}),c("#"+r+">.codefalse-input-options>ul").on("click","li",function(){var e=c(this).val(),n=c(this).text();s.val(e),c("#"+a).val(n),c("#"+r).find(".codefalse-input-options").hide()}),this},adapter:function(e){return console.log("apapter update..."),p(r,u,e),this}};return n.init(),n}}(jQuery);n input
                _this.attr('type', 'hidden');
                // clone input
                var random = parseInt(Math.random() * 100000 + '');
                var searchId = 'codefalse-search' + random;
                var clazz = _this.attr('class');
                var searchInput = '<input id="' + searchId + '" type="text" class="' + clazz + '" placeholder="' + defaults.placeholder + '"/>';
                _this.after(searchInput);
                // add select option
                inputId = 'codefalse-input' + random;
                var selectOptionHtml = '<div id="' + inputId + '" class="codefalse-input">' + '        <div class="codefalse-input-options">' + '            <ul></ul>' + '        </div>' + '    </div>';
                $('#' + searchId).after(selectOptionHtml);
                //add event listener
                $('#' + searchId).on('input', function () {
                    //reset input
                    _this.val('');
                    //call change
                    if (change != undefined && typeof change == 'function') {
                        change($(this).val());
                    }
                    if (defaults.ajax.url != null && defaults.ajax.url != '') {
                        requestData(inputId, defaults, $(this).val());
                    }
                });
                var isHide = true;
                $('#' + searchId).on('blur', function () {
                    if (isHide) {
                        $(this).val('');
                        $('#' + inputId).find('.codefalse-input-options').hide();
                    }
                });
                $('#' + inputId + '>.codefalse-input-options').on('mouseenter', function () {
                    isHide = false;
                });
                $('#' + inputId + '>.codefalse-input-options').on('mouseleave', function (event) {
                    isHide = true;
                });
                $('#' + inputId + '>.codefalse-input-options>ul').on('click', 'li', function () {
                    var val = $(this).val();
                    var text = $(this).text();
                    _this.val(val);
                    $('#' + searchId).val(text);
                    $('#' + inputId).find('.codefalse-input-options').hide();
                });
                return this;
            },
            adapter: function adapter(data) {
                console.log('apapter update...');
                _adapter(inputId, defaults, data);
                return this;
            }
        };

        methods.init();
        return methods;
    };
})(jQuery);
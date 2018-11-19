"use strict";

/**
 * ajax request data by input[type="text"]
 */
(function ($) {
  //private method
  function requestData(showId, options, params) {
    var ajax = options.ajax;
    console.log(ajax.url + ': send ajax...');
    $.ajax({
      type: ajax.type,
      url: ajax.url,
      contentType: 'json',
      data: {
        codefalse: params
      },
      success: function success(data) {
        _adapter(showId, options, data);
      }
    });
  }

  function _adapter(showId, options, data) {
    if (data.length > 0) {
      $('#' + showId).find('.codefalse-input-options').show();
      var ul = $('#' + showId).find('.codefalse-input-options>ul');

      for (var n in data) {
        var obj = data[n];
        var key = obj[options.key];
        var value = '';

        for (var i in options.value) {
          var name = options.value[i];

          if (value != '') {
            value += options.separator;
          }

          value += obj[name];
        }

        ul.append('<li value="' + key + '">' + value + '</li>');
      }
    }
  }

  function clearOptions(inputId) {
    $('#' + inputId + '>.codefalse-input-options').hide().find('ul').empty();
  }

  $.fn.codefalseInput = function (options, change) {
    console.log('codefalse input starting...');

    var _this = $(this); // default options


    var defaults = {
      placeholder: 'Please search...',
      key: 'id',
      value: ['name'],
      separator: '-',
      delay: 200,
      ajax: {
        type: 'GET',
        url: ''
      },
      allowInputText: false,
      searchName: ''
    };
    $.extend(defaults, options);
    var inputId = '';
    var searchId = '';
    var methods = {
      init: function init() {
        console.log('codefalse input init...'); // hidden input

        _this.attr('type', 'hidden'); // clone input


        var random = parseInt(Math.random() * 100000 + '');
        searchId = 'codefalse-search' + random;

        var clazz = _this.attr('class');

        var searchInput = '<input id="' + searchId + '" name="' + defaults.searchName + '" type="text" class="' + clazz + '" placeholder="' + defaults.placeholder + '" autocomplete="off"/>';

        _this.after(searchInput); // add select option


        inputId = 'codefalse-input' + random;
        var selectOptionHtml = '<div id="' + inputId + '" class="codefalse-input">' + '        <div class="codefalse-input-options">' + '            <ul></ul>' + '        </div>' + '    </div>';
        $('#' + searchId).after(selectOptionHtml); //add event listener

        $('#' + searchId).on('input', function () {
          //reset input
          _this.val('');

          clearOptions(inputId);
          var self = $(this);
          var txt1 = self.val();
          setTimeout(function () {
            var txt2 = self.val();

            if (txt2 == '') {
              console.log('++++++++');
              return;
            }

            if (txt1 == txt2) {
              clearTimeout(); //call change

              if (change != undefined && typeof change == 'function') {
                change(txt2);
              }

              if (defaults.ajax.url != null && defaults.ajax.url != '') {
                requestData(inputId, defaults, txt2);
              }
            }
          }, defaults.delay);
        });
        var isHide = true;
        $('#' + searchId).on('blur', function () {
          if (isHide) {
            if (!_this.val() && !defaults.allowInputText) {
              $(this).val('');
            }

            $('#' + inputId).find('.codefalse-input-options').hide();
          }
        });
        $('#' + inputId + '>.codefalse-input-options').on('mouseenter', function () {
          isHide = false;
        });
        $('#' + inputId + '>.codefalse-input-options').on('mouseleave', function () {
          isHide = true;
        });
        $('#' + inputId + '>.codefalse-input-options>ul').on('click', 'li', function () {
          var val = $(this).val();
          var text = $(this).text();

          _this.val(val);

          $('#' + searchId).val(text);
          $('#' + inputId).find('.codefalse-input-options').hide();
        }); //enter keydown

        $('#' + searchId).on('keypress', function (event) {
          if (event.keyCode == 13) {
            $('#' + inputId + '>.codefalse-input-options>ul').find('li:first').trigger('click');
          }
        });
        return this;
      },
      adapter: function adapter(data) {
        console.log('apapter update...');

        _adapter(inputId, defaults, data);

        return this;
      },
      reset: function reset(key, value) {
        console.log('reset codefalse...');

        _this.val(key);

        $('#' + searchId).val(value);
        return this;
      },
      show: function show() {
        $('#' + searchId).show();
        return this;
      },
      hide: function hide() {
        $('#' + searchId).hide();
        $('#' + searchId).val(''); //reset input

        _this.val('');

        clearOptions(inputId);
        return this;
      }
    };
    methods.init();
    return methods;
  };
})(jQuery);

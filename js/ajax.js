~function () {
    function ajax(option) {
        //->init parameters
        var _default = {
            url: null,
            method: 'GET',
            dataType: 'JSON',
            data: null,
            async: true,
            cache: true,
            success: null,//->success callback
            error: null//->error callback
        };
        for (var key in option) {
            if (option.hasOwnProperty(key)) {
                if (key === 'type') {
                    _default['method'] = option['type'];
                    continue;
                }
                _default[key] = option[key];
            }
        }

        //->data && cache
        var regGET = /^(GET|DELETE|HEAD)$/i,
            mark = null;

        if (_default.data) {
            //->If it is an object, we convert it to a string
            if (typeof _default.data === 'object') {
                var str = '';
                for (var attr in _default.data) {
                    if (_default.data.hasOwnProperty(attr)) {
                        str += attr + '=' + _default.data[attr] + '&';
                    }
                }
                _default.data = str.substring(0, str.length - 1);
            }
            if (regGET.test(_default.method)) {
                mark = checkMark(_default.url);
                _default.url += mark + _default.data;
                _default.data = null;
            }
        }

        if (regGET.test(_default.method) && _default.cache === false) {
            mark = checkMark(_default.url);
            _default.url += mark + '_=' + Math.random();
        }

        //->send ajax
        var xhr = new XMLHttpRequest;
        xhr.open(_default.method, _default.url, _default.async);
        xhr.onreadystatechange = function () {
            if (/^(2|3)\d{2}$/.test(xhr.status)) {
                if (xhr.readyState === 4) {
                    var result = xhr.responseText;
                    switch (_default.dataType.toUpperCase()) {
                        case 'JSON':
                            result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                            break;
                        case 'XML':
                            result = xhr.responseXML;
                            break;
                    }
                    _default.success && _default.success.call(xhr, result);
                }
                return;
            }
            _default.error && _default.error.call(xhr, xhr.status, xhr.statusText);
        };
        xhr.send(_default.data);
    }

    //->check whether the question mark contains
    function checkMark(url) {
        return url.indexOf('?') === -1 ? '?' : '&';
    }

    window.ajax = ajax;
}();
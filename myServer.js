var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;//->存储的是客户端问号传递的参数值{xxx:xxx...}

    /*
     * 静态资源文件的请求处理(HTML/CSS/JS/PNG...)
     */
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var conFile = null,
            status = 200;
        try {
            conFile = fs.readFileSync('.' + pathname);
        } catch (e) {
            conFile = 'not found~';
            status = 404;
        }
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }
        res.writeHead(status, {'content-type': suffixMIME});
        res.end(conFile);

        return;
    }

    /*
     * 处理API文档中的数据接口
     * - getAllList
     * - addInfo
     * - updateInfo
     * - getInfo
     * - removeInfo
     */
    var resultTemplate = {code: 1, msg: 'ERROR', data: null},
        path = './json/custom.json',
        customList = JSON.parse(fs.readFileSync(path));//->数组对象,全部的客户信息


    //->getAllList:获取所有的客户信息
    if (pathname === '/getAllList') {
        if (customList.length > 0) {
            resultTemplate = {
                code: 0,
                msg: 'SUCCESS',
                data: customList
            };
        }
        res.writeHead(200, {'content-type': 'application/json'});//->指定返回的是JSON格式的数据(字符串)
        res.end(JSON.stringify(resultTemplate));//->服务器端返回给客户端的是JSON字符串
        return;
    }

    //->getInfo:通过指定的ID获取用户信息
    if (pathname === '/getInfo') {
        //->接收客户端传递的ID(QUERY这里面存储着呢=>客户端用的是GET请求,GET请求就是通过问号传递参数传过来的)
        var customId = query['id'];

        //->循环所有的客户信息找到和传递的ID相同的那一项
        customList.forEach(function (item, index) {
            if (item['id'] == customId) {
                resultTemplate = {
                    code: 0,
                    msg: 'SUCCESS',
                    data: item
                };
            }
        });

        //->返回
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify(resultTemplate));
        return;
    }

    //->removeInfo:删除指定客户
    if (pathname === '/removeInfo') {
        customId = query['id'];
        customList.forEach(function (item, index) {
            if (item['id'] == customId) {
                customList.splice(index, 1);
                //->这是仅仅是在数组中把内容删除了,但是存储数据的文件中还没有删除,我们还需要把文件中的也删除掉
                fs.writeFileSync(path, JSON.stringify(customList));//->把最新的数据转换为字符串写入到文件中(覆盖式写入)
                resultTemplate = {
                    code: 0,
                    msg: 'SUCCESS'
                };
            }
        });
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify(resultTemplate));
        return;
    }

    //->addInfo：增加客户信息
    if (pathname === '/addInfo') {
        //->获取客户端通过请求主体(POST)传递给服务器的内容:name=xxx
        var pass = '';
        req.on('data', function (chunk) {//->正在一点点接收传递的内容,chunk就是每一次接收到的一点点的内容
            pass += chunk;
        });
        req.on('end', function () {//->接收完了
            //pass -> 'name=xxx' -> {name:xxx}
            pass = pass.myQueryURLParameter();

            //->我们还需要给传递的内容多增加一个ID：用当前最大的ID+1，如果当前一项都没有，我们新增加项的ID为1即可
            var maxId = customList.length === 0 ? 0 : parseFloat(customList[customList.length - 1]['id']);
            pass['id'] = maxId + 1;

            //->把最新的信息插入到数组和文件中的末尾(增加成功)
            customList.push(pass);
            fs.writeFileSync(path, JSON.stringify(customList));

            //->返回结果
            resultTemplate = {
                code: 0,
                msg: 'SUCCESS'
            };
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(JSON.stringify(resultTemplate));
        });
        return;
    }

    //->updateInfo:修改客户信息
    if (pathname === '/updateInfo') {
        pass = '';
        req.on('data', function (chunk) {
            pass += chunk;
        });
        req.on('end', function () {
            //pass -> 'id=1&name=xxx' -> {id:1,name:xxx}
            pass = pass.myQueryURLParameter();
            customList.forEach(function (item, index) {
                if (item['id'] == pass['id']) {
                    customList[index] = pass;
                    fs.writeFileSync(path, JSON.stringify(customList));
                    resultTemplate = {
                        code: 0,
                        msg: 'SUCCESS'
                    };
                }
            });
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(JSON.stringify(resultTemplate));
        });
        return;
    }

    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('bad url~');//->我们也可以在404的时候返回一个指定公益页面中的源代码
});
String.prototype.myQueryURLParameter = function () {
    var reg = /([^?&=#]+)=([^?&=#]+)/g;
    var obj = {};
    this.replace(reg, function () {
        obj[arguments[1]] = arguments[2]
    });
    return obj;
};
server.listen(9090, function () {
    console.log('hello world 9090!');
});
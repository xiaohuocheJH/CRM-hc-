var but = document.getElementById('submit'),
    userName = document.getElementById('userName');

/*
 * 1、获取URL地址栏问号后面传递的参数值ID
 * -> myQueryURLParameter
 * -> 执行这个方法获取我们的参数值
 * -> 如果值存在的话，我们需要通过ID获取到当前的客户信息，然后把用户名放在文本框中
 */
String.prototype.myQueryURLParameter = function () {
    var reg = /([^?&=#]+)=([^?&=#]+)/g;
    var obj = {};
    this.replace(reg, function () {
        obj[arguments[1]] = arguments[2]
    });
    return obj;
};
var urlObj = window.location.href.myQueryURLParameter(),
    customId = urlObj["id"];
if (typeof customId !== "undefined") {//->修改
    ajax({
        url: "/getInfo",
        method: "GET",
        dataType: 'JSON',
        cache: false,
        data: {
            id: customId
        },
        success: function (result) {
            if (result && result.code == 0) {
                userName.value = result["data"]["name"];
            }
        }
    });
}


/*
 * 2、增加客户信息
 * -> 给提交按钮绑定点击事件(获取到这个按钮)
 * -> 在点击提交的时候获取文本框中的内容(获取到这个文本框)
 * -> 向服务器发送AJAX请求，接收返回的结果，给予用户相关提示;成功的话跳转回到首页面;
 *
 * 当前操作还有可能是修改的操作,如果是修改的操作调取的是修改的接口
 */
but.onclick = function () {
    var val = userName.value;

    //->UPDATE
    if (typeof customId !== 'undefined') {
        ajax({
            url: '/updateInfo',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id: customId,
                name: val
            },
            success: function (result) {
                if (result && result.code == 0) {
                    alert('修改成功，思密达');
                    window.location.href = 'index.html';
                } else {
                    alert('修改失败，思密达');
                }
            }
        });
        return;
    }

    //->ADD
    ajax({
        url: '/addInfo',
        type: 'post',
        dataType: 'json',
        data: {
            name: val
        },
        success: function (result) {
            if (result && result.code == 0) {
                alert('添加成功');
                window.location.href = 'index.html';
            } else {
                alert('添加失败');
            }
        }
    });
};

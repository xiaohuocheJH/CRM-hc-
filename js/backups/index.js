/*
 * 1、通过API文档中提供的接口,获取所有的客户信息,然后把信息展示在页面中(ES6中的模板字符串)
 * -> 发送AJAX请求获取数据(需要使用我们自己的AJAX库或者JQ的AJAX库)
 * -> 在请求成功后,做数据绑定：循环获取的数据,使用模板字符串做字符串拼接即可
 */
var content = document.getElementById('content');
ajax({
    url: '/getAllList',
    method: 'GET',
    dataType: 'JSON',
    cache: false,
    success: function (result) {
        if (result && result.code == 0) {
            result = result['data'];

            var str = ``;
            for (var i = 0, len = result.length; i < len; i++) {
                var cur = result[i];
                str += `<li>
                    <span>${cur.id}</span>
                    <span>${cur.name}</span>
                    <span>
                        <a href="detail.html?id=${cur.id}">修改</a>
                        <a href="javascript:;" data-id="${cur.id}">删除</a>
                    </span>
                </li>`;
            }
            content.innerHTML = str;
        }
    }
});

/*
 * 2、删除某一个客户的信息
 * -> 给CONTENT下所有的删除按钮绑定点击事件(事件委托):通过事件源判断如果点击的是删除的这个A标签,那么执行删除的操作
 * -> 为了防止误操作,我们需要在删除的时候提示一个“确定要删除编号为 [ xxx ] 的信息吗?”，用户点击的是确定我们才继续往下执行
 * -> 向服务器发送一个AJAX请求，告诉服务器我们要删除谁
 * -> 接收服务器返回的结果，提示给用户删除的结果，如果删除成功的话，需要在当前的CONTENT区域中把这个LI移除
 */
content.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement;
    if (tar.tagName.toUpperCase() === 'A' && tar.innerHTML === '删除') {
        var customId = tar.getAttribute('data-id'),
            flag = confirm('确定要删除编码为 [ ' + customId + ' ] 的信息吗');
        if (flag === false) return;
        ajax({
            url: '/removeInfo',
            method: 'GET',
            dataType: 'JSON',
            cache: false,
            data: {
                id: customId
            },
            success: function (result) {
                if (result && result.code == 0) {
                    alert('删除成功，思密达');
                    content.removeChild(tar.parentNode.parentNode);
                } else {
                    alert('删除失败，思密达');
                }
            }
        });
    }
};
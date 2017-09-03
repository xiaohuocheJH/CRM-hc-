/*
 * 设计模式
 *  -> 单例模式：具体的业务逻辑编写我们最好使用单例模式
 *  -> 构造原型模式：面向对象编程思想，jQuery、Iscroll、Zepto、Swiper、React、Vue、Angular...这些都是基于面向对象编程思想开发出来 =>经常应用于组件、类库、插件、框架的封装
 *
 *  面向对象：
 *    类的继承、封装、多态(重载和重写)，以及通过类来创建不同的实例，实例可以调取类原型上的方法
 *
 * ==>应对特殊的场景的
 *  -> 发布订阅模式：当前一件事情触发的时候,我们需要按照顺序执行很多的事情,此时我们可以使用发布订阅模式整体调控
 *  -> promise模式：AJAX串行，但是我们还希望使用的异步编程，此时用promise整体调控
 */
var indexRender = (function () {
    var content = document.getElementById('content');

    //->bindHTML:绑定数据
    function bindHTML(result) {
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

    //->bindEvent:绑定事件实现删除
    function bindEvent() {
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
        }
    }

    return {
        init: function () {
            //->把init这个方法作为单例模式的入口：在入口中我们统一进行协调管理,控制哪一部分先执行,那一部分后执行... =>"命令模式"
            ajax({
                url: '/getAllList',
                method: 'GET',
                dataType: 'JSON',
                cache: false,
                success: function (result) {
                    if (result && result.code == 0) {
                        result = result['data'];

                        bindHTML(result);

                        bindEvent();
                    }
                }
            });
        }
    }
})();
indexRender.init();



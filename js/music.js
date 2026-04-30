// pjax适配
function whenDOMReady() {
    // pjax加载完成（切换页面）后需要执行的函数和代码
    console.log("pjax开启");
    musicState();
}

// 音乐状态检测（已添加事件监听器，修复点击aplayer后导航栏和控制中心不同步的问题）
function musicState() {
    const music_state = document.querySelector("meting-js").aplayer.audio.paused;
    if (music_state) {
        document.querySelector("#music-Switch i").classList.remove("fa-pause");
        document.querySelector("#music-Switch i").classList.add("fa-play");
        document.querySelector("#console #music-ctrl-btn-center i").classList.remove("fa-pause");
        document.querySelector("#console #music-ctrl-btn-center i").classList.add("fa-play");
    } else {
        document.querySelector("#music-Switch i").classList.remove("fa-play");
        document.querySelector("#music-Switch i").classList.add("fa-pause");
        document.querySelector("#console #music-ctrl-btn-center i").classList.remove("fa-play");
        document.querySelector("#console #music-ctrl-btn-center i").classList.add("fa-pause");
    }
}

function secToTime(s) {
    if (isNaN(s)) s = 0;
    var min = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    var t = min.toString().padStart(2, '0') + ":" + sec.toString().padStart(2, '0');
    return t;
}

var ctrl = {

    // 显示中控台
    showConsole: function () {
        document.querySelector("#console-music-item-main").classList.add("item-show");
        document.querySelector("#console").classList.add("show");
        ctrl.initConsoleState();
    },

    // 隐藏中控台
    hideConsole: function () {
        var items = document.querySelectorAll(".item-show");
        for(var i=0; i<items.length; i++) items[i].classList.remove("item-show");
        document.querySelector("#console").classList.remove("show");
    },

    // 菜单返回
    consoleBackBtn: function () {
        var top_item = document.querySelector(".item-show");
        switch (top_item.id) {
            case 'console-music-item-mini': break;
            case 'console-music-item-main': ctrl.hideConsole(); break;
            case 'console-music-item-list':
                top_item.classList.remove("item-show");
                document.getElementById("console-music-item-main").classList.add("item-show");
                break;
            case 'console-songsheet-item-list':
                top_item.classList.remove("item-show");
                document.getElementById("console-music-item-list").classList.add("item-show");
                break;
            case 'console-music-item-lrc':
                top_item.classList.remove("item-show");
                document.getElementById("console-music-item-main").classList.add("item-show");
                break;
            default: console.log("异常情况");
        }
    },

    // 桌面歌词
    ircShowHide: function () {
        const irc = document.querySelector(".aplayer > .aplayer-lrc-hide"); //这里防止与音乐页面的控制冲突
        if (irc === null) {
            document.querySelector(".aplayer > .aplayer-lrc").classList.add("aplayer-lrc-hide");
            document.querySelector("#ircItem").classList.remove("on");
        } else {
            document.querySelector(".aplayer > .aplayer-lrc").classList.remove("aplayer-lrc-hide");
            document.querySelector("#ircItem").classList.add("on");
        }
    },

    // 导航栏音乐
    musicSwitch: function () {
        const music_state = document.querySelector("meting-js").aplayer.audio.paused;
        if (music_state) {
            document.querySelector("#music-Switch i").classList.remove("fa-play");
            document.querySelector("#music-Switch i").classList.add("fa-pause");
            document.querySelector("#music-ctrl-btn-center i").classList.remove("fa-play");
            document.querySelector("#music-ctrl-btn-center i").classList.add("fa-pause");
        } else {
            document.querySelector("#music-Switch i").classList.remove("fa-pause");
            document.querySelector("#music-Switch i").classList.add("fa-play");
            document.querySelector("#music-ctrl-btn-center i").classList.remove("fa-pause");
            document.querySelector("#music-ctrl-btn-center i").classList.add("fa-play");
        }
        document.querySelector("meting-js").aplayer.toggle();
    },

    musicForward: function () {
        document.querySelector("meting-js").aplayer.skipForward();
        ctrl.getMusicInfo();
    },

    musicBackward: function () {
        document.querySelector("meting-js").aplayer.skipBack();
        ctrl.getMusicInfo();
    },

    getMusicInfo: function () {
        var music_id = document.querySelector("meting-js").aplayer.list.index; //当前曲目的id
        var music_cover = document.querySelector("meting-js").aplayer.list.audios[music_id].cover;
        var music_author = document.querySelector("meting-js").aplayer.list.audios[music_id].author;
        var music_title = document.querySelector("meting-js").aplayer.list.audios[music_id].title;
        document.getElementById("console-music-cover").innerHTML = "<img src='" + music_cover + "' style='width:100%;height:100%;border-radius:0.5rem;'>";// 歌曲信息
        document.getElementById("console-music-title").innerHTML = music_title;
        document.getElementById("console-music-author").innerHTML = music_author;
    },

    // 音乐进度更新
    refreshProgress: function () {
        var nowTime = document.querySelector("meting-js").aplayer.audio.currentTime;// 当前时间
        if (isNaN(nowTime)) nowTime = 0;
        var nowTimeString = secToTime(nowTime);
        var allTime = document.querySelector("meting-js").aplayer.audio.duration;// 总时间
        if (isNaN(allTime)) allTime = 0; //无歌曲时会返回NaN
        var allTimeString = secToTime(allTime);
        document.getElementById("progress-low-btn").innerHTML = nowTimeString;// 进度条时间
        document.getElementById("progress-high-btn").innerHTML = allTimeString;
        document.querySelector("#p_bar").style.width = document.querySelector("#p_bar_bg").offsetWidth * (nowTime / allTime) + "px";// 进度条进度
    },

    // 导入歌单
    importMusicList: function() {
        var audios = document.querySelector("meting-js").aplayer.list.audios;
        var list_html;
        for (var i = 0; i < audios.length; i++) {
            list_html = document.getElementById("console-music-list").innerHTML;
            document.getElementById("console-music-list").innerHTML = list_html + "<li class='music-list-item'><div class='list-music-info1'><a class='list-music-id' data-pjax-state=''>" + (i + 1) + "</a><a class='list-music-state' data-pjax-state=''><i class='iconfont icon-waveform'></i></a></div><div class='list-music-info2'><a class='list-music-title' data-pjax-state=''>" + audios[i].title + "</a><a class='list-music-author' data-pjax-state=''> - " + audios[i].author + "</a></div></li>";
            // console.log("第" + (i + 1) + "首导入成功！");
        }
    },

    // 歌单切换
    changeMusicList: function(Music_id, Music_server) {
        var ap = document.querySelector("meting-js").aplayer;
        var music_list_url_str = "https://metingjs.gavin-chen.top/api?server=" + Music_server + "&type=playlist" + "&id=" + Music_id;
        ap.list.clear();
        fetch(music_list_url_str).then(response => response.json()).then(data => {
            // 在这里使用返回的JSON数据
            newSongsheetLen = data.length;
            console.log(newSongsheetLen);
            ap.list.add(data);
        })
        .catch(error => console.error(error));
    },

    //初始化console图标
    initConsoleState: function () {
        const irc = document.querySelector(".aplayer > .aplayer-lrc-hide");
        const aplayer = document.querySelector(".aplayer > .aplayer-lrc");
        irc === null && aplayer != null
            ? document.querySelector("#ircItem").classList.add("on")
            : document.querySelector("#ircItem").classList.remove("on");
        saveToLocal.get('aside-status') === 'hide'
            ? document.querySelector("#asideItem").classList.add("on")
            : document.querySelector("#asideItem").classList.remove("on");
        var console_musicBody = document.querySelector("#console .console-music-ctrl-item"); // 更新控制中心尺寸
        var console_musicCover = document.getElementById("console-music-cover");
        console_musicCover.style.height = console_musicCover.offsetWidth + "px";
        console_musicBody.style.height = (console_musicCover.offsetWidth + 236) + "px"; //(12rem + 1.3rem + 1.3rem) * 16 = 233.6px
        ctrl.getMusicInfo();
        var nowVolume = document.querySelector("meting-js").aplayer.audio.volume;// 当前音量
        document.querySelector("#v_bar").style.width = document.querySelector("#v_bar_bg").offsetWidth * nowVolume + "px";// 音量条进度
    }

}

// 主页/音乐列表/歌单列表 切换
var music_list_switch = document.getElementById("music-ctrl-btn-end");
var music_list_title = document.getElementById("music-list-title");
music_list_switch.addEventListener("click", function (e) {
    document.getElementById("console-music-item-main").classList.remove("item-show");
    document.getElementById("console-music-item-list").classList.add("item-show");
});
music_list_title.addEventListener("click", function (e) {
    document.getElementById("console-music-item-list").classList.remove("item-show");
    document.getElementById("console-songsheet-item-list").classList.add("item-show");
});

// 歌单列表监听器
var songsheet0 = document.getElementById("songsheet-X");
var songsheet1 = document.getElementById("songsheet-A");
var songsheet2 = document.getElementById("songsheet-B");
var songsheet3 = document.getElementById("songsheet-C");
songsheet0.addEventListener("click", function (e) {
    document.getElementById("console-loading-icon").classList.add("show");
    console.log("正在切换至默认专辑");
    global_music_flag = 1;
    ctrl.changeMusicList("8086610771","netease");
    document.getElementById("music-list-title").innerHTML = "网易云";
});
songsheet1.addEventListener("click", function (e) {
    document.getElementById("console-loading-icon").classList.add("show");
    console.log("正在切换至纯音乐专辑");
    global_music_flag = 1;
    ctrl.changeMusicList("651630118","netease");
    document.getElementById("music-list-title").innerHTML = "纯音乐";
});
songsheet2.addEventListener("click", function (e) {
    document.getElementById("console-loading-icon").classList.add("show");
    console.log("正在切换至古风专辑");
    global_music_flag = 1;
    ctrl.changeMusicList("5296755943","netease");
    document.getElementById("music-list-title").innerHTML = "古风";
});
songsheet3.addEventListener("click", function (e) {
    document.getElementById("console-loading-icon").classList.add("show");
    console.log("正在切换至镜子Vlog专辑");
    global_music_flag = 1;
    ctrl.changeMusicList("4932756913","netease");
    document.getElementById("music-list-title").innerHTML = "镜子Vlog";
});

// 音乐列表监听器
var console_music_list = document.getElementById("console-music-list");
var music_id = null;
console_music_list.addEventListener('click', function (e) {
    var ap = document.querySelector("meting-js").aplayer
    if (e.target && e.target.nodeName.toUpperCase() == "LI") {
        music_id = parseInt(e.target.querySelector(".list-music-id").innerHTML);
        ap.list.switch(music_id - 1);
        ap.play();
        ctrl.getMusicInfo();
    } else if (e.target && e.target.nodeName.toUpperCase() == "DIV") {
        music_id = parseInt(e.target.parentElement.querySelector(".list-music-id").innerHTML);
        ap.list.switch(music_id - 1);
        ap.play();
        ctrl.getMusicInfo();
    } else if (e.target && (e.target.nodeName.toUpperCase() == "A" || e.target.nodeName.toUpperCase() == "I")) {
        music_id = parseInt(e.target.parentElement.parentElement.querySelector(".list-music-id").innerHTML);
        ap.list.switch(music_id - 1);
        ap.play();
        ctrl.getMusicInfo();
    } else alert("ERROR!")
}, false);

// 音量条监听器
var music_volumebar = document.getElementById("music-volumebar"); //扩大热区
var v_bar_bg = document.getElementById("v_bar_bg");
var v_bar = document.getElementById("v_bar");
var v_low = document.getElementById("volume-low-btn");
var v_high = document.getElementById("volume-high-btn");
var v_bar_bg_Len = v_bar_bg.offsetWidth; // 获取进度条总长Width

// 按键按下
music_volumebar.addEventListener("mousedown", function (e) { //添加监听事件
    v_bar_bg.style.height = "0.6rem";
    v_bar.style.backgroundColor = "var(--anzhiyu-reverse)";
    v_low.style.color = "var(--anzhiyu-reverse)";
    v_high.style.color = "var(--anzhiyu-reverse)";
    let x = e.pageX; // 获取按下时鼠标初始位置 // pageX是绝对位置 offsetX是相对位置
    v_bar.style.width = (0 + e.offsetX) + "px"; // 按下时重新设置进度条
    let v_bar_Len = v_bar.offsetWidth; // 获取进度条的初始Width
    v_bar_bg_Len = v_bar_bg.offsetWidth;
    let newVolume = e.offsetX / v_bar_bg_Len;
    document.querySelector("meting-js").aplayer.volume(newVolume, true); // 更改音量
    document.onmousemove = function (e) { // 拖动需要写到down里面
        let diff = x - e.pageX; // 获取移动的距离
        let v_bar_Len_New = v_bar_Len - diff; // 计算当前进度条的Width
        if (v_bar_Len_New < 0) { // 当超出进度条范围，控制
            v_bar_Len_New = 0;
        } else if (v_bar_Len_New > v_bar_bg_Len) {
            v_bar_Len_New = v_bar_bg_Len;
        }
        v_bar.style.width = v_bar_Len_New + "px"; // 更改进度条Width
        newVolume = v_bar_Len_New / v_bar_bg_Len;
        document.querySelector("meting-js").aplayer.volume(newVolume, true); // 更改音量
    }
});

// 触摸按下
music_volumebar.addEventListener("touchstart", function (e) { //添加监听事件
    v_bar_bg.style.height = "0.6rem";
    v_bar.style.backgroundColor = "var(--anzhiyu-reverse)";
    v_low.style.color = "var(--anzhiyu-reverse)";
    v_high.style.color = "var(--anzhiyu-reverse)";
    let x = e.targetTouches[0].pageX; // 获取按下时鼠标初始位置 // pageX是绝对位置 offsetX是相对位置
    v_bar.style.width = (0 + e.targetTouches[0].offsetX) + "px"; // 按下时重新设置进度条
    let v_bar_Len = v_bar.offsetWidth; // 获取进度条的初始Width
    v_bar_bg_Len = v_bar_bg.offsetWidth;
    let newVolume = e.targetTouches[0].offsetX / v_bar_bg_Len;
    document.querySelector("meting-js").aplayer.volume(newVolume, true); // 更改音量
    document.ontouchmove = function (e) { // 拖动需要写到down里面
        let diff = x - e.targetTouches[0].pageX; // 获取移动的距离
        let v_bar_Len_New = v_bar_Len - diff; // 计算当前进度条的Width
        if (v_bar_Len_New < 0) { // 当超出进度条范围，控制
            v_bar_Len_New = 0;
        } else if (v_bar_Len_New > v_bar_bg_Len) {
            v_bar_Len_New = v_bar_bg_Len;
        }
        v_bar.style.width = v_bar_Len_New + "px"; // 更改进度条Width
        newVolume = v_bar_Len_New / v_bar_bg_Len;
        document.querySelector("meting-js").aplayer.volume(newVolume, true); // 更改音量
    }
});

// 进度条监听器
var music_progressbar = document.getElementById("music-progressbar"); //扩大热区
var p_bar_bg = document.getElementById("p_bar_bg");
var p_bar = document.getElementById("p_bar");
var p_low = document.getElementById("progress-low-btn");
var p_high = document.getElementById("progress-high-btn");
var p_bar_Len_New = 0;
var p_bar_bg_Len = p_bar_bg.offsetWidth; // 获取进度条总长Width
var ctrl_flag = 1;
var mousemove_flag = 1;

// 按键按下
music_progressbar.addEventListener("mousedown", function (e) { //添加监听事件
    p_bar_bg.style.height = "0.6rem";
    p_bar.style.backgroundColor = "var(--anzhiyu-reverse)";
    p_low.style.color = "var(--anzhiyu-reverse)";
    p_high.style.color = "var(--anzhiyu-reverse)";
    ctrl_flag = 0;
    global_music_flag = 1;
    let x = e.pageX; // 获取按下时鼠标初始位置 // pageX是绝对位置 offsetX是相对位置
    let p_bar_Len = p_bar.offsetWidth; // 获取进度条的初始Width
    p_bar_bg_Len = p_bar_bg.offsetWidth; // 获取进度条总长Width，不知道为什么，第一次获取的值不对，这里还得再更新一次
    document.onmousemove = function (e) { // 拖动需要写到down里面
        let diff = x - e.pageX; // 获取移动的距离
        mousemove_flag = 0;
        p_bar_Len_New = p_bar_Len - diff; // 计算当前进度条的Width
        if (p_bar_Len_New < 0) { // 当超出进度条范围，控制
            p_bar_Len_New = 0;
        } else if (p_bar_Len_New > p_bar_bg_Len) {
            p_bar_Len_New = p_bar_bg_Len;
        }
        p_bar.style.width = p_bar_Len_New + "px"; // 更改进度条Width
        let all_Time = document.querySelector("meting-js").aplayer.audio.duration;
        let current_time = (p_bar_Len_New / p_bar_bg_Len) * all_Time;
        document.getElementById("progress-low-btn").innerHTML = secToTime(current_time);
    }
});

// 触摸按下
music_progressbar.addEventListener("touchstart", function (e) { //添加监听事件
    p_bar_bg.style.height = "0.6rem";
    p_bar.style.backgroundColor = "var(--anzhiyu-reverse)";
    p_low.style.color = "var(--anzhiyu-reverse)";
    p_high.style.color = "var(--anzhiyu-reverse)";
    ctrl_flag = 0;
    global_music_flag = 1;
    let x = e.targetTouches[0].pageX; // 获取按下时鼠标初始位置 // pageX是绝对位置 offsetX是相对位置
    let p_bar_Len = p_bar.offsetWidth; // 获取进度条的初始Width
    p_bar_bg_Len = p_bar_bg.offsetWidth; // 获取进度条总长Width，不知道为什么，第一次获取的值不对，这里还得再更新一次
    document.ontouchmove = function (e) { // 拖动需要写到down里面
        let diff = x - e.targetTouches[0].pageX; // 获取移动的距离
        mousemove_flag = 0;
        p_bar_Len_New = p_bar_Len - diff; // 计算当前进度条的Width
        if (p_bar_Len_New < 0) { // 当超出进度条范围，控制
            p_bar_Len_New = 0;
        } else if (p_bar_Len_New > p_bar_bg_Len) {
            p_bar_Len_New = p_bar_bg_Len;
        }
        p_bar.style.width = p_bar_Len_New + "px"; // 更改进度条Width
        let all_Time = document.querySelector("meting-js").aplayer.audio.duration;
        let current_time = (p_bar_Len_New / p_bar_bg_Len) * all_Time;
        document.getElementById("progress-low-btn").innerHTML = secToTime(current_time);
    }
});

// 按键抬起
document.onmouseup = function () { //当鼠标弹起的时候，不做任何操作
    v_bar_bg.style.height = "0.4rem";
    v_bar.style.backgroundColor = "var(--font-color)";
    v_low.style.color = "var(--font-color)";
    v_high.style.color = "var(--font-color)";
    p_bar_bg.style.height = "0.4rem";
    p_bar.style.backgroundColor = "var(--font-color)";
    p_low.style.color = "var(--font-color)";
    p_high.style.color = "var(--font-color)";
    if (ctrl_flag == 0 && mousemove_flag == 0) {
        let all_Time = document.querySelector("meting-js").aplayer.audio.duration;
        let new_Time = (p_bar_Len_New / p_bar_bg_Len) * all_Time;
        document.querySelector("meting-js").aplayer.seek(new_Time); //更改进度
    }
    global_music_flag = 0;
    ctrl_flag = 1;
    mousemove_flag = 1;
    document.onmousemove = null;
};

// 触摸抬起
document.ontouchend = function () {
    v_bar_bg.style.height = "0.4rem";
    v_bar.style.backgroundColor = "var(--font-color)";
    v_low.style.color = "var(--font-color)";
    v_high.style.color = "var(--font-color)";
    p_bar_bg.style.height = "0.4rem";
    p_bar.style.backgroundColor = "var(--font-color)";
    p_low.style.color = "var(--font-color)";
    p_high.style.color = "var(--font-color)";
    if (ctrl_flag == 0 && mousemove_flag == 0) {
        let all_Time = document.querySelector("meting-js").aplayer.audio.duration;
        let new_Time = (p_bar_Len_New / p_bar_bg_Len) * all_Time;
        document.querySelector("meting-js").aplayer.seek(new_Time); //更改进度
    }
    global_music_flag = 0;
    ctrl_flag = 1;
    mousemove_flag = 1;
    document.ontouchmove = null;
};

// runtime
var global_music_flag = 0;
var meting_load = 1;
var listener = 0;
var old_music_id = null;
var now_music_id = null;
var newSongsheetLen = 0;
var t_load;

// 设置重复执行函数，周期100ms
setInterval(() => {
    if (document.querySelector("meting-js").aplayer != undefined) meting_load = 0;
    if (meting_load == 0 && listener == 0) {
        // 监测aplayer加载完开始注入音乐列表
        ctrl.importMusicList();
        // 音乐开始与暂停监听
        var ap = document.querySelector("meting-js").aplayer;
        ap.on('play', function () {
            ctrl.getMusicInfo();
            document.querySelector("#music-Switch i").classList.remove("fa-play");// 更新播放/暂停键
            document.querySelector("#music-Switch i").classList.add("fa-pause");
            document.querySelector("#music-ctrl-btn-center i").classList.remove("fa-play");
            document.querySelector("#music-ctrl-btn-center i").classList.add("fa-pause");
            old_music_id = now_music_id;// 更新列表标志
            now_music_id = ap.list.index;
            var ids = document.querySelectorAll("#console-music-list .list-music-id");
            var states = document.querySelectorAll("#console-music-list .list-music-state");
            for (var i = 0; i < ids.length; i++) {
                if (parseInt(ids[i].innerHTML) == now_music_id + 1) {
                    if (old_music_id != null) {
                        ids[old_music_id].classList.remove("hide");
                        states[old_music_id].classList.remove("show");
                        ids[old_music_id].parentElement.parentElement.style.backgroundColor = "";
                    }
                    ids[now_music_id].classList.add("hide");
                    states[now_music_id].classList.add("show");
                    ids[now_music_id].parentElement.parentElement.style.backgroundColor = "var(--vercel-hover-bg)";
                }
            }
        });
        ap.on('pause', function () {
            document.querySelector("#music-Switch i").classList.remove("fa-pause");
            document.querySelector("#music-Switch i").classList.add("fa-play");
            document.querySelector("#music-ctrl-btn-center i").classList.remove("fa-pause");
            document.querySelector("#music-ctrl-btn-center i").classList.add("fa-play");
        });
        // 播放模式按钮监听（循环 / 随机）
        var play_mode = document.getElementById("music-ctrl-btn-first");
        var ap_play_mode = document.querySelector(".aplayer-icon.aplayer-icon-order");
        var loop_str = '<path d="M0.622 18.334h19.54v7.55l11.052-9.412-11.052-9.413v7.549h-19.54v3.725z"></path>';
        var random_str = '<path d="M22.667 4l7 6-7 6 7 6-7 6v-4h-3.653l-3.76-3.76 2.827-2.827 2.587 2.587h2v-8h-2l-12 12h-6v-4h4.347l12-12h3.653v-4zM2.667 8h6l3.76 3.76-2.827 2.827-2.587-2.587h-4.347v-4z"></path>';
        play_mode.addEventListener("click", function (e) {
            var ap_play_mode_str = document.querySelector(".aplayer-icon.aplayer-icon-order svg path").outerHTML;
            if (ap_play_mode_str == loop_str) {
                play_mode.querySelector("i").classList.remove("fa-repeat");
                play_mode.querySelector("i").classList.add("fa-shuffle");
                ap_play_mode.click();
            } else if (ap_play_mode_str == random_str) {
                play_mode.querySelector("i").classList.remove("fa-shuffle");
                play_mode.querySelector("i").classList.add("fa-repeat");
                ap_play_mode.click();
            } else alert("程序错误，请刷新！");
        });
        ap_play_mode.addEventListener("click", function (e) {
            var ap_play_mode_str = ap_play_mode.querySelector("svg path").outerHTML;
            if (ap_play_mode_str == loop_str) {
                play_mode.querySelector("i").classList.remove("fa-shuffle");
                play_mode.querySelector("i").classList.add("fa-repeat");
                console.log("进入顺序播放模式");
            } else if (ap_play_mode_str == random_str) {
                play_mode.querySelector("i").classList.remove("fa-repeat");
                play_mode.querySelector("i").classList.add("fa-shuffle");
                console.log("进入随机播放模式");
            } else alert("程序错误，请刷新！");
        });
        // 歌单切换监听
        ap.on("listclear", function(){
            document.getElementById("console-music-list").innerHTML = "";
        });
        ap.on("listadd", function(){
            var current_len = ap.list.audios.length;
            t_load = setInterval(() => {
                current_len = ap.list.audios.length;
                if (current_len < newSongsheetLen) {
                    console.log("current_len: " + current_len);
                } else {
                    console.log("开始导入")
                    ctrl.importMusicList();
                    global_music_flag = 1;
                    console.log("导入完毕")
                    clearInterval(t_load);
                    document.getElementById("console-loading-icon").classList.remove("show");
                    ctrl.consoleBackBtn();
                }
            }, 50);
        });
        listener = 1;
    };
    //音乐进度更新
    if (meting_load == 0 && global_music_flag == 0) ctrl.refreshProgress();
}, 100);

whenDOMReady(); // 打开网站先执行一次
document.addEventListener("pjax:complete", whenDOMReady); // pjax加载完成（切换页面）后再执行一次
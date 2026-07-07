(function () {

    if (window.musicBallInit) {
        return;
    }

    window.musicBallInit = true;


    // 创建悬浮球
    const ball = document.createElement("div");

    ball.id = "music-ball";
    ball.innerHTML = "🎵";


    document.body.appendChild(ball);



    // 创建播放器
    const audio = document.createElement("audio");

    audio.id = "music-audio";

    document.body.appendChild(audio);



    let songs = [];
    let current = 0;



    // 点击播放暂停
    ball.onclick = function () {

        if (audio.paused) {

            audio.play();

            ball.classList.add("playing");

        } else {

            audio.pause();

            ball.classList.remove("playing");

        }

    };



    // 加载歌单

    fetch("/music/music.json")

    .then(res => res.json())

    .then(data => {


        songs = data;


        if (songs.length > 0) {

            audio.src = songs[0].url;

        }


        console.log(
            "音乐加载成功:",
            songs
        );


    })

    .catch(err=>{

        console.error(
            "音乐列表读取失败",
            err
        );

    });



})();
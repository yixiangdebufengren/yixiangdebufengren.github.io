(function () {

    if (window.musicBallInit) return;
    window.musicBallInit = true;


    let songs = [];
    let current = 0;


    const audio = document.createElement("audio");
    document.body.appendChild(audio);



    const ball = document.createElement("div");

    ball.id = "music-ball";
    ball.innerHTML = "🎵";

    document.body.appendChild(ball);



    const panel = document.createElement("div");

    panel.id = "music-panel";

    panel.innerHTML = `
        <div class="music-header">
            🎵 我的歌单
        </div>
        <div id="music-list">
        </div>
    `;

    document.body.appendChild(panel);



    // 读取歌单

    fetch("/music/music.json")
    .then(res=>res.json())
    .then(data=>{


        songs=data;


        const list =
        document.querySelector("#music-list");


        songs.forEach((song,index)=>{


            let item =
            document.createElement("div");


            item.className="music-item";


            item.innerHTML =
            song.title;


            item.onclick=function(){


                play(index);


            };


            list.appendChild(item);


        });


    });




    function play(index){


        current=index;


        audio.src=
        songs[index].url;


        audio.play();


        ball.classList.add("playing");


    }




    audio.onpause=function(){

        ball.classList.remove("playing");

    };


    audio.onended=function(){

        play(
            (current+1)%songs.length
        );

    };



    /*
       点击球：
       展开歌单
    */

    ball.onclick=function(e){


        if(ball.dataset.dragging==="true"){
            return;
        }


        panel.classList.toggle("show");


    };



    /*
       拖动
    */


    let startX;
    let startY;

    let startLeft;
    let startTop;



    ball.addEventListener(
        "touchstart",
        function(e){


            let touch=e.touches[0];


            startX=touch.clientX;
            startY=touch.clientY;


            startLeft=ball.offsetLeft;
            startTop=ball.offsetTop;


            ball.dataset.dragging="false";


        }
    );




    ball.addEventListener(
        "touchmove",
        function(e){


            let touch=e.touches[0];


            let moveX=
            touch.clientX-startX;


            let moveY=
            touch.clientY-startY;



            if(
                Math.abs(moveX)>5 ||
                Math.abs(moveY)>5
            ){

                ball.dataset.dragging="true";

            }



            let x=
            startLeft+moveX;


            let y=
            startTop+moveY;



            x=Math.max(
                0,
                Math.min(
                    window.innerWidth-55,
                    x
                )
            );


            y=Math.max(
                0,
                Math.min(
                    window.innerHeight-55,
                    y
                )
            );



            ball.style.left=x+"px";
            ball.style.top=y+"px";

            ball.style.right="auto";
            ball.style.bottom="auto";



        }
    );



})();
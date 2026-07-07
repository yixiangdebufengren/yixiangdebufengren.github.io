// 防止 PJAX 重复加载播放器
if (window.musicPlayerLoaded) {
    return;
}

window.musicPlayerLoaded = true;

(async()=>{


let songs=[];

let index=
localStorage.musicIndex||0;


const data=
await fetch('/music/music.json')
.then(r=>r.json());


songs=data;



let audio=document.createElement("audio");

audio.id="music-audio";

audio.src=
songs[index].url;


document.body.appendChild(audio);



let ball=document.createElement("div");

ball.id="music-ball";

ball.innerHTML="🎵";


document.body.appendChild(ball);



let panel=document.createElement("div");

panel.id="music-panel";


panel.innerHTML=`

<div id="music-title">
音乐
</div>

<div id="music-list"></div>

<div id="music-lyric">
</div>

`;

document.body.appendChild(panel);



let list=
document.querySelector("#music-list");


songs.forEach((s,i)=>{


let div=
document.createElement("div");


div.className="music-item";


div.innerHTML=
`
${s.title}
<br>
<small>${s.artist}</small>
`;


div.onclick=()=>{

play(i);

};


list.appendChild(div);


});




function play(i){


index=i;


audio.src=
songs[i].url;


audio.play();


localStorage.musicIndex=i;


ball.classList.add("playing");


}




ball.onclick=(e)=>{


if(
Math.abs(
ball.dataset.move
)<5
){

if(audio.paused){

audio.play();

ball.classList.add("playing");


}else{


audio.pause();

ball.classList.remove("playing");


}


}


};





audio.onended=()=>{


play(
(index+1)%songs.length
);


};






/*
拖动
*/

let startX,startY;

let oldX,oldY;


ball.addEventListener(
"touchstart",
e=>{


let t=e.touches[0];


startX=t.clientX;
startY=t.clientY;


oldX=
ball.offsetLeft;

oldY=
ball.offsetTop;


ball.dataset.move=0;


});



ball.addEventListener(
"touchmove",
e=>{


let t=e.touches[0];


let x=
oldX+t.clientX-startX;


let y=
oldY+t.clientY-startY;



x=Math.max(
0,
Math.min(
window.innerWidth-55,
x
));


y=Math.max(
0,
Math.min(
window.innerHeight-55,
y
));



ball.style.left=x+"px";

ball.style.top=y+"px";


ball.style.right="auto";

ball.style.bottom="auto";



ball.dataset.move=
Math.abs(
t.clientX-startX
)
+
Math.abs(
t.clientY-startY
);


});






/*
点击球展开歌单
长按/二次点击可以扩展歌词
*/

let clickTime=0;


ball.addEventListener(
"dblclick",
()=>{

panel.classList.toggle("show");

});





/*
恢复播放位置
*/

let oldSong=
localStorage.musicIndex;


let oldTime=
localStorage.musicTime;


if(oldSong){

audio.src=
songs[oldSong].url;

}



audio.onloadedmetadata=()=>{

if(oldTime){

audio.currentTime=
oldTime;

}

};



setInterval(()=>{

localStorage.musicTime=
audio.currentTime||0;


},3000);



})();
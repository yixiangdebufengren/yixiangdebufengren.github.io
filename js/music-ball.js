(function(){


if(window.musicBallV2)
return;


window.musicBallV2=true;



let songs=[];

let index=0;

let dragging=false;



const audio=document.createElement("audio");

document.body.appendChild(audio);





const ball=document.createElement("div");

ball.id="music-ball";


ball.innerHTML=
`
<div class="music-disc"></div>
`;


document.body.appendChild(ball);





const panel=document.createElement("div");


panel.id="music-panel";


panel.innerHTML=
`
<div class="music-title">
🎧 我的歌单
</div>

<div id="music-list"></div>

`;


document.body.appendChild(panel);




const disc=
ball.querySelector(".music-disc");





fetch("/music/music.json")

.then(r=>r.json())

.then(data=>{


songs=data;


render();


if(
localStorage.musicIndex
){

index=
Number(localStorage.musicIndex);

}



loadSong(index,false);



});





function render(){


let list=
document.querySelector("#music-list");


songs.forEach((s,i)=>{


let item=
document.createElement("div");


item.className="music-item";


item.innerText=s.title;



item.onclick=function(){


play(i);


};



list.appendChild(item);


});


}




function loadSong(i,autoplay){


index=i;


audio.src=
songs[i].url;


localStorage.musicIndex=i;



if(autoplay)

audio.play();



}




function play(i){


loadSong(i,true);


disc.classList.add("playing");


updateActive();


}





function updateActive(){


document
.querySelectorAll(".music-item")
.forEach(
(e,i)=>{


e.classList.toggle(
"active",
i===index
);


});


}




ball.onclick=function(){


if(dragging)
return;



if(audio.paused){


audio.play();


disc.classList.add("playing");


}else{


audio.pause();


disc.classList.remove("playing");


}



};





audio.onended=function(){


play(
(index+1)%songs.length
);


};



audio.onpause=function(){

disc.classList.remove("playing");

};



/*
拖动
*/


let sx,sy;

let ox,oy;


ball.addEventListener(
"pointerdown",
e=>{


dragging=false;


sx=e.clientX;

sy=e.clientY;


const rect=
ball.getBoundingClientRect();


ox=rect.left;

oy=rect.top;



ball.setPointerCapture(
e.pointerId
);


});





ball.addEventListener(
"pointermove",
e=>{


let dx=
e.clientX-sx;


let dy=
e.clientY-sy;


if(
Math.abs(dx)>5 ||
Math.abs(dy)>5
){

dragging=true;


ball.style.transform=
`
translate(
${dx}px,
${dy}px
)
`;

}


});





ball.addEventListener(
"pointerup",
e=>{


if(!dragging)
return;



const rect=
ball.getBoundingClientRect();


let x=rect.left;

let y=rect.top;



if(
x <
window.innerWidth/2
)

x=10;

else

x=
window.innerWidth-70;



ball.style.transform="";


ball.style.left=x+"px";

ball.style.top=y+"px";


ball.style.right="auto";

ball.style.bottom="auto";



localStorage.musicPosition=
JSON.stringify({
x:x,
y:y
});



});





/*
恢复位置
*/


let pos=
localStorage.musicPosition;


if(pos){


pos=JSON.parse(pos);


ball.style.left=
pos.x+"px";


ball.style.top=
pos.y+"px";


ball.style.right="auto";

ball.style.bottom="auto";


}



})();
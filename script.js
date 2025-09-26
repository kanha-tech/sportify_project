console.log('lets write javascript'); 
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
  currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
   let as = div.getElementsByTagName("a")
    songs = []
   for (let index = 0; index < as.length; index++) {
const element = as[index];
if (element.href.endsWith(".mp3")){
    songs.push(element.href.split(`/${folder}/`)[1])
}
   }

   
 // show all the songs in the playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
for (const song of songs ) {
songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src ="music.svg" alt="">
    <div class="info">
      <div> ${song.replaceAll("%20$", " ")}</div>
    </div>
    <div class="playnow">
      <span>play Now</span>
    <img class="invert" src="play.svg" alt="">
    </div></li>`;
}
// Attach an event listener to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click", element=>{
PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

})
   })
   return songs
}

const PlayMusic = (track, pause=false) => {
  currentSong.src = `/${currFolder}/` + track
  if(!pause){
  currentSong.play()
  play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
  
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    Array.from(anchors).forEach(async e=>{
      if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-2)[0]
        //get the metadata of the folder
          let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
    let response = await a.json();
    console.log(response)
   
      }
    })
  
}
 async function main() {
  //get the list of all the song
  await getSongs("songs/ncs")
 PlayMusic(songs[0], true)

 // display all the Albums on the page
 displayAlbums()

// Attach an event listener to, next and previous
play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src = "pause.svg"
    }
    else{
      currentSong.pause()
      play.src = "play.svg"
    }
})


// Listen for timeupdate event
currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration)* percent)/100
})

//Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
document.querySelector(".left").style.left = "0"
})
//Add an event listener for close button
document.querySelector(".close").addEventListener("click", ()=>{
document.querySelector(".left").style.left = "-120%"
})

//Add an event listener to previous
previous.addEventListener("click", ()=>{
console.log("Previous clicked")
console.log(currentSong)
let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
if((index+1) >= 0){
PlayMusic(songs[index-1])
}
})

//Add an event listener to next
next.addEventListener("click", ()=>{
console.log("Next clicked")

let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
if((index+1) < songs.length){
PlayMusic(songs[index+1])
}
})
//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
console.log("setting volume to", e.target.value, "/100")
currentSong.volume = parseInt(e.target.value)/100
})

//load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click", async item=>{
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
   PlayMusic(songs[0])
  })
}) 
//add event listener to mute the track 
document.querySelector(".volume>img").addEventListener("click", e=>{
  if(e.target.src.includes("volume.svg")){
    e.target.src = e.target.src.replace("volume.svg", "mute.svg")
currentSong.volume = 0;
document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
    currentSong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
})

}

main()
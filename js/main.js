let audio=document.querySelector(".quranplayer");
let surahsContainer=document.querySelector(".surahs");
let ayah=document.querySelector(".ayah");
let next=document.querySelector(".next");
let prev=document.querySelector(".prev");
let play=document.querySelector(".play");
getSurahs()

 
function getSurahs(){
    // fetch surahs data
    fetch('https://api.quran.gading.dev/surah')
    .then(response=>response.json())
    .then(data=>{
        for (let surah in data.data){
            surahsContainer.innerHTML+=
            `
            <div>
            <p>${data.data[surah].name.long}</p>
            <p>${data.data[surah].name.transliteration.en}</p>
            </div>
            `
        }

        // select all surahs
        let allSurahs=document.querySelectorAll(".surahs div");
        let ayahsAudio;
        let ayahsText;
        allSurahs.forEach((surah,index)=>{
            surah.addEventListener("click",()=>{
                fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
                .then(response=>response.json())
                .then(data=>{
                    let verses= data.data.verses;
                    ayahsText=[];
                    ayahsAudio=[];
                    verses.forEach((verse)=>{
                        ayahsAudio.push(verse.audio.primary);
                        ayahsText.push(verse.text.arab);
                    })
                    let AyahIndex=0;
                    changeAyah(AyahIndex);
                    audio.addEventListener('ended',()=>{
                        AyahIndex++;
                        if (AyahIndex < ayahsAudio.length){
                            changeAyah(AyahIndex);
                        }else{
                            AyahIndex=0;
                            changeAyah(AyahIndex);
                            audio.pause();
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Surah has been ended',
                                showConfirmButton: false,
                                timer: 1500
                              })
                              isPlaying=true;
                              togglePlay();
                            
                        }

                    })

                    //Handle Next and Prev
                    next.addEventListener('click',()=>{
                        AyahIndex < ayahsAudio.length -1 ? AyahIndex++ : AyahIndex=0;
                        changeAyah(AyahIndex);
                    })

                    prev.addEventListener('click',()=>{
                        AyahIndex === 0? AyahIndex=ayahsAudio.length -1 : AyahIndex--;
                        changeAyah(AyahIndex);
                    })

                    //Handle play and Pause audio
                    let isPlaying = false;
                    togglePlay();
                    function togglePlay(){
                        if(isPlaying){
                            audio.pause();
                            play.innerHTML=`<i class="fas fa-play"> </i>`;
                            isPlaying=false;
                        }else{
                            audio.play();
                            play.innerHTML=`<i class="fas fa-pause"> </i>`;
                            isPlaying=true;

                        }
                    }

                    play.addEventListener('click',togglePlay)
                    
                    function changeAyah(index){
                        audio.src=ayahsAudio[index];
                        ayah.innerHTML=ayahsText[index];
                    }
                    
                    
                })
            })
        })
    })
}


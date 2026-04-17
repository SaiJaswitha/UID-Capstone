document.addEventListener("DOMContentLoaded", function(){
    const audio = document.getElementById("audio");
    let currentList = [];
    let currentIndex = 0;
    let currentSrc = "";
    let isPlaying = false;
    let isShuffle = false;
    let changingTrack = false;
    let mainPlayBtn = document.getElementById("mainPlayBtn");

    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");

    const titles = {
        trending: "🔥 Trending Songs",
        pearls:   "💎 Tollywood Pearls",
        hits:     "⭐ All Time Hits",
        happy:    "😊 Happy Vibes",
        party:    "🎉 Party Time"
    };
    const titleText = titles[cat] || cat.toUpperCase() + " Songs";
    const parts = titleText.split(" ");
    const emoji = parts[0];
    const rest  = parts.slice(1).join(" ");
    document.getElementById("catTitle").innerHTML = `<span style="-webkit-text-fill-color:initial;">${emoji}</span> ${rest}`;

    currentList = songsDB[cat] || [];

    // ── Favourites ──
    function getFavs(){ return JSON.parse(localStorage.getItem("favorites") || "[]"); }
    function isFav(src){ return getFavs().some(s => s.src === src); }
    function toggleFav(song){
        let favs = getFavs();
        const idx = favs.findIndex(s => s.src === song.src);
        if(idx === -1){ favs.push(song); } else { favs.splice(idx, 1); }
        localStorage.setItem("favorites", JSON.stringify(favs));
        renderSongs();
        updatePlayerFavBtn();
    }
    window.toggleFavSong = function(name, img, src){ toggleFav({name, img, src}); };

    // ── Render Songs ──
    function renderSongs(){
        const list = document.getElementById("songList");
        list.innerHTML = "";
        currentList.forEach(song => {
            const fav     = isFav(song.src);
            const playing = currentSrc === song.src;
            list.innerHTML += `
            <div class="song-item${playing ? ' active' : ''}">
                <div class="song-left">
                    <img src="${song.img}" onclick="showSongInfo('${song.name}','${song.img}','${song.movie}','${song.singer}')" style="cursor:pointer;" title="Song Info">
                    <p>${song.name}</p>
                </div>
                <div class="song-controls">
                    <button onclick="toggleSong(this,'${song.name}','${song.src}','${song.img}')">${playing && isPlaying ? '⏸' : '▶'}</button>
                    <button class="fav-btn ${fav ? 'active' : ''}" onclick="toggleFavSong('${song.name}','${song.img}','${song.src}')">${fav ? '❤️' : '🤍'}</button>
                </div>
            </div>`;
        });
    }
    window.updateNowPlayingUI = function(){
    const npPlay    = document.getElementById('npPlayBtn');
    const npFav     = document.getElementById('npFavBtn');
    const npShuffle = document.getElementById('npShuffleBtn');
    if(npPlay)    npPlay.innerText = isPlaying ? '⏸' : '▶';
    if(npFav)     npFav.innerText  = (currentSrc && isFav(currentSrc)) ? '❤️' : '🤍';
    if(npShuffle) npShuffle.classList.toggle('active', isShuffle);
};
    // ── Playback ──
    window.toggleSong = function(btn, name, src, img){
        if(currentSrc !== src){
            currentIndex = currentList.findIndex(s => s.src === src);
            if(currentIndex === -1) currentIndex = 0;
            changingTrack = true;
            audio.src = src;
            audio.play();
            currentSrc = src;
            isPlaying = true;
            document.getElementById("currentSong").innerText = name;
            const pImg = document.getElementById("playerImg");
            pImg.src = img;
            
            document.getElementById("status").innerText = "Playing...";
            if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
            const song = currentList[currentIndex];
            if(song){
                addToRecentlyPlayed({name:song.name, img:song.img, src:song.src, movie:song.movie||'', singer:song.singer||'', category:cat});
                savePlayerState({src, name, img, index:currentIndex, category:cat, isPlaying:true, movie:song.movie||'', singer:song.singer||''});
            }
            updatePlayerFavBtn();
            refreshNowPlayingCard(name, img, song?.movie||'', song?.singer||'');
            renderSongs();
            return;
        }
        if(isPlaying){ audio.pause(); } else { audio.play(); }
    };

    window.togglePlay = function(){
        if(!audio.src) return;
        if(audio.paused){ audio.play(); } else { audio.pause(); }
    };

    window.next = function(){
        if(!currentList.length) return;
        if(isShuffle){
            let ni;
            do { ni = Math.floor(Math.random() * currentList.length); }
            while(ni === currentIndex && currentList.length > 1);
            currentIndex = ni;
        } else {
            currentIndex = (currentIndex + 1) % currentList.length;
        }
        playByIndex();
    };

    window.prev = function(){
        if(!currentList.length) return;
        currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
        playByIndex();
    };

    function playByIndex(){
        const song = currentList[currentIndex];
        if(!song) return;
        changingTrack = true;
audio.src = song.src;
audio.play();
currentSrc = song.src;
        isPlaying = true;
        document.getElementById("currentSong").innerText = song.name;
        const pImg = document.getElementById("playerImg");
        pImg.src = song.img;
        pImg.onclick = () => showSongInfo(song.name, song.img, song.movie||"Unknown", song.singer||"Unknown");
        document.getElementById("status").innerText = "Playing...";
        if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
        addToRecentlyPlayed({name:song.name, img:song.img, src:song.src, movie:song.movie||'', singer:song.singer||'', category:cat});
        savePlayerState({src:song.src, name:song.name, img:song.img, index:currentIndex, category:cat, isPlaying:true, movie:song.movie||'', singer:song.singer||''});
        updatePlayerFavBtn();
        refreshNowPlayingCard(song.name, song.img, song.movie||'', song.singer||'');
        renderSongs();
    }

    // ── Audio Events ──
    audio.onpause = () => {
    if(changingTrack) return;
    if(mainPlayBtn) mainPlayBtn.innerText = "▶";
    document.getElementById("status").innerText = "Paused";
    isPlaying = false;
    savePlayerState({isPlaying: false});
    renderSongs();
    window.updateNowPlayingUI();
};
audio.onplay = () => {
    changingTrack = false;
    if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
    document.getElementById("status").innerText = "Playing...";
    isPlaying = true;
    savePlayerState({isPlaying: true});
    renderSongs();
    window.updateNowPlayingUI();
};
audio.onended = () => {
    isPlaying = false;
    savePlayerState({isPlaying: false, currentTime: 0});
    window.updateNowPlayingUI();
};

    // ── Progress Bar ──
    function formatTime(sec){
        if(isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ":" + (s < 10 ? "0" + s : s);
    }
    audio.addEventListener("timeupdate", function(){
    if(!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    const curFmt = formatTime(audio.currentTime);
    const totFmt = formatTime(audio.duration);
    // Bottom player bar
    const bar = document.getElementById("progressBar");
    if(bar){ bar.value = pct; }
    document.getElementById("currentTime").innerText = curFmt;
    document.getElementById("totalTime").innerText   = totFmt;
    // Now playing card bar
    const card = document.getElementById('nowPlayingCard');
    if(card && card.classList.contains('open')){
        const npBar = document.getElementById('npProgressBar');
        if(npBar) npBar.value = pct;
        document.getElementById('npCurrentTime').innerText = curFmt;
        document.getElementById('npTotalTime').innerText   = totFmt;
    }
});
    window.seekSong = function(val){
        if(audio.duration) audio.currentTime = (val / 100) * audio.duration;
    };

    setInterval(() => {
    if(currentSrc && !audio.paused) savePlayerState({currentTime: audio.currentTime});
}, 2000);
    window.addEventListener('beforeunload', () => {
        savePlayerState({currentTime: audio.currentTime, isPlaying: !audio.paused});
    });

    // ── Shuffle ──
    window.toggleShuffle = function(){
    isShuffle = !isShuffle;
    savePlayerState({isShuffle});
    updateShuffleBtn();
    window.updateNowPlayingUI();
};
    function updateShuffleBtn(){
        const btn = document.getElementById("shuffleBtn");
        if(!btn) return;
        btn.classList.toggle("active", isShuffle);
        btn.title = isShuffle ? "Shuffle: ON" : "Shuffle: OFF";
    }

    // ── Volume ──
    window.setVolume = function(val){
        audio.volume = val / 100;
        savePlayerState({volume: parseInt(val)});
    };

    // ── Favourites Player Button ──
    window.togglePlayerFav = function(){
        if(!currentSrc) return;
        const song = currentList[currentIndex];
        if(song) toggleFav(song);
    };
    function updatePlayerFavBtn(){
        const btn = document.getElementById("playerFavBtn");
        if(!btn || !currentSrc) return;
        const song = currentList[currentIndex];
        if(song) btn.innerText = isFav(song.src) ? '❤️' : '🤍';
    }

    // ── Song Info ──
    window.showSongInfo = function(name, img, movie, singer){
        document.getElementById("infoImg").src = img;
        document.getElementById("infoName").innerText = name;
        document.getElementById("infoMovie").querySelector("span").innerText = movie || "Unknown";
        document.getElementById("infoSinger").querySelector("span").innerText = singer || "Unknown";
        document.getElementById("songInfoBox").style.display = "block";
        document.getElementById("infoOverlay").style.display = "block";
    };
    window.closeSongInfo = function(){
        document.getElementById("songInfoBox").style.display = "none";
        document.getElementById("infoOverlay").style.display = "none";
    };

    // ── Restore State on Load ──
    function restorePlayerState(){
    const state = getPlayerState();

    const vol = state?.volume ?? 80;
    audio.volume = vol / 100;
    const volSlider = document.getElementById("volumeSlider");
    if(volSlider) volSlider.value = vol;

    isShuffle = state?.isShuffle || false;
    updateShuffleBtn();

    const navType = performance.getEntriesByType('navigation')[0]?.type;
    const isReload = navType === 'reload';

    if(isReload || !state || !state.src){
        document.getElementById("currentSong").innerText = "No song";
        document.getElementById("status").innerText = "";
        renderSongs();
        return;
    }

    currentSrc   = state.src;
    currentIndex = (state.category === cat) ? (state.index || 0) : 0;

    document.getElementById("currentSong").innerText = state.name || 'No song';
    document.getElementById("playerImg").src = state.img || 'images/default.png';
    document.getElementById("status").innerText = state.isPlaying ? "Playing..." : "Paused";
    if(mainPlayBtn) mainPlayBtn.innerText = state.isPlaying ? "⏸" : "▶";
    isPlaying = state.isPlaying || false;

    audio.src = state.src;
    audio.onloadedmetadata = function(){
        audio.currentTime = state.currentTime || 0;
        audio.onloadedmetadata = null;
        if(state.isPlaying){
            audio.play().catch(() => {
                document.getElementById("status").innerText = "Tap ▶ to resume";
                if(mainPlayBtn) mainPlayBtn.innerText = "▶";
                isPlaying = false;
                savePlayerState({isPlaying: false});
            });
        }
    };

    updatePlayerFavBtn();
    renderSongs();
}

    restorePlayerState();
});
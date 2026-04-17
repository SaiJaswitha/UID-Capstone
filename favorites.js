document.addEventListener("DOMContentLoaded", function(){
    const audio = document.getElementById("audio");
    let currentList = [];
    let currentIndex = 0;
    let currentSrc = "";
    let isPlaying = false;
    let isShuffle = false;
    let changingTrack = false;
    let mainPlayBtn = document.getElementById("mainPlayBtn");

    function getFavs(){ return JSON.parse(localStorage.getItem("favorites") || "[]"); }
    function isFav(src){ return getFavs().some(s => s.src === src); }

    function removeFav(src){
        let favs = getFavs().filter(s => s.src !== src);
        localStorage.setItem("favorites", JSON.stringify(favs));
        currentList = getFavs();
        renderSongs();
        updatePlayerFavBtn();
    }

    function renderSongs(){
        currentList = getFavs();
        const list = document.getElementById("songList");
        list.innerHTML = "";
        if(currentList.length === 0){
            list.innerHTML = `<div class="empty-msg">💔 No favourites yet. Go add some songs!</div>`;
            return;
        }
        currentList.forEach(song => {
            const playing = currentSrc === song.src;
            list.innerHTML += `
            <div class="song-item${playing ? ' active' : ''}">
                <div class="song-left">
                    <img src="${song.img}" onerror="this.src='images/default.png'">
                    <p>${song.name}</p>
                </div>
                <div class="song-controls">
                    <button onclick="toggleSong(this,'${song.name}','${song.src}','${song.img}')">${playing && isPlaying ? '⏸' : '▶'}</button>
                    <button class="fav-btn active" onclick="removeFavSong('${song.src}')" title="Remove from Favourites">❤️</button>
                </div>
            </div>`;
        });
    }

    window.removeFavSong = function(src){ removeFav(src); };

    window.toggleSong = function(btn, name, src, img){
        currentList = getFavs();
        if(currentSrc !== src){
            currentIndex = currentList.findIndex(s => s.src === src);
            if(currentIndex === -1) currentIndex = 0;
            changingTrack = true;
audio.src = src;
audio.play();
currentSrc = src;
            isPlaying = true;
            document.getElementById("currentSong").innerText = name;
            document.getElementById("playerImg").src = img;
            document.getElementById("status").innerText = "Playing...";
            if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
            addToRecentlyPlayed({name, img, src, movie:'', singer:'', category:'favorites'});
            savePlayerState({src, name, img, index:currentIndex, category:'favorites', isPlaying:true});
            updatePlayerFavBtn();
            refreshNowPlayingCard(name, img, '', '');
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
        currentList = getFavs();
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
        currentList = getFavs();
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
        document.getElementById("playerImg").src = song.img;
        document.getElementById("status").innerText = "Playing...";
        if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
        addToRecentlyPlayed({name:song.name, img:song.img, src:song.src, movie:'', singer:'', category:'favorites'});
        savePlayerState({src:song.src, name:song.name, img:song.img, index:currentIndex, category:'favorites', isPlaying:true});
        updatePlayerFavBtn();
        refreshNowPlayingCard(song.name, song.img, '', '');
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
    window.updateNowPlayingUI = function(){
    const npPlay    = document.getElementById('npPlayBtn');
    const npFav     = document.getElementById('npFavBtn');
    const npShuffle = document.getElementById('npShuffleBtn');
    if(npPlay)    npPlay.innerText = isPlaying ? '⏸' : '▶';
    if(npFav)     npFav.innerText  = isFav(currentSrc) ? '❤️' : '🤍';
    if(npShuffle) npShuffle.classList.toggle('active', isShuffle);
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
        removeFav(currentSrc);
    };
    function updatePlayerFavBtn(){
        const btn = document.getElementById("playerFavBtn");
        if(!btn || !currentSrc) return;
        btn.innerText = isFav(currentSrc) ? '❤️' : '🤍';
    }

    // ── Restore State ──
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
    currentList  = getFavs();
    currentIndex = currentList.findIndex(s => s.src === state.src);
    if(currentIndex === -1) currentIndex = 0;

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
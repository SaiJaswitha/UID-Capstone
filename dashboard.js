document.addEventListener("DOMContentLoaded", function(){
    const audio = document.getElementById("audio");
    let currentSrc = "";
    let isPlaying = false;
    let currentList = [];
    let currentIndex = 0;
    let currentCategory = "";
    let isShuffle = false;
    let changingTrack = false;
    let mainPlayBtn = document.getElementById("mainPlayBtn");

    // ── User Info ──
    const user = localStorage.getItem("username") || "User";
    document.getElementById("username").innerText = user;
    document.getElementById("welcomeName").innerText = user;
    document.getElementById("avatar").innerText = user.charAt(0).toUpperCase();

    // ── Navigation ──
    window.goHome = function(){ window.scrollTo({top:0, behavior:"smooth"}); };
    window.logout = function(){
    clearPlayerState();
    localStorage.removeItem("username");
    window.location.href = "enter.html";
};
    window.openSlider = function(cat){
        window.location.href = "category.html?cat=" + cat;
    };
    window.scrollRecent = function(dir){
    const container = document.getElementById("recentCards");
    if(container) container.scrollBy({ left: dir * 400, behavior: "smooth" });
};
    // ── Now Playing UI Sync ──
window.updateNowPlayingUI = function(){
    const npPlay    = document.getElementById('npPlayBtn');
    const npFav     = document.getElementById('npFavBtn');
    const npShuffle = document.getElementById('npShuffleBtn');
    if(npPlay)    npPlay.innerText = isPlaying ? '⏸' : '▶';
    if(npFav)     npFav.innerText  = (currentSrc && isFav(currentSrc)) ? '❤️' : '🤍';
    if(npShuffle) npShuffle.classList.toggle('active', isShuffle);
};
    // ── Hero Slider ──
    let index = 0;
    const slides = document.getElementById("slides");
    const dots = document.querySelectorAll(".dots span");
    const total = slides.children.length;

    function showSlide(i){
        index = i;
        slides.style.transform = `translateX(-${i * 100}%)`;
        dots.forEach(d => d.classList.remove("active"));
        if(dots[i]) dots[i].classList.add("active");
    }
    window.goSlide = function(i){ showSlide(i); };

    setInterval(() => {
        index = (index + 1) % total;
        showSlide(index);
    }, 3000);

    function flashBtn(btn){
        btn.style.background = "#06b6d4";
        btn.style.transform = "translateY(-50%) scale(1.15)";
        setTimeout(() => {
            btn.style.background = "rgba(0,0,0,0.55)";
            btn.style.transform = "translateY(-50%) scale(1)";
        }, 300);
    }
    window.prevSlide = function(){
        index = (index - 1 + total) % total;
        showSlide(index);
        flashBtn(document.getElementById("prevBtn"));
    };
    window.nextSlide = function(){
        index = (index + 1) % total;
        showSlide(index);
        flashBtn(document.getElementById("nextBtn"));
    };
    showSlide(0);

    // ── Slider Playing Indicator ──
    const catSlideMap = { trending:0, pearls:1, hits:2, happy:3, party:4 };
    function updateSliderIndicator(cat){
        document.querySelectorAll(".slide").forEach(s => s.classList.remove("slide-playing"));
        const idx = catSlideMap[cat];
        if(idx !== undefined){
            document.querySelectorAll(".slide")[idx].classList.add("slide-playing");
        }
    }

    // ── Profile Menu ──
    document.querySelector(".avatar").addEventListener("click", function(){
        document.getElementById("profileMenu").classList.toggle("show");
        document.getElementById("profileCard").classList.remove("show");
        this.classList.toggle("active");
    });
    window.showProfile = function(){
        const name = localStorage.getItem("username") || "User";
        document.getElementById("pcName").innerText = name;
        document.getElementById("pcAvatar").innerText = name.charAt(0).toUpperCase();
        const email = localStorage.getItem("email") || name.toLowerCase() + "@telugubeats.com";
        document.getElementById("pcEmail").innerText = email;
        document.getElementById("profileMenu").classList.remove("show");
        document.getElementById("profileCard").classList.add("show");
    };
    window.closeProfile = function(){
        document.getElementById("profileCard").classList.remove("show");
        document.querySelector(".avatar").classList.remove("active");
    };

    // ── Category Rendering ──
    function renderCategory(cat, doScroll){
        const list  = document.getElementById("songList");
        const title = document.getElementById("categoryTitle");
        list.innerHTML = "";
        title.innerText = cat.toUpperCase() + " SONGS";
        (songsDB[cat] || []).forEach(song => {
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
        if(doScroll) window.scrollTo({top: title.offsetTop - 80, behavior:"smooth"});
    }

    window.openCategory = function(cat){
        currentCategory = cat;
        currentList = songsDB[cat] || [];
        renderCategory(cat, true);
        savePlayerState({category: cat});
    };
    // ── Search ──
const searchInput = document.querySelector(".search");
if(searchInput){
    searchInput.addEventListener("input", function(){
        const query = this.value.trim().toLowerCase();
        const resultBox = document.getElementById("searchResults");
        if(!query){ resultBox.style.display = "none"; resultBox.innerHTML = ""; return; }
        const allSongs = [];
        Object.keys(songsDB).forEach(cat => {
            songsDB[cat].forEach(song => {
                if(!allSongs.find(s => s.src === song.src)){
                    allSongs.push({...song, category: cat});
                }
            });
        });
        const filtered = allSongs
            .filter(s => s.name.toLowerCase().includes(query))
            .sort((a, b) => a.name.localeCompare(b.name));
        if(filtered.length === 0){
            resultBox.innerHTML = `<div class="search-no-result">No songs found</div>`;
            resultBox.style.display = "block";
            return;
        }
        resultBox.innerHTML = "";
        filtered.forEach(song => {
            const fav = isFav(song.src);
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.innerHTML = `
                <img src="${song.img}" onerror="this.src='images/default.png'">
                <div class="search-result-info">
                    <p>${song.name}</p>
                    <small>${song.movie || ''}</small>
                </div>
                <div class="search-result-btns">
                    <button class="search-play-btn" onclick="searchPlaySong('${song.src}','${song.name}','${song.img}','${song.category}','${(song.movie||'').replace(/'/g,"&#39;")}','${(song.singer||'').replace(/'/g,"&#39;")}')">▶</button>
                    <button class="fav-btn ${fav ? 'active' : ''}" onclick="searchToggleFav('${song.name}','${song.img}','${song.src}')">${fav ? '❤️' : '🤍'}</button>
                </div>
            `;
            resultBox.appendChild(div);
        });
        resultBox.style.display = "block";
    });

    // Close search when clicking outside
    document.addEventListener("click", function(e){
        if(!e.target.closest(".search") && !e.target.closest("#searchResults")){
            document.getElementById("searchResults").style.display = "none";
        }
    });
}

window.searchPlaySong = function(src, name, img, category, movie, singer){
    currentCategory = category;
    currentList = songsDB[category] || [];
    currentIndex = currentList.findIndex(s => s.src === src);
    if(currentIndex === -1) currentIndex = 0;
    audio.src = src;
    audio.play();
    currentSrc = src;
    isPlaying = true;
    document.getElementById("currentSong").innerText = name;
    const pImg = document.getElementById("playerImg");
    pImg.src = img;
    pImg.onclick = () => openNowPlaying();
    document.getElementById("status").innerText = "Playing...";
    if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
    addToRecentlyPlayed({name, img, src, movie, singer, category});
    savePlayerState({src, name, img, index:currentIndex, category, isPlaying:true, movie, singer});
    updatePlayerFavBtn();
    refreshNowPlayingCard(name, img, movie, singer);
    renderRecentlyPlayed();
    // Close search
    document.getElementById("searchResults").style.display = "none";
    document.querySelector(".search").value = "";
};

window.searchToggleFav = function(name, img, src){
    let favs = getFavs();
    const idx = favs.findIndex(s => s.src === src);
    if(idx === -1){ favs.push({name, img, src}); }
    else { favs.splice(idx, 1); }
    localStorage.setItem("favorites", JSON.stringify(favs));
    // Re-trigger search to refresh hearts
    document.querySelector(".search").dispatchEvent(new Event("input"));
    updatePlayerFavBtn();
};

    function refreshListIfOpen(){
        const yearCats = ['y2020','y2010','y2000','y1990'];
        if(currentCategory && yearCats.includes(currentCategory)){
            renderCategory(currentCategory, false);
        }
    }

    // ── Playback ──
    window.toggleSong = function(btn, name, src, img){
        if(currentSrc !== src){
            currentIndex = currentList.findIndex(s => s.src === src);
            if(currentIndex === -1) currentIndex = 0;
            audio.src = src;
            audio.play();
            changingTrack = true;
audio.src = src;
audio.play();
currentSrc = src;
isPlaying = true;
document.getElementById("currentSong").innerText = name;
document.getElementById("playerImg").src = img;
            document.getElementById("status").innerText = "Playing...";
            if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
            const song = currentList[currentIndex];
            if(song){
                addToRecentlyPlayed({name:song.name, img:song.img, src:song.src, movie:song.movie||'', singer:song.singer||'', category:currentCategory});
                savePlayerState({src, name, img, index:currentIndex, category:currentCategory, isPlaying:true, movie:song.movie||'', singer:song.singer||''});
            }
            updatePlayerFavBtn();
            updateSliderIndicator(currentCategory);
            refreshNowPlayingCard(name, img, song?.movie||'', song?.singer||'');
            renderRecentlyPlayed();
            refreshListIfOpen();
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
        document.getElementById("status").innerText = "Playing...";
        if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
        addToRecentlyPlayed({name:song.name, img:song.img, src:song.src, movie:song.movie||'', singer:song.singer||'', category:currentCategory});
        savePlayerState({src:song.src, name:song.name, img:song.img, index:currentIndex, category:currentCategory, isPlaying:true, movie:song.movie||'', singer:song.singer||''});
        updatePlayerFavBtn();
        updateSliderIndicator(currentCategory);
        refreshNowPlayingCard(song.name, song.img, song.movie||'', song.singer||'');
        renderRecentlyPlayed();
        refreshListIfOpen();
    }

    // ── Audio Events ──
    audio.onpause = () => {
    if(changingTrack) return;
    if(mainPlayBtn) mainPlayBtn.innerText = "▶";
    document.getElementById("status").innerText = "Paused";
    isPlaying = false;
    savePlayerState({isPlaying: false});
    refreshListIfOpen();
    window.updateNowPlayingUI();
};
audio.onplay = () => {
    changingTrack = false;
    if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
    document.getElementById("status").innerText = "Playing...";
    isPlaying = true;
    savePlayerState({isPlaying: true});
    refreshListIfOpen();
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

    // Save time every 5 seconds while playing
    

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

    // ── Favourites ──
    function getFavs(){ return JSON.parse(localStorage.getItem("favorites") || "[]"); }
    function isFav(src){ return getFavs().some(s => s.src === src); }

    window.toggleFavSong = function(name, img, src){
    let favs = getFavs();
    const idx = favs.findIndex(s => s.src === src);
    if(idx === -1){ favs.push({name, img, src}); }
    else { favs.splice(idx, 1); }
    localStorage.setItem("favorites", JSON.stringify(favs));
    refreshListIfOpen();
    updatePlayerFavBtn();
    window.updateNowPlayingUI();
};
    window.togglePlayerFav = function(){
        if(!currentSrc) return;
        const song = currentList.find(s => s.src === currentSrc);
        if(song) window.toggleFavSong(song.name, song.img, song.src);
    };
    function updatePlayerFavBtn(){
        const btn = document.getElementById("playerFavBtn");
        if(!btn || !currentSrc) return;
        btn.innerText = isFav(currentSrc) ? '❤️' : '🤍';
    }

    // ── Song Info Popup ──
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

    // ── Query Form ──
    window.showQueryForm = function(){
        document.getElementById("profileMenu").classList.remove("show");
        document.getElementById("queryBox").style.display = "block";
        document.getElementById("queryOverlay").style.display = "block";
        document.getElementById("querySuccess").style.display = "none";
        ["queryName","queryEmail","queryMsg"].forEach(id => document.getElementById(id).value = "");
        ["queryNameErr","queryEmailErr","queryMsgErr"].forEach(id => document.getElementById(id).innerText = "");
    };
    window.closeQuery = function(){
        document.getElementById("queryBox").style.display = "none";
        document.getElementById("queryOverlay").style.display = "none";
    };
    window.submitQuery = function(){
        const name  = document.getElementById("queryName").value.trim();
        const email = document.getElementById("queryEmail").value.trim();
        const msg   = document.getElementById("queryMsg").value.trim();
        let valid = true;
        ["queryNameErr","queryEmailErr","queryMsgErr"].forEach(id => document.getElementById(id).innerText = "");
        if(!name)  { document.getElementById("queryNameErr").innerText  = "Name is required";     valid=false; }
        if(!email) { document.getElementById("queryEmailErr").innerText = "Email is required";    valid=false; }
        if(!msg)   { document.getElementById("queryMsgErr").innerText   = "Query cannot be empty"; valid=false; }
        if(valid){
            document.getElementById("querySuccess").style.display = "block";
            setTimeout(closeQuery, 2000);
        }
    };

    // ── Recently Played ──
    function renderRecentlyPlayed(){
    const recent  = getRecentlyPlayed();
    const section = document.getElementById("recentSection");
    const cards   = document.getElementById("recentCards");
    if(!section || !cards) return;
    if(recent.length === 0){ section.style.display = "none"; return; }
    section.style.display = "block";
    cards.innerHTML = "";
    recent.forEach(song => {
        const safeMovie  = (song.movie  || 'Unknown').replace(/'/g, "&#39;");
        const safeSinger = (song.singer || 'Unknown').replace(/'/g, "&#39;");
        const safeName   = (song.name   || '').replace(/'/g, "&#39;");
        const safeImg    = (song.img    || 'images/default.png').replace(/'/g, "&#39;");
        const safeSrc    = (song.src    || '').replace(/'/g, "&#39;");
        const safeCat    = (song.category || '').replace(/'/g, "&#39;");
        cards.innerHTML += `
        <div class="recent-card">
            <img src="${song.img}"
                onclick="window.showSongInfo('${safeName}','${safeImg}','${safeMovie}','${safeSinger}')"
                style="cursor:pointer;" title="Song Info"
                onerror="this.src='images/default.png'">
            <p onclick="playRecentSong('${safeSrc}','${safeName}','${safeImg}','${safeCat}','${safeMovie}','${safeSinger}')"
               style="cursor:pointer;">${song.name}</p>
            <small>${song.movie || ''}</small>
        </div>`;
    });
}

    window.playRecentSong = function(src, name, img, category, movie, singer){
        currentCategory = category || '';
        currentList = category === 'favorites'
            ? getFavs()
            : (songsDB[category] || []);
        currentIndex = currentList.findIndex(s => s.src === src);
        if(currentIndex === -1) currentIndex = 0;
        audio.src = src;
        audio.play();
        currentSrc = src;
        isPlaying = true;
        document.getElementById("currentSong").innerText = name;
        document.getElementById("playerImg").src = img;
        document.getElementById("status").innerText = "Playing...";
        if(mainPlayBtn) mainPlayBtn.innerText = "⏸";
        addToRecentlyPlayed({name, img, src, movie, singer, category});
        savePlayerState({src, name, img, index:currentIndex, category, isPlaying:true, movie, singer});
        updatePlayerFavBtn();
        updateSliderIndicator(category);
        refreshNowPlayingCard(name, img, movie||'', singer||'');
        window.updateNowPlayingUI();
        renderRecentlyPlayed();
        refreshListIfOpen();
    };

    // ── Restore State on Page Load ──
    function restorePlayerState(){
        const state = getPlayerState();

        // Restore volume and shuffle always
        const vol = state?.volume ?? 80;
        audio.volume = vol / 100;
        const volSlider = document.getElementById("volumeSlider");
        if(volSlider) volSlider.value = vol;

        isShuffle = state?.isShuffle || false;
        updateShuffleBtn();

        // Check if this is a page refresh — if so, show blank player
        const navType = performance.getEntriesByType('navigation')[0]?.type;
        const isReload = navType === 'reload';

        if(isReload || !state || !state.src){
            document.getElementById("currentSong").innerText = "No song";
            document.getElementById("status").innerText = "";
            return;
        }

        // Restore from navigation (not refresh)
        currentSrc      = state.src;
        currentCategory = state.category || '';
        currentList     = state.category === 'favorites'
            ? getFavs()
            : (songsDB[state.category] || []);
        currentIndex    = state.index || 0;

        document.getElementById("currentSong").innerText = state.name || 'No song';
        document.getElementById("playerImg").src = state.img || 'images/default.png';
        document.getElementById("status").innerText = state.isPlaying ? "Playing..." : "Paused";
        if(mainPlayBtn) mainPlayBtn.innerText = state.isPlaying ? "⏸" : "▶";
        isPlaying = state.isPlaying || false;

        // Fast audio restore — minimize gap
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
        updateSliderIndicator(state.category);
    }

    // Save currentTime every 2 seconds (was 5 — more frequent = less gap on navigation)
    setInterval(() => {
        if(currentSrc && !audio.paused) savePlayerState({currentTime: audio.currentTime});
    }, 2000);

    window.addEventListener('beforeunload', () => {
        savePlayerState({currentTime: audio.currentTime, isPlaying: !audio.paused});
    });

    restorePlayerState();
    renderRecentlyPlayed();
});
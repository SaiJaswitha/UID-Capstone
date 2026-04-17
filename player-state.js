function savePlayerState(patch) {
    let state = JSON.parse(localStorage.getItem('playerState') || '{}');
    Object.assign(state, patch);
    localStorage.setItem('playerState', JSON.stringify(state));
}
 
function getPlayerState() {
    return JSON.parse(localStorage.getItem('playerState') || 'null');
}
 
function clearPlayerState() {
    localStorage.removeItem('playerState');
    localStorage.removeItem('recentlyPlayed');
}
 
function addToRecentlyPlayed(song) {
    let recent = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    recent = recent.filter(s => s.src !== song.src);
    recent.unshift(song);
    recent = recent.slice(0, 15);
    localStorage.setItem('recentlyPlayed', JSON.stringify(recent));
}
 
function getRecentlyPlayed() {
    return JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
}
 
// ── Now Playing Card ──
function openNowPlaying() {
    const card = document.getElementById('nowPlayingCard');
    if (!card) return;
    const songName = document.getElementById('currentSong')?.innerText || '';
    if (!songName || songName === 'No song') return;
    const state = getPlayerState();
    document.getElementById('npImg').src = document.getElementById('playerImg')?.src || 'images/default.png';
    document.getElementById('npSongName').innerText = songName;
    document.getElementById('npMovie').innerText  = state?.movie  ? '🎬 ' + state.movie  : '';
    document.getElementById('npSinger').innerText = state?.singer ? '🎤 ' + state.singer : '';
    const npVol = document.getElementById('npVolumeSlider');
    if (npVol) npVol.value = state?.volume ?? 80;
    card.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof window.updateNowPlayingUI === 'function') window.updateNowPlayingUI();
}
 
function closeNowPlaying() {
    const card = document.getElementById('nowPlayingCard');
    if (card) card.classList.remove('open');
    document.body.style.overflow = '';
}
 
function refreshNowPlayingCard(name, img, movie, singer) {
    // Always update the card data — even if closed, so opening it shows fresh info
    if (document.getElementById('npSongName')) document.getElementById('npSongName').innerText = name || '';
    if (document.getElementById('npImg'))      document.getElementById('npImg').src = img || 'images/default.png';
    if (document.getElementById('npMovie'))    document.getElementById('npMovie').innerText  = movie  ? '🎬 ' + movie  : '';
    if (document.getElementById('npSinger'))   document.getElementById('npSinger').innerText = singer ? '🎤 ' + singer : '';
    if (typeof window.updateNowPlayingUI === 'function') window.updateNowPlayingUI();
}
 
// Default stub — each page JS overrides this
window.updateNowPlayingUI = function () {};
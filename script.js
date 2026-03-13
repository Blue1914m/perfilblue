// Player de músicas para tracks
document.addEventListener('DOMContentLoaded', function() {
  const audioIds = ['audio-nuts', 'audio-letdown', 'audio-wuti'];
  const audios = audioIds.map(id => document.getElementById(id));
  let currentTrack = -1;

  // Check if all audios exist
  if (audios.some(audio => audio === null)) {
    console.error('Erro: Alguns áudios não encontrados. Verifique IDs.');
    return;
  }

  // Load metadata for all
  const loadPromises = audios.map((audio, index) => {
    return new Promise((resolve, reject) => {
      audio.addEventListener('loadedmetadata', () => {
        console.log(`Track ${index} duration: ${audio.duration}s`);
        resolve(audio);
      }, {once: true});
      audio.addEventListener('error', (e) => {
        console.error(`Erro carregando track ${index}:`, e);
        reject(e);
      }, {once: true});
      audio.load();
    });
  });

  Promise.all(loadPromises).then(() => {
    console.log('Todos áudios carregados!');
    setupTracks(audios);
  }).catch(err => {
    console.error('Erro ao carregar áudios:', err);
  });

  function setupTracks(audios) {
    const tracks = document.querySelectorAll('.track');
    tracks.forEach((track, index) => {
      track.style.cursor = 'pointer';
      track.title = `Tocar ${track.textContent.trim()}`;
      track.addEventListener('click', () => playTrack(index, audios));
    });
  }

  function playTrack(index, audios) {
    const audio = audios[index];
    if (currentTrack === index && !audio.paused) {
      // Pause
      audio.pause();
      resetProgress(index);
      return;
    }

    // Pause all others
    audios.forEach((a, i) => {
      if (i !== index && !a.paused) {
        a.pause();
        resetProgress(i);
      }
    });

    // Play this one
    currentTrack = index;
    audio.currentTime = 0;
    audio.play().catch(e => console.error('Erro play:', e));
    updateProgress(index, audio);
  }

  function updateProgress(index, audio) {
    const bars = document.querySelectorAll('.progress-bar');
    const bar = bars[index];
    const duration = audio.duration || 10; // Fallback
    bar.style.animation = 'none';
    bar.offsetHeight; // Reflow
    bar.style.animationDuration = duration + 's';
    bar.style.animationName = 'progress-full';
    bar.style.animationTimingFunction = 'linear';
    bar.style.animationIterationCount = '1';
    bar.style.width = '100%';
  }

  function resetProgress(index) {
    const bars = document.querySelectorAll('.progress-bar');
    const bar = bars[index];
    bar.style.animation = 'loading 5s linear infinite';
    bar.style.width = '60%';
  }
});

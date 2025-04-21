const volumes = [0, 0.25, 0.5, 0.75, 1];
const volumeLabels = ['0%', '25%', '50%', '75%', '100%'];

const audios = [
  'som1.mp3',
  'som2.mp3',
  'som3.mp3',
  'som4.mp3',
  'som5.mp3'
];

const roletaSound = new Audio('roleta.mp3'); // Som da roleta
const volumeSlot = document.getElementById('volumeSlot');
const audioSlot = document.getElementById('audioSlot');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');

// Slot que simula rotação e resolve com o índice final
function rolarSlotAsync(elemento, lista) {
  return new Promise((resolve) => {
    let count = 0;
    const maxCount = 20;
    let finalIndex = 0;

    const intervalo = setInterval(() => {
      finalIndex = Math.floor(Math.random() * lista.length);
      elemento.textContent = lista[finalIndex];
      count++;

      if (count >= maxCount) {
        clearInterval(intervalo);
        resolve(finalIndex);
      }
    }, 100);
  });
}

playButton.addEventListener('click', async () => {
  playButton.disabled = true;

  // Inicia o som da roleta
  roletaSound.loop = true; // Faz o som repetir enquanto as colunas giram
  roletaSound.play();

  // Inicia as duas animações ao mesmo tempo
  const volumePromise = rolarSlotAsync(volumeSlot, volumeLabels);
  const audioPromise = rolarSlotAsync(audioSlot, ['Som 1', 'Som 2', 'Som 3', 'Som 4', 'Som 5']);

  // Espera as duas finalizarem
  const [volFinalIndex, audioFinalIndex] = await Promise.all([volumePromise, audioPromise]);

  // Para o som da roleta
  roletaSound.pause();
  roletaSound.currentTime = 0; // Reseta o som de roleta
  
  const imageSlot = document.getElementById('imageSlot');
  imageSlot.src = `imgs/som${audioFinalIndex + 1}.png`;
  // Configura o áudio final
  audioPlayer.src = audios[audioFinalIndex];
  audioPlayer.volume = volumes[volFinalIndex];

  const volumeBar = document.getElementById('volumeBar');
  volumeBar.value = volumes[volFinalIndex]; 

  audioPlayer.play();

  playButton.disabled = false;
});
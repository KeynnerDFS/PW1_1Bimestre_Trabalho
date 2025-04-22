const volumes = [0, 0.25, 0.5, 0.75, 1];//lista com volume.
//lista com porcentagem de volume que vai aparecer no slot.
const volumeLabels = ['0%', '25%', '50%', '75%', '100%'];

//lista dos sons disponiveis.
const audios = [
  'som1.mp3',
  'som2.mp3',
  'som3.mp3',
  'som4.mp3',
  'som5.mp3'
];

//Coloca som de roleta ao apertar o buttom
const roletaSound = new Audio('roleta.mp3'); 
const volumeSlot = document.getElementById('volumeSlot');
const audioSlot = document.getElementById('audioSlot');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');

//faz a rotação dos slots de volume e Som
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

//Faz o efeito de rolagem da imagem
function rolarImagemSlotAsync(elemento, totalImagens) {
  return new Promise((resolve) => {
    let count = 0;
    const maxCount = 20;
    let finalIndex = 0;

    const intervalo = setInterval(() => {
      finalIndex = Math.floor(Math.random() * totalImagens);
      elemento.src = `imgs/som${finalIndex + 1}.png`;
      count++;

      if (count >= maxCount) {
        clearInterval(intervalo);
        resolve(finalIndex);
      }
    }, 100);
  });
}

playButton.addEventListener('click', async () => {
  playButton.disabled = true;//não pode clicar até a roleta terminar.
  //Inicia o som de roleta
  roletaSound.loop = true;
  roletaSound.play();
  //As colunas começam a rodar utilizando as funções feitas anteriormente
  const volumePromise = rolarSlotAsync(volumeSlot, volumeLabels);
  const audioPromise = rolarSlotAsync(audioSlot, ['Som 1', 'Som 2', 'Som 3', 'Som 4', 'Som 5']);
  const imagePromise = rolarImagemSlotAsync(imageSlot, audios.length);

  //Esperar todas as roletas terminarem de girar
  const [volFinalIndex, audioFinalIndex, imgFinalIndex] = await Promise.all([
    volumePromise,
    audioPromise,
    imagePromise
  ]);

  //Para o som da roleta
  roletaSound.pause();
  roletaSound.currentTime = 0;

  //Começa a rodar o audio sorteado
  audioPlayer.src = audios[audioFinalIndex];
  audioPlayer.volume = volumes[volFinalIndex];

  //Atualiza a barra de volume de acorco com o sorteio
  const volumeBar = document.getElementById('volumeBar');
  volumeBar.value = volumes[volFinalIndex];

  audioPlayer.play();//toca o audio com volumes ajustado.

  playButton.disabled = false;// reativa o buttom
});
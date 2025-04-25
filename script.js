const volumes = [0, 0.25, 0.5, 0.75, 1]; // lista com volume
const volumeLabels = ['0%', '25%', '50%', '75%', '100%']; // lista com porcentagem de volume
const audios = ['audios/som1.mp3', 'audios/som2.mp3', 'audios/som3.mp3', 'audios/som4.mp3', 'audios/som5.mp3']; // lista dos sons disponíveis

// Coloca som de roleta ao apertar o botão
const roletaSound = new Audio('roleta.mp3');
const volumeSlot = document.getElementById('volumeSlot');
const audioSlot = document.getElementById('audioSlot');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const imageSlot = document.getElementById('imageSlot'); // A imagem da roleta
const messageDiv = document.getElementById('message'); // Div para exibir a mensagem

// Faz a rotação dos slots de volume e som
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
        resolve(finalIndex); // Resolve com o índice sorteado
      }
    }, 100);
  });
}

// Faz o efeito de rolagem da imagem
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
        resolve(finalIndex); // Resolve com o índice sorteado após a rotação
      }
    }, 100);
  });
}

playButton.addEventListener('click', async () => {
  playButton.disabled = true; // Não pode clicar até a roleta terminar

  // Inicia o som de roleta
  roletaSound.loop = true;
  roletaSound.play();

  // Sorteia o índice de áudio (também vai ser o índice da imagem)
  const audioIndex = Math.floor(Math.random() * audios.length);

  // As colunas começam a rodar utilizando as funções feitas anteriormente
  const volumePromise = rolarSlotAsync(volumeSlot, volumeLabels);
  const audioPromise = rolarSlotAsync(audioSlot, ['Som 1', 'Som 2', 'Som 3', 'Som 4', 'Som 5']);
  
  // Passa o índice sorteado para a rotação da imagem
  const imagePromise = rolarImagemSlotAsync(imageSlot, audios.length); // Isso mantém o efeito de rotação da imagem

  // Esperar todas as roletas terminarem de girar
  const [volFinalIndex, audioFinalIndex, imgFinalIndex] = await Promise.all([volumePromise, audioPromise, imagePromise]);

  // Para o som da roleta
  roletaSound.pause();
  roletaSound.currentTime = 0;

  // Começa a rodar o áudio sorteado (com o índice correto)
  audioPlayer.src = audios[audioIndex]; // Usa o índice sorteado para o áudio
  audioPlayer.volume = volumes[volFinalIndex]; // Usa o indice sorteado para o volume

  // Atualiza a barra de volume de acordo com o sorteio
  const volumeBar = document.getElementById('volumeBar');
  volumeBar.value = volumes[volFinalIndex];

  audioPlayer.play(); // Toca o áudio com volume ajustado

  // Verifica se o índice do áudio e o da imagem são iguais
  if (audioFinalIndex === imgFinalIndex) {
    messageDiv.textContent = "Parabéns! Você acertou o áudio e a imagem!";
    messageDiv.classList.add('show'); // Exibe a caixa de mensagem
  } else {
    messageDiv.classList.remove('show'); // Limpa a mensagem se não forem iguais
  }

  playButton.disabled = false; // Reativa o botão após a roleta terminar
});
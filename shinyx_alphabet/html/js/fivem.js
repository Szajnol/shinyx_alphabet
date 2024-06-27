let progressBarTimer;
let gameOver = false;  // Nowa zmienna do śledzenia stanu gry

$(document).ready(function() {

  window.addEventListener('message', function(event) {
    let action = event.data.action;

    if (action === 'startGame') {
      start();
    }
  });

  let lettersArray = [];
  let timeRemaining = 5;
  let gameInterval;

  let success = new Audio('sfx/success.mp3');
  let fail = new Audio('sfx/fail.mp3');

  function generateRandomLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  function updateLetterDivs() {
    lettersArray = [];  // Resetuje tablicę liter
    for (let i = 1; i <= 18; i++) {
      const letter = generateRandomLetter();
      lettersArray.push(letter);
      document.getElementById(i.toString()).innerText = letter;
      document.getElementById(i.toString()).classList.remove('clicked');
    }
  }

  function handleKeyPress(event) {
    if (gameOver) return;  // Jeżeli gra jest zakończona, ignoruj kliknięcia

    const pressedKey = event.key.toUpperCase();

    if (lettersArray.length > 0 && pressedKey === lettersArray[0]) {
      lettersArray.shift();
      const divId = (18 - lettersArray.length).toString();
      document.getElementById(divId).classList.add('clicked');

      if (lettersArray.length === 0) {
        clearInterval(gameInterval);
        success.currentTime = 0;
        success.play();
        stopProgressBar();
        $('.hack').fadeOut(500);
        $('.information').fadeIn(500).text("SUCCESS");
        gameOver = true;  // Ustawia grę jako zakończoną
        startProgressBar(2000, function() {
          $('.information').fadeOut(500);
          $('.hack-container').fadeOut(500);
        });
        $.post(`https://${GetParentResourceName()}/success`);
      }
    }
  }

  function startProgressBar(duration, onComplete) {
    let progressBar = document.querySelector(".fill");
    let progress = 100;
    let interval = 10;

    progressBarTimer = setInterval(function() {
      if (progress <= 0) {
        clearInterval(progressBarTimer);
        if (typeof onComplete === "function") {
          onComplete();
        }
      } else {
        progress -= (interval / duration) * 100;
        progressBar.style.height = Math.max(progress, 0) + "%";
      }
    }, interval);
  }

  function stopProgressBar() {
    clearInterval(progressBarTimer);
  }

  function start() {
    gameOver = false;  // Resetuje stan gry
    $('.information').text("Klikaj wszystkie przyciski jak najszybciej pokolei").fadeIn(500);
    $('.hack-container').fadeIn(500);
    $('.hack').fadeOut(0);

    startProgressBar(2000, function() {
      $('.information').fadeOut(500);

      updateLetterDivs();
      document.addEventListener("keydown", handleKeyPress);

      startProgressBar(6500, function() {
        if (!gameOver) {  // Sprawdza, czy gra nie jest już zakończona
          fail.currentTime = 0;
          fail.play();
          $('.hack').fadeOut(500);
          $('.information').fadeIn(500).text("ERROR");
          gameOver = true;  // Ustawia grę jako zakończoną
          startProgressBar(2000, function() {
            $('.hack-container').fadeOut(500);
            $('.information').fadeOut(500);
            $.post(`https://${GetParentResourceName()}/failed`);
          });
        }
      });

      $('.information-before-start').fadeOut(500);
      $('.hack').fadeIn(500);
    });
  }
});

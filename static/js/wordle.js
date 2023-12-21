// fetch five letter words from datamuse API
async function fetchFiveLetterWords() {
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=?????&max=1000`
      );
  
      const data = await response.json();
  
      // extract the words from the JSON and return
      const fiveLetterWords = data.map((word) => word.word);
      return fiveLetterWords;
    } catch (error) {
      console.log(`Error fetching words: ${error}`);
    }
  }
  
  async function startGame() {
    const words = await fetchFiveLetterWords();
    // create a set of the words so that we can quickly look up whether a users guess is in the list
    const wordsSet = new Set(words);
  
    // elements
    const keyboard = document.getElementById('keyboard');
    const resultModal = document.getElementById('result-modal');
    const resultText = document.getElementById('result-text');
    const secretWordText = document.getElementById('secret-word');
    const playAgainBtn = document.getElementById('play-again');
  
    // variables
    let guess = '';
    let activeRowNumber = 1;
    let guessAttempts = 0;
    const maxAttempts = 6;
    let gameStatus = 'active';
  
    // get a random word for the game
    function getRandomWord() {
      const index = Math.floor(Math.random() * words.length);
      return words[index];
    }
    const secretWord = getRandomWord();
    console.log('secretWord:', secretWord);
  
    // handle real keyboard or on-screen keyboard event
    window.addEventListener('keyup', handleKeyEvent);
    keyboard.addEventListener('click', handleKeyEvent);
  
    function handleKeyEvent(event) {
      // only handle this if the game is active, otherwise ignore!
      if (gameStatus === 'active') {
        const { letter, backspace } = getKeys(event);
  
        // only react if there is a letter or backspace
        if (letter || backspace) {
          if (!backspace) {
            if (letter === 'enter') {
              // check if the guess is in the set of words
              const isAWord = wordsSet.has(guess);
              isAWord ? scoreGuess() : handleNotExistingWord();
            } else {
              handleGuessLetter(letter);
            }
          } else {
            handleBackspace();
          }
        }
      }
    }
  
    function getKeys(event) {
      const eventType = event.type;
      const keys = { letter: null, backspace: false };
  
      // set the letter and backspace depending on the event type
      if (eventType === 'keyup') {
        if (event.code.toLowerCase().includes('key')) {
          keys.letter = event.key;
        } else {
          keys.letter = event.code.toLowerCase() === 'enter' ? 'enter' : null;
        }
  
        keys.backspace = event.key.toLowerCase() === 'backspace';
      } else {
        keys.letter = event.target.classList.contains('keyboard-letter')
          ? event.target.textContent
          : null;
        keys.backspace =
          event.target.classList.contains('fa-delete-left') ||
          event.target.innerHTML.includes('fa-delete-left');
      }
      return keys;
    }
  
    // handle letter
    function handleGuessLetter(letter) {
      if (guess.length < 5) {
        guess += letter;
        showGuessOnBoard(letter);
      } else {
        alert(`You have already entered 5 letters for this guess!`);
      }
    }
  
    function showGuessOnBoard(letter) {
      const activeRow = document.querySelector(`.board-row--${activeRowNumber}`);
  
      for (let rowBoardLetter of activeRow.children) {
        const rowBoardLetterSpan = rowBoardLetter.querySelector('span');
        if (!rowBoardLetterSpan.textContent) {
          rowBoardLetterSpan.classList.add('letter-enter');
          rowBoardLetterSpan.textContent = letter;
          return;
        }
      }
    }
  
    function handleBackspace() {
      if (guess.length > 0) {
        const letterIndex = guess.length - 1;
  
        // remove the letter from the board row
        const activeRow = document.querySelector(
          `.board-row--${activeRowNumber}`
        );
        const rowBoardLetterSpan =
          activeRow.children[letterIndex].querySelector('span');
        rowBoardLetterSpan.classList.remove('letter-enter');
        setTimeout(() => {
          rowBoardLetterSpan.textContent = '';
        }, 300);
  
        // remove the letter from the guess!
        guess = guess.slice(0, letterIndex);
      }
    }
  
    function handleNotExistingWord() {
      if (guess.length !== 5) {
        alert('Not enough letters!');
      } else {
        const activeRow = document.querySelector(
          `.board-row--${activeRowNumber}`
        );
        activeRow.classList.add('shake');
        setTimeout(() => {
          activeRow.classList.remove('shake');
        }, 300);
      }
    }
  
    function scoreGuess() {
      const guessResult = [];
      // make a copy of secretWord so that we can remove letters from it whilst looping
      let secretWordCopy = secretWord;
  
      // mark all of the correct letters first
      for (let i = 0; i < guess.length; i++) {
        // if the letter is in the same position, it is correct
        if (guess[i] === secretWord[i]) {
          guessResult.push({ letter: guess[i], status: 'correct' });
  
          // remove the letter from secretWordCopy so we don't double count it
          const letterIndex = secretWordCopy.indexOf(guess[i]);
          secretWordCopy =
            secretWordCopy.substring(0, letterIndex) +
            secretWordCopy.substring(letterIndex + 1);
        } else {
          // reserve a spot of 'present' or 'absent' letters later
          guessResult.push(null);
        }
      }
  
      // now mark all present and absent letters
      for (let i = 0; i < guess.length; i++) {
        if (guessResult[i] === null) {
          // if the letter is in the word but not in the same position, it is 'present'
          if (secretWordCopy.includes(guess[i])) {
            guessResult[i] = { letter: guess[i], status: 'present' };
  
            // remove the letter so we don't double count
            const letterIndex = secretWordCopy.indexOf(guess[i]);
            secretWordCopy =
              secretWordCopy.substring(0, letterIndex) +
              secretWordCopy.substring(letterIndex + 1);
          } else {
            // if the letter is not in the word, it is 'absent'
            guessResult[i] = { letter: guess[i], status: 'absent' };
          }
        }
      }
  
      updateUI(guessResult);
    }
  
    // update the UI from the guess
    function updateUI(guessResult) {
      // increment the number of attempts
      guessAttempts++;
  
      // get the activeRow
      const activeRow = document.querySelector(`.board-row--${activeRowNumber}`);
  
      // update styles on row letters
      updateRowLetters(activeRow, guessResult);
  
      // update on-screen keyboard ui
      updateKeyboardLetters(guessResult);
  
      // get number of correct letters and pass to handleGameStatus function
      const numCorrect = guessResult.filter(
        (result) => result.status === 'correct'
      ).length;
      handleGameStatus(numCorrect);
    }
  
    function updateRowLetters(row, guessResult) {
      for (let i = 0; i < guessResult.length; i++) {
        row.children[i].classList.add(`letter-${guessResult[i].status}`);
      }
    }
  
    function updateKeyboardLetters(guessResult) {
      for (let keyboardRow of keyboard.children) {
        for (let keyboardLetter of keyboardRow.children) {
          for (let i = 0; i < guessResult.length; i++) {
            if (guessResult[i].letter === keyboardLetter.textContent) {
              if (guessResult[i].status === 'correct') {
                keyboardLetter.classList.add('letter-correct');
              } else if (!keyboardLetter.classList.contains('letter-correct')) {
                keyboardLetter.classList.add(`letter-${guessResult[i].status}`);
              }
            }
          }
        }
      }
    }
  
    // handle the game status
    // if the user is on their 6th attempt they have either won or lost!
    // if the aren't then they have either won or the game is still active
    function handleGameStatus(numCorrect) {
      if (guessAttempts === maxAttempts) {
        gameStatus = numCorrect === 5 ? 'won' : 'lost';
      } else {
        gameStatus = numCorrect === 5 ? 'won' : 'active';
      }
  
      // todo: show game result if its over
      if (gameStatus !== 'active') {
        resultModal.classList.remove('hidden');
        resultText.innerText =
          gameStatus === 'won' ? 'Congratulations!' : 'Better luck next time!';
        secretWordText.innerText = secretWord;
      } else {
        // reset the guess and move on to the next board row
        guess = '';
        activeRowNumber++;
      }
    }
  
    // reset the game when the user clicks the play again btn
    playAgainBtn.addEventListener('click', () => window.location.reload());
  }
  
  startGame();
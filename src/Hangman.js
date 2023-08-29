import { useState, setState, useEffect } from 'react';

function Hangman(props) {

  // STATE
  const [word, setWord] = useState(props.word)
  const [attemptsLeft, setAttemptsLeft] = useState()
  const [gameState, setGameState] = useState(0); // -1: Lost, 0: Ongoing, 1: Won
  const [lettersState, setLettersState] = useState(Array(props.word.length).fill('_'))
  const [lettersRemainingToBeGuessed, setLettersRemainingToBeGuessed] = useState(props.word.toUpperCase().split(''))

  /* Used useEffect: For adding event listener */
  useEffect(() => {
    document.addEventListener('keydown', keyPressed);
    return () => document.removeEventListener("keydown", keyPressed);
  })

  /* USED useEffect before: For setting the game state based on attempts left, moved the code to where attemptsLeft is decremented  */
  // useEffect(() => {
  //   console.log('use effect called (attempts left)');
  //   if (attemptsLeft <= 0) {
  //     setGameState(-1);
  //   }
  // }, [attemptsLeft])

  /* Used useEffect: For checking if the word has changed */
  useEffect(() => {
    console.log('use effect for word')
    setWord(props.word);
    setAttemptsLeft(5);
    setGameState(0);
    setLettersState(Array(props.word.length).fill('_'));
    setLettersRemainingToBeGuessed(props.word.toUpperCase().split(''));
  }, [props.word])
  

  const nextClicked = () => {
    if (gameState != 0) {
      console.log('Next clicked')
      props.minigameOverHandler(attemptsLeft);
    }
  }
  

  function onClickCharacter(e) {
    let letter = e.target.innerHTML
    console.log(letter)
    guess(letter)
  }

  function _findAndReplace(letter) {
    var found = false
    for (let i = 0; i < lettersRemainingToBeGuessed.length; i++) {
      if (lettersRemainingToBeGuessed[i] === letter) {
        var newLettersState = lettersState
        var newLettersRemainingState = lettersRemainingToBeGuessed
        newLettersRemainingState[i] = '_'
        newLettersState[i] = letter
        // delta
        const nextLettersState = lettersState.map((c, j) => {
          if (i == j) {
            return letter;
          } else {
            return c;
          }
        })
        setLettersState(nextLettersState);
        const nextRemainingState = lettersRemainingToBeGuessed.map((c, j) => {
          if (i == j) {
            return '_';
          } else {
            return c;
          }
        })
        setLettersRemainingToBeGuessed(nextRemainingState);
        found = true
        console.log(found)
      }
    }
    return found
  }

  function _isWinner() {
    return word.toUpperCase() === lettersState.join('');
  }

  function _isGuessCorrect(letter) {
    return lettersRemainingToBeGuessed.indexOf(letter) >= 0;
  }

  function guess(input) {
    if (gameState != 0) {
      return
    }
    input = input.toUpperCase();
    console.log('input', input);
    if (_isGuessCorrect(input)) {
      console.log('correct guess')
      _findAndReplace(input);
      if (_isWinner()) {
        setGameState(1);
        props.winHandler();
      }
    } else {
      setAttemptsLeft(attemptsLeft - 1);
      let newAttemptsLeft = attemptsLeft - 1;
      if (newAttemptsLeft <= 0) {
        setGameState(-1);
      }
    }
  }

  const keyPressed = (e) => {
    guess(e.key);
    console.log(`Key: ${e.key} pressed`);
  }
  
  return (
    <div className="App">
      <p id="attemptsLeft">
      {
        gameState == 0 ? <span>Attempts Left: {attemptsLeft}</span>: (gameState == 1 ? 'Nice! Click the next button below to continue.': 'No attempts left! Click next below.')
      }
      </p>
      <p id="lettersGuessed">
        {lettersState.map(letter => {
          return <span>{letter}</span>
        })}
      </p>
      <ul id="buttonList">
        {
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
            return <li key={letter}><button onClick={onClickCharacter}>{letter}</button></li>
          })}
      </ul>
      {gameState != 0 ? <div id="restartDiv"><button id="nextButton" onClick={nextClicked}>Next</button></div> : <></>}
      
    </div>
  );
}

export default Hangman;

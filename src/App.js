import React, { useState, useEffect } from 'react'
import './App.css';
import Hangman from './Hangman';
import axios from "axios";
import { useWindowSize, useTimeout } from 'react-use'
import Confetti from 'react-confetti'

axios.defaults.baseURL = "https://hangman.aryanchaubal.com"

function App() {

    const wordList = [
        'yellow',
        'red',
        'blue',
        'pink',
        'magenta',
        'purple',
        'green',
        'brown'
    ]
    const totalGames = 3
    const [username, setUsername] = useState('N/A')
    const [currentGame, setCurrentGame] = useState(1);
    const [currentWord, setCurrentWord] = useState(wordList[wordList.length * Math.random() | 0]);
    const [currentScore, setCurrentScore] = useState(0);
    const [highscoreList, setHighscoreList] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const { width, height } = useWindowSize()

    /* Used useEffect: for confetti timeout but moved code below to where confetti was fired */
    // useEffect(() => {
    //     setTimeout(() => {
    //         setShowConfetti(false);
    //     }, 2000);
    //     // useTimeout(() => {
            
    //     //   }, 500);
    // }, [showConfetti])

    /* Used useEffect: For getting the username, I guess this is necessary */
    useEffect(() => {
        console.log('app startup')
        let newUsername = 'achaubal'
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
        } else {
            // production code
            newUsername = prompt('Enter your username')
        }
        console.log(newUsername)
        setUsername(newUsername);
    }, [])

    /* Used useEffect: For POSTing the final score, moved code to place where currentgame is incremented */
    // useEffect(() => {
    //     if (currentGame > totalGames) {
    //         axios.post(`/api/scores`, {
    //             user: username,
    //             score: currentScore
    //         })
    //             .then(res => {
    //                 setHighscoreList(res.data)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })

    //     }
    // }, [currentGame])

    // When a round is over
    const minigameOver = (score) => {
        setCurrentScore(currentScore + score);
        let newWord = wordList[wordList.length * Math.random() | 0];
        while (newWord == currentWord) {
            newWord = wordList[wordList.length * Math.random() | 0];
        }
        console.log('setting new word here:', newWord);
        setCurrentWord(newWord);
        let newGame = currentGame + 1
        setCurrentGame(newGame);
        if (newGame > totalGames) {
            axios.post(`/api/scores`, {
                user: username,
                score: currentScore
            })
                .then(res => {
                    setHighscoreList(res.data)
                })
                .catch(err => {
                    console.log(err)
                })

        }
    }

    const onWin = () => {
        console.log('Yayy')
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
        }, 2000);
    }

    function refreshPage() {
        window.location.reload();
    }

    if (currentGame <= totalGames) {

        return (
            <>
                <Confetti width={width} height={height} className="confetti" numberOfPieces={showConfetti ? 400 : 0} />

                <div id="navbar">
                    <h2>Hangman</h2>
                    <div>{username}</div>
                </div>
                <div id="navbar-sec">
                    <div>Current Game: {currentGame}/{totalGames}</div>
                    <div>Total Score: {currentScore}</div>
                </div>


                <Hangman word={currentWord} minigameOverHandler={minigameOver} winHandler={onWin} />
            </>

        )
    } else {
        return (
            <>
                <div id="navbar">
                    <h2>Hangman</h2>
                    <div>{username}</div>
                </div>
                <h1>Game Over!</h1>
                <div className='container-hs'>
                <span>Your score: {currentScore}</span>
                    <h4>Highscores</h4>
                    <table>
                        <tr>
                            <th>User</th>
                            <th>Score</th>
                        </tr>
                        {highscoreList.map(entry => {
                        return (
                            <tr className="selected">
                                <td>{entry[1]}</td>
                                <td>{entry[2]}</td>
                            </tr>
                        )
                    })}
                    </table>
                    
                    <button type="button" id='nextButton' onClick={refreshPage}> <span>Play again!</span> </button>
                </div>

            </>
        )
    }
}

export default App
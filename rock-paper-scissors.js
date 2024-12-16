const ROCK_ICON_NAME = 'rock-emoji.png';
const PAPER_ICON_NAME = 'paper-emoji.png';
const SCISSORS_ICON_NAME = 'scissors-emoji.png';

const ROCK = "Rock";
const PAPER = "Paper";
const SCISSORS = "Scissors";

const WIN = "Win";
const LOSE = "Lose";
const TIES = "Ties";
const MIN_USER_SCORE = 0;

const EMPTY_TEXT = '';

const userScoreKey = 'userScore';
let isAutoPlaying = false;
let intervalId = undefined;

addEventListenerForButtons();

function addEventListenerForButtons(){
    document.getElementById('btn-move-rock').addEventListener('click', () => playGame(ROCK));
    document.getElementById('btn-move-paper').addEventListener('click', () => playGame(PAPER));
    document.getElementById('btn-move-scissors').addEventListener('click', () => playGame(SCISSORS));
    
    document.body.addEventListener('keydown', (event) =>{
        if(event.key === 'r'){
            playGame(ROCK);
        }else if(event.key === 'p'){
            playGame(PAPER);
        }else if(event.key === 's'){
            playGame(SCISSORS);
        }else if(event.key === 'a'){
            autoPlay();
        }else if(event.key === 'Backspace'){
            resetUserScore();
        }
    });

    document.getElementById('reset-score-btn').addEventListener('click', () => resetUserScore());
}

function autoPlay(){

    if(!isAutoPlaying){
        //Update auto play button
        document.getElementById('btn-auto-play').innerText = 'Stop Auto Play';

        intervalId = setInterval(
            function(){
                const autoUserSelection = pickComputerSelection();
                playGame(autoUserSelection);
            },
            2000
        );
        isAutoPlaying = true;

    }else{
        clearInterval(intervalId);
        isAutoPlaying = false;

        //Update auto play button
        document.getElementById('btn-auto-play').innerText = 'Auto Play';
    }
}

function playGame(userMove) {
    const computerMove = pickComputerSelection();
    //get user score
    const userScore = getUserScore();

    let result = '';
    if (userMove === computerMove) {
        result = 'Ties';
        userScore.ties++;

    } else if (userMove === ROCK && computerMove === SCISSORS
        || userMove === PAPER && computerMove === ROCK
        || userMove === SCISSORS && computerMove === PAPER
    ) {
        result = 'You win';
        userScore.wins++;

    } else {
        result = 'You lose';
        userScore.losses++;
    }

    //Save user score
    saveUserScore(userScore);

    updateScoreElements(userScore);
    setResultElement(`${result}`);
    setMoveElement(userMove, computerMove);

    logUserScore(userScore);
}

function setResultElement(resultText) {
    const resultElement = document.getElementById('result');
    if (!resultElement) {
        alert('The element which has result id not found');

        return;
    }

    if (resultText === EMPTY_TEXT) {
        resultElement.innerText = EMPTY_TEXT;

    } else {
        resultElement.innerText = `${resultText}.`;
    }
}

function updateScoreElements(userScore) {
    setWinScoreElement(userScore.wins);
    setLoseScoreElement(userScore.losses);
    setTieScoreElement(userScore.ties);
}

function setWinScoreElement(wins) {
    const winScoreElement = document.getElementById('win-score');
    if (!winScoreElement) {
        alert('win-score id not found');

        return;
    }

    if (wins === EMPTY_TEXT) {
        winScoreElement.innerText = EMPTY_TEXT;
    } else {
        winScoreElement.innerText = `Wins: ${wins}`;
    }
}

function setLoseScoreElement(losses) {
    const loseScoreElement = document.getElementById('lose-score');
    if (!loseScoreElement) {
        alert('lose-score id not found');

        return;
    }

    if (losses === EMPTY_TEXT) {
        loseScoreElement.innerText = EMPTY_TEXT;
    } else {
        loseScoreElement.innerText = `Losses: ${losses}`;
    }
}

function setTieScoreElement(ties) {
    const tieScoreElement = document.getElementById('tie-score');
    if (!tieScoreElement) {
        alert('tie-score id not found');

        return;
    }

    if (ties === EMPTY_TEXT) {
        tieScoreElement.innerText = EMPTY_TEXT;
    } else {
        tieScoreElement.innerText = `Ties: ${ties}`;
    }
}

function setMoveElement(userMove, computerMove) {
    const moveElement = document.getElementById('move');
    if (!moveElement) {
        alert('The element which has move id not found');

        return;
    }

    if (userMove === EMPTY_TEXT && computerMove === EMPTY_TEXT) {
        moveElement.innerHTML = EMPTY_TEXT;
    } else {
        const userMoveIconPath = getMoveIconPath(userMove);
        const computerMoveIconPath = getMoveIconPath(computerMove);

        moveElement.innerHTML = `You picked: <img src="${userMoveIconPath}"> - Computer picked: <img src="${computerMoveIconPath}"> `;
    }
}

function getMoveIconPath(move) {
    const folderName = 'img';
    let path = folderName;

    if (move === ROCK) {
        path += `/${ROCK_ICON_NAME}`;

    } else if (move === PAPER) {
        path += `/${PAPER_ICON_NAME}`;

    } else {
        path += `/${SCISSORS_ICON_NAME}`;

    }

    return path;
}

function getUserScore() {
    let userScoreJson = localStorage.getItem(userScoreKey);
    if (!userScoreJson) {
        const userScore = createUserScore();

        return userScore;
    }

    const userScore = JSON.parse(userScoreJson);

    return userScore;
}

function saveUserScore(userScore) {
    const userScoreJson = JSON.stringify(userScore);
    localStorage.setItem(userScoreKey, userScoreJson);
}

function createUserScore() {
    const userScore = {
        wins: MIN_USER_SCORE,
        losses: MIN_USER_SCORE,
        ties: MIN_USER_SCORE
    };

    const userScoreJson = JSON.stringify(userScore);
    localStorage.setItem(userScoreKey, userScoreJson);

    return userScore;
}

function logUserScore(userScore) {
    console.log(`Wins: ${userScore.wins}, Losses: ${userScore.losses}, Ties: ${userScore.ties}`)
}

function resetUserScore() {

    const isConfirmed = confirm('Do you want to reset score');
    if(!isConfirmed) return;

    const userScore = getUserScore();

    userScore.wins = MIN_USER_SCORE;
    userScore.losses = MIN_USER_SCORE;
    userScore.ties = MIN_USER_SCORE;

    saveUserScore(userScore);

    setResultElement(EMPTY_TEXT);
    setWinScoreElement(EMPTY_TEXT);
    setLoseScoreElement(EMPTY_TEXT);
    setTieScoreElement(EMPTY_TEXT);
    setMoveElement(EMPTY_TEXT, EMPTY_TEXT);

    console.log('Score was reset');
    alert('Score was reset');
}

function pickComputerSelection() {
    const randomNumber = Math.random();
    let computerSelection = EMPTY_TEXT;
    if (randomNumber >= 0 && randomNumber < 1 / 3) {
        computerSelection = ROCK;
    } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
        computerSelection = PAPER;
    } else {
        computerSelection = SCISSORS;
    }

    return computerSelection;
}
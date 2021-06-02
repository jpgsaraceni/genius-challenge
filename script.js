function Timer(){
    let timerInterval = 400;
    let time = 1000;
    let currentTime = 1000;
    let callbackTimeout;
    let callbackTimerInterval;
    let internalTimeout;
    let internalTimer;
    let minutes;
    let seconds;
    let dseconds;
    let idMinutes;
    let idSeconds;
    let idDseconds;

    function setTimerInterval(_timerInterval){
        timerInterval = _timerInterval;
    };    
    
    function setTimer(_time){
        time = _time;
        currentTime = _time;
    };

    function setCallbackTimeout(_callbackTimeout){
        callbackTimeout = _callbackTimeout;   
    };

    function setCallbackTimerInterval(_callbackTimerInterval){
         callbackTimerInterval = _callbackTimerInterval;
    };

    function setClockIds(_idMinutes, _idSeconds, _idDseconds){
        idMinutes = document.getElementById(_idMinutes);
        idSeconds = document.getElementById(_idSeconds);
        idDseconds = document.getElementById(_idDseconds);
    };

    function startTimer(){
        currentTime = time;

        internalTimer = setInterval(
            function () {
                callbackTimerInterval();
                currentTimeString(); 
            },
            timerInterval);

        internalTimeout = setTimeout(
            function () {
                callbackTimeout();
            },
            time);
    };

    function stopTimer(){
        time = currentTime;
        clearInterval(internalTimer);
        clearTimeout(internalTimeout);
    };

    function resetTimer(){
        time = 1000;
        currentTime = 1000;
        clearInterval(internalTimer);
        clearTimeout(internalTimeout);
    };

    function getCurrentTime(){
        return currentTime;
    };

    function currentTimeString(){
        let rest = currentTime;
        
        minutes = Math.floor(rest/(60*1000));
        rest -= minutes*60*1000;
        seconds = Math.floor(rest/1000);
        rest -= seconds*1000;
        dseconds = Math.floor(rest/100);

        if (minutes < 10){
            minutes = "0"+minutes;
        }
        if (seconds < 10){
            seconds = "0"+seconds;
        }
        if (idMinutes && idSeconds && idDseconds){
            idMinutes.value = minutes;
            idSeconds.value = seconds;
            idDseconds.value = dseconds;
        }
    };

    return {
        setTimer,
        setTimerInterval,
        setCallbackTimeout,
        setCallbackTimerInterval,
        setClockIds,
        startTimer,
        stopTimer,
        resetTimer,
        getCurrentTime,
        currentTimeString,
    }
}

function Simon(){
    const colors = ['green','yellow','blue','red'];
    let currentSequence = [];
    let levels = 30;
    let internalCounter = 0;
    let roundScore = 1;
    let highScore = 0;
    let elements = {};
    let config = {}; 
    let defaults = {};

    let computerFlashInterval = 1000; 
    let colorFlashInterval = 400; 
    let playerTimeout = 2000;

    let redSound = new Audio("audio/simonSoundRed.mp3");
    let blueSound = new Audio("audio/simonSoundBlue.mp3");
    let greenSound = new Audio("audio/simonSoundGreen.mp3");
    let yellowSound = new Audio("audio/simonSoundYellow.mp3");
    let errorSound = new Audio("audio/error.mpeg");
    let winSound = new Audio("audio/win.wav")

    function setElements(
        _redKey, 
        _blueKey, 
        _greenKey, 
        _yellowKey,
        _display,
        _scoreElement, 
        _highScoreElement,
        _redButton, 
        _blueButton,
        _greenButton, 
        _yellowButton,
        _stopButton,
    ){
            elements.redKey = _redKey;
            elements.blueKey = _blueKey;
            elements.greenKey = _greenKey;
            elements.yellowKey = _yellowKey;
            elements.display = _display;
            elements.scoreElement = _scoreElement;
            elements.highScoreElement = _highScoreElement;
            elements.redButton = _redButton;
            elements.blueButton = _blueButton;
            elements.greenButton = _greenButton;
            elements.yellowButton = _yellowButton;
            elements.stopButton = stopButton;
    };

    function setConfig(_levels, _strictMode, _dynamicTimer, _playerTimeout, _computerFlashInterval){
        config.levels = _levels;
        config.strictMode = _strictMode;
        config.dynamicTimer = _dynamicTimer;
        config.playerTimeout = _playerTimeout;
        config.computerFlashInterval = _computerFlashInterval;
    };

    function setDefaultKey(){ 
        elements.redKey = 82; 
        elements.blueKey = 66; 
        elements.greenKey = 71; 
        elements.yellowKey = 89;
    };

    function setComputerFlashInterval(_computerFlashInterval){ 
        computerFlashInterval = _computerFlashInterval;
    };

    function setKey(_color, _keyCode){
        switch (_color) {
            case "red":
                elements.redKey = _keyCode;
                break;
            case "blue":
                elements.blueKey = _keyCode;
                break;
            case "green":
                elements.greenKey = _keyCode;
                break;
            case "yellow":
                elements.yellowKey = _keyCode;
                break;
        }
        let arr = [];
        let count = 0;
        let def = [82, 66, 71, 89];
        arr.push(elements.redKey, elements.blueKey, elements.greenKey, elements.yellowKey);
        for (let i=0; i<4; i++){
            for (let j=0; j<4; j++){
                if (arr[i] == arr[j]){
                    count++;
                }
                if (count > 1){
                    arr[i] = def[i]
                    count = 0;
                }
            }
        }
        elements.redKey = arr[0];
        elements.blueKey = arr[1];
        elements.greenKey = arr[2];
        elements.yellowKey = arr[3];
    };

    function disableButtons(_boolean){
        red.disabled = _boolean;
        green.disabled = _boolean;
        blue.disabled = _boolean;
        yellow.disabled = _boolean;
    };

    function newSequence(){
        for( let i = 0; i < 30; i++){
            currentSequence.push(colors[Math.floor(Math.random() * 4)]);
        }
        return currentSequence;
    };

    function checkColor(_color){
        if(_color == currentSequence[internalCounter]){
            internalCounter ++;
            if (config.strictMode){
                playerTimer.stopTimer();
                playTimeout();
            }
            if(roundScore == config.levels && currentSequence[config.levels-1] == _color){
                clock.stopTimer();
                highScore = roundScore;
                winSound.play();
                elements.display.innerHTML = "You Win!"
                playerTimer.stopTimer();
            }
            if(internalCounter == roundScore){
                internalCounter = 0;
                if (roundScore > highScore){
                    highScore = roundScore;
                    elements.highScoreElement.value = highScore;                 
                }
                if (config.strictMode){playerTimer.stopTimer()}
                setTimeout(function(){nextRound()},computerFlashInterval);
                if (config.dynamicTimer){ 
                    config.computerFlashInterval *= 0.9;
                    config.playerTimeout *= 0.9;
                }
                elements.scoreElement.value = roundScore;
                roundScore ++;
            }
        } else {
            errorSound.play();
            elements.display.innerHTML="Error"
            elements.redButton.style.backgroundImage = 'radial-gradient(rgb(255 197 197), rgb(187 7 7))';
            elements.blueButton.style.backgroundImage = 'radial-gradient(rgb(168 168 255), rgb(0 9 150))';
            elements.yellowButton.style.backgroundImage = 'radial-gradient(rgb(255 255 238), rgb(157 165 11))';
            elements.greenButton.style.backgroundImage = 'radial-gradient(rgb(249 255 249), rgb(6 177 1))';
            flashTimeout();
            playerTimer.stopTimer();
            if (config.strictMode){
                elements.stopButton.innerHTML = "Play Again";
                clock.stopTimer();
                disableButtons(true);
            } else {
                setTimeout(function(){nextRound()},computerFlashInterval);
            } 
       }  
    };
   
    function flashTimeout(){
        timer.setCallbackTimeout(
            function(){
                elements.redButton.style.backgroundImage = 'linear-gradient(315deg, rgb(255,0,0), rgb(112 0 0))';
                elements.blueButton.style.backgroundImage = 'linear-gradient(225deg, rgb(0,0,255), rgb(2 3 18))';
                elements.greenButton.style.backgroundImage = 'linear-gradient(45deg, rgb(0,255,0), rgb(2 61 0))';
                elements.yellowButton.style.backgroundImage = 'linear-gradient(135deg, rgb(255,255,0), rgb(82 86 0))';
                if(!config.strictMode){
                    elements.display.innerHTML="GENIUS"
                }
        });
        timer.setTimer(colorFlashInterval);
        timer.startTimer();
    };

    function flashColors(_color){
        switch (_color) {
            case "red":
                elements.redButton.style.backgroundImage = 'radial-gradient(rgb(255 197 197), rgb(187 7 7))';
                redSound.play();
                break;
            case "blue":
                elements.blueButton.style.backgroundImage = 'radial-gradient(rgb(168 168 255), rgb(0 9 150))';
                blueSound.play();
                break;
            case "yellow":
                elements.yellowButton.style.backgroundImage = 'radial-gradient(rgb(255 255 238), rgb(157 165 11))';
                yellowSound.play();
                break;
            case "green":
                elements.greenButton.style.backgroundImage = 'radial-gradient(rgb(249 255 249), rgb(6 177 1))';
                greenSound.play();
                break;
        };
        flashTimeout();
    };

    function playTimeout(){
        playerTimer.setCallbackTimeout(
            function(){
                errorSound.play();
                clock.stopTimer;
                elements.redButton.style.backgroundImage = 'radial-gradient(rgb(255 197 197), rgb(187 7 7))';
                elements.blueButton.style.backgroundImage = 'radial-gradient(rgb(168 168 255), rgb(0 9 150))';
                elements.yellowButton.style.backgroundImage = 'radial-gradient(rgb(255 255 238), rgb(157 165 11))';
                elements.greenButton.style.backgroundImage = 'radial-gradient(rgb(249 255 249), rgb(6 177 1))';
                flashTimeout();   
                disableButtons(true);
                clock.stopTimer();
                elements.stopButton.innerHTML = "Play Again"
            }); 
        playerTimer.setTimer(config.playerTimeout);
        playerTimer.startTimer();
    };

    function nextRound(){
        elements.stopButton.innerHTML = "Stop";
        let i=0;
        disableButtons(true);
        let flashSequence = function flashSequence(){
            if(i < roundScore){
                flashColors(currentSequence[i]);
                setTimeout(flashSequence,computerFlashInterval);
                i++;
                if (i == roundScore){
                    clearTimeout(flashSequence);
                    disableButtons(false);
                    if (config.strictMode){
                    playTimeout();
                    }
                }
            }
        }
        flashSequence();       
    };

    function getKeys(){
        return [elements.redKey, elements.blueKey, elements.greenKey, elements.yellowKey];
    };

    function reset(){
        currentSequence = [];
        internalCounter = 0;
        elements.scoreElement.value = roundScore - 1;
        roundScore = 1;
    };

    function replay(){
        if (!config.strictMode){
            roundScore -1;
            nextRound();
        }
    };

    return{
        setElements,
        setConfig,
        setComputerFlashInterval,
        setDefaultKey,
        disableButtons,
        newSequence,
        setKey,
        checkColor,
        reset,
        flashColors,
        nextRound,
        getKeys,
        replay,       
    }
}

let timer = new Timer();
let clock = new Timer();
let simon = new Simon();
let playerTimer = new Timer();

const play = document.getElementById("simonPlay");
const stop = document.getElementById("stopButton0");
const save = document.getElementById("voltarButton0");
const help = document.getElementById("helpBtn");
const voltarH = document.getElementById("voltarButton1");
const classic = document.getElementById("playButton");
const restart = document.getElementById("simonRestart");
const restaurar = document.getElementById("restaurarButton0");
const display = document.getElementById("simonName");
const title = document.getElementById("title");
const playBtn =  document.getElementById("settBtn");
const settingBtn =  document.getElementById("settBtn");
const settings = document.getElementById("settBtn");
const quit = document.getElementById("quitButton0");

let initialR = 200;
let initialG = 2;
let initialB = 128;
let rIncrement = -10;
let gIncrement = 10;
let bIncrement = -10;

function colors() {
    let colorR ;

   if (initialR > 255) {
     initialR = 200;
   }

   if (initialG > 255) {
     initialG = 2;
   }

   if (initialB > 255) {
     initialB = 128;
   }

   setColor = "rgb("+(initialR++)+" "+(initialB++)+" "+(initialG++)+")";
   title.style.color = setColor;
  
}

let time = setInterval(function(){colors()},10)

simon.setElements(
    _redKey = document.getElementById("redBtn"),
    _blueKey = document.getElementById("blueBtn"),
    _greenKey = document.getElementById("greenBtn"),
    _yellowKey = document.getElementById("yellowBtn"),
    _display = document.getElementById("simonName"),
    _scoreElement = document.getElementById("score"),
    _highScoreElement = document.getElementById("highest"),
    _redButton = document.getElementById("red"),
    _blueButton = document.getElementById("blue"),
    _greenButton = document.getElementById("green"),
    _yellowButton = document.getElementById("yellow"),
    _stopButton = document.getElementById("stopButton"),
)

simon.setConfig(_levels = 30, _strictMode = true, _dynamicTimer = false, _playerTimeout = 5000);

simon.setDefaultKey();

playerTimer.setCallbackTimerInterval(function(){});

classic.addEventListener('click', (event) => {
    document.getElementById("first-page").style.display = "none";
    document.getElementById("loading-page").style.display = "flex";
    setTimeout(function(){
        document.getElementById("loading-page").style.display = "none";    
        document.getElementById("second-page").style.display = "flex";
        document.getElementById("simonPlay").style.display = "flex";
        document.getElementById("simonName").style.display = "none";
        document.getElementById("simonRestart").style.display = "none";
        display.innerHTML = "GENIUS";
    }, 2000);
    clock.stopTimer();
    simon.disableButtons(true);
    playGame;
});

help.addEventListener('click', (event) => {
    document.getElementById("help").style.display = "flex";
    document.getElementById("menu").style.display = "none";
});

settings.addEventListener('click', (event) => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("settings").style.display = "flex";
});

quit.addEventListener('click', (event) => {
    document.getElementById("first-page").style.display = "flex";
    document.getElementById("second-page").style.display = "none";
    document.removeEventListener('keydown', assignYellow);
    playerTimer.stopTimer();
});

restaurar.addEventListener('click', (event) => {
    document.getElementById("medium").checked = true;
    document.getElementById("strictOn").checked = true;
    simon.setDefaultKey();
    simon.setConfig(_strictMode = true);
    document.getElementById("redBtn").innerHTML = "r";
    document.getElementById("blueBtn").innerHTML = "b";
    document.getElementById("yellowBtn").innerHTML = "y";
    document.getElementById("greenBtn").innerHTML = "g";
    display.innerHTML = "GENIUS";
});

restart.addEventListener('click', (event) => {
    document.getElementById("simonRestart").style.display = "none"; 
    document.getElementById("simonPlay").style.display = "none";
    document.getElementById("simonName").style.display = "flex";
    timer.setCallbackTimerInterval(function(){});
    display.innerHTML = "GENIUS";
    timer.resetTimer();
    simon.reset();
    simon.newSequence();
    simon.nextRound();
    clock.resetTimer();
    startClock();
});

save.addEventListener('click', (event) => {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("settings").style.display = "none";
});

voltarH.addEventListener('click', (event) => {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("help").style.display = "none";
});

stop.addEventListener('click', (event) => {
    clock.stopTimer();
    simon.reset();
    simon.disableButtons(true);
    playerTimer.stopTimer();
    document.getElementById("simonRestart").style.display = "flex";
    document.getElementById("simonName").style.display = "none";
    document.getElementById("simonPlay").style.display = "none";
});

let playGame = play.addEventListener('click', (event) => {
    document.getElementById("simonPlay").style.display = "none";
    document.getElementById("simonName").style.display = "flex";
    timer.setCallbackTimerInterval(function(){});
    timer.resetTimer();
    simon.reset();
    simon.newSequence();
    simon.nextRound();
    let keys = simon.getKeys();
    document.addEventListener('keydown', (event) =>{
        switch (event.keyCode) {
            case keys[0]:
                clickColor("red");
                break;
            case keys[1]:
                clickColor("blue");
                break;
            case keys[2]:
                clickColor("green");
                break;
            case keys[3]:
                clickColor("yellow");
                break;
        }
    });
    startClock();
});

function clickColor(id){
    display.innerHTML = "GENIUS";
    simon.flashColors(id);
    simon.checkColor(id);
};

function assignRed(e){
    simon.setKey("red", e.keyCode);
    document.removeEventListener('keydown', assignRed);
    document.getElementById("redBtn").innerHTML = e.key;
};

function assignBlue(e){
    simon.setKey("blue", e.keyCode);
    document.removeEventListener('keydown', assignBlue);
    document.getElementById("blueBtn").innerHTML = e.key;
};

function assignGreen(e){
    simon.setKey("green", e.keyCode);
    document.removeEventListener('keydown', assignGreen);
    document.getElementById("greenBtn").innerHTML = e.key;
};

function assignYellow(e){
    simon.setKey("yellow", e.keyCode);
    document.removeEventListener('keydown', assignYellow);
    document.getElementById("yellowBtn").innerHTML = e.key;
};

function read(id){
    if (id == "redKey"){document.addEventListener('keydown', assignRed);}
    if (id == "blueKey"){document.addEventListener('keydown', assignBlue);}
    if (id == "greenKey"){document.addEventListener('keydown', assignGreen);}
    if (id == "yellowKey"){document.addEventListener('keydown', assignYellow);}
};

function startClock(){
    clock.setTimer(0);
    clock.setTimerInterval(100);
    clock.setCallbackTimeout(function(){});
    clock.setCallbackTimerInterval(function(){
        let currentTime = clock.getCurrentTime();
        currentTime += 100;
        clock.setTimer(currentTime);
        });
    clock.setClockIds("minutes", "seconds", "dseconds");
    clock.startTimer();
    clock.currentTimeString();
};

document.getElementById("voltarButton0").addEventListener('click', (event) =>{
    if (document.getElementById("slow").checked){ 
        simon.setConfig(_dynamicTimer = false);
        simon.setConfig(_playerTimeout = 10000);
        simon.setConfig(_levels = 5); 
    } else if (document.getElementById("medium").checked){
        simon.setConfig(_dynamicTimer = true);
        simon.setConfig(_playerTimeout = 5000);
        simon.setConfig(_levels = 15);
    } else if (document.getElementById("fast").checked){
        simon.setConfig(_dynamicTimer = true);
        simon.setConfig(_playerTimeout = 2000);
        simon.setComputerFlashInterval(500);
        simon.setConfig(_levels = 30);
    }
    if (document.getElementById("strictOn").checked){
        simon.setConfig(_strictMode = true);
        simon.setConfig(_levels = 30);
        document.getElementById("replayButton").style.display = "none";
    } else if (document.getElementById("strictOff").checked){
        simon.setConfig(_strictMode = false);
        simon.setConfig(_levels = 30);
        document.getElementById("replayButton").style.display = "contents";
    }
});
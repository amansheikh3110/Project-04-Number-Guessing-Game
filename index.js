let computer;
let userGuess = [];
let usernumberUpdate = document.getElementById("zoneheading");
let userinputnumber = document.getElementById("inputbox");
let click = new Audio("click.wav");
let win = new Audio("win.wav");
let lose = new Audio("lose.wav");



const init = () => {
    computer = Math.floor(Math.random()*100);
    document.getElementById("newgame").style.display="none";
    document.getElementById("playzone").style.display="none";
};

const startGame = () => {
    document.getElementById("playzone").style.display="flex";
    document.getElementById("container").style.display="none";
    click.play();
};

const startnewgame = () => {
    document.getElementById("newgame").style.display="flex";
    document.getElementById("inputbox").style.display="none";
};

const newGameBegin = () => {
    click.play();
    window.location.reload();  
};

const compareGuess=()=>{
    const userNumber = Number(userinputnumber.value);
    userGuess = [...userGuess,userNumber];
    document.getElementById("guesses").innerHTML = userGuess;

  if(userGuess.length<maxGuess) 
  {if (userNumber > computer) {
        usernumberUpdate.innerHTML=("Your Guess is high !");
        userinputnumber.value="";
        click.play();
    }else if (userNumber < computer){
        usernumberUpdate.innerHTML=("Your Guess is low !");
        userinputnumber.value="";
        click.play();
    }else {
        usernumberUpdate.innerHTML=("Congratulations, It is correct !");
        userinputnumber.value="";
        startnewgame();
        win.play();
    }
}
else
{if (userNumber > computer) {
    usernumberUpdate.innerHTML=(`You loose !! The correct number was ${computer}`);
    userinputnumber.value="";
    startnewgame();
    lose.play();
}else if (userNumber < computer){
    usernumberUpdate.innerHTML=(`You loose !! The correct number was ${computer}`);
    userinputnumber.value="";
    startnewgame();
    lose.play();
}else {
    usernumberUpdate.innerHTML=("Congratulations, It is correct !");
    userinputnumber.value="";
    startnewgame();
    win.play();
}
}

document.getElementById("attempts").innerHTML = userGuess.length;
}
const easyMode = () => {
    maxGuess = 10;
    startGame();
}
const hardMode = () => {
    maxGuess = 5;
    startGame();
}



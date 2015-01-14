
window.onload = function()
{
	createGame()
}

var toggleFlag = function() {
	if (this.innerHTML == "!") {
		this.classList.remove("flag");
		this.innerHTML = "";
	}
	else {
		this.classList.add("flag");
		this.innerHTML = "!";
	}
	return false;
}

var numRows, numCols, numMines, numLeft, mines, firstClick;
var newGame = document.getElementById("create");
var board = document.getElementById("board");

//Difficulties
var difficulty = document.getElementById("difficulty");
var beginner = difficulty.options[0];
var intermediate = difficulty.options[1];
var expert = difficulty.options[2];
var custom = difficulty.options[3];

//difficulty handlers
var setBeginner = function() {
	beginner.selected='selected';
}
var setIntermediate = function() {
	intermediate.selected='selected';
}
var setExpert = function() {
	expert.selected='selected';
}
var setCustom = function() {
	var custom = document.getElementById("custom");
	custom.classList.remove("hideThis");
}
beginner.onclick = setBeginner;
intermediate.onclick = setIntermediate;
expert.onclick = setExpert;


//set variables for a new game
var setVariables = function() {
	var chosen = difficulty.options[difficulty.selectedIndex].text;
	switch(chosen) {
		case "Beginner":
			console.log("Beginner");
			numRows = 8;
			numCols = 8;
			numMines=10;
			break;
		case "Intermediate":
			console.log("Intermediate");
			numRows = 16;
			numCols = 16;
			numMines = 40;
			break;
		case "Expert":
			console.log("Expert");
			numRows = 16;
			numCols = 30;
			numMines = 99;
			break;
	}
	numLeft = numRows*numCols - numMines;
}

//randomly set mines around the board
var setMines = function() {
	var randX, randY;
	mines = [];
	for (var i = 0; i < numRows; i++) {
		mines.push([]);
		for (var j = 0; j < numCols; j++) {
			mines[i][j] = 0;
		}
	}
	var minesLeft = numMines;
	while (minesLeft > 0) {
		randX = Math.floor(Math.random()*numCols);
		randY = Math.floor(Math.random()*numRows);
		if (mines[randY][randX] != 1)
		{
			mines[randY][randX] = 1;
			minesLeft -= 1;
		}
	}
	
}


//determine if a block contains a mine
function isMine(y, x) {
	return (mines[y][x] == 1);
}



var currLand,numAdjacent;

//return the number of mines around the block
function countAdjacent(y, x) {
	var left = x > 0;
	var right = x < numCols-1;
	var up = y > 0;
	var down = y < numRows-1;
	var numAround=0;
	if(left) {
		if (isMine(y,x-1)) {
			numAround+=1;
		}
		if (up) {
			if (isMine(y-1,x-1)) {
				numAround+=1;
			}
		}
			
		if (down) {
			if (isMine(y+1,x-1)) {
				numAround+=1;
			}
		}
	}
	
	if(right) {
		if (isMine(y,x+1)) {
			numAround+=1;
		}
		if (up) {
			if (isMine(y-1,x+1)) {
				numAround+=1;
			}
		}
		if (down) {
			if (isMine(y+1,x+1)) {
				numAround+=1;
			}
		}
	}
	
	if (up) {
		if (isMine(y-1,x)) {
			numAround+=1;
		}
	}
	
	if (down) {
		if (isMine(y+1,x)) {
			numAround+=1;
		}
	}
	return numAround;
}

var newMines = function(y, x) {
	var adjacent;
	do {
		setMines();
		adjacent = countAdjacent(y,x);
	}
	while (adjacent > 0);
}


//determines the number of mines adjacent to the block.
//if no adjacent mines, rollback on the surrounding blocks
function rollBack(y, x) {
	numLeft -= 1;
	var left = x > 0;
	var right = x < numCols-1;
	var up = y > 0;
	var down = y < numRows-1;
	currLand = document.getElementById(y + " " + x);
	currLand.classList.add("revealed");
	currLand.classList.remove("hidden");
	numAdjacent = countAdjacent(y, x);
	switch (numAdjacent) {
		case 0:
			if(right){
				currLand = document.getElementById(y + " " + parseInt(x+1));
				if (currLand.classList.contains("hidden")){
					rollBack(y,x+1);
				}
				if(up){
					currLand = document.getElementById(parseInt(y-1) + " " + parseInt(x+1));
					if (currLand.classList.contains("hidden")){
						rollBack(y-1,x+1);
					}
				}
				if(down){
					currLand = document.getElementById(parseInt(y+1) + " " + parseInt(x+1));
					if (currLand.classList.contains("hidden")){
						rollBack(y+1,x+1);
					}
				}
			}
			if(left){
				currLand = document.getElementById(y + " " + parseInt(x-1));
					if (currLand.classList.contains("hidden")){
						rollBack(y,x-1);
					}
				if(up){
					currLand = document.getElementById(parseInt(y-1) + " " + parseInt(x-1));
					if (currLand.classList.contains("hidden")){
						rollBack(y-1,x-1);
					}
				}
				if(down){
					currLand = document.getElementById(parseInt(y+1) + " " + parseInt(x-1));
					if (currLand.classList.contains("hidden")){
						rollBack(y+1,x-1);
					}
				}
			}
			if(up){
				currLand = document.getElementById(parseInt(y-1) + " " + x);
					if (currLand.classList.contains("hidden")){
						rollBack(y-1,x);
					}
			}
			if(down){
				currLand = document.getElementById(parseInt(y+1) + " " + x);
					if (currLand.classList.contains("hidden")){
						rollBack(y+1,x);
					}
			}
			currLand.classList.add("clear");
			break;
		case 1:
			currLand.classList.add("one");
			currLand.innerHTML = "1";
			break;
		case 2:
			currLand.classList.add("two");
			currLand.innerHTML = "2";
			break;
		case 3:
			currLand.classList.add("three");
			currLand.innerHTML = "3";
			break;
		case 4:
			currLand.classList.add("four");
			currLand.innerHTML = "4";
			break;
		case 5:
			currLand.classList.add("five");
			currLand.innerHTML = "5";
			break;
		case 6:
			currLand.classList.add("six");
			currLand.innerHTML = "6";
			break;
		case 7:
			currLand.classList.add("seven");
			currLand.innerHTML = "7";
			break;
		case 8:
			currLand.classList.add("eight");
			currLand.innerHTML = "8";
			break;
	}
	if (numLeft == 0) {
		revealAll();
	}
}

function revealAll() {
	var currLand;
	for (var i = 0; i < numRows; i++) {
		for (var j = 0; j < numCols; j++) {
			currLand = document.getElementById(i + " " + j);
			if (isMine(i,j)) {
				currLand.innerHTML = "X";
				currLand.classList.remove("hidden");
				currLand.classList.add("revealed");
			}
			else {
				rollBack(i,j);
			}
		}
	}
	if (gameOver) {
		alert("You Lose!");
	}
	else {
		alert("You Win!");
	}
}

//reveal the block selected, rollback if not a mine
var reveal = function() {
	this.classList.remove("hidden");
	this.classList.add("revealed");
	var coords = this.id.split(" ");
	var yCoord = parseInt(coords[0]);
	var xCoord = parseInt(coords[1]);
	if (isMine(yCoord,xCoord)) {
		if (firstClick)	{
			newMines(yCoord,xCoord);
			firstClick = false;
			rollBack(yCoord,xCoord);
		}
		else {
			this.innerHTML = "X";
			gameOver = true;
			revealAll();
		}
	}
	else
	{
		if (firstClick) {
			newMines(yCoord,xCoord);
		}
		firstClick = false;
		rollBack(yCoord, xCoord);
	}
}

//Create new board
//Set Mines
var createGame = function() {
	var row,col,landValue, landHolder, land, lands;
	board.innerHTML = "";
	setVariables();
	setMines();
	firstClick = true;
	for (var i = 0; i < numRows; i++) {
		row = document.createElement("tr");
		board.appendChild(row);
		for (var j = 0; j < numCols; j++) {
			land = document.createElement("td");
			land.classList.add("land");
			land.classList.add("hidden");
			land.id = i + " " + j;
			land.addEventListener("click", reveal);
			land.oncontextmenu = toggleFlag;
			row.appendChild(land);
		}
	}
	gameOver = false;
}

newGame.onclick = createGame;

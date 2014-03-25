var Game = function(startLetter){
	
	this.index = -1;	
	this.cornersArray = [[0, 0], [0, 2], [2, 0], [2,2]];
	this.opositeCorners = {
		"00": [2,2],
		"02": [2,0],
		"20": [0,2],
		"22": [0,0]
	};
	this.lastMove = [-1, -1];
	this.currentLetter = startLetter || "X";
	this.init();
};

Game.prototype.init = function(){
	var game = this;
	game.map = [[-1, -1, -1],
			[-1, -1, -1],
			[-1, -1, -1]];
	game.lastMove = [-1, -1];
	
	game.cells = game.cells || $(".cell");
	game.cells.click(function(){
		var el = $(this);
		var x = el.parent().attr("data-row"),
			y = el.attr("data-cell");
		game.renderMove(el, x, y);
		game.makeMove();
			
	});
	
	$("#startOver").click(function(){
		game.reset();
	});
	
	$("#humanStart").click(function(){
		game.reset();
	});
	
	$('#computerStart').click(function(){
		game.reset();
		game.makeMove();
	});
};

Game.prototype.reset = function(startLetter){
	
	this.currentLetter = "X";
	this.cells.unbind("click");
	this.cells.removeClass("x").removeClass("o");
	this.init();
}

Game.prototype.checkforWin = function(x, y, letter){
	var tempMap = this.map.map(function(arr){
		return arr.slice(0);
	});
	tempMap[x][y] = letter;
	//Check horizontal rows 
	for(var i = 0; i<3; i++){
		if(	tempMap[i][0] == letter
			&& tempMap[i][1] == letter
			&& tempMap[i][2] == letter) {
				
				return true;
			}
	}
	
	//Check vertical cols
	for(var i=0; i<3; i++){
		if(tempMap[0][i] == letter
			&& tempMap[1][i] == letter
			&& tempMap[2][i] == letter){
				return true;	
			}
	}
	
	//Diagonals check
	if(	tempMap[0][0] == letter 
		&& tempMap[1][1] == letter
		&& tempMap[2][2] == letter){
			return true;
	}
	
	if(tempMap[0][2] == letter
		 && tempMap[1][1] == letter
		 && tempMap[2][0] == letter){

		return true;
	}

	return false;

};

Game.prototype.renderMove= function(el, x, y){
	
	var moveCell = el || $("[data-row=" + x + "]").find("[data-cell=" + y +"]");
	
	moveCell.unbind("click");
	this.lastMove = [x, y];
	
		
	this.map[x][y] = this.currentLetter;
	
	moveCell.addClass(this.currentLetter.toLowerCase());
		
	if (this.checkforWin(x, y, this.currentLetter)){
		alert(this.currentLetter + " Wins");
	} else {
		
		this.currentLetter = (this.currentLetter == "X") ? this.currentLetter = "O" : this.currentLetter = "X";
		
	};
};

Game.prototype.makeMove = function(){
	
	var opponentLetter = (this.currentLetter == "X") ? "O" : "X";
	
	//Deep copy the map array. 
	var nextMoveMap = this.map.map(function(arr){
		return arr.slice(0);
	});
	
	//corners are a good acceptable moves
	for(var i=0; i<this.cornersArray.length; i++){
		if(!isNaN(nextMoveMap[this.cornersArray[i][0]][this.cornersArray[i][1]])){
			nextMoveMap[this.cornersArray[i][0]][this.cornersArray[i][1]] = 2;
		}
	}
	
	//but the opposite corner is better
	if(this.opositeCorners.hasOwnProperty(this.lastMove.join(""))){
		var corner = this.opositeCorners[this.lastMove.join("")];
		
		//If corner is bit taken then its a good move
		if(!isNaN(nextMoveMap[corner[0][corner[1]]])){
			nextMoveMap[corner[0]][corner[1]] = 2;
		}
		
		//but forks are evil
		if(nextMoveMap[corner[0]][corner[1]] == opponentLetter){
			nextMoveMap[corner[0]][1] = 3;
		}
		
	}
	
	//is center open, lets try going there?
	if(nextMoveMap[1][1] < 0) {
		nextMoveMap[1][1] = 3;
	}
	
	//but I can win check next move for win
	for(var x=0; x<3; x++){
		for(var y=0; y<3; y++){
			if(!isNaN(nextMoveMap[x][y])){
				if(this.checkforWin(x, y, this.currentLetter)){
					nextMoveMap[x][y] = 5;
				} 
			}
		}
	}
	
	//Can opponent win on the next move then block it
	for(var x=0; x<3; x++){
		for(var y=0; y<3; y++){
			if(!isNaN(nextMoveMap[x][y])){
				if(this.checkforWin(x, y, opponentLetter)){
					nextMoveMap[x][y] = 4;
				} else {
				}
			} else {
				
			}
		}
	}
	
	//Grab the highest value out of all possible moves and play the next piece there
	var maxX = -1; maxY = -1, maxVal = 0;
	for(var x=0; x<3; x++){
		for(var y=0; y<3; y++){
			if(!isNaN(nextMoveMap[x][y])){
				if(maxVal < nextMoveMap[x][y]){
					maxX = x;
					maxY = y;
					maxVal = nextMoveMap[x][y];
				}
			}
		}
	}
	
	if(maxX == -1 && maxY == -1){
		alert("Draw");
	} else {
		this.renderMove(null, maxX, maxY);
	}	
	
};

var tiktak = new Game();


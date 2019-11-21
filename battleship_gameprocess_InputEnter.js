var tds = document.querySelectorAll('.battleship-field__unit');
var tdsArray = Array.prototype.slice.call(tds);
var battleMessage = document.querySelector('.battleship-message');
var closeResultMessage = document.getElementById('closeResultMessage');
var page = document.querySelector('.page');
var guessInput = document.getElementById('guess-input');
var fireButton = document.getElementById('fire-button');

var sizeArray = [7, 7]; //in future it is received from user input value entering CONVERTED from text to numbers, length is 2, isNaN check
var board7x7;//in future after input of board size is implemented  the name board7x7 should be replaced into smth not so specific (no 7x7)
var allPositionsText = [];

var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


function buildField(rowsAndColumns = []) {
  var fieldArray=[];
  var countOfIndex = 0;
  for (var i=0; i<rowsAndColumns[0]; i++) {
    for (var j=0; j<rowsAndColumns[1]; j++) {
      fieldArray[countOfIndex] = i + "" + j;
      countOfIndex++;
    }
  }
  return fieldArray;
}
function checkAvailability(item, unavailables=[]) { //item- miniArray converted to Text; unavailables - takenUnits
  for (var i=0; i<unavailables.length; i++) {
  	if (unavailables[i] == item) {
  	  return false
  	}
  }
  return true;
}

function addLocationsTextToTakenUnits(listText, dataSource, toAddList) {
  var indexOfTakenUnit;
  for (var i=0; i<listText.length; i++) {
  	indexOfTakenUnit = dataSource.indexOf(listText[i]);
  	toAddList[indexOfTakenUnit] = listText[i];
  }
}
function convertToText(list = []) {  //list - array of arrays
  var listText = [];
  for (var i=0; i<list.length; i++) {
    listText[i] = "".concat(...list[i]);
  }
  return listText;
}

function copyArrayOfArrays(originalArray = [], somePosition) {
  var originalArrayText = [];
  for (var i=0; i<originalArray.length; i++) {
    originalArrayText[i] = "".concat(...originalArray[i]);
  }	
  var copy = originalArrayText.slice();
  for (var i=0; i<copy.length; i++) {
    copy[i] = (copy[i]).split("");
  }
  for (var i=0; i<copy.length; i++) {
    copy[i][somePosition] = parseInt(copy[i][somePosition]);
    copy[i][1-somePosition] = parseInt(copy[i][1-somePosition]);
  }
  return copy;
}

function Battleship(rowsAndColumns = []) {
  this.rowsAndColumns = rowsAndColumns;
  this.shipAmount =  Math.floor(this.rowsAndColumns[0]*this.rowsAndColumns[1]*0.2);
  if (this.shipAmount>40 || this.shipAmount <4) {alert("The board size is between 20X10 (10X20) and 4X5 (5X4) includingly"); return false}
  this.shipRange = [];
  this.buildShipRange = function() {
    var countOf2 = 0;
    var countOf3 = 0;
    var countOf4 = 0;
    var a; var b; var c;
    if (this.shipAmount >= 28) {
      a=2;
      b=3;
      c=4;
    }
    if (this.shipAmount < 28 && this.shipAmount >= 16) {
      a=1;
      b=2;
      c=3;
    }
    if (this.shipAmount < 16 && this.shipAmount >= 8) {
      a=0;
      b=1;
      c=2;
    }
    if (this.shipAmount < 8) {
      a=0;
      b=0;
      c=2;
    }
    for (var i =1; i<= a; i++) {
      this.shipRange.push({decks: 4, positions: [],  neighbours: [], beatenPositionsText: [], positionsText: [] });
      countOf4++;
    }
    for (var i =1; i<= b; i++) {
      this.shipRange.push({decks: 3, positions: [],  neighbours: [], beatenPositionsText: [], positionsText: []});
      countOf3++;
    }
    for (var i =1; i<= c; i++) {
      this.shipRange.push({decks: 2, positions: [],  neighbours: [], beatenPositionsText: [], positionsText: []});
      countOf2++;
    }
    for (var i=1; i<=(this.shipAmount - (countOf4*4+countOf3*3+countOf2*2)); i++) {
      this.shipRange.push({decks: 1, positions: [],  neighbours: [], beatenPositionsText: [], positionsText: []});

    }
  }
  this.buildShipRange(); //?????своего рода вызов метода внутри??
}


function randomfill(someBoard) {
  if (!(someBoard instanceof  Battleship)) {alert("Wrong type of object"); return false}

  var board = buildField(someBoard.rowsAndColumns);
  var takenUnits = [];
  

  for (var i = 0; i<someBoard.shipRange.length; i++) {
    someBoard.shipRange[i].neighbours = [];
    //someBoard.shipRange[i].positionsText = convertToText(someBoard.shipRange[i].positions);
    var criteria = false;
    var firstIdArray = [];
    var position;
    var locations = [];
    while(!criteria) {
      var j=0;
      firstIdArray = [Math.floor(Math.random()*someBoard.rowsAndColumns[0]), Math.floor(Math.random()*someBoard.rowsAndColumns[1])];
      firstIdArrayText = "".concat(...firstIdArray);
      criteria = checkAvailability(firstIdArrayText, takenUnits);
      
      if (!criteria) {continue}
      locations.push(firstIdArray);
      someBoard.shipRange[i].positions.push(firstIdArray);
      position = Math.floor(Math.random()*2);
      
      for (var a=1; a<someBoard.shipRange[i].decks; a++) {
        var nextIdArray = [];  
        nextIdArray[1-position] = firstIdArray[1-position];
  
        if ((nextIdArray[position] = firstIdArray[position]+a) <= (someBoard.rowsAndColumns[position]-1) && checkAvailability("".concat(...nextIdArray),takenUnits)) {
          locations.push(nextIdArray); 
          someBoard.shipRange[i].positions.push(nextIdArray);
        } else {
          j=j+1;
          if ((nextIdArray[position] = firstIdArray[position]-j) >= 0 && checkAvailability("".concat(...nextIdArray),takenUnits)) {
            locations.push(nextIdArray);
            someBoard.shipRange[i].positions.push(nextIdArray);
          } else {
            criteria = false; 
            locations=[]; 
            someBoard.shipRange[i].positions = [];
            break; 
          }
        }     
      }
    }
    var locationsText = convertToText(locations);
    var maxItemIndex = 0;
    var maxItem = locationsText[maxItemIndex];
    var minItemIndex = 0;
    var minItem = locationsText[maxItemIndex];
    for (var c=0; c<locationsText.length; c++) {
      if(parseInt(locationsText[c])>parseInt(maxItem)) {
        maxItem = locationsText[c];
        maxItemIndex = c;
      }
    }
    for (var c=0; c<locationsText.length; c++) {
      if(parseInt(locationsText[c])<parseInt(minItem)) {
        minItem = locationsText[c];
        minItemIndex = c;
      }
    }
    var biggestLocation = locations[maxItemIndex]; //miniArray
    var smallestLocation = locations[minItemIndex]; //miniArray
    var expandedLocations = [];
    expandedLocations = copyArrayOfArrays(locations, position);
    var toSmallestlocation = [];
    var afterBiggestLocation = [];
    toSmallestlocation[1-position] = smallestLocation[1-position];
    toSmallestlocation[position] = smallestLocation[position] - 1;
    afterBiggestLocation[1-position] = biggestLocation[1-position];
    afterBiggestLocation[position] = biggestLocation[position] + 1;
    if (toSmallestlocation[position] >= 0) {
      expandedLocations.push(toSmallestlocation);
      someBoard.shipRange[i].neighbours.push("".concat(...toSmallestlocation));
    }
    if (afterBiggestLocation[position] <=(someBoard.rowsAndColumns[position]-1)) {
      expandedLocations.push(afterBiggestLocation);
      someBoard.shipRange[i].neighbours.push("".concat(...afterBiggestLocation));
    }
  
    if (expandedLocations[0][1-position]>0) {
      var toExpandedLocations = [];
      toExpandedLocations = copyArrayOfArrays(expandedLocations, position);
      for (var b=0; b<toExpandedLocations.length; b++) { //CHECK
        toExpandedLocations[b][1-position] = toExpandedLocations[b][1-position]-1;
      }
      for (var x=0; x<toExpandedLocations.length; x++) {
        someBoard.shipRange[i].neighbours.push("".concat(...toExpandedLocations[x]))
      }
    }
    if (expandedLocations[0][1-position] < (someBoard.rowsAndColumns[1-position]-1) ) {
      var afterExpandedLocations = [];
      afterExpandedLocations = copyArrayOfArrays(expandedLocations,position);
      for (var b=0; b<afterExpandedLocations.length; b++) { //CHECK
        afterExpandedLocations[b][1-position] = afterExpandedLocations[b][1-position]+1;
      }
      for (var x=0; x<afterExpandedLocations.length; x++) {
        someBoard.shipRange[i].neighbours.push("".concat(...afterExpandedLocations[x]))
      }
    }
    
    addLocationsTextToTakenUnits(convertToText(expandedLocations),board, takenUnits);
    addLocationsTextToTakenUnits(convertToText(toExpandedLocations),board, takenUnits);
    addLocationsTextToTakenUnits(convertToText(afterExpandedLocations),board, takenUnits); 
  }
}

function buildBoard() {
  board7x7 = new Battleship(sizeArray);
}

function createPositionsText(someBoard) {
  if (!(someBoard instanceof  Battleship)) {alert("Wrong type of object"); return false}
  for (var i = 0; i<someBoard.shipRange.length; i++) {
    someBoard.shipRange[i].positionsText = convertToText(someBoard.shipRange[i].positions);
  }
}//add this to object - НЕ ПОЛУЧАЕТСЯ

function getAllPositionsText() {
  for (var j=0; j<board7x7.shipRange.length; j++) {
    allPositionsText = allPositionsText.concat(board7x7.shipRange[j].positionsText)
  }
}

function restart() {
  buildBoard();
  randomfill(board7x7);
  createPositionsText(board7x7);
  getAllPositionsText();
}

function  checkOfGuess(guessUnit, someBoard) {
  if (!(someBoard instanceof  Battleship)) {
    alert("Wrong type of object"); return false
  }
  
  for (var j=0; j<someBoard.shipRange.length; j++) {
    for (var i = 0; i< someBoard.shipRange[j].positionsText.length; i++) {
      if (guessUnit.id == someBoard.shipRange[j].positionsText[i]) {
        guessUnit.classList.add('battleship-field__unit--hit');
        if (board7x7.shipRange[j].beatenPositionsText.indexOf(guessUnit.id) < 0) {
          var idFromAllPositions = allPositionsText.indexOf(guessUnit.id);//??
          allPositionsText.splice(idFromAllPositions, 1);
          board7x7.shipRange[j].beatenPositionsText.push(guessUnit.id);//creating array of beaten positions
        }
        if (board7x7.shipRange[j].beatenPositionsText.length == board7x7.shipRange[j].positionsText.length) {//board7x7.shipRange[j].positionsText.length == 0
          for (var y=0; y<board7x7.shipRange[j].neighbours.length; y++) {
            var tdMissed = document.getElementById(board7x7.shipRange[j].neighbours[y]);
            tdMissed.classList.add('battleship-field__unit--missed');
          }
        }
        if (board7x7.shipRange[j].beatenPositionsText.length == board7x7.shipRange[j].positionsText.length) {//board7x7.shipRange[j].positionsText.length == 0
          for (var y=0; y<board7x7.shipRange[j].beatenPositionsText.length; y++) {
            var tdBeaten = document.getElementById(board7x7.shipRange[j].beatenPositionsText[y]);
            tdBeaten.classList.add('battleship-field__unit--hit-all');
          }
        }
        
        if (allPositionsText.length == 0) { //??alert срабатывает быстрее статуса HIT
          battleMessage.classList.remove('batlleship-message--hidden')
          page.classList.add('page--overlay');
        }
        return
      }
    }
  }
  guessUnit.classList.add('battleship-field__unit--missed');
}


function checkInputLetter(row, column, someBoard) {
  if (!(someBoard instanceof  Battleship)) {
    alert("Wrong type of object"); 
    return false;
  }
  if ((row >= 0) && (row < someBoard.rowsAndColumns[0]) && (column >= 0) && (column < someBoard.rowsAndColumns[1])) {
    return true;
  }
  return false;
}

function processInput() {
  if (guessInput.value && guessInput.value.trim().length === 2 && isNaN(guessInput.value.trim()[0])) {//OR a line later: if(guessId) {}
    //guessInput.classList.remove('battleship-form__input--mistake');
    var rowIdSubstitute =  letters.indexOf(guessInput.value.trim().toLowerCase()[0]);
    var columnId = guessInput.value.trim()[1];
   
    if (checkInputLetter(rowIdSubstitute, parseInt(columnId), board7x7)) {
      var guessId = rowIdSubstitute + "" + columnId;
      var guess = document.getElementById(guessId);
      //guessInput.classList.remove('battleship-form__input--mistake');
      checkOfGuess(guess, board7x7);
      guessInput.value = "";
    } else {
      guessInput.classList.add('battleship-form__input--mistake');//shows up twice: REDUCE!
    }
  } else {
    guessInput.classList.add('battleship-form__input--mistake');//shows up twice: REDUCE!
  }
}

window.onload = restart();


closeResultMessage.addEventListener('click', function(evt) {
  evt.preventDefault();
  battleMessage.classList.add('batlleship-message--hidden');
  page.classList.remove('page--overlay');
  tds.forEach(function(td) {//automatie this
    td.classList.remove('battleship-field__unit--hit');
    td.classList.remove('battleship-field__unit--missed');
    td.classList.remove('battleship-field__unit--hit-all');
    td.classList.remove('battleship-field__unit--test');
  })
  restart();
})


window.addEventListener('keydown', function(evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    
    if (page.classList.contains('page--overlay')) {
      battleMessage.classList.add('batlleship-message--hidden');
      page.classList.remove('page--overlay')
    }
  }
}) 

fireButton.addEventListener('click', function(evt) {
  evt.preventDefault();
  processInput();
});

guessInput.addEventListener('keydown', function(evt) {
  if(evt.keyCode === 13) {
    evt.preventDefault();
    processInput();
  }
});

tds.forEach(function(td) {
  td.addEventListener('click', function() {
    checkOfGuess(td, board7x7);
  })
})

tds.forEach(function(td) {
  td.addEventListener('keydown', function(evt) {
    if(evt.keyCode===13) {
      evt.preventDefault();
      checkOfGuess(td, board7x7);
    }
  })
})

//to remove mistake class
guessInput.addEventListener('click', function() {
  guessInput.classList.remove('battleship-form__input--mistake');
})
guessInput.addEventListener('keydown', function(evt) {
  if (evt.keyCode !==13) {
    guessInput.classList.remove('battleship-form__input--mistake');
  }
})

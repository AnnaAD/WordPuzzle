//console.log("loaded");

var mode = "row"; //select mode is either row or column
var width = 5;
var height = 5;
var letters = "abcde";


var settings = {
  autoNextLine: true
}


$(function(){
  var oldFocus = $("#a1");
  oldFocus.focus();
  updateHighlights(oldFocus);

  for(var i = 1; i < 6; i++) {
    $("#aclue" + i).text(puzzle.acrossClues[i-1]);
  }

  for(var i = 1; i < 6; i++) {
    $("#dclue" + i).text(puzzle.downClues[i-1]);
  }

  //changes focus automatically after typing a character
  $("input").keyup(function (e) {
    if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
      //console.log("returned");
      return;
    }
    //console.log("running");
    if (this.value.length == this.maxLength) {
      var id = $(this).attr('id');
      var newfocusId;
      if(mode == "row") {
        newfocusId = incrementRow(id);
      } else if (mode == "column") {
        newfocusId = incrementColumn(id);
      }

      $("#"+newfocusId).focus();
      oldFocus = $("#"+newfocusId);

    }
  });

  //Allows for users to easily type over old inputs
  $("input").keydown(function (e) {
    if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
      return;
    }
    $(this).val("");
  });


  //Arraow key focus control
  $(document).keydown(function(e) {
    console.log(e.keyCode);
    var id = $(document.activeElement).attr("id");

    if(id == undefined) {
      return;
    }

    //37 left
    //38 up
    //39 right
    //40 down

    if(e.keyCode == 39) {
      if(mode == "row") {
        $("#" + id.slice(0,1) + (parseInt(id.slice(1,2)) + 1)).focus();
      } else {
        mode = "row";
        updateHighlights($(document.activeElement));
      }
    } else if (e.keyCode == 40) {
      if(mode == "column") {
        var index = letters.indexOf(id.slice(0,1));
        $("#" + letters.slice(index+1, index+2) + id.slice(1,2)).focus();
      } else {
        mode = "column";
        updateHighlights($(document.activeElement));
      }
    } else if (e.keyCode == 37) {
      if(mode == "row") {
        $("#" + id.slice(0,1) + (parseInt(id.slice(1,2)) - 1)).focus();
      } else {
        mode = "row";
        updateHighlights($(document.activeElement));
      }
    } else if (e.keyCode == 38) {
      if(mode == "column") {
        var index = letters.indexOf(id.slice(0,1));
        $("#" + letters.slice(index-1, index) + id.slice(1,2)).focus();
      } else {
        mode = "column";
        updateHighlights($(document.activeElement));
      }
    }
  });



  $("input").click(function(e){
    //console.log("2");
    //console.log("checked if " + $(this).attr('id') + " = " + oldFocus.attr('id'))
    if($(this).attr('id') == oldFocus.attr('id')) {
      if(mode == "row") {
        mode = "column";
      } else {
        mode = "row";
      }
      updateHighlights($(this));
    }
    oldFocus = $(this);
  });

  $("input").focus(function(e){
    //console.log("1");
    updateHighlights($(this));
    //e.stopImmediatePropagation();
  });

});

function updateHighlights(target) {
  clearAllHighlights();
  var targetId = target.attr('id');
  if(mode == "row") {
    highlightRow(targetId.slice(0,1));
  } else if (mode == "column"){
    highlightColumn(targetId.slice(1,2));
  }
}

function clearAllHighlights() {
  for(var i = 0; i < letters.length; i++) {
    for(var j = 1; j <= width; j++) {
      var targetId = letters.slice(i,i+1) + j;
      $("#" + targetId).removeClass("highlighted");
      $("#" + targetId).removeClass("incorrect");
    }
  }
}

function highlightColumn(number) {
  for(var i = 0; i < letters.length; i++) {
    var targetId = letters.slice(i,i+1) + number;
    $("#" + targetId).addClass("highlighted");
  }
}

function highlightRow(letter) {
  for(var i = 1; i <= width; i++) {
    var targetId = letter + i;
    $("#" + targetId).addClass("highlighted");
  }
}

function incrementRow(id) {
  if(parseInt(id.slice(1,2)) == width) {
    if(settings.autoNextLine) {
      id = id.slice(0,1) + "1";
      return incrementColumn(id);
    } else {
      return;
    }
  } else {
    return id.slice(0,1) + (parseInt(id.slice(1,2)) + 1);
  }
}

function incrementColumn(id) {
  var index = letters.indexOf(id.slice(0,1));
  if(index == letters.length-1) {
    if(settings.autoNextLine) {
      id = "a" + id.slice(1,2);
      return incrementRow(id);
    } else {
      return;
    }
  }
  return letters.slice(index+1,index+2) + id.slice(1,2);
}

function checkWin() {
  var win = true;
  for(var i = 0; i < letters.length; i++) {
    for(var j = 1; j <= width; j++) {
      var targetId = letters.slice(i,i+1) + j;
      if($("#" + targetId).val() != puzzle.grid[i][j-1]) {
        win = false;
        $("#" + targetId).addClass("incorrect");
      }
    }
  }

  if(win) {
    alert("Correct! You got it!");
  }
}

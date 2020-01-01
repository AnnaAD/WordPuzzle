//console.log("loaded");

var mode = "row"; //select mode is either row or column
var width = 5;
var height = 5;

var timerStart = Date.now();

var settings = {
  autoNextLine: true
}

var time;

var timer = setInterval(function() {

  var now = Date.now();
  var distance = now - timerStart;

  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if((seconds+"").length < 2) {
    seconds = "0"+seconds;
  }

  time = minutes + ":" + seconds;
  $("#timer").text(time);
  console.log("run");

},1000);

$(function(){
  var oldFocus = $("#11");
  oldFocus.focus();
  updateHighlights(oldFocus);

  for(var i = 1; i < 6; i++) {
    $("#aclue" + i).text(puzzle.acrossClues[i-1]);
  }

  for(var i = 1; i < 6; i++) {
    $("#dclue" + i).text(puzzle.downClues[i-1]);
  }


  $('input').on('input',function(e){
    content = $('input').val();

    console.log("change");
    var id = $(this).attr('id');

    var newfocusId;
    console.log(id);
    if(mode == "row") {
      newfocusId = incrementRow(id);
    } else if (mode == "column") {
      newfocusId = incrementColumn(id);
    }

    $("#"+newfocusId).focus();
    console.log(newfocusId);
    oldFocus = $("#"+newfocusId);
  });

  $("li").click(function(e) {
    var id = $(this).attr("id");

    var index = id.slice(id.length-1, id.length);

    var oldFocus;
    if(id.slice(0,1) === "d") {
      oldFocus = $("#1"+index);
      mode = "column";
    } else {
      oldFocus = $("#"+index+"1");
      mode = "row";
    }
    oldFocus.focus();
    updateHighlights(oldFocus);
  });
  //Allows for users to easily type over old inputs
  $("input").keydown(function (e) {
    console.log("keydown");
    if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
      return;
    }
    var id = $(this).attr('id');
    console.log(id);
    console.log($(this).val());

    var delete_next = false;
    if($(this).val() == "") {
      delete_next = true;
    }

    console.log(delete_next);

    $(this).val("");


    //deal with delete keypress
    if(e.keyCode == 8 || e.keyCode == 46) {
      if(mode == "row") {
        if(delete_next) {
          $("#" + id.slice(0,1) + (parseInt(id.slice(1,2)) - 1)).focus();
          $("#" + id.slice(0,1) + (parseInt(id.slice(1,2)) - 1)).val("");
        }
      } else {
          if(delete_next) {
            $("#" + (parseInt(id.slice(0,1)) - 1) + id.slice(1,2)).focus();
            $("#" + (parseInt(id.slice(0,1)) - 1) + id.slice(1,2)).val("");
          }
        }
      }
  });


  //Arrow key focus control
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
        $("#" + (parseInt(id.slice(0,1)) + 1) + id.slice(1,2)).focus();
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
        $("#" + (parseInt(id.slice(0,1)) - 1) + id.slice(1,2)).focus();
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
  console.log(targetId);
  if(mode == "row") {
    $("#aclue"+targetId.slice(0,1)).addClass("highlighted");
    highlightRow(targetId.slice(0,1));
  } else if (mode == "column"){
    $("#dclue"+targetId.slice(1,2)).addClass("highlighted");
    highlightColumn(targetId.slice(1,2));
  }
}

function clearAllHighlights() {
  for(var i = 1; i <= height; i++) {
    $("#aclue"+i).removeClass("highlighted");
    for(var j = 1; j <= width; j++) {
      if(i==1) {
        $("#dclue"+j).removeClass("highlighted");
      }
      var targetId = i + "" + j;
      $("#" + targetId).removeClass("highlighted");
      $("#" + targetId).removeClass("incorrect");
    }
  }
}

function highlightColumn(col) {
  for(var i = 1; i <= width; i++) {
    var targetId = i + "" + col;
    $("#" + targetId).addClass("highlighted");
  }
}

function highlightRow(row) {
  for(var i = 1; i <= width; i++) {
    var targetId = row + "" + i;
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
    return id.slice(0,1) + ""  + (parseInt(id.slice(1,2)) + 1);
  }
}

function incrementColumn(id) {
  if(parseInt(id.slice(0,1)) == height) {
    if(settings.autoNextLine) {
      id = "1" + id.slice(1,2);
      return incrementRow(id);
    } else {
      return;
    }
  } else {
    return (parseInt(id.slice(0,1)) + 1) + "" + id.slice(1,2);
  }
}

function checkWin() {
  var win = true;
  for(var i = 1; i <= height; i++) {
    for(var j = 1; j <= width; j++) {
      var targetId = i + "" + j;
      if($("#" + targetId).val() != puzzle.grid[i-1][j-1]) {
        win = false;
        $("#" + targetId).addClass("incorrect");
      }
    }
  }

  if(win) {
    alert("Correct! You got it! TIME: " + time);
    clearInterval(timer);
  }
}

var countCharacters=0;
var startTime;
var userKeyPressCount=0;
$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $("#userInput").tooltip();
    });
    displayRandomText();

    $("#start").on("click", function () {
        $('#userInput').focus();
        $('#userInput').val("");
        location.reload();
    });
    $("#userInput").on("input",function(event){
        if (startTime === undefined) {
            startTime = new Date($.now());
        }

        var modifierKeyKeyCodes = [16,17,18,20,27,37,38,39,40,46];
        if (modifierKeyKeyCodes.includes(event.keyCode) == false) {
            userKeyPressCount++;
        }

        updateWPM();
        updateProgressBar();
        giveColorFeedback();
        if (isGameOver() == true){
            handleGameOver();
        }
    });
});

function storeData() {
    var data= { participated_race: {
            race_id: $("#race_id").data("raceId"),
            total_key_stroke: userKeyPressCount,
            wpm: $("#checkWpm").text(),
            accuracy:$("#accuracy").text(),
            typed_text: $("#userInput").val(),
            start_time: moment(startTime).format('MMM Do YYYY, h:mm:ss a'),
            end_time: moment().format('MMM DD YYYY, h:mm:ss a')
        }
    }
    ajaxCall(data);
}

function displayRandomText() {
    var randomText=$("#displayedText").text();
    // var randomIndex = Math.floor(Math.random()*quotes.length);
    // var randomText = quotes[randomIndex];
    var randomTextCharArray = randomText.split("");
    for(var spanCount=0; spanCount < randomTextCharArray.length; spanCount++) {
        randomTextCharArray[spanCount] = '<span id= "'+spanCount +'">' + randomTextCharArray[spanCount] + '</span>';
    }
    var randomTextSpanified = randomTextCharArray.join("");
    $("#displayedText").html(randomTextSpanified);
}

function updateWPM(){
    countCharacters += 1;
    var currentTime=new Date($.now());
    var timeInSecs = (currentTime-startTime)/1000;
    var timeInMins = timeInSecs/60;
    var wordsWritten = countCharacters/5;
    var wpm = wordsWritten/timeInMins;
    wpm = parseInt(wpm,10);
    $('#checkWpm').text(wpm);
}

function giveColorFeedback(){
    var displayedText = $('#displayedText').text();
    var userInput = $('#userInput').val();
    var currentCharIndex = userInput.length - 1;

    for(var i = currentCharIndex; i < displayedText.length - 1 ; i++){
        $("span #" + i).removeClass("match").removeClass("unmatch");
    }

    if (userInput[currentCharIndex] === displayedText[currentCharIndex]){
        $("span #" + currentCharIndex).addClass("match").removeClass("unmatch");
    } else {
        $("span #" + currentCharIndex).removeClass("match").addClass("unmatch");
    }
}

function isGameOver(){
    return ($('#displayedText').text()===$('#userInput').val())
}

function ajaxCall(data) {
    $.post( "http://localhost:3000/participated_races/", data)
    $('#showResult').removeClass("hidden");
}

function handleGameOver() {
    displayAccuracy();
    disableInput();
    if (! $("body").hasClass("guest-session")){
        storeData();
    }
}

function displayAccuracy() {
    var displayedTextCharLen= $('#displayedText').text().length;
    var userKeyPressInputCharLen=userKeyPressCount;
    var accuracy = ( displayedTextCharLen/userKeyPressInputCharLen )*100;
    accuracy=Math.round( accuracy );
    $('#showAccuracy').removeClass("hidden");
    $(' #accuracy').text(accuracy);
}
function disableInput() {
    $('#userInput').prop('disabled', true);
}

function updateProgressBar(){
    var percentage = 3 + getProgress();
    var progressBarSelector = $("#newBar");
    var progressBar = $(progressBarSelector);
    var displayedText = $('#displayedText').text();
    var userInput = $('#userInput').val();
    var currentCharIndex = userInput.length - 1;
    for(var i = currentCharIndex; i <= displayedText.length - 1 ; i++) {
        if (userInput[currentCharIndex] === displayedText[currentCharIndex]) {
            $(progressBar).css("width", percentage + "%" );
            // $("#newBar").animate({left: "+=500"}, 2000);
        }
    }
}

function getProgress(){
    var userInputLength = $("#userInput").val().length;
    var quoteLength = $("#displayedText").text().length;
    return ((userInputLength / quoteLength) * 100);
}
var quotes = ["Hello there", "Genius is one percent inspiration and ninety-nine percent perspiration.", "You can observe a lot just by watching.","A house divided against itself cannot stand.",
    "Difficulties increase the nearer we get to the goal.","Fate is in your hands and no one elses",
    "Be the chief but never the lord.","Nothing happens unless first we dream.","Well begun is half done.", "Life is a learning experience, only if you learn."
    ,"Self-complacency is fatal to progress.","Peace comes from within. Do not seek it without.","What you give is what you get.",
    "We can only learn to love by loving.","Life is change. Growth is optional. Choose wisely.","You'll see it when you believe it."
    ,"Today is the tomorrow we worried about yesterday.","It's easier to see the mistakes on someone else's paper."
    , "Every man dies. Not every man really lives.","To lead people walk behind them.","Having nothing, nothing can he lose."]

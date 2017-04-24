var order = ["q1"];
var current = "q1";
var questions;
var totals;
var resultData = {};
var groupData = {};
var playData = {};

var fadeSpeed = 250;

var qSlider;

// window.onresize = displayWindowSize;
// window.onload = displayWindowSize;
// function displayWindowSize() {
//     var myWidth = window.innerWidth;
//     var myHeight = window.innerHeight;
//     document.getElementById("dimensions").innerHTML = myWidth + "x" + myHeight;
// };

$(function() {
	$.getJSON('/resources/questions.json', function(json) {
		questions = json;
		$.each(questions, function(index, value) {
			$('#' + value.group + ' .parts').append('<div class="spacer"><div class="bar" id="bar-' + index + '"></div></div>')
		});
	}).fail(function(d, textStatus, error) {
        console.error('getJSON failed, status: ' + textStatus + ', error: '+error)
    });
    $.getJSON('/resources/totals.json', function(json) {
		totals = json;
	}).fail(function(d, textStatus, error) {
        console.error('getJSON failed, status: ' + textStatus + ', error: '+error)
    });
	$('#start-button').on('click', function() {
		goToQuestion('q1');
	});
	$('#next').on('click', function() {
		nextQuestion();
	});
	$('#prev').on('click', function() {
		prevQuestion();
	});
    generateSideChart();
});

function nextQuestion() {
	var next = getNext();
	console.log((order.length / 61 * 100) + '%');
	$('.alt-prog .bar div').css({'width': (order.length / 61 * 100) + '%'});
	$('#bar-' + current).addClass('done');
	$.each(getIntermediateQuestions(current, next), function(index, value) {
		$('#bar-' + value).addClass('done');
	});
	if (next === 'end') {
		goResponses();
	} else {
		goToQuestion(next);
		if (!order.includes(current)) order.push(current);
	}
}

function prevQuestion() {
	if (current ==='q1') {
		goHome();
	} else {
		goToQuestion(getPrev(current))
	}
}

function goHome() {
	$('.intro').removeClass('done');
	$('.content').removeClass('done');
}

function goResults() {
	$('.intro').addClass('done');
	$('.content').addClass('done');
	addData(current, $('input[name=response]:checked').attr('data-response'));
	setData()
}

function goToQuestion(q) {
	if (resultData[q] === undefined) $('#next').prop('disabled', true);
	else $('#next').prop('disabled', false);
	$('.intro').addClass('done');
	$('.content').removeClass('done');
	$('.questions').append(buildQuestion(q));
	$('input[type=radio][name=response]').change(function() {
		addData(current, $('input[name=response]:checked').attr('data-response'));
		$('#next').prop('disabled', false);        
    });
	if (qSlider) {
	addData(current, $('input[name=response]:checked').attr('data-response'));
	generateSideChart();
	$('#' + current).fadeOut(fadeSpeed, function() {
		$(this).remove();
		$('#' + q).fadeIn(fadeSpeed);
	});
	} else {
		$('#' + q).fadeIn(fadeSpeed);
	}
	$('#' + questions[current].subplay).removeClass('current');
	if (questions[current].group !== questions[q].group) $('#' + questions[current].group).addClass('done');
	if (questions[current].subplay !== questions[q].subplay) $('#' + questions[current].subplay).addClass('done');
	current = q;
	// console.log('#' + questions[current].group);
	$('#' + questions[current].subplay).addClass('current');
	$('#' + questions[current].subplay).addClass('active');
	$('#' + questions[current].group).addClass('active');
	qSlider = $('#' + current + '-radio');
}

function getNext() {
	return $('input[name=response]:checked').val();
}

function getPrev(q) {
	return order[order.indexOf(q) - 1];
}

function buildQuestion(id) {
	var q = questions[id];
	var question = '<article class="question row current" id="' + id + '">' + 
            '<h1>' + q.name + '</h1>' +
            '<p>' + q.description +'</p>' +
            '<form class="radio-buttons" id="' + id + '-radio">';
    for (var i = 0; i < q.labels.length; i++) {
    	var checked = parseInt(resultData[id]) === q.values[i] ? 'checked="checked"' : '';
    	question += '<div><input type="radio"' + checked + 'name="response" data-response="' +
    		q.values[i] + '" id="option' + i + '" value="' + q.next[i] + '">' + 
    		'<label for="option' + i + '">' + q.labels[i] + '</label></div>'
  	}
  	question += '</form></article>';
  	return question;
}
var data1;
var ctx;
var myChart;

function setData() {
	ctx = document.getElementById('myChart').getContext('2d');
	var arr = []
	var temparr = [0,0,0,0]
	jQuery.each(resultData, function(i, val) {
	  arr.push(val);
	  if (val != undefined) {
		  if (questions[i].subplay == "bring-people-in") {
		  	temparr[0] = Number(temparr[0]) + Number(val);
		  } else if (questions[i].subplay == "know-your-community") {
		  	temparr[1] = Number(temparr[1]) + Number(val);
		  } else if (questions[i].subplay == "focus-on-issues") {
		  	temparr[2] = Number(temparr[2]) + Number(val);
		  } else if (questions[i].subplay == "talk-it-up") {
		  	temparr[3] = Number(temparr[3]) + Number(val);
		  }
	  }
	});
	temparr[0] = Math.ceil((Number(temparr[0])/44)*100);
	temparr[1] = Math.ceil((Number(temparr[1])/52)*100);
	temparr[2] = Math.ceil((Number(temparr[2])/80)*100);
	temparr[3] = Math.ceil((Number(temparr[3])/68)*100);
	data1 = {
	    labels: ["Bring People In", "Know your Community", "Focus on Issues", "Talk it Up"],
	    datasets: [{
	            label: "Results data",
	            backgroundColor: "rgba(179,181,198,0.2)",
	            borderColor: "rgba(179,181,198,1)",
	            pointBackgroundColor: "rgba(179,181,198,1)",
	            pointBorderColor: "#fff",
	            pointHoverBackgroundColor: "#fff",
	            pointHoverBorderColor: "rgba(179,181,198,1)",
	            data: temparr
	        }
	    ]
	};
	myChart = new Chart(ctx, {
	    type: 'radar',
	    data: data1,
	    options: {
        scale: {
          ticks: {
          	display: false,
            beginAtZero : true,
            max : 100
           }
        }
       }
	});

}

function generateSideChart() {
	ctx = document.getElementById('sideChart').getContext('2d');
	var arr = []
	var temparr = [0,0,0,0]
	jQuery.each(resultData, function(i, val) {
	  arr.push(val);
	  if (val != undefined) {
		  if (questions[i].subplay == "bring-people-in") {
		  	temparr[0] = Number(temparr[0]) + Number(val);
		  } else if (questions[i].subplay == "know-your-community") {
		  	temparr[1] = Number(temparr[1]) + Number(val);
		  } else if (questions[i].subplay == "focus-on-issues") {
		  	temparr[2] = Number(temparr[2]) + Number(val);
		  } else if (questions[i].subplay == "talk-it-up") {
		  	temparr[3] = Number(temparr[3]) + Number(val);
		  }
	  }
	});
	temparr[0] = Math.ceil((Number(temparr[0])/44)*100);
	temparr[1] = Math.ceil((Number(temparr[1])/52)*100);
	temparr[2] = Math.ceil((Number(temparr[2])/80)*100);
	temparr[3] = Math.ceil((Number(temparr[3])/68)*100);
	data1 = {
	    labels: ["Bring People In", "Know your Community", "Focus on Issues", "Talk it Up"],
	    datasets: [{
	            label: "Results data",
	            backgroundColor: "rgba(179,181,198,0.2)",
	            borderColor: "rgba(179,181,198,1)",
	            pointBackgroundColor: "rgba(179,181,198,1)",
	            pointBorderColor: "#fff",
	            pointHoverBackgroundColor: "#fff",
	            pointHoverBorderColor: "rgba(179,181,198,1)",
	            data: temparr
	        }
	    ]
	};
	myChart = new Chart(ctx, {
	    type: 'radar',
	    data: data1,
	    options: {
        scale: {
          ticks: {
          	display: false,
            beginAtZero : true,
            max : 100
          }
        }
      }
	});

}

function getIntermediateQuestions(q1, q2) {
	var grab = false;
	var out = [];
	$.each(questions, function(index, value) {
		if(index === q2) return false;
		if (grab) out.push(index);
		if (index === q1) grab = true;
	});
	return out;
}

var alerts = {"bring-people-in":['<div class="alert alert-danger">Socially Unfocused</div>','<div class="alert alert-success">Socially Focused</div>','<div class="alert alert-success">Very Socially Focused</div>'],
"know-your-community":['<div class="alert alert-danger">Weak Presence</div>','<div class="alert alert-warning">Fairly Strong Presence</div>', ,'<div class="alert alert-success">Strong Presence</div>'],
"focus-on-issues":['<div class="alert alert-warning">Specialized</div>','<div class="alert alert-success">Balanced</div>','<div class="alert alert-success">Far Reaching</div>'],
"talk-it-up":['<div class="alert alert-danger">Poor Communication</div>','<div class="alert alert-warning">Good Communicaiton</div>','<div class="alert alert-success">Great Communicaiton</div>']}

function addData(q, y) {
	resultData[q] = parseInt(y);
	groupData = {};
	playData = {};
	$.each(resultData, function(index, value) {
		if (!groupData[questions[index].group]) groupData[questions[index].group] = value;
		else groupData[questions[index].group] += value;
		if (!playData[questions[index].subplay]) playData[questions[index].subplay] = value;
		else playData[questions[index].subplay] += value;
	});
	// console.log(totals);
	$('#qualititave').empty();
	$.each(groupData, function(index, value) {
		$('#' + index + '-prog div').css({'width': (value / totals.group[index] * 100) + '%'});
	});
	$.each(playData, function(index, value) {
		if(value / totals.subplay[index] < 0.3) $('#qualititave').append(alerts[index][0]);
		else if(value / totals.subplay[index] < 0.6) $('#qualititave').append(alerts[index][1]);
		else $('#qualititave').append(alerts[index][2]);
	});
}




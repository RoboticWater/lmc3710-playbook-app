var order = ["q1"];
var current = "q1";
var questions;
var totals;
var resultData = {};

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
	$('#bar-' + current).addClass('done');
	$.each(getIntermediateQuestions(current, next), function(index, value) {
		$('#bar-' + value).addClass('done');
	})
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
	jQuery.each(resultData, function(i, val) {
	  arr.push(val);
	});
	data1 = {
	    labels: ["Cat 1", "Cat 2", "Cat 3", "Cat 4"],
	    datasets: [{
	            label: "Results data",
	            backgroundColor: "rgba(179,181,198,0.2)",
	            borderColor: "rgba(179,181,198,1)",
	            pointBackgroundColor: "rgba(179,181,198,1)",
	            pointBorderColor: "#fff",
	            pointHoverBackgroundColor: "#fff",
	            pointHoverBorderColor: "rgba(179,181,198,1)",
	            data: arr
	        }
	    ]
	};
	myChart = new Chart(ctx, {
	    type: 'radar',
	    data: data1,
	    options: {
        scale: {
          ticks: {
            beginAtZero : true,
            max : 5
           }
        }
       }
	});

}

function generateSideChart() {
	ctx = document.getElementById('sideChart').getContext('2d');
	var arr = []
	jQuery.each(resultData, function(i, val) {
	  arr.push(val);
	});
	data1 = {
	    labels: ["Cat 1", "Cat 2", "Cat 3", "Cat 4"],
	    datasets: [{
	            label: "Results data",
	            backgroundColor: "rgba(179,181,198,0.2)",
	            borderColor: "rgba(179,181,198,1)",
	            pointBackgroundColor: "rgba(179,181,198,1)",
	            pointBorderColor: "#fff",
	            pointHoverBackgroundColor: "#fff",
	            pointHoverBorderColor: "rgba(179,181,198,1)",
	            data: [2,4,3,2]
	        }
	    ]
	};
	myChart = new Chart(ctx, {
	    type: 'radar',
	    data: data1,
	    options: {
        scale: {
          ticks: {
            beginAtZero : true,
            max : 5
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


function addData(q, y) {
	resultData[q] = y;
}




var order = ["q1"];
var current = "q1";
var questions;
var resultData = {};

var fadeSpeed = 250;

var qSlider;

$(document).ready(function() {
	$.getJSON('/resources/questions.json', function(json) {
		questions = json;
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
	if (!$('#bar-' + current).hasClass('done'))
		$('#bar-' + current).toggleClass('done');
	if (getNext(current) === 'end') {
		$('.content').toggleClass('done');
		setData()
	} else {
		goToQuestion(getNext(current));
		if (!order.includes(current)) order.push(current);
	}
}

function prevQuestion() {
	if (current ==='q1') {
		$('.intro').toggleClass('done');
		$('.intro').css({'display': 'block'});
	} else {
		if (!$('#bar-' + current).hasClass('done'))
			$('#bar-' + current).toggleClass('done');
		goToQuestion(getPrev(current))
	}
}

function goToQuestion(q) {
	if (!$('.intro').hasClass('done'))$('.intro').toggleClass('done');
	console.log(q);
	$('.questions').append(buildQuestion(q, questions[q].name, questions[q].description));
	if (qSlider) {
		addData(current, $('#' + q + '-radio input:radio:checked').val());
		$('#' + current).fadeOut(fadeSpeed, function() {
			$(this).remove();
			$('#' + q).fadeIn(fadeSpeed);
		});
	} else {
		$('#' + q).fadeIn(fadeSpeed);
	}
	if ($('#' + questions[current].group).hasClass('current'))
		$('#' + questions[current].group).toggleClass('current');
	current = q;
	if (!$('#' + questions[current].group).hasClass('current'))
		$('#' + questions[current].group).toggleClass('current');
	qSlider = $('#' + current + '-radio');

}

function getNext(q) {
  var testo = $('#' + q + '-radio input:radio:checked').val()
	return questions[q].next[$('#' + q + '-radio label.active input').val()];
}

function getPrev(q) {
	return order[order.indexOf(q) - 1];
}

function buildQuestion(id, name, description) {
	var test = '<article class="question row current" id="' + id + '">\
            <h1>' + name + '</h1>\
            <img src="" alt="" class="col-md-4 col-centered">\
            <p class="col-md-4 col-centered">' + description +'</p>\
            <div class="btn-group" id="' + id + '-radio" data-toggle = "buttons">';
  for (var i = 0; i < questions[id].labels.length; i++) {
    test += '<label class="btn btn-primary">\
    <input type="radio" name="options" id="option1" value=' + i + '>';
    test += questions[id].labels[i];
    test+= '</label>';
  }
  test += '</div>\
  </article>';
  return test;
};
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
	            data: [0,4,3,2,1]
	        }
	    ]
	};
	myChart = new Chart(ctx, {
	    type: 'radar',
	    data: data1
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
	            data: [0,4,3,2,1]
	        }
	    ]
	};
	myChart = new Chart(ctx, {
	    type: 'radar',
	    data: data1
	});

}


function addData(q, y) {
  resultData[q] = y;
}




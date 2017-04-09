var current = "q1";
var next = null;
var questions = {
	'q1':{'name':'Question One',
	'description': 'Example description', 'category': 'Get Organized', 'negate': false,
	'next':['q2','q2','q2','q2','q3']},

	'q2':{'name':'Question Two',
	'description': 'Example description', 'category': 'Get Organized', 'negate': true,
	'next':['q3','q3','q3','q3','q3']},

	'q3':{'name':'Question Three',
	'description': 'Example description', 'category': 'Get Organized', 'negate': false,
	'next':['q4','q4','q4','q4','q4']},

	'q4':{'name':'Question Four',
	'description': 'Example description', 'category': 'Get Organized', 'negate': false,
	'next':['end','end','end','end','end']}
}

$(document).ready(function() {
	$.getJSON("/resources/questions.json", function(json) {
		console.log(1);
		console.log(json);
		questions = json;
	}).fail(function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    });
	$('#start-button').on('click', function() {
		$('.intro').toggleClass('done');
	});
	$('#next').on('click', function() {
		nextQuestion();
	});
	$('#prev').on('click', function() {
		prevQuestion();
	});
});

function nextQuestion() {
	if (current ==="q1") {
		$('.intro').css({'display': 'none'});
	}
	$('#' + current).toggleClass('current')
	current = getNext(current);
	$('#' + current).toggleClass('current')
}

function prevQuestion() {
	console.log(current);
	if (current ==="q1") {
		$('.intro').css({'display': 'block'});
		$('.intro').toggleClass('done');
	} else {
		$('#' + current).toggleClass('current')
		current = getPrev(current);
		$('#' + current).toggleClass('current')
	}
}

function getNext(q) {
	return questions[questions.indexOf(q) + 1];
}
function getPrev(q) {
	return questions[questions.indexOf(q) - 1];
}
var current = null;
var next = "q1";
var questions = ["q1", "q2", "q3", "q4", "q5", "q6"]

$(document).ready(function() {
	$('#start-button').on('click', function() {
		nextQuestion();
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
	$('#' + current).toggleClass('current')
	current = getNext(current);
	$('#' + current).toggleClass('current')
}

function prevQuestion() {
	$('#' + current).toggleClass('current')
	current = getPrev(current);
	$('#' + current).toggleClass('current')
}

function getNext(q) {
	return questions[questions.indexOf(q) + 1];
}
function getPrev(q) {
	return questions[questions.indexOf(q) - 1];
}
var current = "q1";
var next = null;
var questions;

$(document).ready(function() {
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
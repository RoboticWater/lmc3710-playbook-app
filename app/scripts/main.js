var order = ["q1"];
var current = "q1";
var questions;

var qSlider;

$(document).ready(function() {
	$.getJSON("/resources/questions.json", function(json) {
		questions = json;
	}).fail(function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    });
	$('#start-button').on('click', function() {
		$('.intro').toggleClass('done');
		qSlider = $('#' + current + '-slider');
		qSlider.slider();
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
	} else {
		$('#' + getPrev()).remove();
	}
	$('#' + current).toggleClass('current');
	current = getNext(current);
	console.log(current);
	order.push(current);
	$('.questions').append(buildQuestion(current, questions[current].name, questions[current].description));
	qSlider = $('#' + current + '-slider');
	console.log(qSlider);
	qSlider.slider();
}

function prevQuestion() {
	if (current ==="q1") {
		$('.intro').css({'display': 'block'});
		$('.intro').toggleClass('done');
	} else {
		$('#' + current).toggleClass('current');
		current = getPrev(current);
		$('.questions').prepend(buildQuestion(current, questions[current].name, questions[current].description));
	}
}

function getNext(q) {
	return questions[q].next[qSlider.slider('getValue')];
}

function getPrev(q) {
	return order[order.indexOf('q') - 1];
}

function buildQuestion(id, name, description) {
	return '<article class="question row current" id="' + id + '">\
            <h1>' + name + '</h1>\
            <img src="" alt="" class="col-md-4 col-centered">\
            <p class="col-md-4 col-centered">' + description +'</p>\
            <input type="text" \
            name="slider-'+id+'"\
            data-provide="slider" \
            data-slider-ticks="[0, 1, 2, 3, 4]" \
            data-slider-min="1"\
            data-slider-max="5"\
            data-slider-step="1"\
            data-slider-value="3"\
            data-slider-tooltip="hide" id="'+ id +'-slider">\
          </article>';
}
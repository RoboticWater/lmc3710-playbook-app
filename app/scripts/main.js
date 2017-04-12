var order = ["q1"];
var current = "q1";
var questions;

var qSlider;

$(document).ready(function() {
	$.getJSON('/resources/questions.json', function(json) {
		questions = json;
	}).fail(function(d, textStatus, error) {
        console.error('getJSON failed, status: ' + textStatus + ', error: '+error)
    });
	$('#start-button').on('click', function() {
		$('.intro').toggleClass('done');
		qSlider = $('#' + current + '-slider');
		qSlider.slider();
		$('#' + current).fadeIn(750);
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
	$('#' + current).fadeOut(550, function() { 
		$(this).remove();
		$('#' + current).fadeIn(550);
	});
	current = getNext(current);
	if (!order.includes(current)) order.push(current);
	if (current === 'end') {
		$('.content').toggleClass('done');
	} else {
		$('.questions').append(buildQuestion(current, questions[current].name, questions[current].description));
		qSlider = $('#' + current + '-slider');
		qSlider.slider();
	}
}

function prevQuestion() {
	if (current ==='q1') {
		$('.intro').toggleClass('done');
		$('.intro').css({'display': 'block'});
	} else {
		$('#' + current).fadeOut(550, function() {
			$(this).remove();
			$('#' + current).fadeIn(550);
		});
		current = getPrev(current);
		$('.questions').append(buildQuestion(current, questions[current].name, questions[current].description));
		qSlider = $('#' + current + '-slider');
		qSlider.slider();
	}
}

function getNext(q) {
	return questions[q].next[qSlider.slider('getValue')];
}

function getPrev(q) {
	return order[order.indexOf(q) - 1];
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
            data-slider-value="2"\
            data-slider-tooltip="hide" id="'+ id +'-slider">\
          </article>';
}
Array.prototype.insert = function(index) {
    this.splice.apply(this, [index, 0].concat(
        Array.prototype.slice.call(arguments, 1)));
    return this;
};

var data1 = {
    labels: ["Cat 1", "Cat 2", "Cat 3", "Cat 4", "Cat 5"],
    datasets: [{
            label: "Results data",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [2, 9, 4, 5, 10]
        }
    ]
};

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'radar',
    data: data1
});

$(function() {
	$('#toggle-nav').on('click', function() {
		$('body').toggleClass('hide-leftbar');
	});
	$('#toggle-graph').on('click', function() {
		$('body').toggleClass('hide-rightbar');
	});
});
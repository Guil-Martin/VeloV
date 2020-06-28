class Slideshow {

	constructor (container) {

		this.slidesBox = $(container); 
		this.slideNum = 0;
		this.slideIndex = 0;
		this.arrowLeft = $('.prev');
		this.arrowRight = $('.next');
		this.pauseButton = $('.pause');
		this.autoSlideInterval;

		// Signature canvas variables
		this.signBox = $('#signBox');
		this.signCanvas = $('#signCanvas');

		// Array of objects slides and their path
		let slideFolder = "img/slideshow/";
		this.Slides = [
			slideFolder+'01.png', 
			slideFolder+'02.png', 
			slideFolder+'03.png',
			slideFolder+'04.png'
		];

		for (let i = 0; i < this.Slides.length; i++) {
			this.appendSlide(this.Slides[i], this.Slides[i]);
		}

		this.slideChange(0); // Displays the first image

		// Register arrow to be clicked
		this.arrowLeft.click(() => 		{ this.slideChange(-1); });
		this.arrowRight.click(() => 	{ this.slideChange(1); });
		this.pauseButton.click(() => 	{ this.pauseResume(); });

		// Allow user to change slides with left and right arrow
		$(document).keydown((e) => {
			switch (e.which) {
			case 37: this.slideChange(-1); break; // Previous image / Default: left arrow
			case 39: this.slideChange(1); break; // Next image / Default: right arrow
			default: break;
		}});

		// Resumes Timer for image to change automatically if not disabled on this session
		if (sessionStorage.getItem('slideAuto') === null) {
			this.pauseResume();
		} else { this.pauseButton.css('background-color', 'grey'); }

	}

	appendSlide (imgPath, slideName) {

		this.slideNum++;
		let newMax = this.slideNum;

		// Change maximum number for each image in the slideshow
		$('.slides').each((i) => { 
			$(this).find('.numbertext').text((i+1) + ' / ' + newMax); 
		}); 

		// Append the new image box in the document
		this.slidesBox.append(
			'<div class="slides fade">'
				+ '<div class="numbertext">' + (this.slideNum) + ' / '+ (this.slideNum) + '</div>'
				+ '<img src=' + imgPath + '>'
			+'</div>'
		);	
		//+ '<div id='+ slideName + ' class="text">' + slideName + '</div>'
	}

	removeByName (name) {
		let toRemove = $('#'+name);
		if (toRemove !== null) {
			toRemove.parent().remove();
			this.slideNum--;
			let newMax = this.slideNum;

			// Change maximum number for each images in the slideshow
			$('.slides').each(function(i) { $(this).find('.numbertext').text((i+1) + ' / ' + newMax); });
		}
	}

	slideChange (n) {
		let slides = document.getElementsByClassName('slides');
		this.slideIndex += n;
		if ( this.slideIndex > (slides.length-1) ) { this.slideIndex = 0; } 
		if ( this.slideIndex < 0 ) { this.slideIndex = (slides.length-1); }
		for (let i = 0; i < slides.length; i++) { slides[i].style.display = 'none'; }
		slides[this.slideIndex].style.display = 'block';
	}

	pauseResume () {
		if (!this.autoSlideInterval) { // has the interval been created ?
			this.autoSlideInterval = setInterval(() => {
				this.slideChange(1);
			}, 5000);
			this.pauseButton.css('background-color', 'black');
		} else {
			clearInterval(this.autoSlideInterval); 
			this.autoSlideInterval = null;
			sessionStorage.setItem('slideAuto', false); // Keep the pause if the sesssion memory
			this.pauseButton.css('background-color', 'grey');
		}
	}

}
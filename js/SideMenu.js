class SideMenu {

	constructor () {

		this.setStation;

		// Register HTML elements
		this.elt = $('#sideMenu');
		this.animClass = 'slideAnimation';
		this.name = $('#stationName');
		this.address = $('#stationAddress');
        this.stands = $('#stationStands');
        this.status = $('#stationStatus');
        this.standsFree = $('#stationStandsFree');
        this.bikeFree = $('#stationBikeFree');

		// Menu
		this.closeMenuBtn = $('#sideMenuClose');
		this.button = $('#stationButton');
		this.bookError = $('#bookError');
		this.bookErrorTimer;

		// Signature canvas, create the canvas and its events for the signature
		this.canvasPad = new CanvasPad();

		this.signBox = $('#signBox'); // HTLM element for the whole name and canvas
		this.firstName = $('#sideMenuFirstname');
		this.lastName = $('#sideMenuLastname');

		// ===== HOTKEYS AND EVENTS =====

		// Arrow button to close the side menu
		this.closeMenuBtn.click((e) => {
			if (this.isOpened()) { 
				this.signBox.toggle(false); // Close sign popup if opened
				this.open(); // Close side menu if opened
			} 
			this.canvasPad.eraseCanvas();
		});

		// Validate and close buttons for the signature pad
		var valBtn = 	$('#validBtn'), 
			closeBtn =	$('#closeBtn');
		valBtn.click((e) => {
			if (this.signPadValidate()) { 
				this.open(); // Set data in footer
				this.signBox.toggle(false);
			}
		});
		closeBtn.click((e) => { 
			this.signBox.toggle(false);
			this.canvasPad.eraseCanvas();
		});

		// Register button
		this.button.click((e) => { 
			if (!this.signPadIsOpened()) { this.signPadOpen(); }
		});

		// Set up name and first name if existing
		this.resumeData();

	}

	isOpened () { 
		// Checks if the element if opened (By looking for the class existing)
		return this.elt.hasClass(this.animClass);
	}
	
	open () { 
		// Opens or close the menu if opened
		// Adds a class on the HTML element to check if opened
		if (this.isOpened()) {
			this.elt.removeClass(this.animClass);
		} else {
			if (this.elt.css('display') == 'none') {
				this.elt.css('display', 'flex');
				setTimeout(() => { this.elt.addClass(this.animClass); }, 100);
			} else {
				this.elt.addClass(this.animClass);
			}
		}
	}

	signPadIsOpened () {
		return (this.signBox.css('display') == 'flex');
	}

	signPadOpen () {
		if (!this.signPadIsOpened()) {
			var stationOpened = (this.setStation.status == 'OPEN');
			var bikesAvailable = (this.setStation.available_bikes > 0);
			if (stationOpened && bikesAvailable) {
				 // displays the side menu
				this.signBox.css('display', 'flex');
			} else {
				if (!stationOpened) { this.displayError('Station fermée'); }
				else { this.displayError('Pas de vélos disponibles'); }
			}
		} else { // closes sign box
			this.signBox.toggle(false);
		} 
	}

	signPadValidate () {

		if (!this.firstName.val() || !this.lastName.val()) {
			this.displayError('Veuillez renseigner un nom et un prénom avant de valider');
			console.log('Veuillez renseigner un nom et un prénom avant de valider');
			return false;
		} else if (this.canvasPad.isEmpty()) { // Checks if sign pad is empty
			this.displayError('Veuillez signer avant de valider');
			return false;
		} else if ('timerStation' in sessionStorage && JSON.parse(sessionStorage.getItem('timerStation')).number == sideMenu.setStation.number) {
			this.displayError('Vous avez déjà réservé un vélo à cette station');
			return false;
		}
		
		localStorage.setItem('firstName', this.firstName.val());
		localStorage.setItem('lastName', this.lastName.val());

		// uses the Booking object declared on js.js script to send data in footer
		booking.registerBike();
		return true;
	}	

	// Checks if an error is displayed
	isErrorDisplayed () { return (this.bookError.css('display') == 'block'); }

	displayError (error) {
		this.bookError.text(error);
		if (this.isErrorDisplayed()) { 
			this.bookError.toggle(false);
			clearInterval(this.bookErrorTimer);
		}
		this.bookError.toggle(true);
		this.bookErrorTimer = setInterval(() => {
			if (this.isErrorDisplayed()) { 
				this.bookError.toggle(false); 
			}
			clearInterval(this.bookErrorTimer);
		}, 4000);
	}

	resumeData() {
        if  ('timerStation' in sessionStorage) { 
            this.setStation = JSON.parse(sessionStorage.getItem('timerStation')); 
        }
		// localStorage.clear();
		let firstName = localStorage.getItem('firstName'),
			lastName = localStorage.getItem('lastName');

		if (firstName) { this.firstName.val(firstName) }
		if (lastName) { this.lastName.val(lastName) }
	}

}
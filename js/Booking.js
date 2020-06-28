class Booking {

    constructor() {

        this.timerInt;
        this.resumeTimer = false;

        this.Box = $('#bookedBox');
        this.station = $('#bookedStation');
        this.timer = $('#bookedTimer');
        this.btnCancel = $('#bookedCancel');
        this.bar = $('#bookedBar');
        this.barProgress = $('#bookedBarProgress');
        this.minutes = 0;
        this.seconds = 0;
        this.maxSeconds = 0;
        
        this.bar.toggle(false);
        this.btnCancel.toggle(false);

        // Check if there is data existing in Session and Local storage
        // and resume if needed
        this.resumeData();

    }
    
    incVal(min, sec) {
        while (sec > 59) { sec = sec - 60; this.minutes ++; }
        while (sec < 0 & sec < -59) { sec = sec + 60; this.minutes --; }
        if (this.seconds == 0 && this.minutes > 0) {this.seconds = 59; this.minutes --;
        } else {this.minutes = this.minutes + min; this.seconds = this.seconds + sec; }}
    
    setVal(min, sec) { 
        if (sec > 59) { sec = 59; }
        this.minutes = min; 
        this.seconds = sec;
        this.minStarter = min;
        this.maxSeconds = 1200; } // 20 minutes

    getVal() { 
        var curSec = this.seconds < 10 ? ('0' + this.seconds).slice(-2) : this.seconds;
        return this.minutes +' : '+ curSec;
    }

    barUpdate() {
        var currentMin = this.minutes, currentSec = this.seconds;
        while (currentMin > 0) { currentSec = currentSec + 60; currentMin --; }
        var result = Math.ceil((currentSec * 100) / this.maxSeconds);
        this.barProgress.css('width', result+'%'); 
    }
    
    resetTimer() { 
        this.minutes = 0; 
        this.seconds = 0; 
        this.maxSeconds = 0; 
        this.barProgress.css('width', '100%'); 
    }

    registerBike() {
        
        function storageAvailable(type) { 
            try { 
                let storage = window[type], x = '__storage_test__'; 
                storage.setItem(x, x); storage.removeItem(x); 
                return true; 
            } catch(e) { return false; }
        }
        if (storageAvailable('sessionStorage')) {
    
            this.cancelBook();
    
            if (this.resumeTimer) { 
                this.resumeTimer = false; // Resets this bool used only for refreshes of the page, will be ignored if another station is registered
                var min = JSON.parse(sessionStorage.getItem('timerMin'));
                var sec = JSON.parse(sessionStorage.getItem('timerSec'));
                this.setVal(min, sec); }
            else { this.setVal(20, 0); } // Default value, 20 minutes
    
            this.station.text(sideMenu.setStation.name);
            this.timer.text(this.getVal());
    
            sessionStorage.clear();
            sessionStorage.setItem('timerStation', JSON.stringify(sideMenu.setStation));
            sessionStorage.setItem('timerMin', this.minutes);
            sessionStorage.setItem('timerSec', this.seconds);
    
            // Displays progress bar and cancel buttons
            this.bar.show();
            this.btnCancel.show();
    
            // On click focus on set station and cancel button
            this.station.click(() => { stationsMap.map.setCenter(sideMenu.setStation.position); stationsMap.map.setZoom(16); });
            this.btnCancel.click(() => { this.cancelBook(); sessionStorage.clear(); });
    
            // ===== TIMER =====
            this.timerInt = setInterval(() => {
                this.incVal(0, -1);
                if (this.minutes <= 0 & this.seconds <= 0) { 
                    this.cancelBook(); 
                } 
                else {
                    this.timer.text(this.getVal());
                    sessionStorage.setItem('timerMin', this.minutes);
                    sessionStorage.setItem('timerSec', this.seconds);
                    this.barUpdate();
                }
            }, 1000);
    
        }
        else { console.log("storage NOT available"); }
    }

    cancelBook() {
        clearInterval(this.timerInt);
        this.resetTimer();
        this.station.text('Aucune');
        this.timer.text('');
        this.bar.hide();
        this.btnCancel.hide();
    }

    resumeData() {
        if  ('timerStation' in sessionStorage) { 
            this.resumeTimer = true; // Resumes timer instead of setting it to 20 minutes
            this.registerBike(); 
        }
    }

}
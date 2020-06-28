class CanvasPad {

	constructor () {

        // Canvas
        this.canvas = $('#signCanvas');
        this.canvasElt = this.canvas.get(0);
        this.ctx = this.canvasElt.getContext('2d');
        this.dragging = false;
        this.strokeColor = 'black';
        this.lineWidth = 2;
        this.canvasWidth = 300
		this.canvasHeight = 300
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.lineWidth;

        // Stores mouse location x y and current and last positions
        this.loc = new CanvasPad.CanvasLocation(0,0);

        this.prevX = 0;
        this.currX = 0;
        this.prevY = 0;
        this.currY = 0;

		// ===== MOUSE SETUP =====
        this.canvas.mousedown((e) =>    { this.dragBegin(e); })
        this.canvas.mousemove((e) =>    { this.dragMove(e); })
        this.canvas.mouseup((e) =>      { this.dragEnd(e); })
        this.canvas.mouseout((e) => {
			// When user get out of the canvas
            this.canvasElt.style.cursor = 'default';
            this.loc = this.getMousePosition(e.clientX, e.clientY);
			this.dragging = false;
        })
        
        // ===== MOBILE SETUP =====
        this.canvasElt.addEventListener('touchstart', (e) =>    { this.dragBegin(e, true); })
        this.canvasElt.addEventListener('touchmove', (e) =>     { this.dragMove(e, true); })
        this.canvasElt.addEventListener('touchend', (e) =>      { this.dragEnd(e, true); })

    }

    // Nested object for mouse coordinates
    static CanvasLocation = class { constructor (x, y) { this.x; this.y; } }

    // Mouse & touch events
    dragBegin (e, touch) {
        this.canvasElt.style.cursor = 'crosshair';
        this.loc = touch ? this.getMousePosition(e.touches[0].clientX, e.touches[0].clientY) : this.getMousePosition(e.clientX, e.clientY);
        this.currX = this.loc.x;
        this.currY = this.loc.y;
        this.dragging = true;
    }
    dragMove (e, touch) {
        if (this.dragging) {
            this.canvasElt.style.cursor = 'crosshair';
            this.loc = touch ? this.getMousePosition(e.touches[0].clientX, e.touches[0].clientY) : this.getMousePosition(e.clientX, e.clientY);
            this.drawBrush(); 
        }
    }
    dragEnd (e, touch) {
        this.canvasElt.style.cursor = 'default';
        this.dragging = false;
    }
    ////////////////////////////////

	getMousePosition (x, y) {
		let canvaSizeData = this.canvasElt.getBoundingClientRect();
		return {
		x: (x - canvaSizeData.left) * (this.canvasElt.width / canvaSizeData.width),
		y: (y - canvaSizeData.top) * (this.canvasElt.height / canvaSizeData.height) }
	}

	eraseCanvas () { this.ctx.clearRect(0, 0, this.canvasElt.width, this.canvasElt.height);	}

	drawBrush () {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = this.loc.x;
        this.currY = this.loc.y;

    	this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.closePath();
        this.ctx.stroke();
	}

	isEmpty () {
		return !this.canvasElt.getContext('2d')
		.getImageData(0, 0, this.canvasElt.width, this.canvasElt.height).data
		.some(channel => channel !== 0);
	}

}
class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	draw() {
		context.beginPath();
		context.fillStyle = 'grey';
		context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		context.fill();
	}
}

function drawPoints() {
	for(let p of points) {
		p.draw();
	}
}

function draw() {
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (points.length > 0) {
    drawPoints();
  }
}

function resizeCanvas() {
  canvas.width = parseFloat(window.getComputedStyle(canvas).width);
  canvas.height = parseFloat(window.getComputedStyle(canvas).height);
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
var points = []

resizeCanvas();

canvas.addEventListener('mousedown', e => {
	var p = new Point(e.offsetX, e.offsetY);
	points.push(p);
	draw();
});
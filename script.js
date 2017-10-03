class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.radius = 10
	}

	draw() {
		context.beginPath();
		context.fillStyle = 'grey';
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}

	clicked(x, y){
		var vector = new Point(this.x - x, this.y - y);
		return Math.sqrt(vector.x*vector.x + vector.y*vector.y) <= this.radius;
	}
}

function getClicked(point){
	for(var p in points){
		if(points[p].clicked(point.x, point.y)){
			return p;
		}
	}
	return -1;
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
var context = canvas.getContext('2d');
var points = [];
var indexClicked = -1;

resizeCanvas();

canvas.addEventListener('mousedown', function(e){
	var p = new Point(e.offsetX, e.offsetY);
	indexClicked = getClicked(p);
	if(indexClicked === -1){
		points.push(p);
		draw();
	}	
});

canvas.addEventListener('mouseup', function(e){
	indexClicked = -1;
});

canvas.addEventListener('dblclick', function(e){
	var indexClicked = getClicked(new Point(e.offsetX, e.offsetY));
	if(indexClicked !== -1){
		points.splice(indexClicked, 1);
		draw();
	}
});
class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.radius = 6;
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

function interpolation(p1, p2, t){
	var x = (1-t) * p1.x + t * p2.x
	var y = (1-t) * p1.y + t * p2.y
	return new Point(x, y);
}

function deCasteljau(points, t){
	if(points.length === 1)
		return points[0]
	var p = [];
	for(var i = 0; i < points.length-1; i++){
		p.push(interpolation(points[i], points[+i+1],t));
	}
	return deCasteljau(p, t);
}

function bezierPoints(points, iterations){
	var curve = [];
	if (points.length === 0)
		return curve
	for(var i = 0; i <= iterations; i++){
		curve.push(deCasteljau(points, i/iterations));
	}
	return curve;
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

function drawLine(p1, p2, color){
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = 3;
	context.moveTo(p1.x, p1.y);
	context.lineTo(p2.x, p2.y);
	console.log(p1);
	console.log('p2');
	console.log(p2);
	context.stroke();
	context.fill();
}

function drawLines(points, color){
	for(var i = 0; i < points.length-1; i++){
		drawLine(points[i], points[+i+1], color);
	}
}

function draw() {
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (points.length > 0) {
    drawPoints();
  }
  if (points.length > 1) {
  	drawLines(bezierPoints(points, iterations), 'red');
  	drawLines(points, 'grey');
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
var isMoving = false;
var iterations = 200;

resizeCanvas();

canvas.addEventListener('mousedown', function(e){
	var p = new Point(e.offsetX, e.offsetY);
	indexClicked = getClicked(p);
	if(indexClicked === -1){
		points.push(p);
		draw();
	}	
	isMoving = true;
});

canvas.addEventListener('mousemove', function(e){
	if(isMoving){
		points[indexClicked] = new Point(e.x, e.y);
		draw();
	}
});

canvas.addEventListener('mouseup', function(e){
	indexClicked = -1;
	isMoving = false;
});

canvas.addEventListener('dblclick', function(e){
	var indexClicked = getClicked(new Point(e.offsetX, e.offsetY));
	if(indexClicked !== -1){
		points.splice(indexClicked, 1);
		draw();
	}
});
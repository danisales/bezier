class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.radius = 5;
	}

	draw() {
		context.beginPath();
		context.fillStyle = 'black';
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}

	clicked(x, y){
		var vector = new Point(this.x - x, this.y - y);
		return Math.sqrt(vector.x*vector.x + vector.y*vector.y) <= this.radius;
	}
}

function interpolation(p1, p2, t){
	var x = (1-t) * p1.x + t * p2.x;
	var y = (1-t) * p1.y + t * p2.y;
	return new Point(x, y);
}

function interpolatePoints(points, t){
	var p = []
	for(var i = 0; i < points.length-1; i++){
		p.push(interpolation(points[i], points[+i+1], t));
	}
	return p;
}

function bezierPoints(points, iterations){
	var bezierPts = [];
	var area = [];
	t = +(1/iterations);
	for(var i = 0; i <= 1; i+=t){
		var intPts = interpolatePoints(points, i);
		while(intPts.length > 1){
			area.push(intPts);
			intPts = interpolatePoints(intPts, i);
		}
		bezierPts.push(intPts[0]);
	}
	bezierPts.push(points[points.length-1]);
	bezier = bezierPts;
	blossom = area;
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

function drawLines(points, color, width){
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = width;
	for(var i = 0; i < points.length-1; i++){
		context.moveTo(points[i].x, points[i].y);
		context.lineTo(points[+i+1].x, points[+i+1].y);
	}
	context.stroke();
	context.fill();
}

function drawArea(points, color, width){
	for(var i = 0; i < points.length-1; i++){
		drawLines(points[i], color, width);
	}
}

function draw() {
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (points.length >= 2){
  	if(showPolygons)
  		drawLines(points, 'black', 1.5);
  }
  if (points.length >= 3) {
  	bezierPoints(points, iterations);
  	if(showBlossom)
  		drawArea(blossom, '#008B8B', 0.1);
  	if(showBezier)
  		drawLines(bezier, '#ff1433', 1.5);
  }
  if (points.length > 0) {
  	if(showPoints)
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
var isMoving = false;
var iterations = 100;
var bezier = [];
var blossom = [];

var showPoints = true;
var showPolygons = true;
var showBezier = true;
var showBlossom = true;

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
	if(isMoving && showPoints){
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
	if(indexClicked !== -1 && showPoints){
		points.splice(indexClicked, 1);
		draw();
	}
});

function update(){
	iterations = document.getElementById("iterations").value;
	showPoints = document.getElementById("points").checked;
	showPolygons = document.getElementById("polygons").checked;
	showBezier = document.getElementById("bezier").checked;
	showBlossom = document.getElementById("blossom").checked;
	draw();
}
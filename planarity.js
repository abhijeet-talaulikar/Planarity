Number.prototype.between = function (min, max) {
    return this > min && this < max;
};

n = Math.floor((Math.random() * 100) % 2);
if(n) n = 7;
else n = 6;
m = 2 * n - 4;
vertices = new Array(n);
for(i = 0;i < n;i++) vertices[i] = [0, 0];
edges = new Array(n);
for(i = 0;i < n;i++) edges[i] = new Array(n);
for(i = 0;i < n;i++) for(j = 0;j < n;j++) edges[i][j] = 0;

$( document ).ready(function() {
	Generate();
});

// Returns true if two line segments intersect.
// Based on http://stackoverflow.com/a/565282/64009
function intersect(a, b) {
	if (a[0] === b[0] && a[1] === b[1] || a[0] === b[1] && a[1] === b[0]) return true;
	var p = a[0], r = [a[1][0] - p[0], a[1][1] - p[1]], q = b[0], s = [b[1][0] - q[0], b[1][1] - q[1]];
	var rxs = cross(r, s),
	q_p = [q[0] - p[0], q[1] - p[1]],
	t = cross(q_p, s) / rxs,
	u = cross(q_p, r) / rxs,
	epsilon = 1e-6;
	return t > epsilon && t < 1 - epsilon && u > epsilon && u < 1 - epsilon;
}

function cross(a, b) {
	return a[0] * b[1] - a[1] * b[0];
}

function drawEdges(vertices, edges, n, m) {
	for(i = 0;i < n;i++) for(j = 0;j < n;j++) {
		if(edges[i][j])
			$('#playArea').drawLine({
				layer: true,
				groups: ['edges'],
				strokeStyle: 'red',
				strokeWidth: 3,
				x1: vertices[i][0], y1: vertices[i][1],
				x2: vertices[j][0], y2: vertices[j][1]
			});
	}
}

function Generate() {
	$('#playArea').removeLayers();
	$('#playArea').clearCanvas();
	for(i = 0;i < n;i++) {
		x = 0;
		y = 0;
		while(1) {
			x = Math.floor((Math.random() * 960) + 21);
			y = Math.floor((Math.random() * 460) + 21);
			flag = 0;
			for(j = 0;j < n;j++)
				if((x).between(vertices[j][0]-60, vertices[j][0]+60) && 
				(y).between(vertices[j][1]-60, vertices[j][1]+60)) {
					flag = 1;
					break;
				}
			if(flag) continue;
			else break;
		}
		vertices[i] = [x, y];
		$('#playArea').drawArc({
			layer: 'true',
			groups: ['vertices'],
			draggable: true,
			bringToFront: true,
			strokeStyle: '#555',
			strokeWidth: 2,
			fillStyle: 'red',
			x: x, y: y,
			radius: 15,
			cursors: {
				mouseover: 'pointer',
				mousedown: 'move',
				mouseup: 'pointer'
			},
			drag: function(layer) {
				V = $('#playArea').getLayerGroup('vertices');
				$('#playArea').removeLayerGroup('edges');
				for(i = 0;i < n;i++) vertices[i] = [V[i].x, V[i].y];
				drawEdges(vertices, edges, n, m);
			},
			dragstop: function(layer) {
				drawEdges(vertices, edges, n, m);
				if(success()) {
					$('#playArea').setLayers({
						fillStyle: 'green',
						strokeStyle: 'green'
					});
				} else {
					$('#playArea').setLayerGroup('vertices', {
						fillStyle: 'red',
						strokeStyle: '#555'
					})
				}
			}
		});
	}
	
	//generate random edges
	while(!isConnected(edges) || success()) {
		for(i = 0;i < m;i++) {
			var u = Math.floor((Math.random() * 100) % n), v = u;
			while(v == u) v = Math.floor((Math.random() * 100) % n);
			edges[u][v] = 1;
			edges[v][u] = 1;
		}
	}
	drawEdges(vertices, edges, n, m);
}

function isConnected(edges) {
	for(i = 0;i < n;i++) if(edges[i].indexOf(1) < 0) return false;
	return true;
}

function success() {
	for(i = 0;i < n;i++) {
		for(j = 0;j < n;j++) {
			if(edges[i][j]) {
				for(p = 0;p < n;p++) {
					for(q = 0;q < n;q++) {
						if(edges[p][q]) {
							var a = new Array(2), b = new Array(2);
							a[0] = [vertices[i][0], vertices[i][1]];
							a[1] = [vertices[j][0], vertices[j][1]];
							b[0] = [vertices[p][0], vertices[p][1]];
							b[1] = [vertices[q][0], vertices[q][1]];
							if(i == p && j == q) continue;
							else if(intersect(a, b)) {
								console.log("found");
								return false;
							}
						}
					}
				}
			}
		}
	}
	return true;
}

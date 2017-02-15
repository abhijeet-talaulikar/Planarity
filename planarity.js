Number.prototype.between = function (min, max) {
    return this > min && this < max;
};

moves = 0;
n = 9;
m = 2 * n - 4;
done = false;
highlighted = false;
vertices = new Array(31);
edges = new Array(31);
for(i = 0;i < 31;i++) edges[i] = new Array(31);

$(document).ready(function() {
	$('#moves span').html(moves);
	Generate(n, m);
	$('#hCheck').click(function() {
		if(highlighted) {
			$('#hCheck').val("Highlight");
			highlighted = false;
			$('#playArea').removeLayerGroup('edges');
			drawEdges(vertices, edges, n, m);
			$('#playArea').removeLayerGroup('vertices');
			drawVertices(vertices, n);
		} else {
			$('#hCheck').val("Dehighlight");
			highlighted = true;
			highlight(vertices, edges, n, m);
			$('#playArea').removeLayerGroup('vertices');
			drawVertices(vertices, n);
		}
	});
});

function reset(n1) {
	if(parseInt(n1).between(5, 31)) {
		done = false;
		moves = 0;
		$('#moves span').html(moves);
		n = n1;
		m = 2 * n - 4;
		Generate(n, m);
	}
}

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
				strokeWidth: 1,
				x1: vertices[i][0], y1: vertices[i][1],
				x2: vertices[j][0], y2: vertices[j][1]
			});
	}
}

function highlight(vertices, edges, n, m) {
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
								$('#playArea').drawLine({
									layer: true,
									groups: ['edges'],
									strokeStyle: '#ffb84d',
									strokeWidth: 1,
									x1: a[0][0], y1: a[0][1],
									x2: a[1][0], y2: a[1][1]
								}).drawLine({
									layer: true,
									groups: ['edges'],
									strokeStyle: '#ffb84d',
									strokeWidth: 1,
									x1: b[0][0], y1: b[0][1],
									x2: b[1][0], y2: b[1][1]
								});
							}
						}
					}
				}
			}
		}
	}
}

function drawVertices(vertices, n) {
	for(i = 0;i < n;i++) {
		$('#playArea').drawArc({
			layer: 'true',
			groups: ['vertices'],
			draggable: true,
			bringToFront: true,
			strokeStyle: '#555',
			strokeWidth: 2,
			fillStyle: 'red',
			x: vertices[i][0], y: vertices[i][1],
			radius: 15,
			cursors: {
				mouseover: 'pointer',
				mousedown: 'move',
				mouseup: 'pointer'
			},
			dragstart: function(layer) {
				if(success(n, m)) {
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
			},
			drag: function(layer) {
				V = $('#playArea').getLayerGroup('vertices');
				$('#playArea').removeLayerGroup('edges');
				for(i = 0;i < n;i++) vertices[i] = [V[i].x, V[i].y];
				drawEdges(vertices, edges, n, m);
				if(highlighted) highlight(vertices, edges, n, m);
			},
			dragstop: function(layer) {
				drawEdges(vertices, edges, n, m);
				if(highlighted) highlight(vertices, edges, n, m);
				$('#playArea').removeLayerGroup('vertices');
				drawVertices(vertices, n);
				if(success(n, m)) {
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
				if(done == false) $('#moves span').html(++moves);
			}
		});
	}
}

function Generate(n, m) {
	for(var i = 0;i < 31;i++) vertices[i] = [0, 0];
	for(var i = 0;i < 31;i++) for(j = 0;j < 31;j++) edges[i][j] = 0;
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
	}
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
								count++;
								flag = 1;
							}
						}
					}
				}
			}
		}
	}
	//generate random edges
	while(!Deg2(edges, n, m) || success(n, m)) {
		for(var i = 0;i < n;i++) for(j = 0;j < n;j++) edges[i][j] = 0;
		for(var i = 0;i < m;i++) {
			var u = Math.floor((Math.random() * 100) % n), v = u;
			while(v == u) v = Math.floor((Math.random() * 100) % n);
			edges[u][v] = 1;
			edges[v][u] = 1;
		}
	}
	drawEdges(vertices, edges, n, m);
	drawVertices(vertices, n);
}

function Deg2(edges, n, m) {
	for(i = 0;i < n;i++) if(edges[i].indexOf(1) == edges[i].lastIndexOf(1)) return false;
	return true;
}

function success(n, m) {
	var count = 0, flag = 0;
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
								count++;
								flag = 1;
							}
						}
					}
				}
			}
		}
	}
	$('#intersections span').html(count / 8);
	done = true;
	if(flag) done = false;
	return done;
}

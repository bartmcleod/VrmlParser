/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since February 8, 2017
 *
 * Mostly copied from https://stemkoski.github.io/Three.js/Labeled-Geometry.html
 *
 * The Analyzer can do things like labelling vertices and faces with their index.
 */

VrmlParser.Renderer.ThreeJs['Analyzer'] = function (debug) {
  this.debug = debug;
};

VrmlParser.Renderer.ThreeJs.Analyzer.prototype.labelVertices = function(object) {
	var geometry = object.geometry;
	var key;
	var spacing = 0.2;
	var labelsPerVertex = {};
	for (var i = 0; i < geometry.vertices.length; i++)
	{
		var spritey = this.makeTextSprite( " " + i + " ", { fontsize: 14, backgroundColor: {r:255, g:100, b:100, a:1} } );
		var vertex = geometry.vertices[i];
		// when more than one label is drawn for a given vertex, it will be placed `spacing` m closer to the viewer than the previous label
		key = vertex.x + '_' + vertex.y + '_' + vertex.z;
		labelsPerVertex[key] = labelsPerVertex[key] + 1 || 0;
		labelsPerVertex[key] = 0;
		spritey.position.set(0.5 + vertex.x + labelsPerVertex[key] * spacing, vertex.y, vertex.z);
		object.add( spritey );
	}
};

VrmlParser.Renderer.ThreeJs.Analyzer.prototype.labelFaces = function(object) {
	var geometry = object.geometry;
	for (var i = 0; i < geometry.faces.length; i++)
	{
		var face = geometry.faces[i];
		var flatIndexes = ' [' + face.a + ', ' + face.b + ', ' + face.c + '] ';
		var spritey = this.makeTextSprite( flatIndexes, { fontsize: 16, backgroundColor: {r:100, g:100, b:255, a:1} } );

		var centroid = new THREE.Vector3();
		centroid.add(geometry.vertices[face.a]);
		centroid.add(geometry.vertices[face.b]);
		centroid.add(geometry.vertices[face.c]);
		centroid.divideScalar(3);

		spritey.position.set(centroid.x + 1, centroid.y, centroid.z);
		scene.add( spritey );
	}
};

// function for drawing rounded rectangles
VrmlParser.Renderer.ThreeJs.Analyzer.prototype.roundRect = function(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();
};

VrmlParser.Renderer.ThreeJs.Analyzer.prototype.makeTextSprite = function( message, parameters )
{
	if ( parameters === undefined ) parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	this.roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial(
		{ map: texture } );
	var sprite = new THREE.Sprite( spriteMaterial );
	return sprite;
};

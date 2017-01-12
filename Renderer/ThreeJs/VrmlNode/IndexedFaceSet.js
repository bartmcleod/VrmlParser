/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since January 12, 2017
 *
 * Conversion of a VRML 97 IndexedFaceSet node to its equivalent in ThreeJs.
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'IndexedFaceSet' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.IndexedFaceSet.prototype.parse = function () {
	var object = new THREE.Object3D();
	var node = this.node;
	var scope = this;

	// @todo: separate the logic for duplicating edges into a separate component,
	// because it will have to be reused in Extrusion and ElevationGrid
	var verticesBuffer = [];

	/*
	 An edge always shares two faces at most. So the registry of faces for smoothing edges, should be
	 indexed per edge. This is possible if we build a string representation of the edge and use that as
	 the key for the index.

	 Since we calculate three edges for each triangular face that we will build here, we will get three
	 entries in the registry at each iteration, unless the key already exists, in which case we will just add
	 the face to the entry

	 Structure:
	 {'string_vector_representation': {faces: [], edge: "smooth|sharp"}}
	 */
	var facesBuffer = [];
	object          = new THREE.Geometry();
	//object.shading = THREE.SmoothShading;

	/**
	 * The facebuffer has to keep track of combinations of faces that share edges.
	 *
	 * Each face added will be combined with all other faces already in the buffer at
	 * the same index.
	 *
	 * @param index1
	 * @param index2
	 * @param face
	 * @private
	 */
	var _pushToFaceBuffer = function (index1, index2, face) {
		// the inverted key must also be valid, so always put lowest number first
		var key = parseInt(index1) < parseInt(index2) ? index1 + '_' + index2 : index2 + '_' + index1;

		if ( undefined === facesBuffer[ key ] ) {
			facesBuffer[ key ] = { faces: [] };
		}

		if ( facesBuffer[ key ].faces.indexOf(face) === - 1 ) {

			// first make all the combinations
			if ( facesBuffer[ key ].combinations === undefined ) {
				facesBuffer[ key ].combinations = [];
			}

			for ( var i = 0; i < facesBuffer[ key ].faces.length; i ++ ) {
				// add combination with face for each existingFace, this will, all combinations will be always made
				var existingFace = facesBuffer[ key ].faces[ i ];
				facesBuffer[ key ].combinations.push({ combinedFaces: [ face, existingFace ] });
			}

			facesBuffer[ key ].faces.push(face);

		}

	}

	/**
	 * Edges that have to be rendered sharply have to be redrawn and their faces replaced
	 * with the redrawn edges. For the new edges, duplicate vertices are needed.
	 *
	 * @private
	 */
	var _duplicateVertices = function (key, face) {
		// @todo: duplicate shared vertices, add the to object and or buffer
		// @todo: redraw the face with the new vertices and replace the old face in the object
		// or simply set the new indices on the face
		var indices = key.split('_');

		// duplicate the corresponding vertices
		var vec1 = verticesBuffer[indices[0]].clone();
		var vec2 = verticesBuffer[indices[1]].clone();
		verticesBuffer.push(vec1);
		verticesBuffer.push(vec2);

		// add to object
		object.vertices.push(vec1);
		object.vertices.push(vec2);

		// get the new indices
		var d = object.vertices.indexOf(vec1);
		var e = object.vertices.indexOf(vec2);

		scope.log('face before:');
		scope.log(face);

		// modify the face by replacing the old with the new indices
		if (face.a === indices[0]) {
			face.a = d;
		}
		if (face.b === indices[0]) {
			face.b = d;
		}
		if (face.c === indices[0]) {
			face.c = d;
		}

		if (face.a === indices[1]) {
			face.a = e;
		}
		if (face.b === indices[1]) {
			face.b = e;
		}
		if (face.c === indices[1]) {
			face.c = e;
		}

		scope.log('face after:');
		scope.log(face);

	}

	var indexes, uvIndexes, uvs;

	var vec;

	if ( node.has('texCoord') ) {

		uvs = node.texCoord.point;

	}

	if ( node.has('coord') ) {
		if ( ! uvs ) {
			uvs = node.coord.point;
		}

		for ( var k = 0, l = node.coord.point.length; k < l; k ++ ) {

			var point = node.coord.point[ k ];

			vec = new THREE.Vector3(point.x, point.y, point.z);

			object.vertices.push(vec);
			verticesBuffer.push(vec);

		}

	}

	var skip = 0;

	// some shapes only have vertices for use in other shapes
	if ( node.has('coordIndex') ) {

		// read this: http://math.hws.edu/eck/cs424/notes2013/16_Threejs_Advanced.html
		for ( var i = 0, j = node.coordIndex.length; i < j; i ++ ) {

			indexes = node.coordIndex[ i ];

			if ( node.has('texCoordIndex') ) {
				uvIndexes = node.texCoordIndex[ i ];
			} else {
				// default texture coord index
				uvIndexes = indexes;
			}

			// vrml supports multipoint indexed face sets (more then 3 vertices). You must calculate the composing triangles here
			skip = 0;

			// @todo: see if your can support squares, because they are possible in THREE
			// Face3 only works with triangles, but IndexedFaceSet allows shapes with more then three vertices, build them of triangles
			while ( indexes.length >= 3 && skip < ( indexes.length - 2 ) ) {

				var a = indexes[ 0 ];
				var b = indexes[ skip + (node.ccw ? 1 : 2) ];
				var c = indexes[ skip + (node.ccw ? 2 : 1) ];

				var face = new THREE.Face3(
					a,
					b,
					c,
					null // normal, will be added later
					// todo: pass in the color, if a color index is present
				);

				// push all the edges, with the face
				_pushToFaceBuffer(a, b, face);
				_pushToFaceBuffer(b, c, face);
				_pushToFaceBuffer(c, a, face);

				// @todo: this code might have to move till after faces have been duplicated for sharp edge rendering
				if ( uvs && uvIndexes ) {
					object.faceVertexUvs [ 0 ].push([
						new THREE.Vector2(
							uvs[ uvIndexes[ 0 ] ].x,
							uvs[ uvIndexes[ 0 ] ].y
						),
						new THREE.Vector2(
							uvs[ uvIndexes[ skip + (node.ccw ? 1 : 2) ] ].x,
							uvs[ uvIndexes[ skip + (node.ccw ? 1 : 2) ] ].y
						),
						new THREE.Vector2(
							uvs[ uvIndexes[ skip + (node.ccw ? 2 : 1) ] ].x,
							uvs[ uvIndexes[ skip + (node.ccw ? 2 : 1) ] ].y
						)
					]);
				} else {
					//this.log('Missing either uvs or indexes');
				}

				skip ++;

				object.faces.push(face);

			}

		}

	}

	// by computin face normals here, we will have normals when looping over the buffer,
	// but it is a bit of a hack, since you actually only want to add the faces to the object later...
	object.computeFaceNormals();

	// now, can we determine if the edge is sharp or not and duplicate edges if needed (when sharp) ?
	for ( var a in facesBuffer ) {
		if ( ! facesBuffer.hasOwnProperty(a) ) {
			continue;
		}

		if ( facesBuffer[ a ].faces.length < 2 ) {
			continue;
		}

		// this.log(a + ' has more than one.');

		/*
		 For every combination of faces that share an edge:
		 Compute facenormal for each face and calculate their angle, if it is larger than creaseAngle,
		 the edge is sharp and the face will have to be recalculated with duplicated points,
		 which will have to be added to the vertices of the object.
		 Once all final vertices and faces (partly duplicated) have been buffered, they can be added to the geometry,
		 or exsting faces can be replaced by faces with duplicated edges.
		 */
		var combinations = facesBuffer[ a ].combinations;

		for ( var j = 0; j < combinations.length; j ++ ) {

			var face1 = combinations[ j ].combinedFaces[ 0 ];

			var face2 = combinations[ j ].combinedFaces[ 1 ];

			// calculate angle
			var angle = face1.normal.angleTo(face2.normal);

			// default creaseAngle
			var creaseAngle = 0.5;

			if ( node.has('creaseAngle') ) {
				creaseAngle = node.creaseAngle;
			}

			// a sharp edge will have to be duplicated by rendering one of the faces on duplicated vertices

			/*
			 If the edge is sharp, we can now duplicate the vertices of the shared edge
			 and draw a new face, which should replace the old face
			 */
			// default 'smooth'
			combinations[ j ].edge = 'smooth';

			if ( angle > creaseAngle ) {
				combinations[ j ].edge = 'sharp';

				// duplicate the vertices and redraw face2 with the new vertices
				_duplicateVertices(a, face2);
			}
			/* */
		}

	}

	this.log(facesBuffer);

	// object.mergeVertices();

	object.computeVertexNormals();

	object.computeBoundingSphere();
	return object;

};

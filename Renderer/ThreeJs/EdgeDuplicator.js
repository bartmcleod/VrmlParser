/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since February 13, 2017
 *
 * The EdgeDuplicator can duplicate sharp edges on a geometry, so that
 * computeVertexNormals will show sharp and smooth edges correctly, based
 * on a creaseAngle.
 */

VrmlParser.Renderer.ThreeJs[ 'EdgeDuplicator' ] = function (debug) {
	this.debug       = debug;
	this.facesBuffer = {};

	/**
	 * Utility to easily switch logging on and off with the debug flag.
	 * @param obj
	 */
	this.log = function (obj) {
		if ( this.debug ) {
			console.log(obj);
		}
	};
};

/**
 * Duplicates edges that should be rendered as sharp.
 *
 * Preconditions: Faces have been trough triangulation and face normals have been computed or supplied.
 *
 * @param geometry
 * @param creaseAngle Angle in radians below which faces will be considered to have a smooth shared edge. Default is 0.5.
 */
VrmlParser.Renderer.ThreeJs.EdgeDuplicator.prototype.duplicateSharpEdges = function (geometry, creaseAngle) {
	var scope = this;

	var creaseAngle = creaseAngle || 0.5;

	/**
	 * We keep a registry of faces joined by edges indexed by their key, provided by _buildKey().
	 * @todo: refactor to facesRegistry
	 *
	 * Structure:
	 * {'key': {faces: [], edge: "smooth|sharp"}}
	 * @type {{}}
	 */
	var facesBuffer = {};

	/**
	 * A place to store all vertices, including those duplicated.
	 * @type {Array}
	 */
	var verticesBuffer = geometry.vertices;

	/**
	 * This will keep track of all faces per vertex index, so it tells you for each vertex index, which faces it is a part of.
	 * @type {{}}
	 */
	var verticesRegistry = [];

	/**
	 * A key describes an edge in a uniform manner.
	 *
	 * @param index1
	 * @param index2
	 * @private
	 */
	var _buildKey = function (index1, index2) {
		var key = parseInt(index1) < parseInt(index2) ? index1 + '_' + index2 : index2 + '_' + index1;
		return key;
	};

	/**
	 * Whether two faces share an edge at an angle which is considered sharp given
	 * the current creaseAngle.
	 *
	 * @param face1
	 * @param face2
	 * @returns {boolean}
	 * @private
	 */
	var _edgeIsSharp = function (face1, face2) {
		// calculate angle
		var angle = face1.normal.angleTo(face2.normal);

		return angle > creaseAngle;
	};

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
		var key = _buildKey(index1, index2);

		// keep registry of which vertices takes part in which face
		if ( verticesRegistry[ parseInt(index1) ] === undefined ) {
			verticesRegistry[ parseInt(index1) ] = [];
		}

		verticesRegistry[ parseInt(index1) ].push(face);

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

	};

	/**
	 * Utility method, which helps counting how many indexes two faces will have in
	 * common after swapping vertices.
	 *
	 * @param face The face, subject to index swapping
	 * @param abc one of 'a', 'b' or 'c', indicating the position of the index on the face.
	 * @param index
	 * @param swapIndex
	 * @param index2
	 * @param swapIndex2
	 * @private
	 */
	var _getSwappedIndex = function (face, abc, index, swapIndex, index2, swapIndex2) {
		if ( face[ abc ] == index ) {
			return swapIndex;
		} else if ( face[ abc ] == index2 ) {
			return swapIndex2;
		}
		return face[ abc ];
	};

	/**
	 * Edges that have to be rendered sharply have to be redrawn and their faces replaced
	 * with the redrawn edges. For the new edges, duplicate vertices are needed.
	 *
	 * Preconditions: Faces have been trough triangulation and face normals have been computed or supplied.
	 *
	 * @private
	 */
	var _duplicateVertices = function (key, face, keepFace) {
		scope.log(key + ' is DUPLICATED in _duplicateVertices');
		var indices = key.split('_');

		// duplicate the corresponding vertices
		var vec1 = verticesBuffer[ indices[ 0 ] ].clone();
		var vec2 = verticesBuffer[ indices[ 1 ] ].clone();
		verticesBuffer.push(vec1);
		verticesBuffer.push(vec2);

		// add to geometry
		geometry.vertices.push(vec1);
		geometry.vertices.push(vec2);

		scope.log('Duplicates vertices:');
		scope.log([ vec1, vec2 ]);

		// get the new indices
		var d = geometry.vertices.indexOf(vec1);
		var e = geometry.vertices.indexOf(vec2);

		// modify the face by replacing the old with the new indices
		if ( face.a === indices[ 0 ] ) {
			face.a = d;
		}
		if ( face.b === indices[ 0 ] ) {
			face.b = d;
		}
		if ( face.c === indices[ 0 ] ) {
			face.c = d;
		}

		if ( face.a === indices[ 1 ] ) {
			face.a = e;
		}
		if ( face.b === indices[ 1 ] ) {
			face.b = e;
		}
		if ( face.c === indices[ 1 ] ) {
			face.c = e;
		}

		scope.log('face after swap:');
		scope.log(face);

		scope.log(key + ' is key to be swapped!');
		_swapVertices(indices[ 0 ], d, indices[ 1 ], e, face, keepFace);

	};

	/**
	 * There is a challenge here. I tested this with squares and
	 * they get triangulated. Not out of strict necessity, but I do it for simplicities sake.
	 * I also made the assumption that all faces are convex, while they don't need to be in VRML, unless convex TRUE is set.
	 * Now if you replace two vertex indexes in a triangulated face, because it shares a sharp edge with another face,
	 * then the line between the two faces will be rendered all sharp and nice, but the triangular face that has the new
	 * vertices will now be visually separated from the triangle is had been paired with when the original square face
	 * was triangulated. This is because the paired face still uses the old vertex. This means you should also swap that
	 * particular vertex, to keep the surface of the square smooth. Now how can you tell, which face using vertex at index 3
	 * now has to use vertex at index 9 because you swapped that?
	 *
	 * How to solve it?
	 * 1. Find all faces that share the swapped vertex.
	 * 2. Do they have a 'smooth' edge with this face (called the triggerFace, because it triggered the swap)?
	 * 3. Then also swap the vertex there
	 * 4. Keep the other face the same (the _other face_ being the one you are visually 'separating' from by drawing an extra edge)
	 *
	 * @private
	 * @param index Index which has been replaced by swapIndex
	 * @param swapIndex Index that will replace index
	 * @param index2 Index which has been replaced by swapIndex2
	 * @param swapIndex2 index that will replace index2
	 * @param triggerFace The face that created a need for the swap, we won't swap vertices here.
	 * @param keepFace Face we are 'separating' from, we won't swap vertices in this one.
	 */
	var _swapVertices = function (index, swapIndex, index2, swapIndex2, triggerFace, keepFace) {
		scope.log('Swapping vertex ' + index + ' for ' + swapIndex);
		scope.log('Swapping vertex ' + index2 + ' for ' + swapIndex2);
		scope.log('triggerFace:');
		scope.log(triggerFace);
		// 1. Find all combinations that share the swapped vertex.
		// to avoid searching for it, we kept a registry per vertex telling in which faces is appears
		// in all of those faces, swap the vertex
		/** @var Array faces **/
		var faces  = verticesRegistry[ parseInt(index) ];
		var faces2 = verticesRegistry[ parseInt(index2) ];

		var combinedFaces = faces.concat(faces2);

		var face;
		var swapped;

		for ( var i = 0; i < combinedFaces.length; i ++ ) {
			swapped = false;
			face    = combinedFaces[ i ];

			if ( face == keepFace ) {
				continue;
			}

			/* The vertex must be swapped on the face if it has no edge which is the same as the edge with the triggerKey,
			 * because the triggerKey describes a sharp edge, which should remain sharp. Swapping is only done for
			 * smoot edges */

			var swappedForA = _getSwappedIndex(face, 'a', index, swapIndex, index2, swapIndex2);
			var swappedForB = _getSwappedIndex(face, 'b', index, swapIndex, index2, swapIndex2);
			var swappedForC = _getSwappedIndex(face, 'c', index, swapIndex, index2, swapIndex2);

			scope.log('Swapped for:');
			scope.log([ swappedForA, swappedForB, swappedForC ]);
			// scope.log('triggerFace:');
			// scope.log(triggerFace);

			/* If two indexes would be shared after a swap, the triangles share an edge
			 * If three indexes are the same, the trangles are the same */
			var theSame = 0;

			if ( swappedForA == triggerFace.a || swappedForA == triggerFace.b || swappedForA == triggerFace.c ) {
				theSame ++;
			}
			if ( swappedForB == triggerFace.a || swappedForB == triggerFace.b || swappedForB == triggerFace.c ) {
				theSame ++;
			}
			if ( swappedForC == triggerFace.a || swappedForC == triggerFace.b || swappedForC == triggerFace.c ) {
				theSame ++;
			}

			if ( theSame === 3 ) {
				scope.log('Same face, nothing to do here.');
				continue;
			}

			if ( _edgeIsSharp(face, triggerFace) ) {
				scope.log('Sharp edge, skipping:');
				scope.log(face);
				continue;
			} else {
				scope.log('Smooth edge:');
				scope.log(face);
			}

			if ( face.a != swappedForA ) {
				// scope.log('Swapped index a for ' + swapIndex);
				face.a  = swappedForA;
				swapped = true;
			}

			if ( face.b != swappedForB ) {
				// scope.log('Swapped index b for ' + swapIndex);
				face.b  = swappedForB;
				swapped = true;
			}

			if ( face.c != swappedForC ) {
				// scope.log('Swapped index c for ' + swapIndex);
				face.c  = swappedForC;
				swapped = true;
			}

			if ( swapped ) {
				scope.log('Face after _swapVertices');
				scope.log(face);
			}
		}

	}

	// actual processing starts below:
	for (var i=0; i < geometry.faces.length; i++) {
		var face = geometry.faces[i];
		// push all the edges to the buffer, with the face
		_pushToFaceBuffer(face.a, face.b, face);
		_pushToFaceBuffer(face.b, face.c, face);
		_pushToFaceBuffer(face.c, face.a, face);
	}

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

			// a sharp edge will have to be duplicated by rendering one of the faces on duplicated vertices

			/*
			 If the edge is sharp, we can now duplicate the vertices of the shared edge
			 and draw a new face, which should replace the old face
			 */
			// default 'smooth'
			combinations[ j ].edge = 'smooth';

			if ( _edgeIsSharp(face1, face2) ) {
				combinations[ j ].edge = 'sharp';

				// duplicate the vertices and redraw face2 with the new vertices
				_duplicateVertices(a, face2, face1);
			}
			/* */
		}

	}

};


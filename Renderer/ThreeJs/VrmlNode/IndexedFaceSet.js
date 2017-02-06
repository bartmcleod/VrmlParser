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
	var node   = this.node;
	var scope  = this;

	// @todo: separate the logic for duplicating edges into a separate component,
	// because it will have to be reused in Extrusion and ElevationGrid
	var verticesBuffer = [];

	/**
	 * This will keep track of all faces per vertex, so it tells you for each vertex, which faces it is a part of.
	 * @type {{}}
	 */
	var verticesRegistry = [];

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
	var facesBuffer = {};
	object          = new THREE.Geometry();
	//object.shading = THREE.SmoothShading;

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
	}

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

	}

	/**
	 * Edges that have to be rendered sharply have to be redrawn and their faces replaced
	 * with the redrawn edges. For the new edges, duplicate vertices are needed.
	 *
	 * face normals before you duplicate and you only have face normals (currently) after you
	 * have created an object, so after triangulation. This is turning in to a Yak shaving exercise.
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

		// add to object
		object.vertices.push(vec1);
		object.vertices.push(vec2);

		scope.log('Duplicates vertices:');
		scope.log([ vec1, vec2 ]);

		// get the new indices
		var d = object.vertices.indexOf(vec1);
		var e = object.vertices.indexOf(vec2);

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
		/*
		 * * @todo there is a challenge here. I tested this with squares and
		 * they get triangulated. Not out of strict necessity, but I do it for simplicities sake.
		 * I also made the assumption that all faces are convex, while they don't need to be in VRML, unless convex TRUE is set.
		 * Now if you replace two point indexes in a triangulated face, because it shares a sharp edge with another face,
		 * then the line between the two faces will be rendered all sharp and nice, but the triangular face that has the new
		 * vertices will now be visually separated from the triangle is had been paired with when the original square face
		 * was triangulated. This is because the paired face still uses the old vertex. This means you should also swap that
		 * particular vertex, to keep the surface of the square smooth. Now how can you tell, which face using vertex at index 3
		 * now has to use vertex at index 9 because you swapped that? Note that this did not occur in the manual test, because
		 * there your typed a square face with replaced vertexes, so the problem could not occur, because the vertex swapping happended
		 * before the triangulation.
		 *
		 * How to solve it?
		 * 1. Find all combinations that share the swapped vertex.
		 * 2. Do they have a 'smooth' edge with this face?
		 * 3. Then also swap the vertex there
		 * */
		scope.log(key + ' is key to be swapped!');
		_swapVertices(indices[ 0 ], d, indices[ 1 ], e, face, keepFace);

	}

	/**
	 * Utility method, which helps counting how many indexes two faces will have in
	 * common after swapping vertices.
	 *
	 * @param face
	 * @param swapIndex
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
	}
	/**
	 * @todo there is a challenge here.
	 * I tested this with squares and
	 * they get triangulated. Not out of strict necessity, but I do it for simplicities sake.
	 * I also made the assumption that all faces are convex, while they don't need to be in VRML, unless convex TRUE is set.
	 * Now if you replace two point indexes in a triangulated face, because it shares a sharp edge with another face,
	 * then the line between the two faces will be rendered all sharp and nice, but the triangular face that has the new
	 * vertices will now be visually separated from the triangle is had been paired with when the original square face
	 * was triangulated. This is because the paired face still uses the old vertex. This means you should also swap that
	 * particular vertex, to keep the surface of the square smooth. Now how can you tell, which face using vertex at index 3
	 * now has to use vertex at index 9 because you swapped that? Note that this did not occur in the manual test, because
	 * there you typed a square face with replaced vertexes, so the problem could not occur, because the vertex swapping happended
	 * before the triangulation.
	 *
	 * How to solve it?
	 * 1. Find all combinations that share the swapped vertex.
	 * 2. Do they have a 'smooth' edge with this face?
	 * 3. Then also swap the vertex there
	 * @param indices
	 * @private
	 */
	var _swapVertices    = function (index, swapIndex, index2, swapIndex2, triggerFace, keepFace) {
		scope.log('Swapping vertex ' + index + ' for ' + swapIndex);
		scope.log('Swapping vertex ' + index2 + ' for ' + swapIndex2);
		scope.log('triggerFace:');
		scope.log(triggerFace);
		// 1. Find all combinations that share the swapped vertex.
		// to avoid searching for it, we kept a registry per vertex telling in which faces is appears
		// in all of those faces, swap the vertex
		/** @var Array faces **/
		var faces = verticesRegistry[ parseInt(index) ];
		var faces2 = verticesRegistry[ parseInt(index2) ];

		var combinedFaces = faces.concat(faces2);
		scope.log('combinedFaces:');
		scope.log(combinedFaces);

		var face;
		var swapped;
		var edgeIsSharp;
		var sharesNoEdge;

		for ( var i = 0; i < combinedFaces.length; i ++ ) {
			swapped = false;
			face    = combinedFaces[ i ];

			if (face == keepFace) {
				continue;
			}
			// scope.log('faces buffer:');
			// scope.log(facesBuffer);

			/* The vertex must be swapped on the face if it has no edge which is the same as the edge with the triggerKey,
			 * because the triggerKey describes a sharp edge, which should remain sharp. Swapping is only done for
			 * smoot edges */
			edgeIsSharp = false;

			var swappedForA           = _getSwappedIndex(face, 'a', index, swapIndex, index2, swapIndex2);
			var swappedForB           = _getSwappedIndex(face, 'b', index, swapIndex, index2, swapIndex2);
			var swappedForC           = _getSwappedIndex(face, 'c', index, swapIndex, index2, swapIndex2);

			scope.log('Swapped for:');
			scope.log([swappedForA, swappedForB, swappedForC]);
			scope.log('triggerFace:');
			scope.log(triggerFace);

			/* If two indexes would be shared after a swap, the triangles share an edge
			 * If three indexes are the same, the trangles are the same */
			var theSame = 0;
			
			if (swappedForA == triggerFace.a || swappedForA == triggerFace.b || swappedForA == triggerFace.c) {
				theSame++;
			}			
			if (swappedForB == triggerFace.a || swappedForB == triggerFace.b || swappedForB == triggerFace.c) {
				theSame++;
			}			
			if (swappedForC == triggerFace.a || swappedForC == triggerFace.b || swappedForC == triggerFace.c) {
				theSame++;
			}

			if (theSame === 3) {
				scope.log('Same face, nothing to do here.');
				continue;
			}

			// if two vertices are the same as that of the triggerFace, this face shares an edge with it
			sharesNoEdge = theSame < 2;

			// when is the edge sharp?

			if ( edgeIsSharp || sharesNoEdge ) {
				if (sharesNoEdge) {
					scope.log('Shares no edge, skipping');
				} else {
					scope.log('Sharp edge, skipping:');
				}
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

				scope.log(face);

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
				scope.log('Duplicating because angle ' + angle + ' is larger than creaseAngle ' + creaseAngle);

				// duplicate the vertices and redraw face2 with the new vertices
				_duplicateVertices(a, face2, face1);
			}
			/* */
		}

	}

	// object.mergeVertices();
	object.computeVertexNormals();
	this.log(object.faces);

	object.computeBoundingSphere();
	return object;

};
//@todo in debug mode add arrow to show direction of face normal

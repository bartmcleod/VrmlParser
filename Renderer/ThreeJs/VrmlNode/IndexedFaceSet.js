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
	var duplicator = new VrmlParser.Renderer.ThreeJs.EdgeDuplicator(this.debug);
	var node       = this.node;

	object = new THREE.Geometry();

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

			// @todo: see if your can support squares, because they are possible in THREE (if you do, duplicator must also support them!!)
			// Face3 only works with triangles, but IndexedFaceSet allows shapes with polygons: triangulate them
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

				this.log(face);

				// @todo: this code might have to move till after vertices have been duplicated for sharp edge rendering
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

	// by computing face normals here, we will have normals when duplicating faces,
	object.computeFaceNormals();

	var creaseAngle = node.has('creaseAngle') ? node.creaseAngle : false;

	// if no creaseAngle, the VRML author probably wasn't intersted in smooth rendering, so don't!
	if (false !== creaseAngle) {
		duplicator.duplicateSharpEdges(object, creaseAngle);

		object.computeVertexNormals();
	}
	// this.log(object.faces);
	//
	object.computeBoundingSphere();
	return object;

};

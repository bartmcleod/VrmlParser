/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * Credits: Vitaliy Stoliarov https://github.com/Ni55aN
 * @since February 20, 2018
 *
 * SmoothEdges uses the example linked below to produce smooth face rendering based on
 * the crease angle.
 *
 * Inspired by:
 * https://gist.github.com/Ni55aN/90c017fafbefd3e31ef8d98ab6566cfa
 * and:
 * https://github.com/mrdoob/three.js/issues/3670#issuecomment-355622084
 *
 */

VrmlParser.Renderer.ThreeJs[ 'SmoothEdges' ] = function (debug) {
	this.debug       = debug;

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

VrmlParser.Renderer.ThreeJs.SmoothEdges.prototype._calcNormal = function (normals, normal, angle) {
	let allowed = normals.filter(n => n.angleTo(normal) < angle);

	if(0===allowed.length) {
		return [];
	}
	return allowed.reduce((a, b) => a.clone().add(b)).normalize();
};

VrmlParser.Renderer.ThreeJs.SmoothEdges.prototype.smooth = function (geometry, creaseAngle) {
	var creaseAngle = creaseAngle || 0.5;
	geometry.computeFaceNormals();

	var vertices = geometry.vertices.map(() => []); // vertices with normals array

	geometry.faces.map(face => {
		vertices[ face.a ].push(face.normal);
		vertices[ face.b ].push(face.normal);
		vertices[ face.c ].push(face.normal);
	});

	geometry.faces.map(face => {
		face.vertexNormals[ 0 ] = this._calcNormal(vertices[ face.a ], face.normal, creaseAngle);
		face.vertexNormals[ 1 ] = this._calcNormal(vertices[ face.b ], face.normal, creaseAngle);
		face.vertexNormals[ 2 ] = this._calcNormal(vertices[ face.c ], face.normal, creaseAngle);
	});

	if ( geometry.faces.length > 0 ) {
		geometry.normalsNeedUpdate = true;
	}
};

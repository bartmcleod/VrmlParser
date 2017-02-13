/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since December 8, 2016
 *
 * Conversion of a VRML 97 PointLight node to a THREE.PointLight
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'PointLight' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
};

VrmlParser.Renderer.ThreeJs.VrmlNode.PointLight.prototype.parse = function (scene, camera) {

	// color
	var color;

	if ( this.node.has('color') ) {
		var c = this.node.color;
		color = new THREE.Color(c.x, c.y, c.z);
	}

	var pointLight = new THREE.PointLight(color ? color : 0xaaaaaa);
	//PointLight( color, intensity, distance, decay )

	if ( this.node.has('on') ) {
		pointLight.enabled = this.node.on;
	}

	if ( this.node.has('radius') ) {
		pointLight.distance = this.node.radius;
	}

	if ( this.node.has('intensity') ) {
		// @todo somehow translate intensity to power in lumen?
		pointLight.intensity = this.node.intensity;
	}

	return pointLight;

	// todo: use the cumulative value of ambient intensity to set up an ambient ligth
};

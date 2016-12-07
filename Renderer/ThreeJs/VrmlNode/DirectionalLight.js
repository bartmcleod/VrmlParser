/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since December 7, 2016
 *
 * Conversion of a VRML 97 DirectionalLight node to a ThreeJs dirLight
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'DirectionalLight' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.DirectionalLight.prototype.parse = function (scene, camera) {

	// color
	var color;

	if ( this.node.has('color') ) {
		var c = this.node.color;
		color = new THREE.Color(c.x, c.y, c.z);
	}

	var dirLight = new THREE.DirectionalLight(color ? color : '0xaaaaaa');

	if ( this.node.has('direction') ) {
		// @todo I'm not sure whether translation of direction to a position is actually correct, but the result with the house.wrl looks ok
		var d = this.node.direction;
		dirLight.position.set(d.x, d.y, d.z).normalize();
	}

	if ( this.node.has('on') ) {
		dirLight.enabled = this.node.on;
	}

	if ( this.node.has('intensity') ) {
		dirLight.intensity = this.node.intensity;
	}

	camera.add(dirLight);
	camera.add(dirLight.target);

	// todo: use the cumulative value of ambient intensity to set up an ambient ligth
};

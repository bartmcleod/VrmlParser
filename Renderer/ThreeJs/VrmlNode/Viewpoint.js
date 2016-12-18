/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since September 1, 2016
 *
 * Conversion of a VRML 97 Viewpoint node to a set
 * of properties that can be applied to a ThreeJs camera.
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'Viewpoint' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.Viewpoint.prototype.parse = function (scene) {
	// @todo support for jump (bool)
	var node = this.node;

	var viewPointName           = node.name ? node.name : node.description

	return {
		getCamera: function(){
			return {
				name: viewPointName,
				position: node.position,
				orientation: node.orientation,
				fov: Math.round(180 / Math.PI * node.fieldOfView),
				aspect: window.innerWidth / window.innerHeight,
				near: 0.01,
				far: 1e5
			}
		}
	};

};

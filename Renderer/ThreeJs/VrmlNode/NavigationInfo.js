/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since September 20, 2016
 *
 * Conversion of a VRML 97 NavigationInfo node to Three.js controls.
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'NavigationInfo' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
	this.controls = null;
}

/**
 * Uses the NavigationInfo from the original VRML to determine the best
 * match for controls in ThreeJs.
 *
 * @todo: Figure out of support for avatarSize is possible
 * @todo: Support for headlight
 * @todo: Figure out if visibilityLimit can be implemented, could this be the 'far' property of the camera?
 * @todo: Create controls that mimic the original design of VRML better.
 * @param scene
 */
VrmlParser.Renderer.ThreeJs.VrmlNode.NavigationInfo.prototype.parse = function (scene) {
	this.log('From NavigationInfo');
	var speed = undefined !== this.node.speed ? this.node.speed : 1;

	if ( undefined !== this.node.type ) {
		switch ( this.node.type.toLowerCase() ) {
			case 'fly': // fly
				this.log('fly!');
				// use global controls and camera, no better solution at hand
				controls               = new THREE.FlyControls(camera);
				controls.movementSpeed = speed;
				break;
		}
	} else {
		this.log('orbit!');
		// use global controls and camera, no better solution at hand
		controls               = new THREE.OrbitControls(camera);
		controls.movementSpeed = speed;
	}

	/** Example of originalNode
	 *    avatarSize       [ 0.1, 1.6, 0.2,]
	 *    headlight        FALSE
	 *    speed            4
	 *    type    "FLY"
	 *    visibilityLimit  0.0
	 */

}

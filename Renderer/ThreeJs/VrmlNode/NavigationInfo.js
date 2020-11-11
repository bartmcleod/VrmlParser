import VrmlParser from "../../ThreeJs.js";
import {OrbitControls as OrbitControls} from "../../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {FlyControls as FlyControls} from "../../../node_modules/three/examples/jsm/controls/FlyControls.js";

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
 * @param debug
 * @param renderer
 * @param camera
 * @param domElement (renderer.domElement needed for controls)
 */
VrmlParser.Renderer.ThreeJs.VrmlNode.NavigationInfo.prototype.parse = function (scene, debug, renderer, camera, controls) {
	this.log('From NavigationInfo');
	var speed = undefined !== this.node.speed ? this.node.speed : 1;

	if ( undefined !== this.node.type ) {
		switch ( this.node.type.toLowerCase() ) {
			case 'fly':
				this.log('fly!');
				controls               = new FlyControls(camera, renderer.domElement);
				controls.movementSpeed = speed;
				break;
		}
	} else {
		this.log('orbit!');
		// use global controls, renderer and camera, no better solution at hand
		controls               = new OrbitControls(camera, renderer.domElement);
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

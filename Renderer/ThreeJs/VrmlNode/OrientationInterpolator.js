/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 * @todo: take time into account
 */

/**
 * The OrientationInterpolator wraps the essential properties of its original VRML node counterpart
 * and adds functionality to support animation in Three.js.
 *
 * @param originalNode
 * @constructor
 */
VrmlParser.Renderer.ThreeJs.VrmlNode[ 'OrientationInterpolator' ] = function (originalNode, cycleInterval, debug) {
	VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.call(this, originalNode, cycleInterval, debug);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.OrientationInterpolator.prototype = Object.create(VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype);

VrmlParser.Renderer.ThreeJs.VrmlNode.OrientationInterpolator.prototype.tween = function () {
	var scope      = this;
	//this.log('tweening for ' + this.index);
	var r          = this.keyValue[ this.index ];
	var endRadians = r.radians;
	//this.log(this);
	var from       = this.target.quaternion !== undefined ? this.target.quaternion.w : this.target.rotation.w;
	this.log('Animating from ' + from + ' to ' + endRadians);
	var endQuaternion = new THREE.Quaternion();
	var vector3       = new THREE.Vector3(r.x, r.y, r.z);
	endQuaternion.setFromAxisAngle(vector3, endRadians);
	var duration    = this.getDuration();
	this.tweenObj = new TWEEN
		.Tween(this.target.quaternion)
	.to(endQuaternion, duration)
	.start(+ new Date())
	.onComplete(function () {
		scope.complete();
	});
}

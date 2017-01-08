/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 * @todo: take time into account
 */

/**
 * The PositionInterpolator wraps the essential properties of its original VRML node counterpart
 * and adds functionality to support animation in Three.js.
 *
 * @param originalNode
 * @param debug
 * @constructor
 */
VrmlParser.Renderer.ThreeJs.VrmlNode[ 'PositionInterpolator' ] = function (originalNode, cycleInterval, debug) {
	VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.call(this, originalNode, cycleInterval, debug);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.PositionInterpolator.prototype = Object.create(VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype);

VrmlParser.Renderer.ThreeJs.VrmlNode.PositionInterpolator.prototype.tween = function () {
	var scope       = this;
	var endPosition = this.getPosition();
	this.log(this.key);

	var duration = this.getDuration();
	this.log(duration);
	this.tweenObj = new TWEEN
		.Tween(this.target.position)
	.to(endPosition, duration)
	.start(+ new Date())
	.onComplete(function () {
			scope.complete();
		}
	);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.PositionInterpolator.prototype.getPosition = function () {
	var v = this.keyValue[ this.index ];
	return new THREE.Vector3(v.x, v.y, v.z);
}

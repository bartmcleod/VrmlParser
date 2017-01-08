/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since January 2, 2017
 */

/**
 * The Interpolator provides a base implementation that concrete implementors can use.
 *
 * For now, animation is based on tweening, until something better comes up.
 *
 * Inheritors only need to implement the tween method.
 *
 * @param object originalNode
 * @param bool debug
 * @constructor
 */
VrmlParser.Renderer.ThreeJs.VrmlNode[ 'Interpolator' ] = function (originalNode, cycleInterval, debug) {
	this.originalNode = originalNode;
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.call(this, originalNode, debug);
	this.key      = originalNode.key;
	this.keyValue = originalNode.keyValue;
	// assumption that the object is already at keyValue[0], so start moving toward keyValue[1]
	this.index    = 1;
	this.target   = null;
	this.tweenObj = null;
	this.finish = null;
	// for duration of a single tween, convert to milliseconds and devide by the number of transitions
	this.cycleInterval = cycleInterval;
}

VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype.finish = function(){}

/**
 * Calculates the duration of a transition defined in this.key, based on the total time of the animation
 * (this.cycleInterval) and the proportional duration of the single transition, based on the difference between
 * the current and the previous key. The result is converted to milliseconds and can be used as the duration for
 * a tween.
 *
 * @returns {number}
 */
VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype.getDuration = function(){
	var currentKey = this.key[ this.index ];
	var previousKey = this.key[ this.index - 1 ];
	var duration = (currentKey - previousKey) * 1000 * this.cycleInterval;
	return duration;
}

VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype.complete = function () {
	// take next key or finish
	this.index ++;

	if ( this.index >= (this.keyValue.length) ) {

		if ( this.finish() ) {
			this.log('Interpolator "' + this.originalNode.name + '" finished at index ' + this.index);
		}
		return;
	}

	this.tween();
}

/**
 * To be overriden by inheritors
 */
VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype.tween = function () {

}

/**
 * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
 * @param Object3D target
 * @param callable finish A method that will be called when the callback is ready to be removed
 */
VrmlParser.Renderer.ThreeJs.VrmlNode.Interpolator.prototype.getCallback = function (target, finish) {
	var scope = this;

	// what to animate:
	this.target = target;

	// what to do after completion
	this.finish = finish;

	// trigger the animation
	this.tween();

	/**
	 * The animation callback
	 *
	 * @param float delta time difference
	 * @param callable finish will be called by the callback when it is ready to be removed
	 */
	var callback = function (delta) {
		scope.tweenObj.update(+ new Date());
	};

	return callback;
}

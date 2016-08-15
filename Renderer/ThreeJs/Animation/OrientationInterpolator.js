/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 * @todo: make support for the OrientationInterpolator universal: use all the keys, take time into account and use any axis, not only y.
 */
var VrmlParser = VrmlParser || {};

VrmlParser.Renderer = VrmlParser.Renderer || {};

VrmlParser.Renderer.ThreeJs = VrmlParser.Renderer.ThreeJs || {};

VrmlParser.Renderer.ThreeJs.Animation = VrmlParser.Renderer.ThreeJs.Animation || {};

/**
 * The OrientationInterpolator wraps the essential properties of its original VRML node counterpart
 * and adds functionality to support animation in Three.js.
 *
 * @param originalNode
 * @constructor
 */
VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator = function (originalNode, debug) {
  this.key = originalNode.key;
  this.keyValue = originalNode.keyValue;
  this.debug = debug ? true : false;
  // assumption that the object is already at keyValue[0], so start rotating toward keyValue[1]
  this.index = 1;
  this.finish = null;
  this.target = null;
  this.tweenObj = null;
}

VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator.prototype = {

  /**
   * Utility to easily switch logging on and off with the debug flag.
   * @param obj
   */
  log: function (obj) {
    if ( this.debug ) {
      console.log(obj);
    }
  },

  /**
   * Runs when one tween completes and starts the next
   */
  complete: function () {
    // take next key or finish
    this.index++;

    if ( this.index >= this.keyValue.length ) {
      this.log('finish at index ' + this.index);
      this.finish();
      return;
    }

    this.tween();
  },

  tween: function () {
    var scope = this;
    //this.log('tweening for ' + this.index);
    var endRadians = this.keyValue[this.index].radians;
    this.log('Animating from '+ this.target.rotation.y +' to ' + endRadians);
    var endQuaternion = new THREE.Quaternion();
    endQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), endRadians);

    this.tweenObj = new TWEEN
      .Tween(this.target.quaternion)
      .to(endQuaternion)
      .start(+new Date())
      .onComplete(function () {
        scope.complete();
      });
    ;
  },

  /**
   * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
   * @param Object3D target
   * @param callable finish A method that will be called when the callback is ready to be removed
   */
  getCallback: function (target, finish) {
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
      scope.tweenObj.update(+new Date());
    };

    return callback;
  }

};

/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 * @todo: make support for the PositionInterpolator universal: use all the keys, take time into account and use any axis, not only y.
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
VrmlParser.Renderer.ThreeJs.Animation.PositionInterpolator = function (originalNode, debug) {
  this.key = originalNode.key;
  this.keyValue = originalNode.keyValue;
  this.debug = debug ? true : false;
}

VrmlParser.Renderer.ThreeJs.Animation.PositionInterpolator.prototype = {

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
   * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
   * @param Object3D target
   * @param callable finish A method that will be called when the callback is ready to be removed
   */
  getCallback: function (target, finish) {
    var scope = this;
    var index = 1;

    var p = this.getPosition(index);
    this.log(p);
    this.log(target);
    //this.log(clock.getDelta());

    var position = { x: target.position.x };
    var tween = new TWEEN.Tween(position)
      .to(p, 3000)
      .onUpdate(function(){
        scope.log(p);
        target.position.x = position.x;
        // scope.log(position);
        // target.translateX(position.x);
      })
      .onComplete(function(){
        finish();
      })
      .start(+new Date())
      ;

    // tween.onComplete(function () {
    //   // take next key or finish
    //   index++;
    //
    //   p = scope.getPosition(index);
    //   scope.log(position);
    //   tween = new TWEEN.Tween(position).to(p).start();
    // });

    /**
     * The animation callback
     *
     * @param float delta time difference
     * @param callable finish will be called by the callback when it is ready to be removed
     */
    var callback = function (delta) {
      tween.update(+new Date());
    };

    return callback;
  },

  getPosition: function (index) {
    var v = this.keyValue[index];
    return new THREE.Vector3(v.x, v.y, v.z);
  }
};

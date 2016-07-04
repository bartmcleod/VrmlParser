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
VrmlParser.Renderer.ThreeJs.Animation.PositionInterpolator = function (originalNode) {
  this.key = originalNode.key;
  this.keyValue = originalNode.keyValue;
}

VrmlParser.Renderer.ThreeJs.Animation.PositionInterpolator.prototype = {
  /**
   * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
   * @param Object3D target
   * @param callable finish A method that will be called when the callback is ready to be removed
   */
  getCallback: function (target, finish) {
    var scope = this;
    var index = 0;
    var x;
    var positive;
    var p;

    p = this.getPosition(0);
    positive = p.x >= target.position.x;

    /**
     * The animation callback
     *
     * @param float delta time difference
     * @param callable finish will be called by the callback when it is ready to be removed
     */
    var callback = function (delta) {

      p = scope.getPosition(index);

      var increment = delta * 1000;
      increment = positive ? increment : -increment;

      x = target.position.x + increment;
      var arrivedAtKeyValue = (positive && x >= p.x) || (! positive && x < p.x);


      if ( arrivedAtKeyValue ) {
        // make positiion exact
        target.position.set(p.x, p.y, p.z);

        // take next key or finish
        index++;

        if ( index === scope.keyValue.length ) {
          console.log('finish');
          return finish();
        }

        positive = scope.getPosition(index).x >= target.position.x;
      }

      target.position.set(x, p.y, p.z);

    };

    return callback;
  },

  getPosition: function (index) {
    var v = this.keyValue[index];
    return new THREE.Vector3(v.x, v.y, v.z);
  }
};

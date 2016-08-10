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
VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator = function (originalNode) {
  this.key = originalNode.key;
  this.keyValue = originalNode.keyValue;
}

VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator.prototype = {
  /**
   * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
   * @param Object3D target
   * @param callable finish A method that will be called when the callback is ready to be removed
   */
  getCallback: function (target, finish) {
    var scope = this;
    // assumption that the object is already at keyValue[0], so start rotating toward keyValue[1]
    var index = 1;
    var endRadians;

    /** @var THREE.Object3D firstIntersect */

    var increment = 0.05;

    var endQuaternion;

    /**
     * The animation callback
     *
     * @param float delta time difference
     * @param callable finish will be called by the callback when it is ready to be removed
     */
    var callback = function (delta) {

      // next key @todo: should we also consider the timing from the original animation?, now we rely on delta without any awareness of the original speed

      endRadians = scope.keyValue[index].radians;
      endQuaternion = new THREE.Quaternion();
      endQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), endRadians);
      /*
      Allthough slerp is perfect for the original intent of the animations in the house.wrl, which would only open
      doors by rotating them, slerp is not good for any animation.

      First of all, slerp would actually replace all of the interpolation keys with a single smooth, beautiful animation.
      In spite of its smoothness, this only supports case where the keys were used, only to achieve that particular effect: one
      smooth rotation.
       */
      target.quaternion.slerp(endQuaternion, increment).normalize();

      // because of small rounding differences, we will round ourselves
      var targetQuaternionWCoordinate = Math.round(target.quaternion.w * 10E5);
      var endQuaternionWCoordinate = Math.round(endQuaternion.w * 10E5);

      if ( targetQuaternionWCoordinate == endQuaternionWCoordinate ) {
        // next key
        index++;

        if (index >= scope.keyValue.length) {
          console.log('Last target quaternion reached, remove animation');
          finish();
          return;
        }

      }

    };

    return callback;
  }

};

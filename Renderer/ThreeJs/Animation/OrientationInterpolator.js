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
VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator = function(originalNode){
  this.key = originalNode.key;
  this.keyValue = originalNode.keyValue;
}

VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator.prototype = {
  /**
   * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
   * @param Object3D target
   * @param callable finish A method that will be called when the callback is ready to be removed
   */
  getCallback: function(target, finish){
    var endRadians = this.findendRadians();
    var startRadians = this.keyValue[0].radians;

    // POC
    var startQuaternion = new THREE.Quaternion();
    startQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), endRadians);

    /** @var THREE.Object3D firstIntersect */

    var increment = 0.05;
    var logCount = 0;

    var endQuaternion = new THREE.Quaternion();
    endQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), endRadians);

    // figure out if we want to inverse the animation (when it has played)
    // because of small rounding differences, we will round ourselves
    /* @todo: inversion will become obsolete, once we use all the keys and the time,
     because some doors close themselves after a while and others just stay open
     */
    var targetQuaternionWCoordinate = Math.round(target.quaternion.w * 10000);
    var endQuaternionWCoordinate = Math.round(endQuaternion.w * 10000);
    var inverted = false;

    if ( targetQuaternionWCoordinate <= endQuaternionWCoordinate ) {
      console.log('can be reverted, has already played');
      // we invert it here, by setting the radians to the start radians
      endQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), startRadians);
      inverted = true;
    }

    /**
     * The animation callback
     *
     * @param float delta time difference
     * @param callable finish will be called by the callback when it is ready to be removed
     */
    var callback = function (delta) {

      target.quaternion.slerp(endQuaternion, increment).normalize();

      // because of small rounding differences, we will round ourselves
      targetQuaternionWCoordinate = Math.round(target.quaternion.w * 10000);
      endQuaternionWCoordinate = Math.round(endQuaternion.w * 10000);

      if (
        (false === inverted && targetQuaternionWCoordinate <= endQuaternionWCoordinate)
        ||
        (true === inverted && targetQuaternionWCoordinate >= endQuaternionWCoordinate)
      ) {
        console.log('target quaternion reached, remove animation');
        // scope.removeAnimation(touch);
        finish();
      }

      // if ( logCount % 1500 === 0 ) {
      //   console.log('w group ' + groupLevelParent.quaternion.w);
      //   console.log('w target ' + endQuaternion.w);
      //   console.log('endRadians: ' + endRadians);
      //   console.log('startRadians: ' + startRadians);
      // }
    };

    return callback;
  },

  /**
   * Temporary utility to find the largest amount of rotation specified in an OrientationInterpolator.
   *
   * @param orientationInterpolator
   */
  findendRadians: function () {
    var endRadians;
    var startRadians = this.keyValue[0].radians;
    var lastDiff = 0;

    for ( var i = 0; i < this.keyValue.length; i++ ) {
      var radians = this.keyValue[i].radians;
      var diff = Math.abs(radians - startRadians);
      if ( diff > lastDiff ) {
        endRadians = radians;
        lastDiff = diff;
      }
    }

    console.log('endRadians:' + endRadians);

    return endRadians;
  }
};

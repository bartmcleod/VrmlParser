/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since November 29, 2016
 *
 * Namespace and base node for Vrml nodes.
 */

VrmlParser.Renderer.ThreeJs['VrmlNode'] = function (originalNode, debug) {
  this.debug = debug;
  this.node = originalNode;
  this.node.has = function (property) {
    return ('undefined' !== typeof this[property] && null !== this[property]);
  };

	/**
	 * Utility to easily switch logging on and off with the debug flag.
	 * @param obj
	 */
  this.log = function (obj) {
    if ( this.debug ) {
      console.log(obj);
    }
  };
};

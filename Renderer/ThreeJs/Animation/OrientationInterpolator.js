/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 */
var VrmlParser = VrmlParser || {};

VrmlParser.Renderer = VrmlParser.Renderer || {};

VrmlParser.Renderer.ThreeJs = VrmlParser.Renderer.ThreeJs || {};

VrmlParser.Renderer.ThreeJs.Animation = VrmlParser.Renderer.ThreeJs.Animation || {};

VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator = function(key, keyValue){
  this.key = key;
  this.keyValue = keyValue;
}

VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator.prototype = {
  
};

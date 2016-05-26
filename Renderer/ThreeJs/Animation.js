/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 */
if ( 'undefined' === typeof VrmlParser ) {
  VrmlParser = {};
}

if ( 'undefined' === typeof VrmlParser.Renderer ) {
  VrmlParser.Renderer = {};
}

if ( 'undefined' === typeof VrmlParser.Renderer.ThreeJs ) {
  VrmlParser.Renderer.ThreeJs = function () {
  };
}

if ( 'undefined' === typeof VrmlParser.Renderer.ThreeJs.Animation ) {
  /**
   * Offers support for interaction and animation.
   *
   * Currently support clicking an object and seeing a log message for that.
   *
   * Also, in debug mode, a blue line will be drawn from the perspective camera to the clicked point.
   * You can see this line when zooming out after clicking and object.
   * 
   * @param scene
   * @param camera
   * @param renderer
   * @param debug
   * @constructor
   */
  VrmlParser.Renderer.ThreeJs.Animation = function (scene, camera, renderer, debug) {
    // @todo: support for multiple cameras or just re-initialize with a new camera when switched to one?
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.debug = debug ? true : false;
  };
}

VrmlParser.Renderer.ThreeJs.Animation.prototype = {
  /**
   * Support clicking the scene.
   *
   * If an object is clicked, it will show up in here. If a handler was registered for it,
   * we can execute the handler.
   *
   * Handlers will be registered by parsing VRML ROUTES for TouchSensors.
   *
   * Example:
   * ROUTE klikopdeur.touchTime TO TimeSource.startTime
   * ROUTE TimeSource.fraction_changed TO Deuropen.set_fraction
   * ROUTE Deuropen.value_changed TO deur.rotation
   *
   * @todo: translate event names to English, so that they make sense to people who are not able to read Dutch
   *
   * The example is a three-step animation script:
   * 1. The touchTime of the touch sensor is routed to the time source. We can translate this step, since we have
   * a clock and a click event
   */
  addClickSupport: function () {
    // do some POC click support here YOU MAY DEPEND ON THREEJS, BUT NEED TO LOAD THE DEPENDENCIES FROM THE EXAMPLES DIR
    // THERE IS A CIRCULAR DEPENDENCY, SINCE VRMLLOADER NOW DEPENDS ON VRMLPARSER AND VRMLPARSER EXAMPLES DEPEND ON THREEJS, BUT ONLY THE EXAMPLES
    // clicking: enable clicking on the screen to interact with objects in the 3D world
    projector = new THREE.Projector();
    var line;
    var scope = this;

    this.renderer.domElement.addEventListener('mousedown', function (event) {
      var camera = scope.camera;
      var scene = scope.scene;
      var renderer = scope.renderer;

      var x = event.offsetX == undefined ? event.layerX : event.offsetX;
      var y = event.offsetY == undefined ? event.layerY : event.offsetY;

      var vector = new THREE.Vector3();
      vector.set(( x / renderer.domElement.width ) * 2 - 1, -( y / renderer.domElement.height ) * 2 + 1, 0.5);

      vector.unproject(camera);

      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

      var objects = scene.children;
      var intersects = raycaster.intersectObjects(objects, true);

      if ( intersects.length ) {
        var firstIntersect = intersects[0].object;

        if (
          'undefined' !== typeof firstIntersect.userData
          && 'undefined' !== typeof firstIntersect.userData.originalVrmlNode
        ) {
          console.log(firstIntersect.userData.originalVrmlNode.node);
        }
      }

      if (true === scope.debug) {
        // draw a line where the object was clicked
        if ( null !== line ) {
          scene.remove(line);
        }

        var lineMaterial = new THREE.LineBasicMaterial({
          color: 0x0000ff
        });
        var geometry = new THREE.Geometry();

        geometry.vertices.push(new THREE.Vector3(raycaster.ray.origin.x, raycaster.ray.origin.y, raycaster.ray.origin.z));
        geometry.vertices.push(new THREE.Vector3(raycaster.ray.origin.x + (raycaster.ray.direction.x * 100000), raycaster.ray.origin.y + (raycaster.ray.direction.y * 100000), raycaster.ray.origin.z + (raycaster.ray.direction.z * 100000)));
        line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
        // / draw a line
      }

    }, false);
    // / clicking

  }
};


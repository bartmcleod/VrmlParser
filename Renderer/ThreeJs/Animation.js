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
    this.animations = {};
  };
}

VrmlParser.Renderer.ThreeJs.Animation.prototype = {
  /**
   * Updates or registered animations with a delta from the global clock.
   *
   * @param delta
   */
  update: function (delta) {
    for ( var a in this.animations ) {
      if ( !this.animations.hasOwnProperty(a) ) {
        continue;
      }
      var callback = this.animations[a];
      callback(delta);
    }
  },

  /**
   * Register a callback for the animations, it will be called at each tick with a delta
   * from the global clock.
   *
   * @param callback
   */
  addAnimation: function (name, callback) {
    this.animations[name] = callback;
  },

  /**
   * Gets all routes that were registered for a sensor in the original VRML world.
   *
   * Returned routes have a source and target object. Each have a name and event property.
   *
   * @param string name Name of the source node of the event.
   * @returns {*}
   */
  getRoutesForEvent: function (name) {
    var routesRegistry = this.scene.userData.routes;
    var routes = routesRegistry[name];
    //console.log('The routes are:');

    for ( var r = 0; r < routes.length; r++ ) {
      //console.log(routes[r]);
    }
    return routes;
  },

  /**
   * Recursively finds all targetroutes for a given route.
   *
   * @param triggerRoute
   * @returns {boolean}
   */
  findTargetRoutes: function (triggerRoute) {
    var targetRoutes = [];

    if ( 'undefined' === typeof triggerRoute ) {
      return targetRoutes;
    }

    var routesRegistry = this.scene.userData.routes;

    if ( 'undefined' === typeof routesRegistry[triggerRoute.target.name] ) {
      // this is the leaf route
      return triggerRoute;
    }

    // 1. Find first level of targetRoutes (they can be chained)
    var routes = routesRegistry[triggerRoute.target.name];

    // find all the target routes of intermediate routes
    for ( var i = 0; i < routes.length; i++ ) {

      var route = routes[i];

      // verify if the route has yet another target (it is an intermediate route)

      // 2. Find targetroutes of intermediate route, create a nested array
      var nestedTargetRoutes = this.findTargetRoutes(route);
      targetRoutes.push(nestedTargetRoutes);
    }

    // 3. Return targetroute
    return targetRoutes;
  },

  /**
   * Temporary utility to find the largest amount of rotation specified in an OrientationInterpolator.
   *
   * @param orientationInterpolator
   */
  findTargetRadians: function (orientationInterpolator) {
    var targetRadians;
    var startRadians = orientationInterpolator.keyValue[0].radians;
    var lastDiff = 0;

    for ( var i = 0; i < orientationInterpolator.keyValue.length; i++ ) {
      var radians = orientationInterpolator.keyValue[i].radians;
      var diff = Math.abs(radians - startRadians);
      if ( diff > lastDiff ) {
        targetRadians = radians;
        lastDiff = diff;
      }
    }

    console.log('targetRadians:' + targetRadians);

    return targetRadians;
  },

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
          //console.log(firstIntersect.userData.originalVrmlNode);
          // check if a TouchSensor was registered with the parent
          if ( 'undefined' !== typeof firstIntersect.parent ) {
            for ( var b = 0; b < firstIntersect.parent.children.length; b++ ) {
              var checkNode = firstIntersect.parent.children[b];
              if ( 'undefined' !== typeof checkNode.userData.originalVrmlNode && 'TouchSensor' === checkNode.userData.originalVrmlNode.node ) {
                // do a proof of concept here, but ideally, only trigger an already registered animation
                // @todo: register animation for TouchSensor by the name of the TouchSensor
                /*
                 For a quick proof of concept, you can use slerp and the endpoint of a rotation interpolator
                 from the orignial animation. For that you need to combine the routes and get the names.
                 */
                // find the first route, we only use TimeSensor to get from one to the next
                var touch = checkNode.name;
                console.log('touch: ' + touch);

                // work on a clone [slice(0)] of the routes, otherwise, using pop() will make the array useless for next time
                var routes = scope.getRoutesForEvent(touch).slice(0);

                // naive, only use first
                var targetRoutes = scope.findTargetRoutes(routes.pop());

                // again, naive (good usecase for map reduce?
                var targetRoute = targetRoutes;

                while ( 'function' === typeof targetRoute.pop ) {
                  targetRoute = targetRoute.pop();

                  if ('undefined' === typeof targetRoute) {
                    console.log('no target route found for '+ touch);
                    return;
                  }
                }

                // we found the leaf targetRoute
                console.log('target: ' + targetRoute);

                // again naive, assumptions:
                /*
                 *  1. source is an OrientationInterpolator
                 *  2. target is the groupLevel parent, but axis and radians has to be taken from original target
                 * */
                var OrientationInterpolator = scene.getObjectByName(targetRoute.source.name).userData.originalVrmlNode;
                // find the start radians and max radians and use those to do a slerp. Then after a timeout, slerp back.
                // NOTE: this ia naive interpretation of one specific sort of animation, to do an exact replication, we also need
                // the timesensor and replicate every step using the keys of the orientationInterpolator.
                var targetRadians = scope.findTargetRadians(OrientationInterpolator);
                var startRadians = OrientationInterpolator.keyValue[0].radians;

                var name = 'surrounding_' + targetRoute.target.name;
                var groupLevelParent = scene.getObjectByName(name);

                // POC

                var radians = startRadians;
                var startQuaternion = new THREE.Quaternion(0, 1, 0, startRadians);

                /** @var THREE.Object3D firstIntersect */
                if ( 'undefined' === typeof groupLevelParent.quaternion ) {
                  groupLevelParent.quaternion = startQuaternion;
                }

                var multiplication = 50;
                var increment = 0.01;

                /**
                 * The animation callback, @todo: unregister it when done?
                 * @param delta
                 */
                var callback = function (delta) {

                  if (targetRadians < 0) {
                    delta = -1 * delta;
                    if (radians - increment <= targetRadians) {
                      console.log('stopped, because ' + radians + ' is smaller than ' + targetRadians);
                      return;
                    }
                  } else if (radians + increment >= targetRadians) {
                    console.log('stopped, because ' + radians + ' is larger than ' + targetRadians);
                    return;
                  }

                  radians += multiplication * delta;

                  var targetQuaternion = new THREE.Quaternion(0, 1, 0, radians);

                  //console.log(groupLevelParent.quaternion);
                  groupLevelParent.quaternion.slerp(targetQuaternion, increment).normalize();
                };
                scope.addAnimation(touch, callback);
              }
            }
          }
        }
      }

      if ( true === scope.debug ) {
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


/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * @todo: Understand http://threejs.org/docs/#Reference/Extras.Animation/AnimationHandler, this code might duplicate for example removing an animation from the update loop
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 */

/**
 * Offers support for interaction and animation.
 *
 * Currently support clicking an object and seeing a log message for that.
 *
 * Also, in debug mode, a blue line will be drawn from the perspective camera to the clicked point.
 * You can see this line when zooming out after clicking and object.
 *
 * @param debug
 * @constructor
 */
VrmlParser.Renderer.ThreeJs[ 'Animation' ] = function (debug) {
	// use global camera, scene and renderer ( a weakness, I think )
	this.debug      = debug ? true : false;
	this.animations = {};
};

VrmlParser.Renderer.ThreeJs.Animation.prototype = {
	/**
	 * Holds array of geometries affected by named sensors, per sensor type.
	 */
	sensorRegistry: {},

	/**
	 * The purpose of the sensor registry, is to know, for each type of sensor, which
	 * geometries are within their scope. These are geometries that are children of the
	 * parent of the sensor (at least in case of a TouchSensor) and that have a name,
	 * so that events can be routed to them.
	 *
	 * So the registry should look like this:
	 * { 'TouchSensor': { 'MyTouchySensor1' : [ 'namedGeometry1', 'namedGeometry2'] }, { 'MyT2' : [ 'geom1', 'geom2'] },
	 * 	'PlaneSensor' : { 'MyPlaneSensor1' : [ 'etc'] }
	  * }
	 *
	 */
	buildSensorRegistry: function (scene) {
		var scope = this;
		this.log('building sensor registry');
		var sensors = [];

		/**
		 * Will find a sensor in the children of obj, if any.
		 *
		 * It will do so recursively going down the object tree.
		 * It will not search up the tree to avoid infinite recursion.
		 *
		 * @param obj
		 * @param sensorType
		 */
		function _findSensorsInChildrenOf(obj, sensorType) {
			if ( sensors[ sensorType ] === undefined ) {
				sensors[ sensorType ] = {};
			}

			if ( undefined === obj.children ) {
				return false;
			}

			for ( var i = 0; i < obj.children.length; i ++ ) {
				var checkNode = obj.children[ i ];

				var eventName;

				// check this node
				if ( 'undefined' !== typeof checkNode.userData.originalVrmlNode
					&& sensorType === checkNode.userData.originalVrmlNode.node
					&& checkNode.userData.originalVrmlNode.enabled !== false
				) {
					// find the first route, we only use TimeSensor to get from one to the next
					eventName = checkNode.name;
					scope.log(sensorType + ': ' + eventName);
					sensors[ sensorType ][ eventName ] = checkNode;
				}

				// check its children recursively
				if ( checkNode.children !== undefined ) {
					_findSensorsInChildrenOf(checkNode, sensorType);
				}

			}

		}

		/**
		 * Finds all geometries possible affected by the sensor. These are all geometries descending from
		 * the parent of the sensor.
		 *
		 * @param sensor
		 * @param name
		 * @private
		 */
		function _findGeometriesAffectedBySensor(sensor, name) {

			// if the sensor has no parent, or the parent has no children
			if ( sensor.parent === undefined || sensor.parent.children === undefined ) {
				return;
			}

			for ( var i = 0; i < sensor.parent.children.length; i ++ ) {

				var object = sensor.parent.children[ i ];
				// 1. check if the object is a Mesh and has a geometry
				// 2. check if the object has a name

				// recurse
				if ( object.children !== undefined ) {
					for ( var j = 0; j < object.children.length; j ++ ) {
						_findGeometriesAffectedBySensor(object.children[ j ], name);
					}
				}

				// the object has to be a geometry
				if ( object.geometry === undefined ) {
					// this.log('Object not a mesh object');
					continue;
				}

				// the geometry has to have a name (otherwise it cannot be routed to)
				if ( object.geometry.name === undefined || ! object.name ) {
					// this.log('Unnamed geometry');
					continue;
				}

				// the geometry should not be a debug Box of the sensor itself or any other sensor of the same type
				if ( object.userData.originalVrmlNode.node === sensorType ) {
					continue;
				}

				if ( scope.sensorRegistry[ sensorType ] [ name ] === undefined ) {
					scope.sensorRegistry[ sensorType ] [ name ] = [];
				}

				// register the geometry with the sensor
				scope.sensorRegistry[ sensorType ][ name ].push(object);
			}

		}

		// loop over all supported sensortypes to build the registry, based on the sensors found in the scene
		var supportedSensorTypes = [ 'TouchSensor' ];

		for ( var k = 0; k < supportedSensorTypes.length; k ++ ) {
			var sensorType = supportedSensorTypes[ k ];

			if ( this.sensorRegistry[ sensorType ] === undefined ) {
				this.sensorRegistry[ sensorType ] = [];
			}

			_findSensorsInChildrenOf(scene, sensorType);

			this.log('Found the following sensors of type ' + sensorType + ':');
			this.log(sensors[ sensorType ]);

			/*
			 For each sensor, you should get its parent and register named child geometries as sensitive to
			 the sensor
			 */
			for ( var l in sensors[ sensorType ] ) {

				var sensor = sensors[ sensorType ][ l ];
				_findGeometriesAffectedBySensor(sensor, sensor.name);

			}

		}

		this.log(this.sensorRegistry);
		this.log('DONE building sensor registry');
	},
	/**
	 * Updates or registered animations with a delta from the global clock.
	 *
	 * @param delta
	 */
	update: function (delta) {
		for ( var a in this.animations ) {

			if ( ! this.animations.hasOwnProperty(a) ) {
				continue;
			}

			var callback = this.animations[ a ];
			callback(delta);
		}
	},

	/**
	 * Register a callback for the animations, it will be called at each tick with a delta
	 * from the global clock.
	 *
	 * @param name
	 * @param callback
	 */
	addAnimation: function (name, callback) {
		this.animations[ name ] = callback;
	},

	/**
	 * Unregister a callback for the animations.
	 * @param name
	 * @return boolean true on successful removal
	 */
	removeAnimation: function (name) {

		if ( this.animations[ name ] === undefined ) {
			this.log('Animation ' + name + ' cannot be removed (missing)');
			return false;
		}

		this.log('Deleting animation ' + name);
		delete this.animations[ name ];
		return true;
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
		var routesRegistry = scene.userData.routes;
		var routes         = routesRegistry[ name ];
		this.log(routes, 'routes');
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

		var routesRegistry = scene.userData.routes;

		if ( 'undefined' === typeof routesRegistry[ triggerRoute.target.name ] ) {
			// this is the leaf route
			return triggerRoute;
		}

		// 1. Find first level of targetRoutes (they can be chained)
		var routes = routesRegistry[ triggerRoute.target.name ];

		// find all the target routes of intermediate routes
		for ( var i = 0; i < routes.length; i ++ ) {

			var route = routes[ i ];

			// verify if the route has yet another target (it is an intermediate route)

			// 2. Find targetroutes of intermediate route, create a nested array
			var nestedTargetRoutes = this.findTargetRoutes(route);
			targetRoutes.push(nestedTargetRoutes);
		}

		// 3. Return targetroute
		return targetRoutes;
	},

	/**
	 * Utility to easily switch logging on and off with the debug flag.
	 * @param obj
	 */
	log: function (obj, label) {

		if ( this.debug ) {

			if ( undefined !== label ) {
				console.log(label + ':');
			}

			console.log(obj);
		}
	},

	/**
	 * Checks the sensor registry to find sensor that affect the object.
	 *
	 * @param Object3D the clicked geometry.
	 * @param string sensorType
	 * @returns array sensor names
	 */
	findSensors: function (object, sensorType) {
		var sensorNames = [];

		for ( var name in this.sensorRegistry[ sensorType ] ) {
			//this.log('Checking the registry for ' + name);

			for ( var i = 0; i < this.sensorRegistry[ sensorType ][ name ].length; i ++ ) {

				if ( this.sensorRegistry[ sensorType ][ name ][ i ] === object ) {
					// this object is controlled by the sensor a
					//this.log('Found ' + i  + ' in ' + sensorType + ':' + name + ' and it is ' + object);
					sensorNames.push(name);
				}

			}

		}

		this.log('The clicked object can be affected by the following sensors of type ' + sensorType + ':');
		this.log(sensorNames);

		return sensorNames;
	},

	// @todo: support more interactions than just clicking

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
	 * The example is a three-step animation script:
	 * 1. The touchTime of the touch sensor is routed to the time source. We can translate this step, since we have
	 * a clock and a click event
	 */
	addClickSupport: function (camera, renderer) {
		var localCamera   = camera;
		var localRenderer = renderer;
		// clicking: enable clicking on the screen to interact with objects in the 3D world
		projector         = new THREE.Projector();
		var line;
		var scope         = this;

		renderer.domElement.addEventListener('mousedown', function (event) {
				// use global camera, scene and renderer
				var x = event.offsetX == undefined ? event.layerX : event.offsetX;
				var y = event.offsetY == undefined ? event.layerY : event.offsetY;

				var vector = new THREE.Vector3();
				vector.set(( x / localRenderer.domElement.width ) * 2 - 1, - ( y / localRenderer.domElement.height ) * 2 + 1, 0.5);

				vector.unproject(localCamera);

				var raycaster = new THREE.Raycaster(localCamera.position, vector.sub(localCamera.position).normalize());

				var objects    = scene.children;
				var intersects = raycaster.intersectObjects(objects, true);

				if ( intersects.length ) {
					var firstIntersect = intersects[ 0 ].object;

					var touches = scope.findSensors(firstIntersect, 'TouchSensor');

					for ( var a in touches ) {
						if ( ! touches.hasOwnProperty(a) ) {
							continue;
						}

						var touch = touches[ a ];

						var routes = scope.getRoutesForEvent(touch);

						for ( var i = 0; i < routes.length; i ++ ) {

							var targetRoutes = scope.findTargetRoutes(routes[ i ]);
							scope.log(targetRoutes, 'targetRoutes');

							for ( var j = 0; j < targetRoutes.length; j ++ ) {
								var targetRoute = targetRoutes[ j ];

								//find leaf route, because we skip intermediate routes for now
								while ( 'function' === typeof targetRoute.pop ) {
									targetRoute = targetRoute.pop();

									if ( 'undefined' === typeof targetRoute ) {
										scope.log('no target route found for ' + touch);
										return;
									}
								}

								var originalNode = scene.getObjectByName(targetRoute.source.name).userData.originalVrmlNode;

								// any supported interpolator will work, for now, only OrientationInterpolator and PositionInterpolator
								if ( undefined === VrmlParser.Renderer.ThreeJs.VrmlNode[ originalNode.node ] ) {
									scope.log(originalNode.node + ' is not yet supported');
									return;
								}

								var interpolator = new VrmlParser.Renderer.ThreeJs.VrmlNode[ originalNode.node ](originalNode, scope.debug);
								scope.log(interpolator, originalNode.node);
								var name   = 'surrounding_' + targetRoute.target.name;
								var target = scene.getObjectByName(name);

								// cleanup method for when the callback wants to be removed because it's done.
								var finish = function (touch) {
									return function() {
										return scope.removeAnimation(touch);
									}
								}(touch); // capture touch in function scope, otherwise always last touch will be used

								var callback = interpolator.getCallback(target, finish);

								scope.addAnimation(touch, callback);
							}
						}
					}

				}

				// drawing a line for diagnostic purposes.
				// keep this disabled, unless you really, really need it.
				// The problem is: the line can prevent finding your sensor if the line is clicked instead of your object.
				// if ( true === scope.debug ) {
				//   // draw a line where the object was clicked
				//   if ( null !== line ) {
				//     scene.remove(line);
				//   }
				//
				//   var lineMaterial = new THREE.LineBasicMaterial({
				//     color: 0x0000ff
				//   });
				//   var geometry = new THREE.Geometry();
				//
				//   geometry.vertices.push(new THREE.Vector3(raycaster.ray.origin.x, raycaster.ray.origin.y, raycaster.ray.origin.z));
				//   geometry.vertices.push(new THREE.Vector3(raycaster.ray.origin.x + (raycaster.ray.direction.x * 100000), raycaster.ray.origin.y + (raycaster.ray.direction.y * 100000), raycaster.ray.origin.z + (raycaster.ray.direction.z * 100000)));
				//   line = new THREE.Line(geometry, lineMaterial);
				//   scene.add(line);
				//   // / draw a line
				// }

			}
			,
			false
		);
		// / clicking

	}
};


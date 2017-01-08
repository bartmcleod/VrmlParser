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
	 * Utility to easily switch logging on and off with the debug flag.
	 * @param obj
	 * @param label
	 */
	log: function (obj, label) {

		if ( this.debug ) {

			if ( undefined !== label ) {
				console.log(label + ':');
			}

			console.log(obj);
		}
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
	 * @todo: translate event names in the example house.wrl to English, so that they make sense to people who are not able to read Dutch
	 * The example is a three-step animation script:
	 * 1. The touchTime of the touch sensor is routed to the time source. We can translate this step, since we have
	 * a clock and a click event
	 */
	init: function (camera, renderer) {
		var localCamera   = camera;
		var localRenderer = renderer;
		// clicking: enable clicking on the screen to interact with objects in the 3D world
		projector         = new THREE.Projector();
		var line;
		var scope         = this;

		/**
		 * Checks the sensor registry to find sensors that affect the object.
		 * The registry is only for sensors that affect geometries and need a list
		 * of geometries that will respond to the sensor if clicked.
		 *
		 * @param object Object3D the clicked geometry.
		 * @param sensorType String
		 * @returns Array sensor names
		 */
		function _findSensors(object, sensorType) {
			var sensorNames = [];

			for ( var name in scope.sensorRegistry[ sensorType ] ) {
				//this.log('Checking the registry for ' + name);

				for ( var i = 0; i < scope.sensorRegistry[ sensorType ][ name ].length; i ++ ) {

					if ( scope.sensorRegistry[ sensorType ][ name ][ i ] === object ) {
						// this object is controlled by the sensor a
						//this.log('Found ' + i  + ' in ' + sensorType + ':' + name + ' and it is ' + object);
						sensorNames.push(name);
					}

				}

			}

			// scope.log('The clicked object can be affected by the following sensors of type ' + sensorType + ':');
			// scope.log(sensorNames);

			return sensorNames;
		}

		renderer.domElement.addEventListener('mousedown', function (event) {
				/**
				 * Recursively finds all targetroutes for a given route.
				 *
				 * @param triggerRoute
				 * @returns Array
				 */
				function _findTargetRoutes(triggerRoute) {
					var targetRoutes = [];

					if ( 'undefined' === typeof triggerRoute ) {
						return targetRoutes;
					}

					var routesRegistry = scene.userData.routes;
					//this.log(routesRegistry, 'routesRegistry');

					if ( 'undefined' === typeof routesRegistry[ triggerRoute.target.name ] ) {
						// this is the leaf route
						return triggerRoute;
					}

					// 1. Find first level of targetRoutes (they can be chained)
					var routes = routesRegistry[ triggerRoute.target.name ];

					// find all the target routes of intermediate routes
					for ( var i = 0; i < routes.length; i ++ ) {

						var route = routes[ i ];
						// scope.log(route, 'Found follwoing route');

						// verify if the route has yet another target (it is an intermediate route)

						// 2. Find targetroutes of intermediate route, create a nested array
						var nestedTargetRoutes = _findTargetRoutes(route);
						targetRoutes.push(nestedTargetRoutes);
					}

					scope.log(targetRoutes, 'targetRoutes from private method');
					// 3. Return targetroute
					return targetRoutes;
				}

				/**
				 * Gets all routes that were registered for a sensor in the original VRML world.
				 *
				 * Returned routes have a source and target object. Each have a name and event property.
				 *
				 * @param string name Name of the source node of the event.
				 * @returns {*}
				 */
				function _getRoutesForEvent (name) {
					var routesRegistry = scene.userData.routes;
					var routes         = routesRegistry[ name ];
					scope.log(routes, 'routes');
					return routes;
				}

				function _addAnimation(rootRoute) {
					var targetRoutes = _findTargetRoutes(rootRoute);
					//scope.log(targetRoutes, 'targetRoutes');

					for ( var j = 0; j < targetRoutes.length; j ++ ) {
						var targetRoute = targetRoutes[ j ];
						// always initialize at 2, because your are already at a child (2) of the root route (1)
						var count       = 2;

						/*
						 What whe need to do here is pretty complex, because many routes can be chained. For now, I will make
						 the assumpion that routes are setup as follows:
						 1. Route a Sensor that interacts with the scene to trigger behavior (of these, currently TouchSensor is
						 the only one supported, but we also have @todo ProximitySensor, PlaneSensor, CylinderSensor and possibly others.
						 2. Route the Sensor from step 1 to a TimeSensor to be able to control the animation over time
						 3. Route the time events from step 2 to an Interpolator, so that for example position and orientation can
						 be changed.

						 So in the cases of a click we already have the first step and now we need some awareness of time.
						 The last step is to use the time to control the speed of the interpolation in step 3.

						 Because we want the results to be predictable, we will not process routing sets that comprise more than
						 3 routings. If there are more then 3 routings in a set, we will instead log a message.

						 If you are using this library and you a use case with routing chains of more than 3 routings, please
						 reate an issue on Github with example, requesting support for that use case. This would be really helpful
						 in order to create better animations support.
						 */

						// because of the above assumption, the root route already points us to a TimeSensor, which is the target of our rootRoute.
						var timeSensor = scene.getObjectByName(rootRoute.target.name);
						var cycleInterval = timeSensor.userData.originalVrmlNode.cycleInterval;

						while ( 'function' === typeof targetRoute.pop ) {

							targetRoute = targetRoute.pop();

							//scope.log(targetRoute, 'Just popped this targetRoute');
							++ count;

							if ( count > 3 ) {
								scope.log('Event routing chains of more than 3 routes are not supported in the current version. Skipping ' + touch + '...');
								return;
							}

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

						var interpolator = new VrmlParser.Renderer.ThreeJs.VrmlNode[ originalNode.node ](originalNode, cycleInterval, scope.debug);
						scope.log(interpolator, originalNode.node);
						var name   = 'surrounding_' + targetRoute.target.name;
						var target = scene.getObjectByName(name);

						// cleanup method for when the callback wants to be removed because it's done.
						var finish = function (touch) {
							return function () {
								return scope.removeAnimation(touch);
							}
						}(touch); // capture touch in function scope, otherwise always last touch will be used

						var callback = interpolator.getCallback(target, finish);

						scope.log('Adding animation for ' + touch);
						scope.addAnimation(touch, callback);
					}
				}

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

					var touches = _findSensors(firstIntersect, 'TouchSensor');

					for ( var k = 0; k < touches.length; k ++ ) {

						var touch = touches[ k ];

						var routes = _getRoutesForEvent(touch);

						for ( var i = 0; i < routes.length; i ++ ) {

							var rootRoute = routes[ i ];
							scope.log(rootRoute, 'rootRoute');
							_addAnimation(rootRoute);
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


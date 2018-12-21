/**
 * Not written as a NodeJs module, because this would require to use browserify
 * to make it available in the browser, while it is onlly useful in the browser anyway.
 *
 * @copyright Bart McLeod 2016, mcleod@spaceweb.nl
 * @author Bart McLeod / http://spaceweb.nl/
 */
window[ 'VrmlParser' ] = {};

VrmlParser[ 'Renderer' ] = {};

VrmlParser.Renderer[ 'ThreeJs' ] = function (debug) {
	this.debug = debug ? true : false;
};

VrmlParser.Renderer.ThreeJs.prototype = {
	viewpoints: {},
	debug: false,
	REVISION: 1,
	constructor: VrmlParser.Renderer.ThreeJs,

	log: function () {
		if ( this.debug ) {
			console.log.apply(console, arguments);
		}
	},

	warn: function () {
		console.warn.apply(console, arguments);
	},

	error: function () {
		console.error.apply(console, arguments);
	},

	/**
	 * @param Object nodeTree
	 * @param THREE.Scene scene
	 */
	render: function (nodeTree, scene) {

		var scope = this;

		console.log('VrmlParser.Renderer.ThreeJsRenderer ' + this.REVISION);

		/**
		 * Colors ar return by the parser as vector{x, y, z}.
		 * We want them as color{r, g, b}.
		 * @param vector
		 */
		var convertVectorToColor = function (vector) {
			return { r: vector.x, g: vector.y, b: vector.z };
		}

		/**
		 * Interpolates colors a and b following their relative distance
		 * expressed by t.
		 *
		 * @param float a
		 * @param float b
		 * @param float t
		 * @returns {Color}
		 */
		var interpolateColors = function (a, b, t) {
			a          = convertVectorToColor(a);
			b          = convertVectorToColor(b);
			var deltaR = a.r - b.r;
			var deltaG = a.g - b.g;
			var deltaB = a.b - b.b;

			var c = new THREE.Color();

			c.r = a.r - t * deltaR;
			c.g = a.g - t * deltaG;
			c.b = a.b - t * deltaB;

			return c;

		};

		/**
		 * Vertically paints the faces interpolating between the
		 * specified colors at the specified angels. This is used for the Background
		 * node, but could be applied to other nodes with multiple faces as well.
		 *
		 * When used with the Background node, default is directionIsDown is true if
		 * interpolating the skyColor down from the Zenith. When interpolationg up from
		 * the Nadir i.e. interpolating the groundColor, the directionIsDown is false.
		 *
		 * The first angle is never specified, it is the Zenith (0 rad). Angles are specified
		 * in radians. The geometry is thought a sphere, but could be anything. The color interpolation
		 * is linear along the Y axis in any case.
		 *
		 * You must specify one more color than you have angles at the beginning of the colors array.
		 * This is the color of the Zenith (the top of the shape).
		 *
		 * @param geometry
		 * @param radius
		 * @param angles
		 * @param colors
		 * @param boolean directionIsDown Whether to work bottom up or top down.
		 */
		var paintFaces = function (geometry, radius, angles, colors, directionIsDown) {
			var f, n, p, vertexIndex, color;

			var direction = directionIsDown ? 1 : - 1;

			var faceIndices = [ 'a', 'b', 'c', 'd' ];

			var coord = [], aColor, bColor, t = 1, A = {}, B = {}, applyColor = false, colorIndex;

			for ( var k = 0; k < angles.length; k ++ ) {

				var vec = {};

				// push the vector at which the color changes
				vec.y = direction * (Math.cos(angles[ k ]) * radius);

				vec.x = direction * (Math.sin(angles[ k ]) * radius);

				coord.push(vec);

			}

			// painting the colors on the faces
			for ( var i = 0; i < geometry.faces.length; i ++ ) {

				f = geometry.faces[ i ];

				n = (f instanceof THREE.Face3) ? 3 : 4;

				for ( var j = 0; j < n; j ++ ) {

					vertexIndex = f[ faceIndices[ j ] ];

					p = geometry.vertices[ vertexIndex ];

					for ( var index = 0; index < colors.length; index ++ ) {

						// linear interpolation between aColor and bColor, calculate proportion
						// A is previous point (vertex)
						if ( index === 0 ) {

							A.x = 0;
							A.y = directionIsDown ? radius : - 1 * radius;

						} else {

							A.x = coord[ index - 1 ].x;
							A.y = coord[ index - 1 ].y;

						}

						// B is current point (angle)
						B = coord[ index ];

						if ( undefined !== B ) {

							// p has to be between the points A and B which we interpolate
							applyColor = directionIsDown ? p.y <= A.y && p.y > B.y : p.y >= A.y && p.y < B.y;

							if ( applyColor ) {

								bColor = colors[ index + 1 ];

								aColor = colors[ index ];

								// below is simple linear interpolation
								t = Math.abs(p.y - A.y) / (A.y - B.y);

								// to make it faster, you can only calculate this if the y coord changes, the color is the same for points with the same y
								color = interpolateColors(aColor, bColor, t);

								f.vertexColors[ j ] = color;

							}

						} else if ( undefined === f.vertexColors[ j ] ) {

							colorIndex          = directionIsDown ? colors.length - 1 : 0;
							f.vertexColors[ j ] = convertVectorToColor(colors[ colorIndex ]);

						}

					}

				}

			}

		};

		/**
		 * Utility to quickly and safely check if a given property is
		 * present and set on a node.
		 *
		 * @param string property
		 * @return boolean
		 */
		var has = function (property) {
			// note that this pull the object the 'has' method is assigned to into this functions scope
			return ('undefined' !== typeof this[ property ] && null !== this[ property ]);
		};

		/**
		 * Convert VRML node representation into a ThreeJS 3D object.
		 *
		 * @param object node VRML node as parsed by the VrmlParser.
		 * @returns {THREE.Object3D}
		 */
		var parseNode = function (node, material) {
			if ( undefined === node.node ) {
				// not a node, for now, ignore it
				return false;
			}

			var smooth = new VrmlParser.Renderer.ThreeJs.SmoothEdges(scope.debug);

			// for syntactic sugar only:
			node.has = has;

			// this will be the returned ThreeJS object returned from parseNode, if not overwritten
			var object           = new THREE.Object3D();
			var surroundingGroup = false;
			// @todo: WIP refactor the switch to a class name with parse method for each node: parse(writer, node)
			switch ( node.node ) {
				case 'Text':
					var text = new VrmlParser.Renderer.ThreeJs.VrmlNode.Text(node, scope.debug);
					text.setMaterial(material);
					object = text.parse();
					break;

				case 'PointLight':
					var pointLight = new VrmlParser.Renderer.ThreeJs.VrmlNode.PointLight(node, scope.debug);
					object         = pointLight.parse();
					break;

				case 'DirectionalLight':
					object               = false;
					var directionalLight = new VrmlParser.Renderer.ThreeJs.VrmlNode.DirectionalLight(node, scope.debug);
					directionalLight.parse(scene, camera);
					break;

				case 'NavigationInfo':
					// no object needed, NavigationInfo initializes controls in the scene
					object             = false;
					var navigationInfo = new VrmlParser.Renderer.ThreeJs.VrmlNode.NavigationInfo(node, scope.debug);
					navigationInfo.parse(scene, camera);
					break;

				case 'Viewpoint':
					object            = false;
					var viewPointName = node.name ? node.name : node.description;
					scope.log('Got a Viewpoint named ' + (viewPointName));
					var viewpoint = new VrmlParser.Renderer.ThreeJs.VrmlNode.Viewpoint(node, scope.debug);
					// surroundingGroup = viewpoint.parse(scene);
					// store the group with the camera in the list of cameras, by its name
					//object = surroundingGroup.getCamera();
					scope.viewpoints[ viewPointName ] = viewpoint.parse(scene);
					break;

				case 'OrientationInterpolator':
				case 'PositionInterpolator':
					// only keeping the object, because we are interested in its original values
					break;

				case 'Switch':
					// Switch is a list of nodes from which is chosen based on whichChoice, which is the index.
					if ( node.whichChoice >= 0 && node.whichChoice < node.choice.length ) {
						object = parseNode(node.choice[ node.whichChoice ]);
					} else {
						object = false;
					}
					break;

				case 'Group':
				case 'Transform':
					// Group is basically the same as Object3D, only the type is set to Group
					object = new THREE.Group;
					if ( node.has('children') ) {
						// sugar
						node.children.has = has;
						// children can be a node or an array
						if ( node.children.has('node') ) {
							// children is a node
							var objects = parseNode(node.children);
							if ( false !== objects ) {
								object.add(objects);
							}
						} else if ( node.children.has('length') ) {
							// children should be an array
							for ( var i = 0; i < node.children.length; i ++ ) {

								var child      = node.children[ i ];
								child.has      = has;
								var threeJsObj = parseNode(child);
								if ( false !== threeJsObj ) {
									object.add(threeJsObj);
								}

							}
						}
					}

					var t = { x: 0, y: 0, z: 0 };

					if ( node.has('translation') ) {

						t = node.translation;
						object.position.set(t.x, t.y, t.z);

					}

					var r = { x: 0, y: 0, z: 0, radians: 0 };

					if ( node.has('rotation') ) {

						r = node.rotation;
						// we no longer set it here, but in the surrounding group, otherwise rotation will no be relative when animated
						//object.quaternion.setFromAxisAngle(new THREE.Vector3(r.x, r.y, r.z), r.radians);
					}

					if ( node.has('scale') ) {

						var s = node.scale;

						object.scale.set(s.x, s.y, s.z);

					}

					// support for center requires an extra group, which we will add allways, to ensure predictable behavior
					// the name of the surrounding group will later become the name of the object prefixed with 'surrounding_'
					surroundingGroup = new THREE.Group();

					if ( ! node.has('center') ) {
						// setup a default center
						node.center = { x: 0, y: 0, z: 0 };
					}

					var center = node.center;
					// this will be the axis of rotation, how to apply?
					// by creating a group around the group, setting its position to the center
					// and then translate the innerGroup back to its original position
					surroundingGroup.position.set(t.x + center.x, t.y + center.y, t.z + center.z);
					object.position.set(0 - center.x, 0 - center.y, 0 - center.z);

					// we me must also rotate the surrounding group to any rotation that applies to the original object
					surroundingGroup.quaternion.setFromAxisAngle(new THREE.Vector3(r.x, r.y, r.z).normalize(), r.radians);

					surroundingGroup.add(object);
					break;

				case 'Shape':
					var isLine  = node.has('geometry') && 'IndexedLineSet' === node.geometry.node;
					var isPoint = node.has('geometry') && 'PointSet' === node.geometry.node;
					var geometry;
					var appearance;

					if ( node.has('appearance') ) {
						appearance = node.appearance;

						// sugar
						appearance.has = has;

						if ( appearance.has('material') ) {
							var vrmlMaterial = appearance.material;
							var material;

							// sugar
							vrmlMaterial.has = has;

							if ( isLine ) {
								//scope.log('Line object');
								// @todo: we use LineBasicMaterial, is this always appropriate for VRML?
								material = new THREE.LineBasicMaterial();

								if ( vrmlMaterial.has('color') ) {

									var materialColor = convertVectorToColor(vrmlMaterial.color);

									material.color.setRGB(materialColor.r, materialColor.g, materialColor.b);
									material.shininess = 0;

								}
							} else if ( isPoint ) {
								// points in ThreeJS only support color
								//scope.log('Points object');
								//scope.log(vrmlMaterial);

								// color
								var c;

								if ( vrmlMaterial.has('diffuseColor') ) {
									c = convertVectorToColor(vrmlMaterial.diffuseColor);
								}
								if ( vrmlMaterial.has('emissiveColor') ) {
									c = convertVectorToColor(vrmlMaterial.emissiveColor);
								}

								material = new THREE.ShaderMaterial({
									vertexShader: 'void main() {' +
										'\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n' +
										'\n\tgl_PointSize = 3.0;\n' +
										'}',
									fragmentShader: 'void main() {\n\tgl_FragColor = vec4( ' + c.r + ', ' + c.g + ', ' + c.b + ', 1.0 );\n}'
								});

							} else {

								if (
									vrmlMaterial.has('specularColor')
									&& (
										vrmlMaterial.specularColor.x != 0
										|| vrmlMaterial.specularColor.y != 0
										|| vrmlMaterial.specularColor.z != 0
									) ) {

									material = new THREE.MeshPhongMaterial();

								} else {

									material = new THREE.MeshLambertMaterial();

								}

								if ( vrmlMaterial.has('diffuseColor') ) {

									var materialColor = convertVectorToColor(vrmlMaterial.diffuseColor);

									material.color.setRGB(materialColor.r, materialColor.g, materialColor.b);

								}

								if ( vrmlMaterial.has('emissiveColor') ) {

									var emissiveColor = convertVectorToColor(vrmlMaterial.emissiveColor);

									material.emissive.setRGB(emissiveColor.r, emissiveColor.g, emissiveColor.b);

								}

								// specular is only defined for phong material, so check!
								if ( vrmlMaterial.has('specularColor') && undefined !== material.specular ) {

									var specularColor = convertVectorToColor(vrmlMaterial.specularColor);

									material.specular.setRGB(specularColor.r, specularColor.g, specularColor.b);

								}

								if ( vrmlMaterial.has('transparency') ) {

									// transparency is opposite of opacity
									material.opacity = Math.abs(1 - vrmlMaterial.transparency);

									material.transparent = true;

								}

								if ( appearance.has('texture') ) {
									var textureNode = appearance.texture;
									textureNode.has = has;

									// ImageTexture node?
									if ( textureNode.has('node')
										&& textureNode.node === 'ImageTexture'
										&& textureNode.has('url')
										&& textureNode.url
									) {

										var imageUrl;

										if (
											textureNode.url instanceof Array
											&& textureNode.url.length > 0
										) {
											// @todo: for simplicity we only consider the first url, but what should we do when there are more?
											imageUrl = textureNode.url[ 0 ];
										} else {
											// url is (probably) a string
											imageUrl = textureNode.url;
										}

										if ( imageUrl.length > 0 ) {
											scope.log('Loading image: ' + imageUrl);

											// @todo: support for repeatS and repeatT

											var texture = new THREE.TextureLoader().load(imageUrl, function (texture) {
												if ( undefined !== texture.image ) {
													texture.repeat.set(texture.image.height / texture.image.width, 1);
												}
											});

											texture.wrapS = THREE.ClampToEdgeWrapping;
											texture.wrapT = THREE.ClampToEdgeWrapping;
											scope.log(texture);

											material.map = texture;
										}

									}

								}

								//@todo: support for TextureTransform
							}

						}

						if ( node.has('geometry') && 'IndexedFaceSet' === node.geometry.node ) {
							//if ( false === node.geometry.node.solid ) {

							material.side = THREE.DoubleSide;
							// object.material.side = THREE.FrontSide;

							//}
						}

					}

					if ( node.has('geometry') ) {
						geometry = parseNode(node.geometry, material);

						// turned off after figuring out edge duplication for sharp edges
						// if ( scope.debug ) {
						// 	analyzer.labelVertices(object);
						// 	analyzer.labelFaces(object);
						// }
					}

					if ( isLine ) {
						object = new THREE.Line();
					} else if ( isPoint ) {
						object = new THREE.Points({ size: 0.01 });
					} else if ( geometry instanceof THREE.Group ) {
						// for example, a text
						scope.log('Geometry is a group, replaces the object!');
						object = geometry;
					} else {
						object = new THREE.Mesh(geometry, material);
					}

					break;

				case 'Background':
					object = false;

					var segments = 20;

					// sky (full sphere):

					var radius = 2e4;

					var skyGeometry = new THREE.SphereGeometry(radius, segments, segments);
					var skyMaterial = new THREE.MeshBasicMaterial({ fog: false, side: THREE.BackSide });

					if ( node.skyColor.length > 1 ) {

						paintFaces(skyGeometry, radius, node.skyAngle, node.skyColor, true);

						skyMaterial.vertexColors = THREE.VertexColors;

					} else {

						var color = convertVectorToColor(node.skyColor[ 0 ]);

						skyMaterial.color.setRGB(color.r, color.g, color.b);

					}

					var sky                       = new THREE.Mesh(skyGeometry, skyMaterial);
					sky.userData.originalVrmlNode = node;
					scene.add(sky);

					// ground (half sphere):

					if ( node.has('groundColor') ) {

						radius = 1.2e4;

						var groundGeometry = new THREE.SphereGeometry(radius, segments, segments, 0, 2 * Math.PI, 0.5 * Math.PI, 1.5 * Math.PI);
						var groundMaterial = new THREE.MeshBasicMaterial({
							fog: false,
							side: THREE.BackSide,
							vertexColors: THREE.VertexColors
						});

						paintFaces(groundGeometry, radius, node.groundAngle, node.groundColor, false);

						var ground                       = new THREE.Mesh(groundGeometry, groundMaterial);
						ground.userData.originalVrmlNode = node;
						ground.receiveShadow             = true;
						scene.add(ground);
					}

					break;

				case 'Box':
					var s  = node.size;
					object = new THREE.BoxGeometry(s.x, s.y, s.z);
					break;

				case 'Cylinder':
					object = new THREE.CylinderGeometry(node.radius, node.radius, node.height, 36);
					smooth.smooth(object);
					break;

				case 'Cone':
					// @todo move Cone to its own class
					let openEnded = node.has('bottom') ? false === node.bottom : false;

					let radialSegments = 36;

					var heightSegments = 1;

					// if side is FALSE in VMRL, we will simply use no height segments
					// does not work
					if ( node.has('side') && false === node.side ) {

						heightSegments = 0;

					}

					let coneRadius = node.has('bottomRadius') ? node.bottomRadius : 1;

					let coneHeight = node.has('height') ? node.height : 1;

					object = new THREE.ConeGeometry(coneRadius, coneHeight, radialSegments, heightSegments, openEnded);

					smooth.smooth(object);

					break;

				case 'Sphere':
					object = new THREE.SphereGeometry(node.radius);
					smooth.smooth(object);
					break;

				case 'IndexedFaceSet':
					var indexedFaceSet = new VrmlParser.Renderer.ThreeJs.VrmlNode.IndexedFaceSet(node, scope.debug);
					object             = indexedFaceSet.parse();
					// indexed faces set uses SmoothEdges internally, no need to do anything here
					break;

				case 'IndexedLineSet':
					var vec;
					var point;
					var object   = new THREE.Geometry();
					var vertices = [];

					// first create a buffer of vectors to use for the points.
					// the challenge lies in the fact that ThreeJs draws lines in the order the vertices are added
					// I do not yet see a way to tell ThreeJs to draw any amount of lines between all points.
					// Could it be just a simple as using a LineMaterial for a shape?
					if ( node.has('coord') ) {

						for ( var k = 0, l = node.coord.point.length; k < l; k ++ ) {

							point = node.coord.point[ k ];

							vec = new THREE.Vector3(point.x, point.y, point.z);

							vertices.push(vec);

						}

					}

					if ( node.has('coordIndex') ) {

						for ( var i = 0, j = node.coordIndex.length; i < j; i ++ ) {

							indexes = node.coordIndex[ i ];

							// loop over all the points and add their vertex to the geometry.
							// hopefully, using the same vertex twice will not lead to an error,
							// but  just draw a line as intended.
							for ( var p = 0; p < indexes.length; p ++ ) {

								var a = indexes[ p ];

								var pointA = vertices[ a ];

								object.vertices.push(new THREE.Vector3(pointA.x, pointA.y, pointA.z));
							}

						}

						object.computeBoundingSphere();

					}
					// @todo: is there a color property to support?
					break;
				case 'PointSet':

					var vec;
					var point;
					var object = new THREE.Geometry();

					if ( node.has('coord') ) {

						for ( var k = 0, l = node.coord.point.length; k < l; k ++ ) {

							point = node.coord.point[ k ];

							vec = new THREE.Vector3(point.x, point.y, point.z);

							object.vertices.push(vec);

						}

					}

					object.computeBoundingSphere();

					// if ( node.has('color') ) {
					//   for ( var k = 0, l = node.coord.point.length; k < l; k++ ) {
					//
					//     point = node.coord.point[k];
					//
					//     vec = new THREE.Vector3(point.x, point.y, point.z);
					//
					//     geometry.vertices.push(vec);
					//
					//   }
					// }

					break;
				case 'TimeSensor':
					// just explicitly keep the object (by not setting it to false), do nothing else
					break;
				case 'TouchSensor':
					// just explicitly keep the object (by not setting it to false), do nothing else
					if ( scope.debug ) {
						// in debug mode, add a ten x ten x ten cm cube to indicate the presence of a touchsensor
						// @todo: register this with a legenda
						object                = new THREE.Mesh();
						object.geometry       = new THREE.CubeGeometry(0.1, 0.1, 0.1);
						object.material       = new THREE.MeshNormalMaterial();
						object.material.color = new THREE.Color(0.5, 0.5, 0.5);
					}
					break;
				default:
					// unsupported nodes will not be added to the scene as an object
					object = false;
					break;
			}

			if ( false !== object ) {
				if ( undefined !== object.userData ) {
					// keep the original VRML node for reference
					object.userData.originalVrmlNode = node;
				}

				if ( '' === object.name ) {
					if ( node.has('name') ) {
						object.name = node.name;
					} else if ( node.has('node') ) {
						object.name = node.node;
					}
				}
				object.castShadow    = ! isPoint;
				object.receiveShadow = ! isPoint;
			}

			if ( false !== surroundingGroup ) {
				surroundingGroup.name = 'surrounding_' + object.name;
				return surroundingGroup;
			}
			return object;
		};

		for ( var n = 0; n < nodeTree.length; n ++ ) {
			var childNode = parseNode(nodeTree[ n ]);
			if ( false !== childNode ) {
				scene.add(childNode);
			}
		}

		scene.userData.routes = nodeTree.routes;
		scope.log(scene);
	}

};

/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 1, 2018
 *
 * Conversion of a VRML 97 Text node to a THREE.Text
 *
 * The Text node may include a FontStyle node, which will be parsed along with the Text node.
 * The attributes of the FontStyle node have a meaning only in the context of the Text node and shall not
 * be used outside that context.
 *
 * Set VrmlParser.Renderer.ThreeJs.VrmlNode.Text.fontsDir globally, to allow this node to find its fonts.
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'Text' ] = function (node, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);

	this.material = null;
};

VrmlParser.Renderer.ThreeJs.VrmlNode.Text.prototype.setMaterial = function (material) {
	this.material = material;
};

VrmlParser.Renderer.ThreeJs.VrmlNode.Text.prototype.parse = function (scene, camera) {
	var textGroup = new THREE.Group();

	var loader = new THREE.FontLoader();

	var node = this.node;

	// determine if the strings should be in the order top to bottom
	var topToBottom = true;

	var fontStyle = node.fontStyle ? node.fontStyle : false;

	if ( fontStyle && undefined !== fontStyle.topToBottom && false === fontStyle.topToBottom ) {
		topToBottom = false;
	}

	// determine if the strings should be in the order left to right
	var leftToRight = true;

	if ( fontStyle && undefined !== fontStyle.leftToRight && ! fontStyle.leftToRight ) {
		leftToRight = false;
	}

	var size = fontStyle.size ? fontStyle.size : 1;
	var x, y;
	// @todo: right to left support?

	var spacing       = fontStyle.spacing ? fontStyle.spacing : 1;
	var greatestWidth = 0;
	var scope = this;

	// for now, we only support a single font
	// @todo: support more fonts
	// fonts can also be preloaded... as an alternative to what we are doing here
	loader.load(VrmlParser.Renderer.ThreeJs.VrmlNode.Text.fontsDir + '/helvetiker_regular.typeface.json', function (font) {

		for ( var i = 0; i < node.string.length; i ++ ) {
			let text = node.string[ i ];

			// reverse the text if leftToRight is false
			if ( false === leftToRight ) {
				text = text.split('').reverse().join('');
			}

			y = topToBottom ? (node.string.length - i) * size : i * size;
			y *= spacing;

			let geometry = new THREE.TextGeometry(text, {
				font: font,
				size: size,
				height: 0, // this is the thickness. It must be zero to match the VRML 97 specification.
				curveSegments: 12,
				bevelEnabled: false,
				bevelThickness: 0,
				bevelSize: 0,
				bevelSegments: 0
			});
			geometry.computeBoundingBox();
			geometry.computeFaceNormals();
			let textMesh = new THREE.Mesh(geometry, scope.material);
			textMesh.position.set(0, y, 0);
			textGroup.add(textMesh);

			// determine greatest width
			// first get a bounding box
			let box = new THREE.Box3().setFromObject(textMesh);
			let width = box.getSize().x;

			if ( greatestWidth < width ) {
				greatestWidth = width;
			}
		}

		// correct x position is leftToRight is false, once greatestWidth is known
		if ( false === leftToRight ) {
			// adjust x position to the greatest width, minus the width
			for ( var j = 0; j < textGroup.children.length; j ++ ) {
				let textMesh = textGroup.children[ j ];
				let box = new THREE.Box3().setFromObject(textMesh);
				let width = box.getSize().x;
				textMesh.position.setX(greatestWidth - width);
			}
		}
	});

	return textGroup;
};

import VrmlParser from "../../ThreeJs.js";
import {FileLoader} from "../../../node_modules/three/src/loaders/FileLoader.js";
/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since January 4, 2019
 *
 * Conversion of a VRML 97 Inline node so that it will load and parse the referenced wrl file.
 */

VrmlParser.Renderer.ThreeJs.VrmlNode[ 'Inline' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
}

VrmlParser.Renderer.ThreeJs.VrmlNode.Inline.prototype.parse = function (scene, converter) {
	let node = this.node;

	if ( ! node.has('url') ) {
		return;
	}

	// support multiple urls
	let urls = typeof node.url === 'object' ? node.url : [ node.url ];

	let loader = new FileLoader();

	// define callback to convert loaded vrml data
	let onload = function (vrml) {
		let tree = vrmlParser.parse(vrml);
		converter.render(tree, scene);
	};

	// load each inline world
	for ( let i = 0; i < urls.length; i ++ ) {
		let url = urls[ i ];
		loader.load(url, onload);
	}

};

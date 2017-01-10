# VRML Parser
I started this project by building on top of my earlier improvements of the sequential parsing that Ricardo Cabello alias Mr.Doob (The author of ThreeJs) had started. Half way this project I have taken a different approach, by moving to the PEG.js parser, which is based on Expression Grammar. An Expression Grammar offers a modern approach to writing parsers. All you do is define a grammar (The VRML 97 specification rules, basically) and the parser can be generated for you, based on the grammar. You may then use the parser to parse a VRML file and the resulting parsed node tree to create a ThreeJs file or in-memory ThreeJs world, to be rendered in a browser.

The actual PEG.js grammar is in `vrml.pegjs`.

## Installation
If you have cloned or downloaded the project from Github, run `npm install` in the root directory of the project. This means you will have to install NodeJs before you can run this command.

Alternatively, you can install it as an npm package directly, without downloading or cloning from Github: `npm install vrmlparser`. Depending on your setup, you may need to use `sudo`.

## Usage
The parser is implemented in JavaScript and can be run by node from the command line. An example is added: `vrml-parser.js`. Just run
`node vrml-parser.js` on the command line to see the experimental output.

To parse a different file, edit `vrml-parser.js` and change the path to the `wrl/test.wrl` file that is being loaded, 
or paste the contents of your VRML file into `wrl/test.wrl`.

Originally, `wrl/test.wrl` contains the same content as the `house.wrl` from the ThreeJs examples, except for
an occasional typo I had to fix to make the parser succeed.

### How to use the parser in the browser

*For your convenience, a pre-parsed `vrml.js` has been added to the project. It is ready for you to use in a browser. It exposes the vrmlParser global variable as the parser.*

*Also, you may serve the example.html file locally, for example using the built-in webserver that comes with php, to see a working example of the VrmlParser and the ThreeJsRenderer.*

To use the parser in the Browser, you cannot make use of the nodeJs approach, you will have to generate a browser friendly version of the parser. It can be generated using the following command:

```
pegjs -e vrmlParser vrml.pegjs
```
*See also http://pegjs.org/documentation#generating-a-parser-command-line*

This generates the parser as a JavaScript file, that can be loaded in the html page using a &lt;script&gt; tag like any other JavaScript file.

Note that the options come before the input file name. Running this command will generate the parser in `vrml.js`, which you can then load in the browser. The parser will be available to you as vrmlParser:

```
var xhrLoader = new THREE.XHRLoader();
// onLoad, onProgress, onError
xhrLoader.load("wrl/house.wrl", function (data){
    var tree = vrmlParser.parse(data);
    consele.log(tree);
}, function (){},function(){});

```
Instead of using the THREE.XHRLoader you could use XMLHttpRequest. For the browser, you do not need a console renderer to get visual textual output, you may just call `console.log(tree);` and you will be able to expand all nodes in the browser console, to verify that your VRML file has been parsed as expected.

### Inline nodes
The parser currently makes no attempt to load Inline nodes. It only parses them as an Inline node with
a single property: the url. Depending on the type of renderer you use, you might want to feed the VRML file
found at the url to the parser in turn, to get its contents as a node tree. If you are not writing a renderer,
but would still like to see the contents of your whole VRML world, including Inline nodes, you may
use `php make_single_file.php input.wrl [output-dir]`. For this command you need php. It will output 
the file `single_input.wrl` in the same directory as `input.wrl` or in the `output-dir` if you specified
one. Once you've got `single_input.wrl` you may use that as input in the `vrml-parser.js` and run that through
`node vrml-parser.js` to see the full tree on the console.


### Parser errors and reporting issues
If the parser fails with information about a location in your VRML file, it will report the position
in the terminal output. This might help you in correcting any errors in your VRML file, if you feel the
error message is correct. Otherwise, please report an issue on github: https://github.com/bartmcleod/VrmlParser

## Dependencies
1. NodeJs
2. npm
3. pegjs-require
4. fs
5. php, if you want to merge multiple VRML files into one or if you want to use the built-in webserver to serve your files.

Once you have installed NodeJs, you can just run `npm install` to install the other dependencies. php Is entirely optional and won't be installed by the command. If you want to run a local webserver, there are many options, not only php.

## Milestones
1. Working, experimental grammar, based on experience, memory and sample files. It should be able to parse house.wrl, from the ThreeJs examples.
2. Refactoring the example VRML loader for ThreeJS to use the experimental grammar based PEG.js parser instead of line by line parsing.
3. Adding support for all VRML 97 nodes, including animation to the VrmlParser renderer for ThreeJs (VrmlParser.Renderer.ThreeJs).
4. Refining the parser to support the VRML 97 specification more closely, based on the specification and strict test files.
5. Automated testing

### Previous Milestone
*Refactoring the example VRML loader for ThreeJS to use the experimental grammar based PEG.js parser instead of line by line parsing.*

This Milestone is in Proof Of Concept phase now. There is a PR for Mr.Doob to review and give his recommendations regarding integration of the VrmlParser library in ThreeJs. If you clone my fork of ThreeJs you can already use the new version of the VRML loader example page at `examples/webgl_loader_vrml.html`.

### Next Milestone
*Adding support for all VRML 97 nodes, including animation to the VrmlParser renderer for ThreeJs (VrmlParser.Renderer.ThreeJs).*

Since converting animations is something requested by some, I will focus on converting animations first and add support for more nodes along the way.

To help with converting animations I would like to have some diagnostic information on the objects in 3D. Some sort of editor mode or inspection panel, where I can see which part of the object was clicked.

##Challenge
One of the first challenges encountered, is caused by how I defined animations in the original VRML file dating from 1997. If for example the green arrow on the top left of the first floor of the house was clicked, the first floor and attic would be moved sideways to the right (positive x), revealing the interior of the ground floor. When the corresponding red arrow on the right was clicked, the reverse would happen.

When I wrote the parser, I made the assumption that animated nodes were named and that it would suffice to write the name onto the Object3D instance in the ThreeJs renderer. With a name, the Object3D could then be retrieved and animated, because I also stored all the routes (ROUTE definitions are used to define VRML animations). In reality however, it is not the green arrow from the example that is named, in order to be clickable. In my original VRML file, the green arrow is just a child of a Transform node, which is also not named, but has a named TouchSensor as one of its children. So the TouchSensor actually holds the unique name we need for our animation. The TouchSensor is a sibling of the green arrow Object3D. Now to start animating,
we need to find the correct routing sequence for the TouchSensor and animate its parent. Note that the TouchSensor is not actually rendered in the Scene, it has no geometry or color. However, it has the oringinalVrmlNode property stored in userData, and it has the name of the original TouchSensor node.



Regarding support for more nodes, there are several refactorings that could be done:
 * Parsing can be made more strict, by making the identifier that is currently used in the PEG.js grammar use a list of valid choices for node types instead of just some characters. This will prevent invalid node types from making
their way into the parsed node tree. In fact, the parsing will likely fail, which could be a disadvantage, but will definitely be more accurate.
 * Instead of using a switch in the VrmlParser.Renderer.ThreeJs to treat different nodes differently, each node could
be handled by its own class. This would lead to clearer code that is easier to maintain and extend. There could be some kind of registration process by type, so that the entire switch can go away and we can simply check if a renderer class has been registered for a given type. This would also make it extendable, as we could allow to unregister renderer classes, register mulitple classes or different ones.
 * The term rendering should be reconsidered, because rendering in the 3d community means something different then just converting the VRML nodes to ThreeJs objects. I will probably be renaming render to convert where applicable.






## Nice to have
Now that I have defined a Grammar that does a basic job of parsing VRML in JavaScript, it would be nice to have
something similar that would add PEG.js grammar support and VRML support to my favorite IDE: PHPStorm, or
more generally speaking, IntelliJ IDEA.

## How you can help
If you are interested in the projects, please test as many of your VRML files as possible and post any issues you find with your files, along with the file that yields errors and a description of 
the issue.

### Coding style
Although my first commits did not adhere to any specific coding style, I decided to follow best practices
already validated by the node community. We should adhere to the coding style as described here: http://nodeguide.com/style.html

## License
"You are free to use the Grammar any way you like, with the only restriction that you should mention 
the original author: Bart McLeod. If you do not remove any @copyright and @author annotations you will
be fine."

The quote above is the license with which I initially started. To make it more formal, I have adopted the MIT license.

# VRML Parser
I started this project by building on top of my earlier improvements of the sequential parsing that Mr. Doob (The author of ThreeJs) had started.
Half way this project I have taken a different approach, by moving to the PEG.js parser, which is based on Expression Grammar.
This is a modern approach to writing parsers. All you do is define a grammar (The VRML 97 specification rules, basically) and
the parser will be generated for you, based on the grammar. You may then use the parsed node tree to create a ThreeJs file
or in-memory ThreeJs world.

The actual PEG.js grammar is in `vrml.pegjs`.

## Installation
You need to install node, npm and pegjs-require.

## Usage
The parser is implemented in JavaScript and can be run by node from the command line. An example is added: `vrml-parser.js`. Just run
`node vrml-parser.js` on the command line to see the experimental output.

To parse a different file, edit `vrml-parser.js` and change the path to the `test.wrl` file that is being loaded, 
or paste the contents of your VRML file into `test.wrl`.

Originally, `test.wrl` contains the same content as the `house.wrl` from the ThreeJs examples, except for
an occasional typo I had to fix to make the parser succeed.

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
5. php, if you want to merge multiple VRML files into one.

## Milestones
1. Working, experimental grammar, based on experience, memory and sample files. It should be able to parse house.wrl, from the ThreeJs examples.
2. Refactoring the example VRML loader for ThreeJS to use the experimental grammar based PEG.js parser instead of line by line parsing.
3. Adding support for all parsed nodes, including animation to the VRML loader from the ThreeJS examples.
4. Refining the parser to support the VRML 97 specification more closely, based on the specification and strict test files.
5. Automated testing

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
You are free to use the Grammar any way you like, with the only restriction that you should mention 
the original author: Bart McLeod. If you do not remove any @copyright and @author annotations you will
be fine.

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
or paste the contents of your vrml file into `test.wrl`.

Originally, `test.wrl` contains the same content as the `house.wrl` from the ThreeJs examples, except for
an occasional typo I had to fix to make the parser succeed.

### Parser errors and reporting issues
If the parser fails with information about a location in your VRML file, it will report the position
in the terminal output. This might help you in correcting any errors in your VRML file, if you feel the
error message is correct. Otherwise, please report an issue on github: https://github.com/bartmcleod/VrmlParser

## Dependencies
1. NodeJs
2. npm
3. pegjs-require
4. fs

## Milestones
1. Working, experimental grammar, based on experience, memory and sample files. It should be able to parse house.wrl, from the ThreeJs examples.
2. Refactoring the example VRML loader for ThreeJS to use the experimental grammar based PEG.js parser instead of line by line parsing.
3. Adding support for all parsed nodes, including animation to the VRML loader from the ThreeJS examples.
4. Refining the parser to support the VRML 97 specification more closely, based on the specification and strict test files.
5. Automated testing

## How you can help
If you are interested in the projects, please test as many of your VRML files as possible and post any issues you find with your files, along with the file that yields errors and a description of 
the issue.

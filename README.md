#VRML Parser
I started this project by build on top of my earlier improvements of the sequential parsing that Mr. Doob (The author of ThreeJs) had started.
Half way this project I have taken a different approach, by moving to the PEG.js parser, which is based on Expression Grammar.
This is a modern approach to writing parsers. All you do is define a grammar (The VRML 97 specification rules, basically) and
the parser will be generated for you, based on the grammar. You can then used the parsed node tree to create a ThreeJs file
or in-memory ThreeJs world.

##Milestones
1. Working, experimental grammar, based on experience, memory and sample files. It should be able to parse house.wrl, from the ThreeJs examples.
2. Refactoring the example VRML loader for ThreeJS to use the experimental grammar based PEG.js parser instead of line by line parsing.
3. Adding support for all parsed nodes, including animation to the VRML loader from the ThreeJS examples.
4. Refining the parser to support the VRML 97 specification more closely, based on the specification and strict test files.
5. Automated testing

## How you can help
If you are interested in the projects, please post any issues you find with your files, along with the file that yields errors and a description of 
the issue.

#!/usr/bin/env bash
# While Tween is available in three.js libs, it is not compatible with the version I used for VrmlParser, so I will include it in the compressed js
java -jar ~/closure-compiler/closure-compiler-v20161024.jar --js vrml.js ./node_modules/tween.js/src/Tween.js Renderer/ThreeJs.js Renderer/ThreeJs/*.js Renderer/ThreeJs/**/*.js --js_output_file vrml.concat.js --manage_closure_dependencies --compilation_level WHITESPACE_ONLY --externs ./externs.js

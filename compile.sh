#!/usr/bin/env bash
java -jar ~/closure-compiler/closure-compiler-v20161024.jar --js vrml.js ./node_modules/tween.js/src/Tween.js Renderer/ThreeJs.js Renderer/ThreeJs/*.js Renderer/ThreeJs/**/*.js --js_output_file vrml.min.js --compilation_level SIMPLE_OPTIMIZATIONS --externs ./externs.js

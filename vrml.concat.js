vrmlParser = function () {
	function peg$subclass(child, parent) {
		function ctor() {
			this.constructor = child
		}

		ctor.prototype  = parent.prototype;
		child.prototype = new ctor
	}

	function peg$SyntaxError(message, expected, found, location) {
		this.message  = message;
		this.expected = expected;
		this.found    = found;
		this.location = location;
		this.name     = "SyntaxError";
		if ( typeof Error.captureStackTrace === "function" ) Error.captureStackTrace(this, peg$SyntaxError)
	}

	peg$subclass(peg$SyntaxError, Error);
	function peg$parse(input) {
		var options                                                                                                                                                                              = arguments.length >
				1 ? arguments[ 1 ] : {}, parser = this, peg$FAILED = {}, peg$startRuleFunctions = { vrml: peg$parsevrml }, peg$startRuleFunction = peg$parsevrml, peg$c0 = "#VRML V2.0 utf8", peg$c1 = {
					type: "literal",
					value: "#VRML V2.0 utf8",
					description: '"#VRML V2.0 utf8"'
				}, peg$c2 = function (vrml) {
					vrml.nodeDefinitions = nodeDefinitions;
					vrml.routes = routes;
					return vrml
				}, peg$c3 = function (name) {
					return name
				}, peg$c4 = "OrientationInterpolator", peg$c5 = {
					type: "literal",
					value: "OrientationInterpolator",
					description: '"OrientationInterpolator"'
				}, peg$c6 = function (name,
																																														 properties) {
					var n = { name: name, node: "OrientationInterpolator", isDefinition: true };
					for ( var i = 0; i < properties.length; i ++ )n[ properties[ i ][ "name" ] ] = properties[ i ][ "value" ];
					nodeDefinitions[ name ] = n;
					return n
				}, peg$c7                                                                                                                                                                            = "keyValue", peg$c8                                                                                                                                                       = {
					type: "literal",
					value: "keyValue",
					description: '"keyValue"'
				}, peg$c9                                                                                                                                                                            = function (q) {
					return q
				}, peg$c10                                                                                                                                                                           = function (q, last_q) {
					q.push(last_q);
					return q
				}, peg$c11                                                                                                                                                                           = function (quaternionArray) {
					return { name: "keyValue", value: quaternionArray }
				}, peg$c12                                                                                                                                                                           = function (name, n) {
					n.name = name;
					n.isDefinition = true;
					nodeDefinitions[ name ] =
						n;
					return n
				}, peg$c13                                                                                                                                                                           = function (t, pp) {
					var n = { node: t };
					for ( var i = 0; i < pp.length; i ++ ) {
						var p = pp[ i ];
						if ( undefined !== p.node )if ( "Switch" === n.node ) {
							if ( undefined === n.choice ) n.choice = [];
							n.choice.push(p)
						} else {
							if ( undefined === n.children ) n.children = [];
							n.children.push(p)
						} else if ( undefined !== p.name ) {
							n[ p.name ] = p.value;
							if ( undefined !== p.comment ) {
								if ( undefined === n.comments ) n.comments = {};
								if ( undefined === n.comments[ p.name ] ) n.comments[ p.name ] = [];
								n.comments[ p.name ].push(p.comment)
							}
						} else if ( undefined !== p.src ) routes.push(p); else {
							if ( undefined ===
								n.nodeComments ) n.nodeComments = [];
							n.nodeComments.push(p)
						}
					}
					return n
				}, peg$c14                                                                                                                                                                           = "orientation", peg$c15 = {
					type: "literal",
					value: "orientation",
					description: '"orientation"'
				}, peg$c16                                                                                                                                                                           = "rotation", peg$c17 = {
					type: "literal",
					value: "rotation",
					description: '"rotation"'
				}, peg$c18                                                                                                                                                                           = "scaleOrientation", peg$c19                                                                                                                                             = {
					type: "literal",
					value: "scaleOrientation",
					description: '"scaleOrientation"'
				}, peg$c20                                                                                                                                                                           = function (name, q) {
					return { name: name, value: q }
				}, peg$c21                                                                                                                                                                           = " ", peg$c22                                                                                                                                                            = {
					type: "literal",
					value: " ",
					description: '" "'
				}, peg$c23                                                                                                                                                                           = function (x, y, z, radians) {
					return {
						x: x,
						y: y, z: z, radians: radians
					}
				}, peg$c24                                                                                                                                                                           = "coordIndex", peg$c25                                                                                                                                                   = {
					type: "literal",
					value: "coordIndex",
					description: '"coordIndex"'
				}, peg$c26                                                                                                                                                                           = function (face) {
					return { name: "coordIndex", value: face }
				}, peg$c27                                                                                                                                                                           = "point", peg$c28                                                                                                                                                        = {
					type: "literal",
					value: "point",
					description: '"point"'
				}, peg$c29                                                                                                                                                                           = "vector", peg$c30                                                                                                                                                       = {
					type: "literal",
					value: "vector",
					description: '"vector"'
				}, peg$c31                                                                                                                                                                           = function (name, pointArray) {
					return { name: name, value: pointArray }
				}, peg$c32                                                                                                                                                                           = function (name, value, comment) {
					var p = { name: name, value: value };
					if ( null !== comment ) p.comment =
						comment;
					return p
				}, peg$c33                                                                                                                                                                           = {
					type: "other",
					description: "identifier"
				}, peg$c34                                                                                                                                                                           = /^[A-Za-z0-9_]/, peg$c35 = {
					type: "class",
					value: "[A-Za-z0-9_]",
					description: "[A-Za-z0-9_]"
				}, peg$c36                                                                                                                                                                           = function (o) {
					return o.join("")
				}, peg$c37                                                                                                                                                                           = {
					type: "other",
					description: "array"
				}, peg$c38                                                                                                                                                                           = function (v) {
					return v
				}, peg$c39                                                                                                                                                                           = function (it) {
					var a = [];
					for ( var i = 0; i < it.length; i ++ ) {
						var value = it[ i ];
						if ( undefined !== value.src ) routes.push(value); else if ( undefined !== value.comment ) {
							if ( undefined === a.comments ) a.comments = [];
							a.comments.push(value)
						} else a.push(value)
					}
					return a
				},
				peg$c40                                                                                                                                                                              = {
					type: "other",
					description: "value"
				}, peg$c41                                                                                                                                                                           = "false", peg$c42                                                                                                                                                        = {
					type: "literal",
					value: "false",
					description: '"false"'
				}, peg$c43                                                                                                                                                                           = "FALSE", peg$c44                                                                                                                                                        = {
					type: "literal",
					value: "FALSE",
					description: '"FALSE"'
				}, peg$c45                                                                                                                                                                           = function () {
					return false
				}, peg$c46                                                                                                                                                                           = "null", peg$c47 = {
					type: "literal",
					value: "null",
					description: '"null"'
				}, peg$c48                                                                                                                                                                           = "NULL", peg$c49                                                                                                                                                         = {
					type: "literal",
					value: "NULL",
					description: '"NULL"'
				}, peg$c50                                                                                                                                                                           = function () {
					return null
				}, peg$c51                                                                                                                                                                           = "true", peg$c52 = {
					type: "literal",
					value: "true",
					description: '"true"'
				}, peg$c53                                                                                                                                                                           = "TRUE", peg$c54 =
					{ type: "literal", value: "TRUE", description: '"TRUE"' }, peg$c55                                                                                                                 = function () {
					return true
				}, peg$c56                                                                                                                                                                           = {
					type: "other",
					description: "number"
				}, peg$c57                                                                                                                                                                           = function () {
					return parseFloat(text())
				}, peg$c58                                                                                                                                                                           = ".", peg$c59 = {
					type: "literal",
					value: ".",
					description: '"."'
				}, peg$c60                                                                                                                                                                           = /^[1-9]/, peg$c61                                                                                                                                                       = {
					type: "class",
					value: "[1-9]",
					description: "[1-9]"
				}, peg$c62                                                                                                                                                                           = /^[eE]/, peg$c63                                                                                                                                                        = {
					type: "class",
					value: "[eE]",
					description: "[eE]"
				}, peg$c64                                                                                                                                                                           = function (s, c) {
					return s + c
				}, peg$c65                                                                                                                                                                           = function (i) {
					return i.join("")
				}, peg$c66                                                                                                                                                                           = "-", peg$c67 = {
					type: "literal", value: "-",
					description: '"-"'
				}, peg$c68                                                                                                                                                                           = "+", peg$c69 = {
					type: "literal",
					value: "+",
					description: '"+"'
				}, peg$c70                                                                                                                                                                           = "0", peg$c71                                                                                                                                                            = {
					type: "literal",
					value: "0",
					description: '"0"'
				}, peg$c72                                                                                                                                                                           = "#", peg$c73 = {
					type: "literal",
					value: "#",
					description: '"#"'
				}, peg$c74                                                                                                                                                                           = /^[^\n]/, peg$c75                                                                                                                                                       = {
					type: "class",
					value: "[^\\n]",
					description: "[^\\n]"
				}, peg$c76                                                                                                                                                                           = function (text) {
					return { comment: text.join("").trim() }
				}, peg$c77                                                                                                                                                                           = "ROUTE", peg$c78                                                                                                                                                        = {
					type: "literal",
					value: "ROUTE",
					description: '"ROUTE"'
				}, peg$c79                                                                                                                                                                           = "TO", peg$c80                                                                                                                                                           = {
					type: "literal",
					value: "TO",
					description: '"TO"'
				}, peg$c81                                                                                                                                                                           =
					function (src, target) {
						var index = src.name;
						var route = { source: src, target: target };
						if ( "undefined" === typeof routes[ index ] ) routes[ index ] = [];
						routes[ index ].push(route);
						return route
					}, peg$c82                                                                                                                                                                         = function (name, property) {
					return { name: name, property: property }
				}, peg$c83                                                                                                                                                                           = "[", peg$c84 = {
					type: "literal",
					value: "[",
					description: '"["'
				}, peg$c85                                                                                                                                                                           = "]", peg$c86 = {
					type: "literal",
					value: "]",
					description: '"]"'
				}, peg$c87                                                                                                                                                                           = "{", peg$c88                                                                                                                                                            = {
					type: "literal",
					value: "{",
					description: '"{"'
				}, peg$c89                                                                                                                                                                           = "}", peg$c90 = {
					type: "literal",
					value: "}",
					description: '"}"'
				},
				peg$c91                                                                                                                                                                              = ",", peg$c92                                                                                                                                                               = {
					type: "literal",
					value: ",",
					description: '","'
				}, peg$c93                                                                                                                                                                           = {
					type: "other",
					description: "whitespace"
				}, peg$c94                                                                                                                                                                           = /^[ \t\n\r]/, peg$c95 = {
					type: "class",
					value: "[ \\t\\n\\r]",
					description: "[ \\t\\n\\r]"
				}, peg$c96                                                                                                                                                                           = function (ws) {
					return ws.join("")
				}, peg$c97                                                                                                                                                                           = function (p) {
					return p
				}, peg$c98                                                                                                                                                                           = function (x, y, z) {
					return { x: x, y: y, z: z }
				}, peg$c99                                                                                                                                                                           = function (x, y) {
					return { x: x, y: y }
				}, peg$c100                                                                                                                                                                          = "DEF", peg$c101 = {
					type: "literal",
					value: "DEF",
					description: '"DEF"'
				}, peg$c102                                                                                                                                                                          = function () {
					return true
				}, peg$c103                                                                                                                                                                          = function (name) {
					var obj = nodeDefinitions[ name ];
					if ( undefined === obj ) {
						console.log(name + " not found in nodeDefinitions");
						return obj
					}
					if ( "function" === typeof obj.clone )return obj.clone();
					return obj
				}, peg$c104                                                                                                                                                                          = "USE", peg$c105 = {
					type: "literal",
					value: "USE",
					description: '"USE"'
				}, peg$c106                                                                                                                                                                          = "-1", peg$c107                                                                                                                                                         = {
					type: "literal",
					value: "-1",
					description: '"-1"'
				}, peg$c108                                                                                                                                                                          = function (points) {
					return points
				}, peg$c109                                                                                                                                                                          = function (i) {
					return i
				}, peg$c110                                                                                                                                                                          = function (uri) {
					return uri
				}, peg$c111                                                                                                                                                                          = /^[^"]/, peg$c112                                                                                                                                                      = {
					type: "class",
					value: '[^"]',
					description: '[^"]'
				}, peg$c113                                                                                                                                                                          = "jpg", peg$c114                                                                                                                                                        = {
					type: "literal",
					value: "jpg", description: '"jpg"'
				}, peg$c115                                                                                                                                                                          = "jpeg", peg$c116                                                                                                                                                       = {
					type: "literal",
					value: "jpeg",
					description: '"jpeg"'
				}, peg$c117                                                                                                                                                                          = "gif", peg$c118                                                                                                                                                        = {
					type: "literal",
					value: "gif",
					description: '"gif"'
				}, peg$c119                                                                                                                                                                          = "wrl", peg$c120 = {
					type: "literal",
					value: "wrl",
					description: '"wrl"'
				}, peg$c121                                                                                                                                                                          = function (i, dot, ext) {
					return i + dot + ext
				}, peg$c122                                                                                                                                                                          = function (s) {
					return s.join("")
				}, peg$c123                                                                                                                                                                          = '"', peg$c124 = {
					type: "literal",
					value: '"',
					description: '"\\""'
				}, peg$c125                                                                                                                                                                          = /^[0-9]/, peg$c126 = {
					type: "class",
					value: "[0-9]",
					description: "[0-9]"
				}, peg$c127                                                                                                                                                                          = /^[0-9a-f]/i,
				peg$c128                                                                                                                                                                             = {
					type: "class",
					value: "[0-9a-f]i",
					description: "[0-9a-f]i"
				}, peg$currPos                                                                                                                                                                       = 0, peg$savedPos                                                                                                                                                     = 0, peg$posDetailsCache = [ {
					line: 1,
					column: 1,
					seenCR: false
				} ], peg$maxFailPos                                                                                                                                                                  = 0, peg$maxFailExpected                                                                                                                                         = [], peg$silentFails                                                                                                                   = 0, peg$result;
		if ( "startRule" in options ) {
			if ( ! (options.startRule in peg$startRuleFunctions) )throw new Error("Can't start parsing from rule \"" + options.startRule + '".');
			peg$startRuleFunction = peg$startRuleFunctions[ options.startRule ]
		}
		function text() {
			return input.substring(peg$savedPos, peg$currPos)
		}

		function location() {
			return peg$computeLocation(peg$savedPos,
				peg$currPos)
		}

		function expected(description) {
			throw peg$buildException(null, [ {
				type: "other",
				description: description
			} ], input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
		}

		function error(message) {
			throw peg$buildException(message, null, input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
		}

		function peg$computePosDetails(pos) {
			var details = peg$posDetailsCache[ pos ], p, ch;
			if ( details )return details; else {
				p = pos - 1;
				while ( ! peg$posDetailsCache[ p ] )p --;
				details = peg$posDetailsCache[ p ];
				details = { line: details.line, column: details.column, seenCR: details.seenCR };
				while ( p < pos ) {
					ch = input.charAt(p);
					if ( ch === "\n" ) {
						if ( ! details.seenCR ) details.line ++;
						details.column = 1;
						details.seenCR = false
					} else if ( ch === "\r" || ch === "\u2028" || ch === "\u2029" ) {
						details.line ++;
						details.column = 1;
						details.seenCR = true
					} else {
						details.column ++;
						details.seenCR = false
					}
					p ++
				}
				peg$posDetailsCache[ pos ] = details;
				return details
			}
		}

		function peg$computeLocation(startPos, endPos) {
			var startPosDetails = peg$computePosDetails(startPos),
					endPosDetails   = peg$computePosDetails(endPos);
			return {
				start: { offset: startPos, line: startPosDetails.line, column: startPosDetails.column },
				end: { offset: endPos, line: endPosDetails.line, column: endPosDetails.column }
			}
		}

		function peg$fail(expected) {
			if ( peg$currPos < peg$maxFailPos )return;
			if ( peg$currPos > peg$maxFailPos ) {
				peg$maxFailPos      = peg$currPos;
				peg$maxFailExpected = []
			}
			peg$maxFailExpected.push(expected)
		}

		function peg$buildException(message, expected, found, location) {
			function cleanupExpected(expected) {
				var i = 1;
				expected.sort(function (a,
																b) {
					if ( a.description < b.description )return - 1; else if ( a.description > b.description )return 1; else return 0
				});
				while ( i < expected.length )if ( expected[ i - 1 ] === expected[ i ] ) expected.splice(i, 1); else i ++
			}

			function buildMessage(expected, found) {
				function stringEscape(s) {
					function hex(ch) {
						return ch.charCodeAt(0).toString(16).toUpperCase()
					}

					return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g,
						function (ch) {
							return "\\x0" + hex(ch)
						}).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
						return "\\x" + hex(ch)
					}).replace(/[\u0100-\u0FFF]/g, function (ch) {
						return "\\u0" + hex(ch)
					}).replace(/[\u1000-\uFFFF]/g, function (ch) {
						return "\\u" + hex(ch)
					})
				}

				var expectedDescs = new Array(expected.length), expectedDesc, foundDesc, i;
				for ( i = 0; i < expected.length; i ++ )expectedDescs[ i ] = expected[ i ].description;
				expectedDesc = expected.length > 1 ? expectedDescs.slice(0, - 1).join(", ") + " or " + expectedDescs[ expected.length - 1 ] : expectedDescs[ 0 ];
				foundDesc    =
					found ? '"' + stringEscape(found) + '"' : "end of input";
				return "Expected " + expectedDesc + " but " + foundDesc + " found."
			}

			if ( expected !== null ) cleanupExpected(expected);
			return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location)
		}

		function peg$parsevrml() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			if ( input.substr(peg$currPos, 15) === peg$c0 ) {
				s1 = peg$c0;
				peg$currPos += 15
			} else {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c1)
			}
			if ( s1 !== peg$FAILED ) {
				s2 = [];
				s3 = peg$parseOrientationInterpolator();
				if ( s3 === peg$FAILED ) {
					s3 = peg$parsenodeDefinition();
					if ( s3 === peg$FAILED ) {
						s3 = peg$parsenode();
						if ( s3 === peg$FAILED ) {
							s3 = peg$parsecomment();
							if ( s3 === peg$FAILED ) s3 = peg$parseroute()
						}
					}
				}
				while ( s3 !== peg$FAILED ) {
					s2.push(s3);
					s3 = peg$parseOrientationInterpolator();
					if ( s3 === peg$FAILED ) {
						s3 = peg$parsenodeDefinition();
						if ( s3 === peg$FAILED ) {
							s3 = peg$parsenode();
							if ( s3 === peg$FAILED ) {
								s3 = peg$parsecomment();
								if ( s3 === peg$FAILED ) s3 = peg$parseroute()
							}
						}
					}
				}
				if ( s2 !== peg$FAILED ) {
					peg$savedPos = s0;
					s1           = peg$c2(s2);
					s0           = s1
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos =
					s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseOrientationInterpolator() {
			var s0, s1, s2, s3, s4, s5;
			s0 = peg$currPos;
			s1 = peg$currPos;
			s2 = peg$parsedef();
			if ( s2 !== peg$FAILED ) {
				s3 = peg$parseidentifier();
				if ( s3 !== peg$FAILED ) {
					peg$savedPos = s1;
					s2           = peg$c3(s3);
					s1           = s2
				} else {
					peg$currPos = s1;
					s1          = peg$FAILED
				}
			} else {
				peg$currPos = s1;
				s1          = peg$FAILED
			}
			if ( s1 !== peg$FAILED ) {
				if ( input.substr(peg$currPos, 23) === peg$c4 ) {
					s2 = peg$c4;
					peg$currPos += 23
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c5)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsebegin_node();
					if ( s3 !== peg$FAILED ) {
						s4 = [];
						s5 = peg$parsekeyValueForOrientationInterpolator();
						if ( s5 === peg$FAILED ) s5 = peg$parseproperty();
						if ( s5 !== peg$FAILED )while ( s5 !== peg$FAILED ) {
							s4.push(s5);
							s5 = peg$parsekeyValueForOrientationInterpolator();
							if ( s5 === peg$FAILED ) s5 = peg$parseproperty()
						} else s4 = peg$FAILED;
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parseend_node();
							if ( s5 !== peg$FAILED ) {
								peg$savedPos = s0;
								s1           = peg$c6(s1, s4);
								s0           = s1
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos =
						s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsekeyValueForOrientationInterpolator() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.substr(peg$currPos, 8) === peg$c7 ) {
					s2 = peg$c7;
					peg$currPos += 8
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c8)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsebegin_array();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$currPos;
						s5 = [];
						s6 = peg$currPos;
						s7 = peg$parsequaternion();
						if ( s7 !== peg$FAILED ) {
							s8 =
								peg$parsevalue_separator();
							if ( s8 !== peg$FAILED ) {
								peg$savedPos = s6;
								s7           = peg$c9(s7);
								s6           = s7
							} else {
								peg$currPos = s6;
								s6          = peg$FAILED
							}
						} else {
							peg$currPos = s6;
							s6          = peg$FAILED
						}
						while ( s6 !== peg$FAILED ) {
							s5.push(s6);
							s6 = peg$currPos;
							s7 = peg$parsequaternion();
							if ( s7 !== peg$FAILED ) {
								s8 = peg$parsevalue_separator();
								if ( s8 !== peg$FAILED ) {
									peg$savedPos = s6;
									s7           = peg$c9(s7);
									s6           = s7
								} else {
									peg$currPos = s6;
									s6          = peg$FAILED
								}
							} else {
								peg$currPos = s6;
								s6          = peg$FAILED
							}
						}
						if ( s5 !== peg$FAILED ) {
							s6 = peg$parsequaternion();
							if ( s6 !== peg$FAILED ) {
								peg$savedPos = s4;
								s5           = peg$c10(s5, s6);
								s4           = s5
							} else {
								peg$currPos = s4;
								s4          = peg$FAILED
							}
						} else {
							peg$currPos = s4;
							s4          = peg$FAILED
						}
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parseend_array();
							if ( s5 !== peg$FAILED ) {
								peg$savedPos = s0;
								s1           = peg$c11(s4);
								s0           = s1
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsenodeDefinition() {
			var s0, s1, s2, s3, s4, s5, s6;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$currPos;
				s3 = peg$parsedef();
				if ( s3 !== peg$FAILED ) {
					s4 = peg$parsews();
					if ( s4 !== peg$FAILED ) {
						s5 = peg$parseidentifier();
						if ( s5 !== peg$FAILED ) {
							s6 = peg$parsews();
							if ( s6 !== peg$FAILED ) {
								peg$savedPos = s2;
								s3           = peg$c3(s5);
								s2           = s3
							} else {
								peg$currPos = s2;
								s2          = peg$FAILED
							}
						} else {
							peg$currPos = s2;
							s2          = peg$FAILED
						}
					} else {
						peg$currPos = s2;
						s2          = peg$FAILED
					}
				} else {
					peg$currPos = s2;
					s2          = peg$FAILED
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsenode();
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c12(s2, s3);
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsenode() {
			var s0, s1, s2, s3, s4, s5;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parseidentifier();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsebegin_node();
					if ( s3 !== peg$FAILED ) {
						s4 = [];
						s5 = peg$parsenodeDefinition();
						if ( s5 === peg$FAILED ) {
							s5 = peg$parseroute();
							if ( s5 === peg$FAILED ) {
								s5 = peg$parseproperty();
								if ( s5 === peg$FAILED ) {
									s5 = peg$parsenode();
									if ( s5 === peg$FAILED ) s5 = peg$parsecomment()
								}
							}
						}
						while ( s5 !== peg$FAILED ) {
							s4.push(s5);
							s5 = peg$parsenodeDefinition();
							if ( s5 === peg$FAILED ) {
								s5 = peg$parseroute();
								if ( s5 === peg$FAILED ) {
									s5 = peg$parseproperty();
									if ( s5 === peg$FAILED ) {
										s5 = peg$parsenode();
										if ( s5 === peg$FAILED ) s5 = peg$parsecomment()
									}
								}
							}
						}
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parseend_node();
							if ( s5 !== peg$FAILED ) {
								peg$savedPos = s0;
								s1           = peg$c13(s2, s4);
								s0           = s1
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseproperty() {
			var s0;
			s0 = peg$parseorientation();
			if ( s0 === peg$FAILED ) {
				s0 = peg$parsecoordIndex();
				if ( s0 === peg$FAILED ) {
					s0 = peg$parsepointArray();
					if ( s0 === peg$FAILED ) s0 = peg$parsegeneric_property()
				}
			}
			return s0
		}

		function peg$parseorientation() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.substr(peg$currPos, 11) === peg$c14 ) {
					s2 = peg$c14;
					peg$currPos += 11
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c15)
				}
				if ( s2 === peg$FAILED ) {
					if ( input.substr(peg$currPos, 8) === peg$c16 ) {
						s2 = peg$c16;
						peg$currPos += 8
					} else {
						s2 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c17)
					}
					if ( s2 ===
						peg$FAILED )if ( input.substr(peg$currPos, 16) === peg$c18 ) {
						s2 = peg$c18;
						peg$currPos += 16
					} else {
						s2 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c19)
					}
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsequaternion();
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c20(s2, s3);
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsequaternion() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				s2 =
					peg$parsenumber();
				if ( s2 !== peg$FAILED ) {
					s3 = [];
					if ( input.charCodeAt(peg$currPos) === 32 ) {
						s4 = peg$c21;
						peg$currPos ++
					} else {
						s4 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c22)
					}
					if ( s4 !== peg$FAILED )while ( s4 !== peg$FAILED ) {
						s3.push(s4);
						if ( input.charCodeAt(peg$currPos) === 32 ) {
							s4 = peg$c21;
							peg$currPos ++
						} else {
							s4 = peg$FAILED;
							if ( peg$silentFails === 0 ) peg$fail(peg$c22)
						}
					} else s3 = peg$FAILED;
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsenumber();
						if ( s4 !== peg$FAILED ) {
							s5 = [];
							if ( input.charCodeAt(peg$currPos) === 32 ) {
								s6 = peg$c21;
								peg$currPos ++
							} else {
								s6 =
									peg$FAILED;
								if ( peg$silentFails === 0 ) peg$fail(peg$c22)
							}
							if ( s6 !== peg$FAILED )while ( s6 !== peg$FAILED ) {
								s5.push(s6);
								if ( input.charCodeAt(peg$currPos) === 32 ) {
									s6 = peg$c21;
									peg$currPos ++
								} else {
									s6 = peg$FAILED;
									if ( peg$silentFails === 0 ) peg$fail(peg$c22)
								}
							} else s5 = peg$FAILED;
							if ( s5 !== peg$FAILED ) {
								s6 = peg$parsenumber();
								if ( s6 !== peg$FAILED ) {
									s7 = [];
									if ( input.charCodeAt(peg$currPos) === 32 ) {
										s8 = peg$c21;
										peg$currPos ++
									} else {
										s8 = peg$FAILED;
										if ( peg$silentFails === 0 ) peg$fail(peg$c22)
									}
									if ( s8 !== peg$FAILED )while ( s8 !== peg$FAILED ) {
										s7.push(s8);
										if ( input.charCodeAt(peg$currPos) ===
											32 ) {
											s8 = peg$c21;
											peg$currPos ++
										} else {
											s8 = peg$FAILED;
											if ( peg$silentFails === 0 ) peg$fail(peg$c22)
										}
									} else s7 = peg$FAILED;
									if ( s7 !== peg$FAILED ) {
										s8 = peg$parsenumber();
										if ( s8 !== peg$FAILED ) {
											s9 = peg$parsews();
											if ( s9 === peg$FAILED ) s9 = null;
											if ( s9 !== peg$FAILED ) {
												peg$savedPos = s0;
												s1           = peg$c23(s2, s4, s6, s8);
												s0           = s1
											} else {
												peg$currPos = s0;
												s0          = peg$FAILED
											}
										} else {
											peg$currPos = s0;
											s0          = peg$FAILED
										}
									} else {
										peg$currPos = s0;
										s0          = peg$FAILED
									}
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos =
							s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsecoordIndex() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
			s0 = peg$currPos;
			if ( input.substr(peg$currPos, 10) === peg$c24 ) {
				s1 = peg$c24;
				peg$currPos += 10
			} else {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c25)
			}
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parsews();
				if ( s2 === peg$FAILED ) s2 = null;
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsebegin_array();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsecomment();
						if ( s4 === peg$FAILED ) s4 = null;
						if ( s4 !== peg$FAILED ) {
							s5 =
								peg$parsews();
							if ( s5 === peg$FAILED ) s5 = null;
							if ( s5 !== peg$FAILED ) {
								s6 = [];
								s7 = peg$parseface();
								if ( s7 !== peg$FAILED )while ( s7 !== peg$FAILED ) {
									s6.push(s7);
									s7 = peg$parseface()
								} else s6 = peg$FAILED;
								if ( s6 !== peg$FAILED ) {
									s7 = peg$parsews();
									if ( s7 === peg$FAILED ) s7 = null;
									if ( s7 !== peg$FAILED ) {
										s8 = peg$parsecomment();
										if ( s8 === peg$FAILED ) s8 = null;
										if ( s8 !== peg$FAILED ) {
											s9 = peg$parseend_array();
											if ( s9 !== peg$FAILED ) {
												s10 = peg$parsews();
												if ( s10 === peg$FAILED ) s10 = null;
												if ( s10 !== peg$FAILED ) {
													peg$savedPos = s0;
													s1           = peg$c26(s6);
													s0           = s1
												} else {
													peg$currPos = s0;
													s0          =
														peg$FAILED
												}
											} else {
												peg$currPos = s0;
												s0          = peg$FAILED
											}
										} else {
											peg$currPos = s0;
											s0          = peg$FAILED
										}
									} else {
										peg$currPos = s0;
										s0          = peg$FAILED
									}
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsepointArray() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
			s0 = peg$currPos;
			if ( input.substr(peg$currPos, 5) === peg$c27 ) {
				s1 = peg$c27;
				peg$currPos += 5
			} else {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c28)
			}
			if ( s1 === peg$FAILED )if ( input.substr(peg$currPos, 6) === peg$c29 ) {
				s1 = peg$c29;
				peg$currPos += 6
			} else {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c30)
			}
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parsews();
				if ( s2 === peg$FAILED ) s2 = null;
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsebegin_array();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsecomment();
						if ( s4 === peg$FAILED ) s4 = null;
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 === peg$FAILED ) s5 = null;
							if ( s5 !== peg$FAILED ) {
								s6 = [];
								s7 = peg$parsepoint();
								if ( s7 !== peg$FAILED )while ( s7 !==
								peg$FAILED ) {
									s6.push(s7);
									s7 = peg$parsepoint()
								} else s6 = peg$FAILED;
								if ( s6 !== peg$FAILED ) {
									s7 = peg$parsecomment();
									if ( s7 === peg$FAILED ) s7 = null;
									if ( s7 !== peg$FAILED ) {
										s8 = peg$parseend_array();
										if ( s8 !== peg$FAILED ) {
											s9 = peg$parsews();
											if ( s9 === peg$FAILED ) s9 = null;
											if ( s9 !== peg$FAILED ) {
												peg$savedPos = s0;
												s1           = peg$c31(s1, s6);
												s0           = s1
											} else {
												peg$currPos = s0;
												s0          = peg$FAILED
											}
										} else {
											peg$currPos = s0;
											s0          = peg$FAILED
										}
									} else {
										peg$currPos = s0;
										s0          = peg$FAILED
									}
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos =
							s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsegeneric_property() {
			var s0, s1, s2, s3, s4, s5, s6;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parseidentifier();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsevalue();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 !== peg$FAILED ) {
								s6 = peg$parsecomment();
								if ( s6 === peg$FAILED ) s6 = null;
								if ( s6 !== peg$FAILED ) {
									peg$savedPos = s0;
									s1           = peg$c32(s2, s4, s6);
									s0           = s1
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseidentifier() {
			var s0, s1, s2, s3;
			peg$silentFails ++;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				s2 = [];
				if ( peg$c34.test(input.charAt(peg$currPos)) ) {
					s3 = input.charAt(peg$currPos);
					peg$currPos ++
				} else {
					s3 = peg$FAILED;
					if ( peg$silentFails ===
						0 ) peg$fail(peg$c35)
				}
				if ( s3 !== peg$FAILED )while ( s3 !== peg$FAILED ) {
					s2.push(s3);
					if ( peg$c34.test(input.charAt(peg$currPos)) ) {
						s3 = input.charAt(peg$currPos);
						peg$currPos ++
					} else {
						s3 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c35)
					}
				} else s2 = peg$FAILED;
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c36(s2);
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			peg$silentFails --;
			if ( s0 === peg$FAILED ) {
				s1 =
					peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c33)
			}
			return s0
		}

		function peg$parsearray() {
			var s0, s1, s2, s3, s4, s5, s6;
			peg$silentFails ++;
			s0 = peg$currPos;
			s1 = peg$parsebegin_array();
			if ( s1 !== peg$FAILED ) {
				s2 = [];
				s3 = peg$parsecomment();
				if ( s3 === peg$FAILED ) {
					s3 = peg$parseroute();
					if ( s3 === peg$FAILED ) {
						s3 = peg$currPos;
						s4 = peg$parsevalue();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 !== peg$FAILED ) {
								s6 = peg$parsevalue_separator();
								if ( s6 === peg$FAILED ) s6 = null;
								if ( s6 !== peg$FAILED ) {
									peg$savedPos = s3;
									s4           = peg$c38(s4);
									s3           = s4
								} else {
									peg$currPos =
										s3;
									s3          = peg$FAILED
								}
							} else {
								peg$currPos = s3;
								s3          = peg$FAILED
							}
						} else {
							peg$currPos = s3;
							s3          = peg$FAILED
						}
					}
				}
				while ( s3 !== peg$FAILED ) {
					s2.push(s3);
					s3 = peg$parsecomment();
					if ( s3 === peg$FAILED ) {
						s3 = peg$parseroute();
						if ( s3 === peg$FAILED ) {
							s3 = peg$currPos;
							s4 = peg$parsevalue();
							if ( s4 !== peg$FAILED ) {
								s5 = peg$parsews();
								if ( s5 !== peg$FAILED ) {
									s6 = peg$parsevalue_separator();
									if ( s6 === peg$FAILED ) s6 = null;
									if ( s6 !== peg$FAILED ) {
										peg$savedPos = s3;
										s4           = peg$c38(s4);
										s3           = s4
									} else {
										peg$currPos = s3;
										s3          = peg$FAILED
									}
								} else {
									peg$currPos = s3;
									s3          = peg$FAILED
								}
							} else {
								peg$currPos = s3;
								s3          = peg$FAILED
							}
						}
					}
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parseend_array();
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c39(s2);
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			peg$silentFails --;
			if ( s0 === peg$FAILED ) {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c37)
			}
			return s0
		}

		function peg$parsevalue() {
			var s0, s1;
			peg$silentFails ++;
			s0 = peg$parsefalse();
			if ( s0 === peg$FAILED ) {
				s0 = peg$parseOrientationInterpolator();
				if ( s0 === peg$FAILED ) {
					s0 = peg$parseface();
					if ( s0 ===
						peg$FAILED ) {
						s0 = peg$parsenull();
						if ( s0 === peg$FAILED ) {
							s0 = peg$parsetrue();
							if ( s0 === peg$FAILED ) {
								s0 = peg$parsenodeDefinition();
								if ( s0 === peg$FAILED ) {
									s0 = peg$parsenode();
									if ( s0 === peg$FAILED ) {
										s0 = peg$parsepoint();
										if ( s0 === peg$FAILED ) {
											s0 = peg$parsepointArray();
											if ( s0 === peg$FAILED ) {
												s0 = peg$parsevector();
												if ( s0 === peg$FAILED ) {
													s0 = peg$parsevector2();
													if ( s0 === peg$FAILED ) {
														s0 = peg$parseuse_statement();
														if ( s0 === peg$FAILED ) {
															s0 = peg$parsearray();
															if ( s0 === peg$FAILED ) {
																s0 = peg$parsenumber();
																if ( s0 === peg$FAILED ) {
																	s0 = peg$parseidentifier();
																	if ( s0 ===
																		peg$FAILED ) {
																		s0 = peg$parseurl();
																		if ( s0 === peg$FAILED ) s0 = peg$parsequoted_string()
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			peg$silentFails --;
			if ( s0 === peg$FAILED ) {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c40)
			}
			return s0
		}

		function peg$parsefalse() {
			var s0, s1;
			if ( input.substr(peg$currPos, 5) === peg$c41 ) {
				s0 = peg$c41;
				peg$currPos += 5
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c42)
			}
			if ( s0 === peg$FAILED ) {
				s0 = peg$currPos;
				if ( input.substr(peg$currPos, 5) === peg$c43 ) {
					s1 = peg$c43;
					peg$currPos += 5
				} else {
					s1 = peg$FAILED;
					if ( peg$silentFails ===
						0 ) peg$fail(peg$c44)
				}
				if ( s1 !== peg$FAILED ) {
					peg$savedPos = s0;
					s1           = peg$c45()
				}
				s0 = s1
			}
			return s0
		}

		function peg$parsenull() {
			var s0, s1;
			if ( input.substr(peg$currPos, 4) === peg$c46 ) {
				s0 = peg$c46;
				peg$currPos += 4
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c47)
			}
			if ( s0 === peg$FAILED ) {
				s0 = peg$currPos;
				if ( input.substr(peg$currPos, 4) === peg$c48 ) {
					s1 = peg$c48;
					peg$currPos += 4
				} else {
					s1 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c49)
				}
				if ( s1 !== peg$FAILED ) {
					peg$savedPos = s0;
					s1           = peg$c50()
				}
				s0 = s1
			}
			return s0
		}

		function peg$parsetrue() {
			var s0,
					s1;
			if ( input.substr(peg$currPos, 4) === peg$c51 ) {
				s0 = peg$c51;
				peg$currPos += 4
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c52)
			}
			if ( s0 === peg$FAILED ) {
				s0 = peg$currPos;
				if ( input.substr(peg$currPos, 4) === peg$c53 ) {
					s1 = peg$c53;
					peg$currPos += 4
				} else {
					s1 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c54)
				}
				if ( s1 !== peg$FAILED ) {
					peg$savedPos = s0;
					s1           = peg$c55()
				}
				s0 = s1
			}
			return s0
		}

		function peg$parsenumber() {
			var s0, s1, s2, s3, s4;
			peg$silentFails ++;
			s0 = peg$currPos;
			s1 = peg$parseminus();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				s2 =
					peg$currPos;
				s3 = peg$parseint();
				if ( s3 !== peg$FAILED ) {
					s4 = peg$parsefrac();
					if ( s4 === peg$FAILED ) s4 = null;
					if ( s4 !== peg$FAILED ) {
						s3 = [ s3, s4 ];
						s2 = s3
					} else {
						peg$currPos = s2;
						s2          = peg$FAILED
					}
				} else {
					peg$currPos = s2;
					s2          = peg$FAILED
				}
				if ( s2 === peg$FAILED ) s2 = peg$parsefrac();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parseexp();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c57();
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			peg$silentFails --;
			if ( s0 === peg$FAILED ) {
				s1 =
					peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c56)
			}
			return s0
		}

		function peg$parsedecimal_point() {
			var s0;
			if ( input.charCodeAt(peg$currPos) === 46 ) {
				s0 = peg$c58;
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c59)
			}
			return s0
		}

		function peg$parsedigit1_9() {
			var s0;
			if ( peg$c60.test(input.charAt(peg$currPos)) ) {
				s0 = input.charAt(peg$currPos);
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c61)
			}
			return s0
		}

		function peg$parsee() {
			var s0;
			if ( peg$c62.test(input.charAt(peg$currPos)) ) {
				s0 =
					input.charAt(peg$currPos);
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c63)
			}
			return s0
		}

		function peg$parseexp() {
			var s0, s1, s2, s3, s4;
			s0 = peg$currPos;
			s1 = peg$parsee();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parseminus();
				if ( s2 === peg$FAILED ) s2 = peg$parseplus();
				if ( s2 === peg$FAILED ) s2 = null;
				if ( s2 !== peg$FAILED ) {
					s3 = [];
					s4 = peg$parseDIGIT();
					if ( s4 !== peg$FAILED )while ( s4 !== peg$FAILED ) {
						s3.push(s4);
						s4 = peg$parseDIGIT()
					} else s3 = peg$FAILED;
					if ( s3 !== peg$FAILED ) {
						s1 = [ s1, s2, s3 ];
						s0 = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos =
						s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsefrac() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsedecimal_point();
			if ( s1 !== peg$FAILED ) {
				s2 = [];
				s3 = peg$parseDIGIT();
				while ( s3 !== peg$FAILED ) {
					s2.push(s3);
					s3 = peg$parseDIGIT()
				}
				if ( s2 !== peg$FAILED ) {
					s1 = [ s1, s2 ];
					s0 = s1
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseint() {
			var s0, s1, s2;
			s0 = peg$currPos;
			s1 = peg$parseint_start();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parseint_continued();
				if ( s2 !== peg$FAILED ) {
					peg$savedPos =
						s0;
					s1           = peg$c64(s1, s2);
					s0           = s1
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseint_start() {
			var s0;
			s0 = peg$parsezero();
			if ( s0 === peg$FAILED ) s0 = peg$parsedigit1_9();
			return s0
		}

		function peg$parseint_continued() {
			var s0, s1, s2;
			s0 = peg$currPos;
			s1 = [];
			s2 = peg$parseDIGIT();
			while ( s2 !== peg$FAILED ) {
				s1.push(s2);
				s2 = peg$parseDIGIT()
			}
			if ( s1 !== peg$FAILED ) {
				peg$savedPos = s0;
				s1           = peg$c65(s1)
			}
			s0 = s1;
			return s0
		}

		function peg$parseminus() {
			var s0;
			if ( input.charCodeAt(peg$currPos) === 45 ) {
				s0 = peg$c66;
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c67)
			}
			return s0
		}

		function peg$parseplus() {
			var s0;
			if ( input.charCodeAt(peg$currPos) === 43 ) {
				s0 = peg$c68;
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c69)
			}
			return s0
		}

		function peg$parsezero() {
			var s0;
			if ( input.charCodeAt(peg$currPos) === 48 ) {
				s0 = peg$c70;
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c71)
			}
			return s0
		}

		function peg$parsecomment() {
			var s0, s1, s2, s3, s4;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !==
				peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 35 ) {
					s2 = peg$c72;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c73)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = [];
					if ( peg$c74.test(input.charAt(peg$currPos)) ) {
						s4 = input.charAt(peg$currPos);
						peg$currPos ++
					} else {
						s4 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c75)
					}
					while ( s4 !== peg$FAILED ) {
						s3.push(s4);
						if ( peg$c74.test(input.charAt(peg$currPos)) ) {
							s4 = input.charAt(peg$currPos);
							peg$currPos ++
						} else {
							s4 = peg$FAILED;
							if ( peg$silentFails === 0 ) peg$fail(peg$c75)
						}
					}
					if ( s3 !== peg$FAILED ) {
						s4 =
							peg$parsews();
						if ( s4 !== peg$FAILED ) {
							peg$savedPos = s0;
							s1           = peg$c76(s3);
							s0           = s1
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseroute() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				if ( input.substr(peg$currPos, 5) === peg$c77 ) {
					s2 = peg$c77;
					peg$currPos += 5
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c78)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !==
						peg$FAILED ) {
						s4 = peg$parseroute_part();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 !== peg$FAILED ) {
								if ( input.substr(peg$currPos, 2) === peg$c79 ) {
									s6 = peg$c79;
									peg$currPos += 2
								} else {
									s6 = peg$FAILED;
									if ( peg$silentFails === 0 ) peg$fail(peg$c80)
								}
								if ( s6 !== peg$FAILED ) {
									s7 = peg$parsews();
									if ( s7 !== peg$FAILED ) {
										s8 = peg$parseroute_part();
										if ( s8 !== peg$FAILED ) {
											s9 = peg$parsews();
											if ( s9 !== peg$FAILED ) {
												peg$savedPos = s0;
												s1           = peg$c81(s4, s8);
												s0           = s1
											} else {
												peg$currPos = s0;
												s0          = peg$FAILED
											}
										} else {
											peg$currPos = s0;
											s0          = peg$FAILED
										}
									} else {
										peg$currPos = s0;
										s0          = peg$FAILED
									}
								} else {
									peg$currPos =
										s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseroute_part() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parseidentifier();
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 46 ) {
					s2 = peg$c58;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c59)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parseidentifier();
					if ( s3 !== peg$FAILED ) {
						peg$savedPos =
							s0;
						s1           = peg$c82(s1, s3);
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsebegin_array() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 91 ) {
					s2 = peg$c83;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c84)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						s1 = [ s1, s2, s3 ];
						s0 = s1
					} else {
						peg$currPos =
							s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseend_array() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 93 ) {
					s2 = peg$c85;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c86)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						s1 = [ s1, s2, s3 ];
						s0 = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos =
						s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsebegin_node() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 123 ) {
					s2 = peg$c87;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c88)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						s1 = [ s1, s2, s3 ];
						s0 = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos =
					s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseend_node() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 125 ) {
					s2 = peg$c89;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c90)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						s1 = [ s1, s2, s3 ];
						s0 = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsevalue_separator() {
			var s0,
					s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 44 ) {
					s2 = peg$c91;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c92)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						s1 = [ s1, s2, s3 ];
						s0 = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsews() {
			var s0, s1, s2;
			peg$silentFails ++;
			s0 = peg$currPos;
			s1 =
				[];
			if ( peg$c94.test(input.charAt(peg$currPos)) ) {
				s2 = input.charAt(peg$currPos);
				peg$currPos ++
			} else {
				s2 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c95)
			}
			while ( s2 !== peg$FAILED ) {
				s1.push(s2);
				if ( peg$c94.test(input.charAt(peg$currPos)) ) {
					s2 = input.charAt(peg$currPos);
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c95)
				}
			}
			if ( s1 !== peg$FAILED ) {
				peg$savedPos = s0;
				s1           = peg$c96(s1)
			}
			s0 = s1;
			peg$silentFails --;
			if ( s0 === peg$FAILED ) {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c93)
			}
			return s0
		}

		function peg$parsespace() {
			var s0;
			if ( input.charCodeAt(peg$currPos) === 32 ) {
				s0 = peg$c21;
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c22)
			}
			return s0
		}

		function peg$parsepoint() {
			var s0, s1, s2, s3, s4;
			s0 = peg$currPos;
			s1 = peg$parsevector();
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 44 ) {
					s2 = peg$c91;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c92)
				}
				if ( s2 === peg$FAILED ) s2 = null;
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsecomment();
						if ( s4 === peg$FAILED ) s4 = null;
						if ( s4 !== peg$FAILED ) {
							peg$savedPos =
								s0;
							s1           = peg$c97(s1);
							s0           = s1
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsevector() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parsenumber();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsenumber();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 !== peg$FAILED ) {
								s6 = peg$parsenumber();
								if ( s6 !== peg$FAILED ) {
									s7 =
										peg$parsews();
									if ( s7 !== peg$FAILED ) {
										s8 = peg$parsecomment();
										if ( s8 === peg$FAILED ) s8 = null;
										if ( s8 !== peg$FAILED ) {
											peg$savedPos = s0;
											s1           = peg$c98(s2, s4, s6);
											s0           = s1
										} else {
											peg$currPos = s0;
											s0          = peg$FAILED
										}
									} else {
										peg$currPos = s0;
										s0          = peg$FAILED
									}
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsevector2() {
			var s0, s1, s2, s3, s4, s5, s6;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parsenumber();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsenumber();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 !== peg$FAILED ) {
								s6 = peg$parsecomment();
								if ( s6 === peg$FAILED ) s6 = null;
								if ( s6 !== peg$FAILED ) {
									peg$savedPos = s0;
									s1           = peg$c99(s2, s4);
									s0           = s1
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsedef() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 === peg$FAILED ) s1 = null;
			if ( s1 !== peg$FAILED ) {
				if ( input.substr(peg$currPos, 3) === peg$c100 ) {
					s2 = peg$c100;
					peg$currPos += 3
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c101)
				}
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c102();
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseuse_statement() {
			var s0,
					s1, s2, s3, s4;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parseuse();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parseidentifier();
						if ( s4 !== peg$FAILED ) {
							peg$savedPos = s0;
							s1           = peg$c103(s4);
							s0           = s1
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseuse() {
			var s0, s1;
			s0 = peg$currPos;
			if ( input.substr(peg$currPos, 3) === peg$c104 ) {
				s1 = peg$c104;
				peg$currPos += 3
			} else {
				s1 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c105)
			}
			if ( s1 !== peg$FAILED ) {
				peg$savedPos = s0;
				s1           = peg$c102()
			}
			s0 = s1;
			return s0
		}

		function peg$parseface() {
			var s0, s1, s2, s3, s4;
			s0 = peg$currPos;
			s1 = [];
			s2 = peg$parseindex();
			if ( s2 !== peg$FAILED )while ( s2 !== peg$FAILED ) {
				s1.push(s2);
				s2 = peg$parseindex()
			} else s1 = peg$FAILED;
			if ( s1 !== peg$FAILED ) {
				if ( input.substr(peg$currPos, 2) === peg$c106 ) {
					s2 = peg$c106;
					peg$currPos += 2
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c107)
				}
				if ( s2 !== peg$FAILED ) {
					if ( input.charCodeAt(peg$currPos) === 44 ) {
						s3 = peg$c91;
						peg$currPos ++
					} else {
						s3 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c92)
					}
					if ( s3 === peg$FAILED ) s3 = null;
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsews();
						if ( s4 !== peg$FAILED ) {
							peg$savedPos = s0;
							s1           = peg$c108(s1);
							s0           = s1
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseindex() {
			var s0, s1, s2, s3, s4, s5;
			s0 = peg$currPos;
			s1 = peg$parseint();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$currPos;
				s3 = peg$parsews();
				if ( s3 !== peg$FAILED ) {
					if ( input.charCodeAt(peg$currPos) ===
						44 ) {
						s4 = peg$c91;
						peg$currPos ++
					} else {
						s4 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c92)
					}
					if ( s4 !== peg$FAILED ) {
						if ( input.charCodeAt(peg$currPos) === 32 ) {
							s5 = peg$c21;
							peg$currPos ++
						} else {
							s5 = peg$FAILED;
							if ( peg$silentFails === 0 ) peg$fail(peg$c22)
						}
						if ( s5 === peg$FAILED ) s5 = null;
						if ( s5 !== peg$FAILED ) {
							s3 = [ s3, s4, s5 ];
							s2 = s3
						} else {
							peg$currPos = s2;
							s2          = peg$FAILED
						}
					} else {
						peg$currPos = s2;
						s2          = peg$FAILED
					}
				} else {
					peg$currPos = s2;
					s2          = peg$FAILED
				}
				if ( s2 === peg$FAILED ) {
					s2 = [];
					if ( input.charCodeAt(peg$currPos) === 32 ) {
						s3 = peg$c21;
						peg$currPos ++
					} else {
						s3 =
							peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c22)
					}
					if ( s3 !== peg$FAILED )while ( s3 !== peg$FAILED ) {
						s2.push(s3);
						if ( input.charCodeAt(peg$currPos) === 32 ) {
							s3 = peg$c21;
							peg$currPos ++
						} else {
							s3 = peg$FAILED;
							if ( peg$silentFails === 0 ) peg$fail(peg$c22)
						}
					} else s2 = peg$FAILED
				}
				if ( s2 !== peg$FAILED ) {
					peg$savedPos = s0;
					s1           = peg$c109(s1);
					s0           = s1
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseurl() {
			var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parsebegin_array();
				if ( s2 !== peg$FAILED ) {
					s3 = peg$parsews();
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsequote();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parseuri();
							if ( s5 !== peg$FAILED ) {
								s6 = peg$parsequote();
								if ( s6 !== peg$FAILED ) {
									s7 = peg$parsews();
									if ( s7 !== peg$FAILED ) {
										s8 = peg$parseend_array();
										if ( s8 !== peg$FAILED ) {
											s9 = peg$parsews();
											if ( s9 !== peg$FAILED ) {
												peg$savedPos = s0;
												s1           = peg$c110(s5);
												s0           = s1
											} else {
												peg$currPos = s0;
												s0          = peg$FAILED
											}
										} else {
											peg$currPos = s0;
											s0          = peg$FAILED
										}
									} else {
										peg$currPos = s0;
										s0          = peg$FAILED
									}
								} else {
									peg$currPos = s0;
									s0          = peg$FAILED
								}
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos =
								s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parseuri() {
			var s0, s1, s2, s3;
			s0 = peg$currPos;
			s1 = [];
			if ( peg$c111.test(input.charAt(peg$currPos)) ) {
				s2 = input.charAt(peg$currPos);
				peg$currPos ++
			} else {
				s2 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c112)
			}
			while ( s2 !== peg$FAILED ) {
				s1.push(s2);
				if ( peg$c111.test(input.charAt(peg$currPos)) ) {
					s2 = input.charAt(peg$currPos);
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails ===
						0 ) peg$fail(peg$c112)
				}
			}
			if ( s1 !== peg$FAILED ) {
				if ( input.charCodeAt(peg$currPos) === 46 ) {
					s2 = peg$c58;
					peg$currPos ++
				} else {
					s2 = peg$FAILED;
					if ( peg$silentFails === 0 ) peg$fail(peg$c59)
				}
				if ( s2 !== peg$FAILED ) {
					if ( input.substr(peg$currPos, 3) === peg$c113 ) {
						s3 = peg$c113;
						peg$currPos += 3
					} else {
						s3 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c114)
					}
					if ( s3 === peg$FAILED ) {
						if ( input.substr(peg$currPos, 4) === peg$c115 ) {
							s3 = peg$c115;
							peg$currPos += 4
						} else {
							s3 = peg$FAILED;
							if ( peg$silentFails === 0 ) peg$fail(peg$c116)
						}
						if ( s3 === peg$FAILED ) {
							if ( input.substr(peg$currPos,
									3) === peg$c117 ) {
								s3 = peg$c117;
								peg$currPos += 3
							} else {
								s3 = peg$FAILED;
								if ( peg$silentFails === 0 ) peg$fail(peg$c118)
							}
							if ( s3 === peg$FAILED )if ( input.substr(peg$currPos, 3) === peg$c119 ) {
								s3 = peg$c119;
								peg$currPos += 3
							} else {
								s3 = peg$FAILED;
								if ( peg$silentFails === 0 ) peg$fail(peg$c120)
							}
						}
					}
					if ( s3 !== peg$FAILED ) {
						peg$savedPos = s0;
						s1           = peg$c121(s1, s2, s3);
						s0           = s1
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsequoted_string() {
			var s0, s1, s2, s3, s4, s5;
			s0 = peg$currPos;
			s1 = peg$parsews();
			if ( s1 !== peg$FAILED ) {
				s2 = peg$parsequote();
				if ( s2 !== peg$FAILED ) {
					s3 = [];
					if ( peg$c111.test(input.charAt(peg$currPos)) ) {
						s4 = input.charAt(peg$currPos);
						peg$currPos ++
					} else {
						s4 = peg$FAILED;
						if ( peg$silentFails === 0 ) peg$fail(peg$c112)
					}
					while ( s4 !== peg$FAILED ) {
						s3.push(s4);
						if ( peg$c111.test(input.charAt(peg$currPos)) ) {
							s4 = input.charAt(peg$currPos);
							peg$currPos ++
						} else {
							s4 = peg$FAILED;
							if ( peg$silentFails === 0 ) peg$fail(peg$c112)
						}
					}
					if ( s3 !== peg$FAILED ) {
						s4 = peg$parsequote();
						if ( s4 !== peg$FAILED ) {
							s5 = peg$parsews();
							if ( s5 !==
								peg$FAILED ) {
								peg$savedPos = s0;
								s1           = peg$c122(s3);
								s0           = s1
							} else {
								peg$currPos = s0;
								s0          = peg$FAILED
							}
						} else {
							peg$currPos = s0;
							s0          = peg$FAILED
						}
					} else {
						peg$currPos = s0;
						s0          = peg$FAILED
					}
				} else {
					peg$currPos = s0;
					s0          = peg$FAILED
				}
			} else {
				peg$currPos = s0;
				s0          = peg$FAILED
			}
			return s0
		}

		function peg$parsequote() {
			var s0;
			if ( input.charCodeAt(peg$currPos) === 34 ) {
				s0 = peg$c123;
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c124)
			}
			return s0
		}

		function peg$parseDIGIT() {
			var s0;
			if ( peg$c125.test(input.charAt(peg$currPos)) ) {
				s0 = input.charAt(peg$currPos);
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c126)
			}
			return s0
		}

		function peg$parseHEXDIG() {
			var s0;
			if ( peg$c127.test(input.charAt(peg$currPos)) ) {
				s0 = input.charAt(peg$currPos);
				peg$currPos ++
			} else {
				s0 = peg$FAILED;
				if ( peg$silentFails === 0 ) peg$fail(peg$c128)
			}
			return s0
		}

		var nodeDefinitions = {};
		var routes          = {};
		peg$result          = peg$startRuleFunction();
		if ( peg$result !== peg$FAILED && peg$currPos === input.length )return peg$result; else {
			if ( peg$result !== peg$FAILED && peg$currPos < input.length ) peg$fail({
				type: "end",
				description: "end of input"
			});
			throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
		}
	}

	return { SyntaxError: peg$SyntaxError, parse: peg$parse }
}();
var TWEEN  = TWEEN || function () {
		var _tweens = [];
		return {
			getAll: function () {
				return _tweens
			}, removeAll: function () {
				_tweens = []
			}, add: function (tween) {
				_tweens.push(tween)
			}, remove: function (tween) {
				var i = _tweens.indexOf(tween);
				if ( i !== - 1 ) _tweens.splice(i, 1)
			}, update: function (time, preserve) {
				if ( _tweens.length === 0 )return false;
				var i = 0;
				time  = time !== undefined ? time : TWEEN.now();
				while ( i < _tweens.length )if ( _tweens[ i ].update(time) || preserve ) i ++; else _tweens.splice(i, 1);
				return true
			}
		}
	}();
(function () {
	if ( this.window === undefined && this.process !== undefined ) TWEEN.now = function () {
		var time = process.hrtime();
		return time[ 0 ] * 1E3 + time[ 1 ] / 1E3
	}; else if ( this.window !== undefined && window.performance !== undefined && window.performance.now !== undefined ) TWEEN.now = window.performance.now.bind(window.performance); else if ( Date.now !== undefined ) TWEEN.now = Date.now; else TWEEN.now = function () {
		return (new Date).getTime()
	}
})();
TWEEN.Tween         = function (object) {
	var _object                = object;
	var _valuesStart           = {};
	var _valuesEnd             = {};
	var _valuesStartRepeat     = {};
	var _duration              = 1E3;
	var _repeat                = 0;
	var _yoyo                  = false;
	var _isPlaying             = false;
	var _reversed              = false;
	var _delayTime             = 0;
	var _startTime             = null;
	var _easingFunction        = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens         = [];
	var _onStartCallback       = null;
	var _onStartCallbackFired  = false;
	var _onUpdateCallback      = null;
	var _onCompleteCallback    = null;
	var _onStopCallback        = null;
	for ( var field in object )_valuesStart[ field ] =
		parseFloat(object[ field ], 10);
	this.to                = function (properties, duration) {
		if ( duration !== undefined ) _duration = duration;
		_valuesEnd = properties;
		return this
	};
	this.start             = function (time) {
		TWEEN.add(this);
		_isPlaying            = true;
		_onStartCallbackFired = false;
		_startTime            = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;
		for ( var property in _valuesEnd ) {
			if ( _valuesEnd[ property ] instanceof Array ) {
				if ( _valuesEnd[ property ].length === 0 )continue;
				_valuesEnd[ property ] = [ _object[ property ] ].concat(_valuesEnd[ property ])
			}
			if ( _valuesStart[ property ] ===
				undefined )continue;
			_valuesStart[ property ] = _object[ property ];
			if ( _valuesStart[ property ] instanceof Array === false ) _valuesStart[ property ] *= 1;
			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0
		}
		return this
	};
	this.stop              = function () {
		if ( ! _isPlaying )return this;
		TWEEN.remove(this);
		_isPlaying = false;
		if ( _onStopCallback !== null ) _onStopCallback.call(_object);
		this.stopChainedTweens();
		return this
	};
	this.stopChainedTweens = function () {
		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i ++ )_chainedTweens[ i ].stop()
	};
	this.delay             = function (amount) {
		_delayTime = amount;
		return this
	};
	this.repeat            = function (times) {
		_repeat = times;
		return this
	};
	this.yoyo              = function (yoyo) {
		_yoyo = yoyo;
		return this
	};
	this.easing            = function (easing) {
		_easingFunction = easing;
		return this
	};
	this.interpolation     = function (interpolation) {
		_interpolationFunction = interpolation;
		return this
	};
	this.chain             = function () {
		_chainedTweens = arguments;
		return this
	};
	this.onStart           = function (callback) {
		_onStartCallback = callback;
		return this
	};
	this.onUpdate          = function (callback) {
		_onUpdateCallback =
			callback;
		return this
	};
	this.onComplete        = function (callback) {
		_onCompleteCallback = callback;
		return this
	};
	this.onStop            = function (callback) {
		_onStopCallback = callback;
		return this
	};
	this.update            = function (time) {
		var property;
		var elapsed;
		var value;
		if ( time < _startTime )return true;
		if ( _onStartCallbackFired === false ) {
			if ( _onStartCallback !== null ) _onStartCallback.call(_object);
			_onStartCallbackFired = true
		}
		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;
		value   = _easingFunction(elapsed);
		for ( property in _valuesEnd ) {
			if ( _valuesStart[ property ] ===
				undefined )continue;
			var start = _valuesStart[ property ] || 0;
			var end   = _valuesEnd[ property ];
			if ( end instanceof Array ) _object[ property ] = _interpolationFunction(end, value); else {
				if ( typeof end === "string" )if ( end.charAt(0) === "+" || end.charAt(0) === "-" ) end = start + parseFloat(end, 10); else end = parseFloat(end, 10);
				if ( typeof end === "number" ) _object[ property ] = start + (end - start) * value
			}
		}
		if ( _onUpdateCallback !== null ) _onUpdateCallback.call(_object, value);
		if ( elapsed === 1 )if ( _repeat > 0 ) {
			if ( isFinite(_repeat) ) _repeat --;
			for ( property in _valuesStartRepeat ) {
				if ( typeof _valuesEnd[ property ] ===
					"string" ) _valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
				if ( _yoyo ) {
					var tmp                        = _valuesStartRepeat[ property ];
					_valuesStartRepeat[ property ] = _valuesEnd[ property ];
					_valuesEnd[ property ]         = tmp
				}
				_valuesStart[ property ] = _valuesStartRepeat[ property ]
			}
			if ( _yoyo ) _reversed = ! _reversed;
			_startTime = time + _delayTime;
			return true
		} else {
			if ( _onCompleteCallback !== null ) _onCompleteCallback.call(_object);
			for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i ++ )_chainedTweens[ i ].start(_startTime +
				_duration);
			return false
		}
		return true
	}
};
TWEEN.Easing        = {
	Linear: {
		None: function (k) {
			return k
		}
	}, Quadratic: {
		In: function (k) {
			return k * k
		}, Out: function (k) {
			return k * (2 - k)
		}, InOut: function (k) {
			if ( (k *= 2) < 1 )return .5 * k * k;
			return - .5 * (-- k * (k - 2) - 1)
		}
	}, Cubic: {
		In: function (k) {
			return k * k * k
		}, Out: function (k) {
			return -- k * k * k + 1
		}, InOut: function (k) {
			if ( (k *= 2) < 1 )return .5 * k * k * k;
			return .5 * ((k -= 2) * k * k + 2)
		}
	}, Quartic: {
		In: function (k) {
			return k * k * k * k
		}, Out: function (k) {
			return 1 - -- k * k * k * k
		}, InOut: function (k) {
			if ( (k *= 2) < 1 )return .5 * k * k * k * k;
			return - .5 * ((k -= 2) * k * k * k - 2)
		}
	}, Quintic: {
		In: function (k) {
			return k *
				k * k * k * k
		}, Out: function (k) {
			return -- k * k * k * k * k + 1
		}, InOut: function (k) {
			if ( (k *= 2) < 1 )return .5 * k * k * k * k * k;
			return .5 * ((k -= 2) * k * k * k * k + 2)
		}
	}, Sinusoidal: {
		In: function (k) {
			return 1 - Math.cos(k * Math.PI / 2)
		}, Out: function (k) {
			return Math.sin(k * Math.PI / 2)
		}, InOut: function (k) {
			return .5 * (1 - Math.cos(Math.PI * k))
		}
	}, Exponential: {
		In: function (k) {
			return k === 0 ? 0 : Math.pow(1024, k - 1)
		}, Out: function (k) {
			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k)
		}, InOut: function (k) {
			if ( k === 0 )return 0;
			if ( k === 1 )return 1;
			if ( (k *= 2) < 1 )return .5 * Math.pow(1024, k - 1);
			return .5 *
				(- Math.pow(2, - 10 * (k - 1)) + 2)
		}
	}, Circular: {
		In: function (k) {
			return 1 - Math.sqrt(1 - k * k)
		}, Out: function (k) {
			return Math.sqrt(1 - -- k * k)
		}, InOut: function (k) {
			if ( (k *= 2) < 1 )return - .5 * (Math.sqrt(1 - k * k) - 1);
			return .5 * (Math.sqrt(1 - (k -= 2) * k) + 1)
		}
	}, Elastic: {
		In: function (k) {
			if ( k === 0 )return 0;
			if ( k === 1 )return 1;
			return - Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI)
		}, Out: function (k) {
			if ( k === 0 )return 0;
			if ( k === 1 )return 1;
			return Math.pow(2, - 10 * k) * Math.sin((k - .1) * 5 * Math.PI) + 1
		}, InOut: function (k) {
			if ( k === 0 )return 0;
			if ( k === 1 )return 1;
			k *= 2;
			if ( k < 1 )return - .5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			return .5 * Math.pow(2, - 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1
		}
	}, Back: {
		In: function (k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s)
		}, Out: function (k) {
			var s = 1.70158;
			return -- k * k * ((s + 1) * k + s) + 1
		}, InOut: function (k) {
			var s = 1.70158 * 1.525;
			if ( (k *= 2) < 1 )return .5 * (k * k * ((s + 1) * k - s));
			return .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2)
		}
	}, Bounce: {
		In: function (k) {
			return 1 - TWEEN.Easing.Bounce.Out(1 - k)
		}, Out: function (k) {
			if ( k < 1 / 2.75 )return 7.5625 * k * k; else if ( k < 2 / 2.75 )return 7.5625 *
				(k -= 1.5 / 2.75) * k + .75; else if ( k < 2.5 / 2.75 )return 7.5625 * (k -= 2.25 / 2.75) * k + .9375; else return 7.5625 * (k -= 2.625 / 2.75) * k + .984375
		}, InOut: function (k) {
			if ( k < .5 )return TWEEN.Easing.Bounce.In(k * 2) * .5;
			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * .5 + .5
		}
	}
};
TWEEN.Interpolation = {
	Linear: function (v, k) {
		var m  = v.length - 1;
		var f  = m * k;
		var i  = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;
		if ( k < 0 )return fn(v[ 0 ], v[ 1 ], f);
		if ( k > 1 )return fn(v[ m ], v[ m - 1 ], m - f);
		return fn(v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i)
	}, Bezier: function (v, k) {
		var b  = 0;
		var n  = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;
		for ( var i = 0; i <= n; i ++ )b += pw(1 - k, n - i) * pw(k, i) * v[ i ] * bn(n, i);
		return b
	}, CatmullRom: function (v, k) {
		var m  = v.length - 1;
		var f  = m * k;
		var i  = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;
		if ( v[ 0 ] === v[ m ] ) {
			if ( k < 0 ) i = Math.floor(f = m * (1 + k));
			return fn(v[ (i - 1 + m) % m ], v[ i ], v[ (i + 1) % m ], v[ (i + 2) % m ], f - i)
		} else {
			if ( k < 0 )return v[ 0 ] - (fn(v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], - f) - v[ 0 ]);
			if ( k > 1 )return v[ m ] - (fn(v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m) - v[ m ]);
			return fn(v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i)
		}
	}, Utils: {
		Linear: function (p0, p1, t) {
			return (p1 - p0) * t + p0
		}, Bernstein: function (n, i) {
			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc(n) / fc(i) / fc(n - i)
		}, Factorial: function () {
			var a = [ 1 ];
			return function (n) {
				var s = 1;
				if ( a[ n ] )return a[ n ];
				for ( var i = n; i > 1; i -- )s *= i;
				a[ n ] = s;
				return s
			}
		}(), CatmullRom: function (p0, p1, p2, p3, t) {
			var v0 = (p2 - p0) * .5;
			var v1 = (p3 - p1) * .5;
			var t2 = t * t;
			var t3 = t * t2;
			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
		}
	}
};
(function (root) {
	if ( typeof define === "function" && define.amd ) define([], function () {
		return TWEEN
	}); else if ( typeof module !== "undefined" && typeof exports === "object" ) module.exports = TWEEN; else if ( root !== undefined ) root.TWEEN = TWEEN
})(this);
/*
 Bart McLeod 2016, mcleod@spaceweb.nl
 @author Bart McLeod / http://spaceweb.nl/
 */
window[ "VrmlParser" ]                                                  = {};
VrmlParser[ "Renderer" ]                                                = {};
VrmlParser.Renderer[ "ThreeJs" ]                                        = function (debug) {
	this.debug = debug ? true : false
};
VrmlParser.Renderer.ThreeJs.prototype                                   = {
	debug: false, REVISION: 1, constructor: VrmlParser.Renderer.ThreeJs, log: function () {
		console.log.apply(console, arguments)
	}, warn: function () {
		console.warn.apply(console, arguments)
	}, error: function () {
		console.error.apply(console, arguments)
	}, render: function (nodeTree, scene) {
		var scope = this;
		console.log("VrmlParser.Renderer.ThreeJsRenderer " + this.REVISION);
		var convertVectorToColor = function (vector) {
			return { r: vector.x, g: vector.y, b: vector.z }
		};
		var interpolateColors    = function (a, b, t) {
			a          =
				convertVectorToColor(a);
			b          = convertVectorToColor(b);
			var deltaR = a.r - b.r;
			var deltaG = a.g - b.g;
			var deltaB = a.b - b.b;
			var c      = new THREE.Color;
			c.r        = a.r - t * deltaR;
			c.g        = a.g - t * deltaG;
			c.b        = a.b - t * deltaB;
			return c
		};
		var paintFaces           = function (geometry, radius, angles, colors, directionIsDown) {
			var f, n, p, vertexIndex, color;
			var direction   = directionIsDown ? 1 : - 1;
			var faceIndices = [ "a", "b", "c", "d" ];
			var coord       = [], aColor, bColor, t = 1, A = {}, B = {}, applyColor = false, colorIndex;
			for ( var k = 0; k < angles.length; k ++ ) {
				var vec = {};
				vec.y   = direction * (Math.cos(angles[ k ]) *
					radius);
				vec.x   = direction * (Math.sin(angles[ k ]) * radius);
				coord.push(vec)
			}
			for ( var i = 0; i < geometry.faces.length; i ++ ) {
				f = geometry.faces[ i ];
				n = f instanceof THREE.Face3 ? 3 : 4;
				for ( var j = 0; j < n; j ++ ) {
					vertexIndex = f[ faceIndices[ j ] ];
					p           = geometry.vertices[ vertexIndex ];
					for ( var index = 0; index < colors.length; index ++ ) {
						if ( index === 0 ) {
							A.x = 0;
							A.y = directionIsDown ? radius : - 1 * radius
						} else {
							A.x = coord[ index - 1 ].x;
							A.y = coord[ index - 1 ].y
						}
						B = coord[ index ];
						if ( undefined !== B ) {
							applyColor = directionIsDown ? p.y <= A.y && p.y > B.y : p.y >= A.y && p.y < B.y;
							if ( applyColor ) {
								bColor              =
									colors[ index + 1 ];
								aColor              = colors[ index ];
								t                   = Math.abs(p.y - A.y) / (A.y - B.y);
								color               = interpolateColors(aColor, bColor, t);
								f.vertexColors[ j ] = color
							}
						} else if ( undefined === f.vertexColors[ j ] ) {
							colorIndex          = directionIsDown ? colors.length - 1 : 0;
							f.vertexColors[ j ] = convertVectorToColor(colors[ colorIndex ])
						}
					}
				}
			}
		};
		var has                  = function (property) {
			return "undefined" !== typeof this[ property ] && null !== this[ property ]
		};
		var parseNode            = function (node) {
			if ( undefined === node.node )return false;
			node.has             = has;
			var object           = new THREE.Object3D;
			var surroundingGroup =
						false;
			switch ( node.node ) {
				case "NavigationInfo":
					object             = false;
					var navigationInfo = new VrmlParser.Renderer.ThreeJs.VrmlNode.NavigationInfo(node, scope.debug);
					navigationInfo.parse(scene);
					break;
				case "Viewpoint":
					var viewpoint                   = new VrmlParser.Renderer.ThreeJs.VrmlNode.Viewpoint(node, scope.debug);
					surroundingGroup                = viewpoint.parse(scene);
					object                          = surroundingGroup.getCamera();
					scope.viewpoints[ object.name ] = surroundingGroup;
					break;
				case "OrientationInterpolator":
				case "PositionInterpolator":
					break;
				case "Switch":
					if ( node.whichChoice >=
						0 && node.whichChoice < node.choice.length ) object = parseNode(node.choice[ node.whichChoice ]); else object = false;
					break;
				case "Group":
				case "Transform":
					object = new THREE.Group;
					if ( node.has("children") ) {
						node.children.has = has;
						if ( node.children.has("node") ) {
							var objects = parseNode(node.children);
							if ( false !== objects ) object.add(objects)
						} else if ( node.children.has("length") )for ( var i = 0; i < node.children.length; i ++ ) {
							var child      = node.children[ i ];
							child.has      = has;
							var threeJsObj = parseNode(child);
							if ( false !== threeJsObj ) object.add(threeJsObj)
						}
					}
					var t =
								{ x: 0, y: 0, z: 0 };
					if ( node.has("translation") ) {
						t = node.translation;
						object.position.set(t.x, t.y, t.z)
					}
					var r = { x: 0, y: 0, z: 0, radians: 0 };
					if ( node.has("rotation") ) r = node.rotation;
					if ( node.has("scale") ) {
						var s = node.scale;
						object.scale.set(s.x, s.y, s.z)
					}
					surroundingGroup = new THREE.Group;
					if ( ! node.has("center") ) node.center = { x: 0, y: 0, z: 0 };
					var center = node.center;
					surroundingGroup.position.set(t.x + center.x, t.y + center.y, t.z + center.z);
					object.position.set(0 - center.x, 0 - center.y, 0 - center.z);
					surroundingGroup.quaternion.setFromAxisAngle(new THREE.Vector3(r.x,
						r.y, r.z), r.radians);
					surroundingGroup.add(object);
					break;
				case "Shape":
					var isLine  = node.has("geometry") && "IndexedLineSet" === node.geometry.node;
					var isPoint = node.has("geometry") && "PointSet" === node.geometry.node;
					object      = isLine ? new THREE.Line : isPoint ? new THREE.Points({ size: .01 }) : new THREE.Mesh;
					if ( node.has("geometry") ) object.geometry = parseNode(node.geometry);
					if ( node.has("appearance") ) {
						var appearance = node.appearance;
						appearance.has = has;
						if ( appearance.has("material") ) {
							var vrmlMaterial = appearance.material;
							var material;
							vrmlMaterial.has = has;
							if ( isLine ) {
								material = new THREE.LineBasicMaterial;
								if ( vrmlMaterial.has("color") ) {
									var materialColor = convertVectorToColor(vrmlMaterial.color);
									material.color.setRGB(materialColor.r, materialColor.g, materialColor.b)
								}
							} else if ( isPoint ) {
								var c;
								if ( vrmlMaterial.has("diffuseColor") ) c = convertVectorToColor(vrmlMaterial.diffuseColor);
								if ( vrmlMaterial.has("emissiveColor") ) c = convertVectorToColor(vrmlMaterial.emissiveColor);
								material = new THREE.ShaderMaterial({
									vertexShader: "void main() {" + "\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
									"\n\tgl_PointSize = 3.0;\n" + "}",
									fragmentShader: "void main() {\n\tgl_FragColor = vec4( " + c.r + ", " + c.g + ", " + c.b + ", 1.0 );\n}"
								})
							} else {
								material = new THREE.MeshPhongMaterial;
								if ( vrmlMaterial.has("diffuseColor") ) {
									var materialColor = convertVectorToColor(vrmlMaterial.diffuseColor);
									material.color.setRGB(materialColor.r, materialColor.g, materialColor.b)
								}
								if ( vrmlMaterial.has("emissiveColor") ) {
									var emissiveColor = convertVectorToColor(vrmlMaterial.emissiveColor);
									material.emissive.setRGB(emissiveColor.r, emissiveColor.g,
										emissiveColor.b)
								}
								if ( vrmlMaterial.has("specularColor") ) {
									var specularColor = convertVectorToColor(vrmlMaterial.specularColor);
									material.specular.setRGB(specularColor.r, specularColor.g, specularColor.b)
								}
								if ( vrmlMaterial.has("transparency") ) {
									material.opacity     = Math.abs(1 - vrmlMaterial.transparency);
									material.transparent = true
								}
								if ( appearance.has("texture") )if ( undefined !== appearance.texture.node && appearance.texture.node === "ImageTexture" ) {
									var imageUrl = appearance.texture.url[ 0 ];
									if ( undefined != imageUrl && imageUrl ) {
										scope.log("Loading image: " +
											imageUrl);
										var texture   = (new THREE.TextureLoader).load(imageUrl, function (texture) {
											if ( undefined !== texture.image ) texture.repeat.set(texture.image.height / texture.image.width * 2, 2)
										});
										texture.wrapS = THREE.ClampToEdgeWrapping;
										texture.wrapT = THREE.ClampToEdgeWrapping;
										scope.log(texture);
										material.map = texture
									}
								}
							}
						}
						object.material = material;
						if ( "IndexedFaceSet" === node.geometry.node ) object.material.side = THREE.DoubleSide
					}
					break;
				case "Background":
					object          = false;
					var segments    = 20;
					var radius      = 2E4;
					var skyGeometry = new THREE.SphereGeometry(radius,
						segments, segments);
					var skyMaterial = new THREE.MeshBasicMaterial({ fog: false, side: THREE.BackSide });
					if ( node.skyColor.length > 1 ) {
						paintFaces(skyGeometry, radius, node.skyAngle, node.skyColor, true);
						skyMaterial.vertexColors = THREE.VertexColors
					} else {
						var color = convertVectorToColor(node.skyColor[ 0 ]);
						skyMaterial.color.setRGB(color.r, color.g, color.b)
					}
					var sky                       = new THREE.Mesh(skyGeometry, skyMaterial);
					sky.userData.originalVrmlNode = node;
					scene.add(sky);
					if ( node.has("groundColor") ) {
						radius             = 12E3;
						var groundGeometry = new THREE.SphereGeometry(radius,
							segments, segments, 0, 2 * Math.PI, .5 * Math.PI, 1.5 * Math.PI);
						var groundMaterial = new THREE.MeshBasicMaterial({
							fog: false,
							side: THREE.BackSide,
							vertexColors: THREE.VertexColors
						});
						paintFaces(groundGeometry, radius, node.groundAngle, node.groundColor, false);
						var ground                       = new THREE.Mesh(groundGeometry, groundMaterial);
						ground.userData.originalVrmlNode = node;
						ground.receiveShadow             = true;
						scene.add(ground)
					}
					break;
				case "Box":
					var s          = node.size;
					object         = new THREE.BoxGeometry(s.x, s.y, s.z);
					object.shading = THREE.SmoothShading;
					break;
				case "Cylinder":
					object =
						new THREE.CylinderGeometry(node.radius, node.radius, node.height);
					break;
				case "Cone":
					object = new THREE.CylinderGeometry(node.topRadius, node.bottomRadius, node.height);
					break;
				case "Sphere":
					object = new THREE.SphereGeometry(node.radius);
					break;
				case "IndexedFaceSet":
					object         = new THREE.Geometry;
					object.shading = THREE.SmoothShading;
					var indexes, uvIndexes, uvs;
					var vec;
					if ( node.has("texCoord") ) uvs = node.texCoord.point;
					if ( node.has("coord") ) {
						if ( ! uvs ) uvs = node.coord.point;
						for ( var k = 0, l = node.coord.point.length; k < l; k ++ ) {
							var point =
										node.coord.point[ k ];
							vec       = new THREE.Vector3(point.x, point.y, point.z);
							object.vertices.push(vec)
						}
					}
					var skip = 0;
					if ( node.has("coordIndex") )for ( var i = 0, j = node.coordIndex.length; i < j; i ++ ) {
						indexes = node.coordIndex[ i ];
						if ( node.has("texCoordIndex") ) uvIndexes = node.texCoordIndex[ i ]; else uvIndexes = indexes;
						skip = 0;
						while ( indexes.length >= 3 && skip < indexes.length - 2 ) {
							var a    = indexes[ 0 ];
							var b    = indexes[ skip + (node.ccw ? 1 : 2) ];
							var c    = indexes[ skip + (node.ccw ? 2 : 1) ];
							var face = new THREE.Face3(a, b, c, null);
							if ( uvs && uvIndexes ) object.faceVertexUvs[ 0 ].push([ new THREE.Vector2(uvs[ uvIndexes[ 0 ] ].x,
								uvs[ uvIndexes[ 0 ] ].y), new THREE.Vector2(uvs[ uvIndexes[ skip + (node.ccw ? 1 : 2) ] ].x, uvs[ uvIndexes[ skip + (node.ccw ? 1 : 2) ] ].y), new THREE.Vector2(uvs[ uvIndexes[ skip + (node.ccw ? 2 : 1) ] ].x, uvs[ uvIndexes[ skip + (node.ccw ? 2 : 1) ] ].y) ]); else;
							skip ++;
							object.faces.push(face)
						}
					}
					object.computeFaceNormals();
					object.computeBoundingSphere();
					break;
				case "IndexedLineSet":
					var vec;
					var point;
					var object   = new THREE.Geometry;
					var vertices = [];
					if ( node.has("coord") )for ( var k = 0, l = node.coord.point.length; k < l; k ++ ) {
						point = node.coord.point[ k ];
						vec   = new THREE.Vector3(point.x,
							point.y, point.z);
						vertices.push(vec)
					}
					if ( node.has("coordIndex") ) {
						for ( var i = 0, j = node.coordIndex.length; i < j; i ++ ) {
							indexes = node.coordIndex[ i ];
							for ( var p = 0; p < indexes.length; p ++ ) {
								var a      = indexes[ p ];
								var pointA = vertices[ a ];
								object.vertices.push(new THREE.Vector3(pointA.x, pointA.y, pointA.z))
							}
						}
						object.computeBoundingSphere()
					}
					break;
				case "PointSet":
					var vec;
					var point;
					var object = new THREE.Geometry;
					if ( node.has("coord") )for ( var k = 0, l = node.coord.point.length; k < l; k ++ ) {
						point = node.coord.point[ k ];
						vec   = new THREE.Vector3(point.x,
							point.y, point.z);
						object.vertices.push(vec)
					}
					object.computeBoundingSphere();
					break;
				case "TouchSensor":
					if ( scope.debug ) {
						object                = new THREE.Mesh;
						object.geometry       = new THREE.CubeGeometry(.1, .1, .1);
						object.material       = new THREE.MeshNormalMaterial;
						object.material.color = new THREE.Color(.5, .5, .5)
					}
					break;
				default:
					object = false;
					break
			}
			if ( false !== object ) {
				if ( undefined !== object.userData ) object.userData.originalVrmlNode = node;
				if ( "" === object.name )if ( node.has("name") ) object.name = node.name; else if ( node.has("node") ) object.name = node.node;
				object.castShadow    = ! isPoint;
				object.receiveShadow = ! isPoint
			}
			if ( false !== surroundingGroup ) {
				surroundingGroup.name = "surrounding_" + object.name;
				return surroundingGroup
			}
			return object
		};
		for ( var n = 0; n < nodeTree.length; n ++ ) {
			var childNode = parseNode(nodeTree[ n ]);
			if ( false !== childNode ) scene.add(childNode)
		}
		scene.userData.routes = nodeTree.routes;
		console.log(scene)
	}
};
VrmlParser.Renderer.ThreeJs[ "Animation" ]                              = function (debug) {
	this.debug      = debug ? true : false;
	this.animations = {}
};
VrmlParser.Renderer.ThreeJs.Animation.prototype                         = {
	update: function (delta) {
		for ( var a in this.animations ) {
			if ( ! this.animations.hasOwnProperty(a) )continue;
			var callback = this.animations[ a ];
			callback(delta)
		}
	}, addAnimation: function (name, callback) {
		this.animations[ name ] = callback
	}, removeAnimation: function (name) {
		delete this.animations[ name ]
	}, getRoutesForEvent: function (name) {
		var routesRegistry = scene.userData.routes;
		var routes         = routesRegistry[ name ];
		for ( var r = 0; r < routes.length; r ++ );
		return routes
	}, findTargetRoutes: function (triggerRoute) {
		var targetRoutes =
					[];
		if ( "undefined" === typeof triggerRoute )return targetRoutes;
		var routesRegistry = scene.userData.routes;
		if ( "undefined" === typeof routesRegistry[ triggerRoute.target.name ] )return triggerRoute;
		var routes = routesRegistry[ triggerRoute.target.name ];
		for ( var i = 0; i < routes.length; i ++ ) {
			var route              = routes[ i ];
			var nestedTargetRoutes = this.findTargetRoutes(route);
			targetRoutes.push(nestedTargetRoutes)
		}
		return targetRoutes
	}, log: function (obj) {
		if ( this.debug ) console.log(obj)
	}, findSensor: function (object, sensorType) {
		var scope =
					this;

		function findSensorinChildrenOf(obj, sensorType) {
			if ( undefined === obj.children )return false;
			for ( var b = 0; b < obj.children.length; b ++ ) {
				var checkNode = obj.children[ b ];
				if ( undefined === checkNode )continue;
				var eventName;
				if ( "undefined" !== typeof checkNode.userData.originalVrmlNode && sensorType === checkNode.userData.originalVrmlNode.node ) {
					eventName = checkNode.name;
					scope.log(sensorType + ": " + eventName);
					return eventName
				}
			}
			return false
		}

		if ( null === object ) {
			this.log("Cannot find a sensor of type " + sensorType + " in null");
			return false
		}
		var foundItInChildren;
		if ( foundItInChildren = findSensorinChildrenOf(object, sensorType) )return foundItInChildren;
		this.log("No " + sensorType + " found amongst the children of the following  node:");
		this.log(object);
		if ( "undefined" === typeof object.parent || null === object.parent ) {
			this.log("We cannot go up the tree any further");
			return false
		}
		this.log("Searching up the tree");
		return this.findSensor(object.parent, sensorType)
	}, addClickSupport: function (camera, renderer) {
		var localCamera   = camera;
		var localRenderer =
					renderer;
		projector         = new THREE.Projector;
		var line;
		var scope         = this;
		renderer.domElement.addEventListener("mousedown", function (event) {
			var x      = event.offsetX == undefined ? event.layerX : event.offsetX;
			var y      = event.offsetY == undefined ? event.layerY : event.offsetY;
			var vector = new THREE.Vector3;
			vector.set(x / localRenderer.domElement.width * 2 - 1, - (y / localRenderer.domElement.height) * 2 + 1, .5);
			vector.unproject(localCamera);
			var raycaster  = new THREE.Raycaster(localCamera.position, vector.sub(localCamera.position).normalize());
			var objects    =
						scene.children;
			var intersects = raycaster.intersectObjects(objects, true);
			if ( intersects.length ) {
				var firstIntersect = intersects[ 0 ].object;
				var touch          = scope.findSensor(firstIntersect, "TouchSensor");
				if ( false === touch )return;
				var routes       = scope.getRoutesForEvent(touch).slice(0);
				var targetRoutes = scope.findTargetRoutes(routes.pop());
				var targetRoute  = targetRoutes;
				while ( "function" === typeof targetRoute.pop ) {
					targetRoute = targetRoute.pop();
					if ( "undefined" === typeof targetRoute ) {
						scope.log("no target route found for " + touch);
						return
					}
				}
				scope.log(targetRoute);
				var originalNode = scene.getObjectByName(targetRoute.source.name).userData.originalVrmlNode;
				if ( undefined === VrmlParser.Renderer.ThreeJs.Animation[ originalNode.node ] ) {
					scope.log(originalNode.node + " is not yet supported");
					return
				}
				var interpolator = new VrmlParser.Renderer.ThreeJs.Animation[ originalNode.node ](originalNode, scope.debug);
				var name         = "surrounding_" + targetRoute.target.name;
				var target       = scene.getObjectByName(name);
				var finish       = function () {
					scope.removeAnimation(touch)
				};
				var callback     =
							interpolator.getCallback(target, finish);
				scope.addAnimation(touch, callback)
			}
		}, false)
	}
};
VrmlParser.Renderer.ThreeJs[ "VrmlNode" ]                               = VrmlParser.Renderer.ThreeJs.VrmlNode || {};
VrmlParser.Renderer.ThreeJs.Animation[ "OrientationInterpolator" ]      = function (originalNode, debug) {
	this.key      = originalNode.key;
	this.keyValue = originalNode.keyValue;
	this.debug    = debug ? true : false;
	this.index    = 1;
	this.finish   = null;
	this.target   = null;
	this.tweenObj = null
};
VrmlParser.Renderer.ThreeJs.Animation.OrientationInterpolator.prototype = {
	log: function (obj) {
		if ( this.debug ) console.log(obj)
	}, complete: function () {
		this.index ++;
		if ( this.index >= this.keyValue.length ) {
			this.log("finish at index " + this.index);
			this.finish();
			return
		}
		this.tween()
	}, tween: function () {
		var scope      = this;
		var r          = this.keyValue[ this.index ];
		var endRadians = r.radians;
		this.log("Animating from " + this.target.rotation.y + " to " + endRadians);
		var endQuaternion = new THREE.Quaternion;
		var vector3       = new THREE.Vector3(r.x, r.y,
			r.z);
		endQuaternion.setFromAxisAngle(vector3, endRadians);
		this.tweenObj = (new TWEEN.Tween(this.target.quaternion)).to(endQuaternion).start(+ new Date).onComplete(function () {
			scope.complete()
		})
	}, getCallback: function (target, finish) {
		var scope   = this;
		this.target = target;
		this.finish = finish;
		this.tween();
		var callback = function (delta) {
			scope.tweenObj.update(+ new Date)
		};
		return callback
	}
};
VrmlParser.Renderer.ThreeJs.Animation[ "PositionInterpolator" ]         = function (originalNode, debug) {
	this.key      = originalNode.key;
	this.keyValue = originalNode.keyValue;
	this.debug    = debug ? true : false
};
VrmlParser.Renderer.ThreeJs.Animation.PositionInterpolator.prototype    = {
	log: function (obj) {
		if ( this.debug ) console.log(obj)
	}, tween: function (target, endPosition) {
		return (new TWEEN.Tween(target.position)).to(endPosition).start(+ new Date)
	}, getCallback: function (target, finish) {
		var scope = this;
		var index = 1;
		var p     = this.getPosition(index);
		this.log(p);
		this.log(target);
		var tween = this.tween(target, p);
		tween.onComplete(function () {
			index ++;
			if ( index >= scope.keyValue.length ) {
				console.log("finish");
				target.position = p;
				finish();
				return
			}
			p = scope.getPosition(index);
			scope.log(p);
			tween            = scope.tween(target, p);
			tween.onComplete = this
		});
		var callback = function (delta) {
			tween.update(+ new Date)
		};
		return callback
	}, getPosition: function (index) {
		var v = this.keyValue[ index ];
		return new THREE.Vector3(v.x, v.y, v.z)
	}
};
VrmlParser.Renderer.ThreeJs.VrmlNode[ "NavigationInfo" ]                = function (originalNode, debug) {
	this.debug    = debug;
	this.node     = originalNode;
	this.node.has = function (property) {
		return "undefined" !== typeof this[ property ] && null !== this[ property ]
	};
	this.controls = null
};
VrmlParser.Renderer.ThreeJs.VrmlNode.NavigationInfo.prototype           = {
	log: function (obj) {
		if ( this.debug ) console.log(obj)
	}, parse: function (scene) {
		this.log("From NavigationInfo");
		var speed = undefined !== this.node.speed ? this.node.speed : 1;
		if ( undefined !== this.node.type )switch ( this.node.type.toLowerCase() ) {
			case "fly":
				this.log("fly!");
				controls               = new THREE.FlyControls(camera);
				controls.movementSpeed = speed;
				break
		} else {
			this.log("fly!");
			controls               = new THREE.FlyControls(camera);
			controls.movementSpeed = speed
		}
	}
};
VrmlParser.Renderer.ThreeJs.VrmlNode[ "Viewpoint" ]                     = function (originalNode, debug) {
	this.debug    = debug;
	this.node     = originalNode;
	this.node.has = function (property) {
		return "undefined" !== typeof this[ property ] && null !== this[ property ]
	}
};
VrmlParser.Renderer.ThreeJs.VrmlNode.Viewpoint.prototype                = {
	log: function (obj) {
		if ( this.debug ) console.log(obj)
	}, parse: function (scene) {
		var fov, aspect, near, far;
		fov                  = Math.round(180 / Math.PI * this.node.fieldOfView);
		aspect               = window.innerWidth / window.innerHeight;
		near                 = .01;
		far                  = 1E5;
		var camera           = new THREE.PerspectiveCamera(fov, aspect, near, far);
		var surroundingGroup = new THREE.Group;
		surroundingGroup.add(camera);
		if ( this.node.has("name") ) camera.name = this.node.name; else camera.name = this.node.description;
		surroundingGroup.getCamera =
			function () {
				return this.children[ 0 ]
			};
		var p                      = this.node.position;
		surroundingGroup.position.set(p.x, p.y, p.z);
		var o       = this.node.orientation;
		var vector3 = new THREE.Vector3(o.x, o.y, o.z);
		surroundingGroup.quaternion.setFromAxisAngle(vector3, o.radians);
		return surroundingGroup
	}
};

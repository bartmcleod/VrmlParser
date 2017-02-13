/*
 * VRML Grammar
 * ============
 *
 * VRML Grammar for pegjs, inspired by JSON grammar found here:
 * https://github.com/pegjs/pegjs/blob/master/examples/json.pegjs
 *
 * @author Bart McLeod mcleod@spaceweb.nl
 * @since 2016-05-04
 *
 * The primary goal of this grammar is to enable you to use a full VRML node tree with modern JavaScript
 * 3D libraries, such as ThreeJS.If this grammar is used with Pegjs, it will produce a node tree that
 * you can use with a converter, to produce valid ThreeJS code, or direct output in ThreeJS (or another 3D
 * JavaScript library of your choice.
 *
 * This grammar is currently experimental. Is has been built by trial and error, based on an old
 * VRML model that I used as a source for the ThreeJs VRML loader example. The ThreeJs example
 * can be found here, but it currently uses the old line by line parsing method, which has very
 * limited awareness of the node tree.
 *
 * When used with Pegjs (https://github.com/pegjs), it can be used to parse a node tree, so
 * that full awareness of the node tree will exist. This will allow to do more with VRML in JavaScript,
 * such as animations.
 *
 *
 */
{
	var nodeDefinitions = {};
	var routes = {};
}

vrml
	= '#VRML V2.0 utf8' vrml:( OrientationInterpolator / nodeDefinition / node / comment / route)*
	{
	    // before returning the root vrml object, enricht it with routes and nodeDefinitions
		vrml.nodeDefinitions = nodeDefinitions;
		vrml.routes = routes;
		return vrml;
	}

/* ----- Node ------ */
OrientationInterpolator
    = name:(def name:identifier { return name; }) "OrientationInterpolator" begin_node properties:( keyValueForOrientationInterpolator / property)+ end_node
    {
    	var n = {name:name, node: "OrientationInterpolator", isDefinition: true}
        for (var i=0; i < properties.length; i++) {
        	n[properties[i]['name']] = properties[i]['value'];
        }
        // store node for later re-use
        nodeDefinitions[name] = n;
        return n;
    }

keyValueForOrientationInterpolator
    = ws? "keyValue" begin_array quaternionArray:( q:(q:quaternion value_separator comment? {return q;})* lq:quaternion? comment? {if(lq)q.push(lq);return q;} ) end_array
    {
        return {name: "keyValue", value: quaternionArray};
    }

nodeDefinition
    = ws name:(def ws name:identifier ws { return name; }) n:node
    {
        n.name = name;
        n.isDefinition = true;
        // store node for later re-use
        nodeDefinitions[name] = n;
        return n;
    }

node
	= ws t:identifier begin_node pp:( nodeDefinition / route / property / node / comment )* end_node
	{
		var n = {node: t};

		// node properties are in pp, if pp is not an Inline node, if pp is an inline node, it should be read from the url
		for (var i=0; i < pp.length; i++) {
			var p = pp[i];

			// is p a node?
			if (undefined !== p.node) {
				//console.log(p.node + ' node found');

                // are we processing a Switch node?
                if ('Switch' === n.node) {

                    // if the switch does not already have choice, create choice here
                    if (undefined === n.choice) {
                        n.choice = [];
                    }

                    n.choice.push(p);
                } else {
                    // not a Switch, some other node, which has children.

                    // if the node does not already have children, create children here
                    if (undefined === n.children) {
                        n.children = [];
                    }

                    // @todo for an Inline node, we could use the parser (named 'parser') and fs here, to fetch the inline file and parse it
                    // on the other hand, it could be left up to the renderers what to do with the inline node.
                    /*
                    @see http://pegjs.org/documentation#grammar-syntax-and-semantics
                    The code inside the predicate can also access the parser object using the parser variable and options passed to the parser using the options variable.
                    */
                    n.children.push(p);
				}

			} else if (undefined !== p.name) {
				// p is a property
				n[p.name] = p.value;

				if (undefined !== p.comment) {
					if (undefined === n.comments) { n.comments = {}; }
					if (undefined === n.comments[p.name]) { n.comments[p.name] = []; }
					n.comments[p.name].push(p.comment);
				}
			} else if (undefined !== p.src) {
			    // p is a route
			    // move it to global scope
			    routes.push(p);
			} else {
				// p is a comment
				if (undefined === n.nodeComments) {
                    n.nodeComments = [];
                }
                n.nodeComments.push(p);
			}
		}

		return n;
	}


property
    =  orientation / coordIndex / pointArray / generic_property

orientation
	= ws? name:("orientation" / "rotation" / "scaleOrientation") q:quaternion
    { return {name: name, value: q} }

quaternion
    = ws? x:number " "+ y:number " "+ z:number " "+ radians:number ws?
    { return {x: x, y: y, z: z, radians: radians} }

coordIndex
    = "coordIndex" ws? begin_array comment? ws? face:face+ ws? comment? end_array ws?
    {
        return {name: "coordIndex", value: face};
    }



pointArray
    = name:("point" / "vector") ws? begin_array comment? ws? pointArray:point+ comment? end_array ws?
    {
        return {name: name, value: pointArray};
    }

generic_property
    = ws? name:identifier ws value:value ws comment:comment?
    {
        var p = { name:name, value:value };

        // you could change a color property here by returning r g b instead of x y z

        if (null !== comment) {
            p.comment = comment;
        }
        return p;
    }

identifier "identifier"
	= ws? o:[A-Za-z0-9_]+ ws? { return o.join(''); }

/* ----- Arrays (The VRML way) ----- */

array "array"
  = begin_array
        it:(c:comment / r:route / v:(v:value ws value_separator? { return v; } ) )*
    end_array
    {
        var a = [];
        for (var i=0; i < it.length; i++) {
            var value = it[i];

            if (undefined !== value.src) {
                // value is a route, add to global routes
                routes.push(value);
            } else if (undefined !== value.comment) {
                // value is a comment
                if (undefined === a.comments) {
                    a.comments = [];
                }

                a.comments.push(value);
            } else {
                // this is what we are looking for: a value for in our array!
                a.push(value);
            }
        }

        return a;
    }


/* ----- Values ----- */

value "value"
  = false
  / points
  / OrientationInterpolator
  / face
  / null
  / true
  / nodeDefinition
  / node
  / point
  / pointArray
  / vector
  / vector2
  / use_statement
  / array
  / number
  / identifier
  / url
  / quoted_string


false = "false" / "FALSE" { return false; }
null  = "null" / "NULL"  { return null;  }
true  = "true" / "TRUE"  { return true;  }


/* ----- Numbers ----- */

number "number"
  = minus? ((int frac?) / (frac)) exp? { return parseFloat(text()); }

decimal_point = "."
digit1_9      = [1-9]
e             = [eE]
exp           = e (minus / plus)? DIGIT+
frac          = decimal_point DIGIT*
int           = s:int_start c:int_continued {return s + c;}
int_start     = zero / digit1_9
int_continued = i:DIGIT* {return i.join('');}
minus         = "-"
plus          = "+"
zero          = "0"

/* ----- VRML Grammar ----- */

comment
	=  ws "#" text:[^\n]* ws { return { comment: text.join('').trim() }; }

route
	= ws "ROUTE" ws src:route_part ws "TO"  ws target:route_part ws
	{
	    // create an index that is the name of the source node, for later retrieval of the route by name of the source
	    var index = src.name;
	    var route = { source: src, target: target };
	    // put it in the global routes collection
	    if ('undefined' === typeof routes[index]) {
	        routes[index] = [];
	    }
	    routes[index].push(route);
	    return route;
	}

route_part
	= name:identifier "." property:identifier
	{ return { name: name, property: property }; }

begin_array     = ws? "[" ws?
end_array       = ws? "]" ws?

begin_node    = ws? "{" ws?
end_node      = ws? "}" ws?

value_separator = ws? "," ws?
name_separator  = ws

ws "whitespace"
	= ws:[ \t\n\r]*
	{ return ws.join('');}

space
	= " "

point
	= p:vector ","? ws comment? { return p; }

points
    = point / comment

vector
	= ws? x:number ws y:number ws z:number ws comment?
	{ return {x:x, y:y, z:z}; }

/* for example scale of a texture is a vec2 */
vector2
	= ws x:number ws y:number ws comment?
	{ return {x:x, y:y}; }

def
	= ws? "DEF" ws?
	{ return true; }

use_statement
	= ws use ws name:identifier
	{
	    var obj = nodeDefinitions[name];

	    if (undefined === obj) {
	        console.log(name + ' not found in nodeDefinitions');
	        return obj; // undefined obj
	    }

	    if ('function' === typeof obj.clone) {
	        return obj.clone();
	    }

	    return obj;
	}

use
	= "USE"
	{ return true; }

face
	= points:index+ "-1" ws ","? ws
	{ return points; }

index
	= i:int (( ws "," " "?) / " "+)
    { return i }

url
	= ws begin_array ws quote uri:uri quote ws end_array ws
	{ return uri; }

uri
	= i:[^"]* dot:"." ext:("jpg" / "jpeg" / "gif" / "wrl")
	{ return i + dot + ext; }

quoted_string
	= ws quote s:[^"]* quote ws
	{ return  s.join(''); }

quote
	= '"'

/* ----- Core ABNF Rules ----- */

/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT  = [0-9]

HEXDIG = [0-9a-f]i


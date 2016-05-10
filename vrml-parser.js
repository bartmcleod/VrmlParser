/**
 * @author Bart McLeod mcleod@spaceweb.nl
 * @since 2016-03-29
 */

require('pegjs-require');
var fs = require('fs');
var parser = require('./vrml.pegjs');
var vrmlText = fs.readFileSync('./test.wrl', 'utf8');

try {
  var result = parser.parse(vrmlText);
  console.log(result);
} catch (e) {
  console.log('Exception with message ' + e.message);

  if (undefined !== e.location) {
    console.log('Exception at location start: offset: ' + e.location.start.offset + ' line: ' + e.location.start.line + ' column: ' + e.location.start.column);
    console.log('Exception at location end: offset: ' + e.location.end.offset + ' line: ' + e.location.end.line + ' column: ' + e.location.end.column);
  }
}



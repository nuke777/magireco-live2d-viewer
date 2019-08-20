var fs = require('fs');
var files = fs.readdirSync('../assets/bg/static/');

var text = "var BackgroundList = [\n"

for (var i = 0; i < files.length; ++i) {
	text += '\t{\n';
	text += '\t\t"TYPE" : "STATIC",\n';
	text += '\t\t"FILE" : "'+files[i]+'",\n';
	text += '\t},\n';
}

text += "];"

fs.writeFile("BackgroundList.js", text, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
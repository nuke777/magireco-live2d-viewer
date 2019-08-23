var ld = require('./LAppDefine');
var fs = require('fs');

var text = "var CharData = [\n"
var id = 0;
console.log(ld.CHAR_MODEL);
for (var i in ld.CHAR_MODEL) {
	if (ld.CHAR_MODEL[i]%100 == 0){
		if (id != 0){
			text += '\n\t\t}\n';
			text += '\t},\n';
		}
		id = ld.CHAR_MODEL[i]/100;
		text += '\t{\n';
			text += '\t\t"NAME" : "'+i+'",\n';
			text += '\t\t"ID" : "'+id+'",\n';
			text += '\t\t"ICON" : "';
			for (var j = 1; j <=4; ++j){
				if (fs.existsSync('../assets/icon/card_'+id+''+j+'_d.png')){
					text += 'card_'+id+''+j+'_d.png';
					break;
				}
			}
			text += '",\n';
			text += '\t\t"SKIN" : {\n\t\t\t"'+i+'" : "00"';
	}
	if (Math.floor(ld.CHAR_MODEL[i]/100) == id && ld.CHAR_MODEL[i]%100 != 0){
			text += ',\n\t\t\t"'+i+'" : "'+ld.CHAR_MODEL[i].slice(-2)+'"';
	}
}
text += '\n\t\t}\n';
text += '\t},\n';
text += "];"

fs.writeFile("CharData.js", text, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
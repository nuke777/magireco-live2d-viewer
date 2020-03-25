var ld = require('./json');
var fs = require('fs');

var text = ld;
var text2 = ""
var id = 0;
//console.log(ld);
for (var i in ld) {
	fs.readdirSync("E:/Nox/Nox_share/OtherShare/Magireco/03-24-2020_JP/mini/anime").forEach(function(file){
		//console.log(ld[i].ID);
		if (file.substring(5,9) == ld[i].ID){
			if (file.slice(-11) == ".ExportJson"){
				console.log(test(file.substring(0, file.length-11)));
				if (text[i].SKIN[test(file.substring(0, file.length-11))] == null)
					text[i].SKIN[test(file.substring(0, file.length-11))] = file.substring(0, file.length-11).substring(5);
				else
					text[i].SKIN[test(file.substring(0, file.length-11)) + "_" + file.substring(9, 11)] = file.substring(0, file.length-11).substring(5);
			}
		} else {
			if (file.slice(-11) == ".ExportJson"){
				text2 += file.substring(0, file.length-11) + "\n";
			}
		}
	});
}
/*console.log(JSON.stringify(text));

fs.writeFile("json.txt", JSON.stringify(text), (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});*/

console.log(text);

fs.writeFile("json.txt", JSON.stringify(text), (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

fs.writeFile("noID.txt", text2, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});


function test(r){
	if (r.slice(-4) == "_d_r"){
		return "Doppel";
	} 
	else if (r.slice(-4) == "_m_r"){
		return "Magia";
	} 
	else
	{
		if (r.slice(-2) == "_r"){
			return "Regular";
		}
		else
		{
			return r;
		}
	}
}
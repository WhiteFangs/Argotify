$(document).ready(function(){
	
	var textnodes = nativeTreeWalker(),
	_nv;
	for (var i = 0, len = textnodes.length; i<len; i++){
		_nv = textnodes[i].nodeValue;
		textnodes[i].nodeValue = transformNodeValue(_nv);
	}

});

var removeApostrophes = true;

function verlanifySyllabes(a, word){
	if(word.length > 5 && !word.match(/'|’/g) && !word.match(/-/g) &&
		(a.nb == 2 || a.max == 3) && a.syllabes[0].length > 1 &&
		word.slice(-3).indexOf("e") == -1 && ["a", "e", "é", "i", "o", "u", "y"].indexOf(word.charAt(0)) == -1){
		if(Math.random() < 0.33){
			var first = a.syllabes.shift();
			a.syllabes.push("-" + first);
		}
	}
	return a.syllabes;
}

function wordReplacing(word){
	if(word == "un")
		return "1";
	if(word == "mais")
		return "mé";
	if(word == "cela")
		return "ça";
	if(word == "ait")
		return "é";
	if(word == "ceci")
		return "ceuci";
}

function simplifyWordWriting(word){
	word = word.replace(/ph/gi, "f");
	word = word.replace(/qu/gi, "k");
	word = word.replace(/ctio/gi, "ksio");
	word = word.replace(/ette/gi, "éte");
	word = word.replace(/elle/gi, "él");
	if(word.indexOf("vraise") == -1)
		word = word.replace(/(a|e|é|i|o|u)s(a|e|é|i|o|u)/gi, "$1z$2");
	word = word.replace(/(b|d|l|m|n|f|p|r|t)\1/gi, "$1");
	word = word.replace(/(a|e|i|o)m(b|p|m)/gi, "$1n$2");
	word = word.replace(/(a|e|é|i|o|u)c(e|é|i)/gi, "$1ss$2");
	word = word.replace(/ct(a|e|é|o|u)/gi, "kt$1");
	word = word.replace(/g(e|é|i)/gi, "j$1");
	word = word.replace(/nc(e|é|i)/gi, "ns$1");
	word = word.replace(/th/gi, "t");
	return word;
}

function simplifyWordEnding(word){
	if(word.length < 3)
		return word;
	if(word.slice(-2) == "in")
		word = word.slice(0, -2) + "1";
	if(word.slice(-2) == "er" || word.slice(-2) == "ai" || word == "des" || word == "les" || word =="ces" || word == "mes" || word == "ses")
		word = word.slice(0, -2) + "é";
	if(word.slice(-3) == "ées" || 
		(word.slice(-3) == "ent" && word.slice(-4) != "ment" && word.slice(-4) != "vent" && word != "dent"))
		word = word.slice(0, -2);
	if(word.slice(-2) == "re" || word.slice(-2) == "ze" ||  word.slice(-2) == "ée" ||
		(word != "ke" && word.slice(-2) == "ke") || (word.indexOf("sens") == -1 && word.slice(-2) == "ns") ||
		word.slice(-2) == "ts" || word.slice(-2) == "ds" || word.slice(-2) == "rs" ||  
		word.slice(-3) == "ant" || word.slice(-3) == "int" || word.slice(-2) == "es" ||
		word.slice(-2) == "ie" || word.slice(-2) == "ue" || word.slice(-2) == "us" || word.slice(-2) == "is" ||
		word.slice(-2) == "it" || word.slice(-2) == "ut"|| word.slice(-2) == "ot" || word.slice(-2) == "as" ||
		word.slice(-2) == "at")
		word = word.slice(0, -1);
	return word;
}

function simplifySyllabes(syllabes){
	syllabes.forEach(function(syllabe, i){
		syllabes[i] = simplifySyllabe(syllabe);
	});
	return syllabes;
}

function simplifySyllabe(syllabe){
	if(syllabe == "de")
		return "2";
	syllabe = syllabe.replace(/qu/gi, "k");
	syllabe = syllabe.replace(/co/gi, "ko");
	syllabe = syllabe.replace(/cu/gi, "ku");
	syllabe = syllabe.replace(/ca/gi, "ka");
	syllabe = syllabe.replace(/eux/gi, "eu");
	syllabe = syllabe.replace(/ont/gi, "on");
	syllabe = syllabe.replace(/eaux/gi, "o");
	syllabe = syllabe.replace(/eau/gi, "o");
	syllabe = syllabe.replace(/aux/gi, "o");
	syllabe = syllabe.replace(/au/gi, "o");
	syllabe = syllabe.replace(/est/gi, "é");
	syllabe = syllabe.replace(/ain/gi, "1");
	syllabe = syllabe.replace(/tôt/gi, "to");
	return syllabe;
}

function transformWord(word){
	word = word.toLowerCase();
	var tword = wordReplacing(word);
	if(tword != undefined)
		return tword;
	// simplify writings in word, not syllabes
	word = simplifyWordWriting(word);
	word = simplifyWordEnding(word);
	// work on syllabes
	var a = syllabify(word);
	// simplify syllabes
	a.syllabes = simplifySyllabes(a.syllabes);
	// verlanify syllabes
	a.syllabes = verlanifySyllabes(a, word);
	// join syllabes after simplify and verlanify
	word = a.syllabes.join("");
	return word;
}

function transformNodeValue(nv){
	var words = nv.match(/\S+/g) || [];
	words.forEach(function(word, i){
		// handle apostrophes
		if(removeApostrophes){
			word = word.replace(/'|’/g, "");
		}else{
			var parts = word.split(/'|’/g);
			if(parts.length > 1){
				var prefix = parts.shift();
				word = parts.join("");
			}
		}
		// handle punctuation
		if(word.indexOf(".") > -1 || word.indexOf(",") > -1 || word.indexOf(";") > -1 || word.indexOf("!") > -1 || word.indexOf("?") > -1){
			match = word.match(/(\.|,|;|!|\?)+/gi);
			word = word.replace(match[0], "");
			var punctuation = match[0];
		}
		// transform word
		if(word.length > 0){
			// handle capitalized
			var isCapitalized = word[0] === word[0].toUpperCase() && word !== word.toUpperCase();
			// handle caps words
			var isCaps = word === word.toUpperCase();
			var tword = transformWord(word);
			if(punctuation){
				if(Math.random() < 0.33)
					tword += " " + getRandomThugWord();
				tword += punctuation;
			}
			if(isCapitalized)
				tword = tword.charAt(0).toUpperCase() + tword.slice(1).toLowerCase();
			if(isCaps)
				tword = tword.toUpperCase();
			if(prefix)
				tword = prefix + "'" + tword;
			words[i] = tword;
		}	
	});
var tnv = words.join(" ");
	// handle trimed spaces before and after text
	if(nv.match(/^\s/g))
		tnv = " " + tnv;
	if(nv.match(/\s$/g))
		tnv += " ";
	return tnv;
}

var	thugWords = ["wesh", "wesh wesh", "gros", "sisi", "tmtc", "tkt", "ouais", "raï", "posey", "gros bail",
"dans le game", "grave", "de ouf", "sa mère", "wallah", "jte jure", "le seum", "trankil", "bouffon",
"en scred", "bogoss", "miskine", "bg", "zarma", "mdrrr", "ptdrr", "la mifa", "la fami", "fdp", "crari", "des barres",
"ma gueule", "izi", "tavu", "truc de ouf", "en loucedé", "batard", "tarba", "abusé", "lol", "chaud",
"crevard", "sérieux", "blédard", "avou", "sa fait plaiz", "trop dar", "askip", "oklm", "javou", "loool"];
function getRandomThugWord(){
	return thugWords[Math.floor(Math.random()*thugWords.length)];
}

function nativeTreeWalker() {
	var walker = document.createTreeWalker(
		document.body, 
		NodeFilter.SHOW_TEXT, 
		null, 
		false
		);

	var node;
	var textNodes = [];

	while(node = walker.nextNode()) {
		if(node.parentNode.nodeName != "SCRIPT" && node.nodeValue.trim().length > 1)
			textNodes.push(node);
	}
	return textNodes;
}
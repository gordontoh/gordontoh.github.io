let input = document.querySelector('input') 

let textarea = document.querySelector('textarea') 

// This event listener has been implemented to identify a 
// Change in the input section of the html code 
// It will be triggered when a file is chosen. 
input.addEventListener('change', () => { 
	let files = input.files; 

	if (files.length == 0) return; 

	/* If any further modifications have to be made on the 
	Extracted text. The text can be accessed using the 
	file variable. But since this is const, it is a read 
	only variable, hence immutable. To make any changes, 
	changing const to var, here and In the reader.onload 
	function would be advisible */
	const file = files[0]; 

	let reader = new FileReader(); 

	reader.onload = (e) => { 
		const file = e.target.result; 

		// This is a regular expression to identify carriage 
		// Returns and line breaks 
		const lines = file.split(/\r\n|\n/); 
		textarea.value = lines.join('\n'); 

	}; 

	reader.onerror = (e) => alert(e.target.error.name); 

	reader.readAsText(file); 
}); 

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function copy(eleid){
	const copyText = document.getElementById(eleid).textContent;
	const textArea = document.createElement('textarea');
	textArea.textContent = copyText;
	document.body.append(textArea);
	textArea.select();
  	document.execCommand("copy");
  	textArea.remove();
}

document.getElementById('input').addEventListener('keydown', function(e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    this.value = this.value.substring(0, start) +
      "\t" + this.value.substring(end);

    // put caret at right position again
    this.selectionStart =
      this.selectionEnd = start + 1;
  }
});

document.getElementById("clear").addEventListener('click', function(e) {
	document.getElementById('input').value = "";
});

document.getElementById("tojson").addEventListener('click', function(e) {
	try{
		var obj = JSON.parse(document.getElementById('input').value);
		var rand = Math.random().toString(36).substring(2);

		var output = document.createElement('pre');
		output.setAttribute('id', rand);
		output.innerHTML = syntaxHighlight(JSON.stringify(obj, undefined, 4));
		document.getElementById("output").appendChild(output);

		var button = document.createElement('input');
	    button.setAttribute('type', 'button');
	    button.setAttribute('value', 'Copy to Clipboard');
	    // button.setAttribute('class', 'clip');
		button.setAttribute('onclick', 'copy("'+rand+'")');
		// document.getElementById("output").appendChild(button);


		var filename = document.createElement('span');
		filename.innerHTML = document.getElementById('finput').files[0].name;
		filename.setAttribute('class', 'pretext');
		// document.getElementById("output").appendChild(filename);

		var precontrol = document.createElement('div');
		precontrol.setAttribute('class', 'precontrols');
		precontrol.appendChild(filename);
		precontrol.appendChild(button);
		document.getElementById('output').appendChild(precontrol);

	}catch(err) {
		alert(err);
	}
});
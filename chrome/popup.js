window.addEventListener('DOMContentLoaded', function () {
	document.getElementById("simplify").addEventListener("input", changeInput);
	document.getElementById("verlanify").addEventListener("input", changeInput);
	document.getElementById("weshify").addEventListener("input", changeInput);

	changeInput();
});

var simplifyValue, verlanifyValue, weshifyValue;

function changeInput(){
	simplifyValue = document.getElementById("simplify").value / 10,
	verlanifyValue = document.getElementById("verlanify").value / 10,
	weshifyValue = document.getElementById("weshify").value / 10;

	document.getElementById("simplifyValue").value = simplifyValue*100 + "%";
	document.getElementById("verlanifyValue").value = verlanifyValue*100 + "%";
	document.getElementById("weshifyValue").value = weshifyValue*100 + "%";
	sendAction();
}

function sendAction(){
	chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
		var message = {
			from: 'popup', 
			variables: {
				simplifyValue : simplifyValue, 
				verlanifyValue : verlanifyValue, 
				weshifyValue: weshifyValue
			}
		};
		chrome.tabs.sendMessage(tabs[0].id, message);
	});
}
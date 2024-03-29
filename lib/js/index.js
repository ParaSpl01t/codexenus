var cx = {
	editCode: (element) => {
		document.querySelectorAll('.active-editing').forEach(function (e) {
			e.classList.remove('active-editing')
		})
		element.classList.add('active-editing');
		var codeEditor = document.getElementById('codeEditor');
		codeEditor.classList.add('modal--active');
		codeEditor.querySelector('.card__content').innerText = element.innerText;
		codeEditor.dataset.codeType = element.parentNode.querySelector('.card__code-type').dataset.codeType;
	},
	saveCode: (code, modal) => {
		var codeTarget = document.querySelector('.active-editing');
		codeTarget.querySelector('pre').innerText = code;
		codeTarget.classList.remove('active-editing');
		cx.highlight();
		modal.classList.remove('modal--active');
	},
	beautify: (code, modal) => {
		var beautifier = modal.dataset.codeType + '_beautify'
		var codeEditor = document.getElementById('codeEditor');
		codeEditor.querySelector('.card__content').innerText = window[beautifier](code);
	},
	highlight: () => {
		hljs.configure({
			useBR: true
		})
		document.querySelectorAll('.highlight-block > pre').forEach((block) => {
			hljs.highlightBlock(block);
		});
	},
	setCodeType: (parent, type) => {
		parent.querySelector('.card__code-type').dataset.codeType = type;
		parent.querySelector('.code-type--active').classList.remove('code-type--active');
		parent.querySelector('.card__code-type>img[alt="'+type+'"]').classList.add('code-type--active');
		parent.querySelector('.highlight-block>pre').className = '';
		parent.querySelector('.highlight-block>pre').classList.add('hljs',type);
		cx.highlight();
	},
	loadJson: (file, callback) => {
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(rawFile.responseText);
			}
		}
		rawFile.send(null);
	}
};

document.getElementById('codeBlock').addEventListener('click', function () {
	cx.editCode(this);
}, false);

var codeTypeButtons = document.querySelectorAll('.card__code-type>.code-type');
for (var i = 0; i < codeTypeButtons.length; i++) {
	codeTypeButtons[i].addEventListener('click', function () {
		cx.setCodeType(this.closest('.card'), this.alt);
	});
}

document.getElementById('#save').addEventListener('click', function () {
	var codeEditor = document.getElementById('codeEditor');
	cx.saveCode(codeEditor.querySelector('.card__content').innerText, codeEditor);
}, false);

document.getElementById('#beautify').addEventListener('click', function () {
	var codeEditor = document.getElementById('codeEditor');
	cx.beautify(codeEditor.querySelector('.card__content').innerText, codeEditor);
}, false);

document.addEventListener('DOMContentLoaded', () => {
	cx.loadJson("./lib/data/data.json", function (text) {
		var data = JSON.parse(text);
		document.querySelector('#app').style.backgroundImage = 'linear-gradient(40deg, ' + data.list[53].colors + ')';
	});
	cx.highlight();
});
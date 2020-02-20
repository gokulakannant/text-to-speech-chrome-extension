const synth = window.speechSynthesis;
var voices = [];

function onSpeak(info) {
  var config = JSON.parse(localStorage.getItem("tts_config"));

  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
    if ( aname < bname ) return -1;
    else if ( aname == bname ) return 0;
    else return +1;
  });

  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  var utterThis = new window.SpeechSynthesisUtterance(info.selectionText);
  utterThis.onend = function(event) {
    console.log("SpeechSynthesisUtterance.onend");
  };
  utterThis.onerror = function(event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };
  for (i = 0; i < voices.length; i++) {
    if (voices[i].name == config.voice.name) {
      utterThis.voice = voices[i];
      break;
    }
  }
  utterThis.pitch = config.pitch;
  utterThis.rate = config.rate;
  synth.speak(utterThis);
}

function onError() {
  if (chrome.extension.lastError) {
    console.error("Got expected error: " + chrome.extension.lastError.message);
  }
}

chrome.contextMenus.create(
  {
    title: "Text To Speech: %s",
    contexts: ["selection"],
    onclick: onSpeak
  },
  onError
);

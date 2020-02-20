var synth = window.speechSynthesis;

var voiceSelect = document.querySelector("select");
var pitch = document.querySelector("#pitch");
var pitchValue = document.querySelector(".pitch-value");
var rate = document.querySelector("#rate");
var rateValue = document.querySelector(".rate-value");

var voices = [];
var config = {
  pitch: "1",
  rate: "1",
  voice: {
    name: "Google UK English Female",
    lang: "en-GB"
  }
};

if (localStorage.getItem("tts_config")) {
  config = JSON.parse(localStorage.getItem("tts_config"));
} else {
  localStorage.setItem("tts_config", JSON.stringify(config));
}

function populateVoiceList() {
  voices = synth.getVoices().sort(function(a, b) {
    const aname = a.name.toUpperCase(),
      bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });
  voiceSelect.innerHTML = "";
  for (i = 0; i < voices.length; i++) {
    var option = document.createElement("option");
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    if (config.voice.name == voices[i].name) {
      option.selected = true;
    }
    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  var selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

document.getElementById("reset").onclick = e => {
  synth.cancel();
  localStorage.removeItem("tts_config");
  window.location.reload();
};

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
  config.pitch = pitch.value;
  localStorage.setItem("tts_config", JSON.stringify(config));
};

rate.onchange = function() {
  rateValue.textContent = rate.value;
  config.rate = rate.value;
  localStorage.setItem("tts_config", JSON.stringify(config));
};

voiceSelect.onchange = function() {
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      config.voice.name = voices[i].name;
      config.voice.lang = voices[i].lang;
      break;
    }
  }
  localStorage.setItem("tts_config", JSON.stringify(config));
};

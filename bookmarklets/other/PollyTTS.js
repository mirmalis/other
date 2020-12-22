javascript:((function(){
  var textSelector = "dd,div,p,ul,h1,h2,h3,h4,#text";
  var defaultVoice = "Matthew";
  var defaultVolume = "0.5";
  var css = 
`.injected-visible { font: 400 13.3333px Arial !important; margin:0px 0px !important; padding:0px 0px !important; border: 1px solid black !important; height: 18px; font-size: 18px; color: black !important; background: #fff; z-index:999999999 !important; position:fixed; top:0px; }
.speed-controller {width:50px}
.volume-controller {left:50px; width:50px}
.voice-controller {left:100px;width:100px}
`;
  var defaultSpeed = 1.75;
  if (typeof injected === 'undefined' || injected === null || !injected){
    injected = true;
    cssElement=document.createElement('style');
    cssElement.innerHTML=css;
    cssElement.rel="stylesheet";
    cssElement.className="injected";
    cssElement.type="text/css";
    document.body.appendChild(cssElement);
    awsScript=document.createElement('script');
    awsScript.type='text/javascript';
    awsScript.src='https://sdk.amazonaws.com/js/aws-sdk-2.410.0.min.js';
    awsScript.className='injected';
    document.body.appendChild(awsScript);
    
    speedInput=document.createElement('input');
    speedInput.type="number";
    speedInput.className='injected injected-visible speed-controller';
    speedInput.value=defaultSpeed;
    speedInput.min='0.25';
    speedInput.max='10';
    speedInput.step='0.75';
    document.body.appendChild(speedInput);

    volumeInput=document.createElement('input');
    volumeInput.type="number";
    volumeInput.className='injected injected-visible volume-controller';
    volumeInput.value=defaultVolume;
    volumeInput.min='0';
    volumeInput.max='1';
    volumeInput.step='0.1';
    document.body.appendChild(volumeInput);

    selectInput=document.createElement('select');
    selectInput.className='injected injected-visible voice-controller';
      ["Ivy", "Joanna", "Kendra", "Kimberly", "Salli", "Joey", "Justin", "Matthew"].forEach(item => {
        var option = document.createElement("option");
        option.value=item;
        option.innerHTML=item;
        if (item === defaultVoice) option.selected = true;
        selectInput.add(option);
      });
    document.body.appendChild(selectInput);


    console.log('Adding injections');
    var bods = document.querySelectorAll(textSelector);
    bods.forEach(
      bod => {
        bod.onclick = (asd) => {
          speakText(asd.srcElement.innerText.replace(/https?:\/\/[^\s]+/g, "link").replace("¶", "").replace("🔗", ""));
          asd.stopPropagation();
        };
      }
    );
    speakText = function(text){
      AWS.config.region="eu-west-1";
      AWS.config.credentials = new AWS.Credentials('AWS KEY VALUES', 'FOR POLLY SERVICE');
      console.log("Playing \"" + text + "\"");
      var speechParams = {
        OutputFormat: "mp3",
        SampleRate: "16000",
        Text: text,
        TextType: "text",
        VoiceId: document.querySelector(".voice-controller").value
      };
      var polly = new AWS.Polly({apiVersion: '2016-06-10'});
      var signer = new AWS.Polly.Presigner(speechParams, polly);
      signer.getSynthesizeSpeechUrl(speechParams, function(error, url) {
        if (error) {
          console.log(error);
        } else {
          audioObject = new Audio(url);
          audioObject.volume = Number(document.querySelector(".volume-controller").value);
          audioObject.playbackRate = Number(document.querySelector(".speed-controller").value);
          audioObject.play();
        }
      });
    }
  } else {
    document.querySelectorAll('.injected').forEach(item => document.body.removeChild(item));
    injected = null;
    speakText = null;
    var bods = document.querySelectorAll(textSelector);
    bods.forEach(
      bod => {
        bod.onclick = null;
      }
    );
  }
})()
)

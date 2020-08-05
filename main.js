var SpeechRecognition=window.webkitSpeechRecognition;
var firebaseConfig = {
    apiKey: "AIzaSyB5wq4pKKaVD3-KIPDtGfUXovq7HnDXRMw",
    authDomain: "thundercellpublicselfies.firebaseapp.com",
    databaseURL: "https://thundercellpublicselfies.firebaseio.com",
    projectId: "thundercellpublicselfies",
    storageBucket: "thundercellpublicselfies.appspot.com",
    messagingSenderId: "540281536298",
    appId: "1:540281536298:web:c4a810cf97e3a302fda853",
    measurementId: "G-WGYR2EK0KL"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

function public(){
   window.location="public.html";
}

var x=document.getElementById("quality");
var image=new Image();
var recognition=new SpeechRecognition();
var content;
function startTake(){
    document.getElementById("takeInput").innerHTML="";
    recognition.start();
}
recognition.onresult=function run(event){
    console.log(event);
    content=event.results[0][0].transcript;
    document.getElementById("takeInput").innerHTML=content;
    speak();
}
var speech;
function picture_transmission(phot, nam){
    firebase.database().ref("/").child(nam).update(
        {
            photo:phot,
            name:nam
        }
    )
}
function speak(){
     speech=window.speechSynthesis;
     speakData=document.getElementById("takeInput").value;
     if(speakData=="take my selfie" || speakData=="cheese" || speakData=="smile" || speakData=="victory"){
         speakData="taking your selfie in 5 seconds";
     Webcam.attach("#cam");
     window.setTimeout(function(){
         take_snippet();
         save();
     },
         5000
     );
    }

     utterThis= new SpeechSynthesisUtterance(speakData);
     speech.speak(utterThis);
}
Webcam.set({
    width:400,
    height:300,
    image_format:x.value,
    tiff_quality:100,
    raw_quality:100,
    png_quality:100,
    jpeg_quality:100,
    psd_quality:100
});
function take_snippet(){

Webcam.snap( function(data_uri) {
    // display results in page
    document.getElementById('result').innerHTML = 
    '<img id="Thundersell"src="'+data_uri+'"/>';
  } );
}
function save(){
    image.src=document.getElementById("Thundersell").src;
    document.getElementById("link").href=image.src;
    b=prompt("What name should we save your photo as? Avoid \".\"")
    document.getElementById("link").download=b+"."+x.value;
    document.getElementById("link").click();
    console.log("image.src");
    x=0;
    g=prompt("Do you want to publicise this photo? Ans in yes or no").toUpperCase();
    if(g=="YES"){
        picture_transmission(image.src, b);
    }
}

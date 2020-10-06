var SpeechRecognition=window.webkitSpeechRecognition;
var canvas=document.getElementById("uploaded_result");
var ctx=canvas.getContext("2d");
var speech=window.SpeechSynthesis;
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
 var emotions=['Sad Face', 'Happy Face', 'Normal Face', 'Surprised Face', 'Angry Face'];
 var emojis=['&#128532; Feelin\' Sad','&#128522; Feelin\' Happy', '&#128528; Feelin\' Normal?', '&#128562; Feelin\' Surprised?', '&#128545; Ya\' Angry?'];
function public(){
   window.location="public.html";
}
var classifier=ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/EbIXLlbpT/model.json', function(){return 0;})
function emotion_identify(imager){
    check=imager;
    classifier.classify(check, doResult)
}
function doResult(error, results){
    console.log(results); 
 if(error){
     console.error(error);
 }
 else{
     myEmoji=results[0].label;
     myAccuracy=Number(results[0].confidence);
     myPercentage=String((myAccuracy*100).toFixed(2))+"%";
     hex=emotions.indexOf(myEmoji);
     final_display=emojis[hex];
     console.log(final_display);
     document.getElementById('express').innerHTML='<h2>'+final_display+"We are: "+String(myPercentage)+" sure"+'</h2>';
     emotionSpeaker(myEmoji);
 }
};
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
function picture_transmission(phot, nam){
    firebase.database().ref("/").push(
        {
            photo:phot,
            name:nam,
            likes:0,
            laughs:0
        }
    );
}
function take_d_photo(){
    speakData="taking your selfie in 5 seconds";
    Webcam.attach("#cam");
    window.setTimeout(function(){
        take_snippet();
        save();
    },
        5000
    );
    document.getElementById("takeInput").value=speakData;
    speak();
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
function emotionSpeaker(emote){
speech=window.speechSynthesis;
speakData=emote;
utterThis=new SpeechSynthesisUtterance(speakData);
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
    console.log(emotion_identify(image));
    document.getElementById("link").href=image.src;
    b=window.prompt("What name should we save your photo as?");
    document.getElementById("link").download=b+"."+x.value;
    document.getElementById("link").click();
    console.log("image.src");
    x=0;
    g=prompt("Do you want to publicise this photo? Ans in yes or no").toUpperCase();
    if(g=="YES"){
        picture_transmission(image.src, b);
    }
}
var pubUpLoad='';
var my_photo_image=new Image();
 function loadFile(event) {
    console.log(event);
	var image = document.getElementById('Thundersell');
    image.src = URL.createObjectURL(event.target.files[0]);
    console.log(image.src);
    image.onload=function(){
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        console.log(image);
        my_photo=canvas.toDataURL();
        console.log(my_photo);
        console.log(canvas);
        pubUpLoad=window.prompt("Do you want to publicise this to the public gallery?").toUpperCase();
        name_var=window.prompt('What Name do you want to publicise this as?');
        if(pubUpLoad=='YES'){
            picture_transmission(my_photo, name_var);
        }
    }
};
var MostLiked=0;
function getData(){
    firebase.database().ref("/").on('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          childKey=childSnapshot.key;
          message_data=childSnapshot.val();
         if(message_data['likes']>MostLiked){
             MostLiked=message_data['likes'];
             document.getElementById('thunderPhoto').src=message_data['photo'];
             console.log(message_data['photo']);
         }
        });
    });
}
getData();

// Comenzamos firebase
var config = {
            apiKey: "AIzaSyAnSGZEuHa8oveFux42gFZdIAu-l2moEyA",
            authDomain: "greenpub-2db97.firebaseapp.com",
            databaseURL: "https://greenpub-2db97.firebaseio.com",
            projectId: "greenpub-2db97",
            storageBucket: "greenpub-2db97.appspot.com",
            messagingSenderId: "287867891695"
    };
firebase.initializeApp(config);

var firebaseRef = firebase.database().ref();
var firebaseAuth = firebase.auth();
var user = firebase.auth().currentUser;
var selectedFile;
var ref

//--------------------ACTUALIZAR EL PERFIL DE USUARIO --------------------
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	var db = firebase.database();
	ref = db.ref("Users");

	var email = user.email;
	var dispatch, payment, name, balance, key, my_code;
	//Update_History_Table(ref);
	//ACTUALIZAR INFORMACION RESPECTO AL PERFIL
	ref.orderByChild('email').equalTo(email).on("child_added", function(snapshot) {
		 key = snapshot.key;
		 ref = db.ref("Users/" + key);

		 balance = snapshot.val().balance;
		 name = snapshot.val().name;
		 payment = snapshot.val().payment.payment_method;
		 dispatch = snapshot.val().payment.dispatch_method;
		 my_code = snapshot.val().refer_code;

		 document.getElementById("balance").innerHTML = balance;
		 document.getElementById("Card_UserName").innerHTML = name;
		 document.getElementById("Actual_dispatch_method").innerHTML = dispatch;
		 document.getElementById("Actual_payment_method").innerHTML = payment;
		 document.getElementById("My_code").innerHTML = my_code;
		 Update_History_Table(ref);
	});
	
	
  } else {
    alert("nadie ha iniciado seccion");
		setTimeout(function(){
        window.location.href="index.html";
    }, 3000);
  }
});



//--------------------FUNCION PARA LAS PESTAÑAS DEL PERFIL --------------------
(function ($) {
    'use strict';
	$(document).ready(function() {
	$(".btn-pref .btn").click(function () {
	    $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
	    // $(".tab").addClass("active"); // instead of this do the below 
	    $(this).removeClass("btn-default").addClass("btn-primary");   
	});
	});
});



// --------------------FUNCION PARA ACTUALIZAR LA TABLA DE REFERIDOS --------------------
function Update_History_Table(ref)
{
	var table = '<tr>' + ' <th>Nombre</th>' + ' <th>Pago</th>' + ' <th>Nivel</th>' + ' </tr>';
	var rows = 1;
	var cols = 3;
	var name = [" ", " "];
	var nivel = [" ", " "];
	var pago = [" ", " "];
	var pagare = [" ", " "];
	var Look_For_email = [" ", " "];

	//ACA TOCA HACER UN QUERING DE LOS USUARIOS QUE TENGO REFERIDOS
	var Childs_Ref = ref.child("childs");
	for(var r = 0; r < rows; r++)
	{
		Childs_Ref.orderByChild("nombre").on("child_added", function(snapshot){
			name.push(snapshot.val().nombre);
			nivel.push(snapshot.val().nivel);
			Look_For_email.push(snapshot.val().email);

				
		});
		var i = 2;
		while(i < Look_For_email.length){
			firebase.database().ref("Users").orderByChild('email').equalTo(Look_For_email[i]).on("child_added", function(snapshot) {
						pagare.push(snapshot.val().payment_history.pago.payment);
						console.log(pagare);						
			});
			i++;
		}


		setTimeout(function(){
            var j = 2;
			while(j < name.length){
				table += '<tr>';
					table += '<td>' + name[j] + '</td>';
					table += '<td>'+ pagare[j] +'</td>';
					table += '<td>' + nivel[j] + '</td>';
				table += '</tr>';
				j++;
			}
			document.getElementById("refer-list").innerHTML = '<table>' + table + '</table>';
			console.log(table);
        }, 1000);
	
		
	}	
}


// --------------------FUNCION PARA CARGAR LA FOTO A LA BASE DE DATOS --------------------

$("#file").on("change", function(event){
	selectedFile = event.target.files[0];
});

function CargarFoto(){
	var fileName = selectedFile.name;

	var storageRef = firebase.storage().ref('/Publicidad/' + fileName);
	var uploadTask = storageRef.put(selectedFile);


	uploadTask.on('state_changed', function(snapshot){
  	  // Observe state change events such as progress, pause, and resume
  	  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	 /* var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	  console.log('Upload is ' + progress + '% done');
	  switch (snapshot.state) {
	    case firebase.storage.TaskState.PAUSED: // or 'paused'
	      console.log('Upload is paused');
	      break;
	    case firebase.storage.TaskState.RUNNING: // or 'running'
	      console.log('Upload is running');
	      break;
	    }*/
	}, function(error) {
  		window.alert("Error al subir la imagen, intenta de nuevo");
	}, function() {
  		var downloadURL = uploadTask.snapshot.downloadURL;
  		var AdvertisingRef = ref.child("advertising");
  		AdvertisingRef.push({
  			image: downloadURL,
  			text: $("#ImageText").val()
  		});
   		console.log(downloadURL);
	});
}


// -------------------- FUNCION PARA LA PREVIEW DE LA FOTO --------------------

function PreviewPhoto(input){
	if(input.files && input.files[0]){
		var reader = new FileReader();
		reader.onload = function (e){
			$('#preview img').attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

$(document).on('change', 'input[type="file"]',function(){
	PreviewPhoto(this);
})
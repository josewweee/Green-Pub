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

function BtnLogin(){

	/*if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }*/

	var email = document.getElementById("correo").value;
	var password = document.getElementById("contraseña").value;

	 if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }

	firebaseAuth.signInWithEmailAndPassword(email, password).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;

	  //MANEJO DE ERRORES
	  if (errorCode === 'auth/wrong-password') {
            alert('Contraseña equivocada.');
            return;
          } else if (errorCode === 'auth/user-not-found'){
            alert('Usuario no encontrado.');
            return;

      	  } else if(errorCode === 'auth/invalid-email'){
      	  	alert('Email invalido.');
      	  	return;

      	  } else if(errorCode === 'auth/user-disabled'){
      	  	alert('Usuario bloqueado.');
      	  	return;

      	  }else{
      	  	alert(errorMessage);
      	  	return;
      	  }
	});
	

	ChangeView();
}

function ChangeView(){
	var user = firebase.auth().currentUser;
	if (user) {
	  alert("seccion iniciada");
	  setTimeout(function(){
                window.location.href="Perfil.html"; // The URL that will be redirected too.
            }, 3000);
	} else {
	  alert("nadie ha iniciado seccion");
	}
}
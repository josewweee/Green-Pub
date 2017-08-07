
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
var refe = firebaseRef.child("Users");

//Boton de registar usuario
function submitRegister() {

	var email = document.getElementById('correo').value;
	var password = document.getElementById("contraseña").value;
	var name = document.getElementById("nombre").value;
	var last_name = document.getElementById("apellido").value;
	var Rpassword = document.getElementById("Rcontraseña").value;
	var referCode = document.getElementById("codigoRef").value;
	var father;
	var IsOkRegister = 0;
	//FALTA AGREGAR EL REFERIDO POR DEFAULT QUE SE REFIERE DIRECTO A MI
	if(referCode.length < 3){
		referCode = "MORE_MONEY_BITCHES";
	}else{
		refe.orderByChild('refer_code').equalTo(referCode).on("child_added", function(snapshot)
		{
			father = snapshot.val().email;
			var address = "Users/" + snapshot.key + "/childs";
			var ref = firebaseRef.child("Users/" + snapshot.key + '/childs');
			ref.push({
				email: email,
				nivel: "1", 	 
				nombre: name
			});
		});
	}

	if(password == Rpassword){
		if (email.length < 4) {
          alert('Entra un email valido.');
          IsOkRegister++;
          return;
        }
        if (password.length < 6) {
          alert('Entra una contraseña mas larga.');
          IsOkRegister++;
          return;
        }
	}else{
		alert("Asegurate de haber escrito bien la contraseña las 2 veces");
		IsOkRegister++;
		return;
	}

	firebaseAuth.createUserWithEmailAndPassword(email, password).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;

	  if (errorCode === 'auth/wrong-password') {
            alert('Contraseña equivocada.');
            IsOkRegister++;
            return;
          } else {
            alert(errorMessage);
            IsOkRegister++;
            return;
          }
	});
	var my_code = Math.floor((Math.random() * 10000) + 1);

	setTimeout(function(){
		if(IsOkRegister == 0){
			AddUser_info(email, password, name, last_name, referCode, my_code);
		}
		ChangeView();
	}, 2000);

	
}	

function AddUser_info(email, password, name, last_name, referCode, my_code){
	var ref = firebaseRef.child("Users");
	//ACA DEBEMOS HACER LA BUSQEUDA DEL PADRE DADO EL REFERcODE
	ref.push({
		email: email,
		password: password,
		name: name,
		last_name: last_name,
		father: referCode,
		grandfather: "NO SE COMO AGREGAR ESTO",
		balance: "0",
		childs: 0,
		advertising: {image: ("../images/Perfil/default_image.png"), text: "NULL"},
		payment: {payment_method: "NULL", dispatch_method: "NULL"},
		payment_history: {pago:{date: "NULL", payment: "NULL"}},
		refer_code: my_code
	});
}

function ChangeView(){
	var user = firebase.auth().currentUser;
	if (user) {
	  console.log("seccion iniciada");
	  //MOVER LA FUNCION ADDUSER_INFO() ACA
	  setTimeout(function(){
                window.location.href="Perfil.html";
            }, 3000);
	} else {
	  alert("nadie ha iniciado seccion");
	  return;
	}
}

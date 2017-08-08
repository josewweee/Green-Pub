// -------------------- ABRIENDO CONEXION CON FIREBASE--------------------
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





// -------------------- FUNCION PARA MOSTRAR LA PAGINA 1 DE IMAGENES Y HACER EL QUERING--------------------

		 var ImagesRef = firebase.database().ref("Users");
         var storageRef = firebase.storage().ref();
         var spaceRef = storageRef.child('Publicidad');
         var Imagenes;
         var imagenes_Url = [" ", " "];
         var imagenes_Text = [" ", " "];

         //VARIABLES PARA LA PAGINACION
         var pagina_actual = 1;
    	 var registros_por_pagina = 3;
    	 var total_registros = 0;
    	 var paginas = '<ul>' + '<li><a href="#" onclick="paginaAnterior()">&lsaquo;</a></li>';

         ImagesRef.orderByChild("advertising").on("child_added", function(snapshot){
			imagenes_Url.push(snapshot.val().advertising.image);
			imagenes_Text.push(snapshot.val().advertising.text);
			total_registros++;
		});

         setTimeout(function(){
            var j = 2;
			while(j < registros_por_pagina+2){
				
				Imagenes += '<div class="floated_img">';
				Imagenes += '<img height="200" width="200" src="' + imagenes_Url[j] + '" onclick="openNav('+"'"+imagenes_Url[j]+"'"+','+"'"+imagenes_Text[j]+"'"+')">';
				Imagenes += '</div>';
				j++;
			}
			document.getElementById("Imagenes_publicidad").innerHTML = Imagenes;

			var k = 1;
		    while(k < total_registros/registros_por_pagina){
		      paginas += '<li><a href="#" onclick="cambiar_pagina(' + k + ')">' + k + '</a></li>';
		      k++;
		    }
		    paginas += ' <li><a href="#">...</a></li>';
		    paginas += '<li><a href="#" onclick="paginaSiguiente()">&rsaquo;</a></li>';
		    paginas += '</ul>'
		    document.getElementById("paginas").innerHTML = paginas;


        }, 3000);



function openNav(imagen, texto) {
	var overlay_content = '<img src="'+imagen+'">';
	overlay_content += '<p style="font-size: large;">'+ texto + '</p>';
    document.getElementById("myNav").style.width = "100%";
    document.getElementById("Ov-content").innerHTML = overlay_content;
}


function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}






// -------------------- FUNCION PARA CERRAR SECCION --------------------

function LogOut(){
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		windows.alert("seccion cerrada correctamente");
		window.location.href="index.html";
	}, function(error) {
    	// An error happened.
    	windows.alert("Un error ha sucedido, por favor comuniquese con lancha para mas informacion");
	});
}







// -------------------- FUNCION PARA MANEJAR LA PAGINACION--------------------

function paginaAnterior(){
  if (pagina_actual > 1) {
        pagina_actual--;
        cambiar_pagina(pagina_actual);
    }
}

function paginaSiguiente(){
   if (pagina_actual < numPags()) {
        pagina_actual++;
        cambiar_pagina(pagina_actual);
    }
}

function numPags()
{
    return Math.ceil(total_registros / registros_por_pagina);
}

function cambiar_pagina(pagina_actual){
	  var Imagenes = "";
	  var Texto_a_Mandar;
      var j = (pagina_actual-1) * registros_por_pagina + 2;
      while(j < pagina_actual * registros_por_pagina + 2){
      	if(imagenes_Url[j] != null){
      		Texto_a_Mandar = imagenes_Text[j];
      		//ESOS .REPLACE TRANSFORMAN LOS ESPACIOS Y LOS ''  PARA QUE JS LOS PUEDE LEER EN EL PASO DE PARAMETROS
      		Texto_a_Mandar = Texto_a_Mandar.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      		Texto_a_Mandar = Texto_a_Mandar.replace(/'/g, "\\'");
	     	Imagenes += '<div class="floated_img">';
			Imagenes += '<img height="200" width="200" src="' + imagenes_Url[j] + '" onclick="openNav('+"'"+imagenes_Url[j]+"'"+','+"'"+Texto_a_Mandar+"'"+')">';
			Imagenes += '</div>';
		}else{
			j = pagina_actual * registros_por_pagina + 3;
		}
        j++;
      }
      document.getElementById("Imagenes_publicidad").innerHTML = Imagenes;
}

function Trip(){
	// its time to trip
	window.location.href="index.html";
}

function Trip_Menu(){
	// triping back to home
	window.location.href="index.html";
}
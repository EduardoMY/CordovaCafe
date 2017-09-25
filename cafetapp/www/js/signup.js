var app = {
    // Application Constructor
    initialize: function() {
        //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	if(firebase.auth().currentUser)
	    location='defaultView.html';
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
	id;
    },
};

app.initialize();

document.getElementById('reg').addEventListener('click', authNow, false);

function authNow() {
    var name = document.getElementById('name').value;
    var tel = document.getElementById('telephone').value;
    var email = document.getElementById('email').value;
    var pass = document.getElementById('pass').value;
    var passCopy = document.getElementById('passCopy').value;
    
    if(checkDataIntegrity(name, tel, email, pass, passCopy)){
	//createUse
	firebase.auth().createUserWithEmailAndPassword(email, pass).
	    then(function(c){
		console.log(firebase.auth().currentUser);
		var db = firebase.database();
		db.ref('users/' + firebase.auth().currentUser.uid).set({
		    name: name,
		    email: email,
		    telephone: tel,
		    orders: {}
		});
		window.location='defaultView.html';
	    }).
	    catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorMessage);
	    });
    }
}

function checkDataIntegrity(name, telephone, email, pass, passCopy){
    if(!pass || pass.length<6){
	window.alert('Cuida el password');
	return false;
    }
    else if(!telephone || telephone.length!=10 || !name || !pass || !passCopy || pass!==passCopy){
	window.alert('Nooo');
	return false;
    }
    return true;
}



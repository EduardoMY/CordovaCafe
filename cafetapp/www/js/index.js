var app = {
    // Application Constructor
    userType: '',
    page: 0,
    initialize: function() {
	this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
	document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function(id) {
	this.receivedEvent('deviceready');
	this.initFirebase();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
	this.makeTransition(app.page);
    },
    manageUsers: function(){
	var isUserLoggedIn = function(){return firebase && firebase.apps.length!==0 && firebase.auth() && firebase.auth().currentUser;};
	var destinationPath = function(){return currentPage ==='login' || currentPage ==='signup' ? 'defaultView.html' : 'login.html'; };
	
	if(isUserLoggedIn())
	    location = destinationPath();
	/*
	  else
	  firebase.auth().onAuthStateChanged(function(user) {
	  if (user) 
	  location = destinationPath();
	  });
	*/
    },
    authNow: function(){
	alert('authNow');
	var email=document.getElementById('email').value;
	var pass=document.getElementById('pass').value;
	//Log In User
	firebase.auth().signInWithEmailAndPassword(email, pass).
	    then(function(){
		alert('TodoFine');
		app.page=3;
		app.makeTransition();
	    }).
	    catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	    });
    },
    signUpNow: function(){
	var name = document.getElementById('name').value;
	var tel = document.getElementById('telephone').value;
	var email = document.getElementById('email').value;
	var pass = document.getElementById('pass').value;
	
	if(this.checkDataIntegrity(name, tel, email, pass)){
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
		    app.page=3;
		    app.makeTransition();
//		    window.location='defaultView.html';
		}).
		catch(function(error) {
		    var errorCode = error.code;
		    var errorMessage = error.message;
		    console.log(errorMessage);
		});
	}
    },
    checkDataIntegrity:function(name, telephone, email, pass){
	if(!pass || pass.length<6){
	    window.alert('Cuida el password');
	    return false;
	}
	else if(!telephone || telephone.length!=10 || !name || !pass || !passCopy){
	    window.alert('Nooo');
	    return false;
	}
	return true;
    },
    initFirebase: function(){
	var config = {
	    apiKey: "AIzaSyC5_0BKQjt_0s27yR4VpqO6xuFU29PU3AQ",
	    authDomain: "cafetapp.firebaseapp.com",
	    databaseURL: "https://cafetapp.firebaseio.com",
	    projectId: "cafetapp",
	    storageBucket: "cafetapp.appspot.com",
	    messagingSenderId: "379126400871"
	};
	firebase.initializeApp(config);
    },
    loadRestaurantsReact: function(){
	var n = React.createElement;
	ReactDOM.render(
	    n("div", {className:"col s6"},
	      n("div",{className: "card" },
		n("div",{className: "card-image waves-effect waves-block waves-light" },
		  n("img", {className: "activator", src: "../img/res.jpg" })),
		n("div",{className: "card-content" },
		  n("span",{className: "card-title activator grey-text text-darken-4" },"Card Title",
		    n("i",{className: "material-icons right" },"more_vert")),
		  n("p",null,
		    n("a",{ href: "restaurantDishes.html" },"This is a link"))),
		n("div",{className: "card-reveal" },
		  n("span",{className: "card-title grey-text text-darken-4" },"Card Title",
		    n("i",{className: "material-icons right" },"close")),
		  n("p",null,"Here is some more information about this product that is only revealed once clicked on.")))),
	    document.getElementById('restaurants-space'));
    },
    logOut: function(){
	firebase.auth().signOut().then(function() {
	    alert('wuuu');
	    location='login.html';
	}, function(error) {	    
	    console.log(error);
	});
    },
    loadDishes: function(dishes){
	var nR = React.createElement;
	var keys =  Object.keys(dishes);
	var DishesRendering = React.createClass({
	    displayName: "DishesRendering",
	    render: function () {
		return (
		    nR("url", null,
		       this.props.dishes.map(function(dishKey){
			   return nR('li', null, dishKey);
		       })
		      ));
	    }
	});
	ReactDOM.render(nR(DishesRendering, {dishes: keys}),
			document.getElementById('dishes-space'));
    },
    gimmeTheDishes: function(){
	firebase.database().ref('restaurants/').once('value').then(function(snapshot) {
	    app.loadDishes((snapshot.val() && snapshot.val().dishes) || 'Anonymous'); });
    },
    makeTransition: function(){
	if(app.page===0){ //Load Login
	    this.changeUserInterface(false);
	    $("#app-content").load("html/login.html", function(){
		$('#submit').click(app.authNow.bind(app));
		$('#secondary-button-text').html('Go to Sign Up page');
		$('#back').click(function(){
		    app.page=1;
		    app.makeTransition();
		});
	    });
	}
	else if(app.page===1){ //Load Signup
	    $("#app-content").load("html/signup.html", function(){
		$('#submit').click(app.signUpNow.bind(app));
		$('#secondary-button-text').html('Back to Login page');
		$('#back').click(function(){
		    app.page=0;
		    app.makeTransition();
		});
	    });
	}
	else if(app.page===2){ //DefaultView,,,,, Let this for a next version :)
	    alert('what you doing here');
	}
	else if(app.page===3){
	    this.changeUserInterface(true);
	    $("#app-content").load("html/defaultView.html", function(){
		app.loadDishes();
	    });
	}
    },
    changeUserInterface: function(isLoggedIn){
	if(isLoggedIn){
	    $('#app-content-buttons').css('visibility', "hidden");
	    $('#nav-mobile').css('visibility', 'visible');
	}
	else{
	    $('#app-content-buttons').css('visibility', "visible");
	    $('#nav-mobile').css('visibility', 'hidden');
	}
    }
};

app.initialize();

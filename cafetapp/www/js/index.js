var app = {
    // Application Constructor
    userType: "",
    page: 0,
    order: [],
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // "load", "deviceready", "offline", and "online".
    bindEvents: function () {
	document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
	document.addEventListener("backbutton", this.handleBack.bind(this), false);
    },
    bindRestEvents: function(){
	document.getElementById("submit").addEventListener("click", this.submit.bind(this), false);
	document.getElementById("back").addEventListener("click", this.goBack.bind(this), false);
	document.getElementById("logout").addEventListener("click", this.logOut.bind(this), false);
	document.getElementById("settings").addEventListener("click", this.logOut.bind(this), false);
    },
    // deviceready Event Handler
    //
    // The scope of "this" is the event. In order to call the "receivedEvent"
    // function, we must explicity call "app.receivedEvent(...);"
    onDeviceReady: function (id) {
	this.receivedEvent("deviceready");
	this.initFirebase();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
	setTimeout(function() {
	    $("#mainLogo").attr("src", "img/cafeteria_logo.png");
	    setTimeout(function(){
		app.makeTransition(app.page);
	    }, 2000)
	}, 1500);
    },
    setModal: function(){
	$('#choose-drink').modal({
	    dismissible: false,
	    inDuration: 300,
	    outDuration: 200,
	});
    },
    authNow: function (){
	alert("authNow");
	var email=document.getElementById("email").value;
	var pass=document.getElementById("pass").value;
	//Log In User
	firebase.auth().signInWithEmailAndPassword(email, pass).
	    then(function(){
		alert("TodoFine");
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
	var name = document.getElementById("name").value;
	var tel = document.getElementById("telephone").value;
	var email = document.getElementById("email").value;
	var pass = document.getElementById("pass").value;
	
	if(this.checkDataIntegrity(name, tel, email, pass)){
	    //createUse
	    firebase.auth().createUserWithEmailAndPassword(email, pass).
		then(function(c){
		    console.log(firebase.auth().currentUser);
		    var db = firebase.database();
		    db.ref("users/" + firebase.auth().currentUser.uid).set({
			name: name,
			email: email,
			telephone: tel,
			orders: []
		    });
		    app.page=3;
		    app.makeTransition();
		}).
		catch(function(error) {
		    var errorCode = error.code;
		    var errorMessage = error.message;
		    alert(errorMessage);
		});
	}
    },
    checkDataIntegrity:function(name, telephone, email, pass){
	if(!pass || pass.length<6){
	    window.alert("Cuida el password");
	    return false;
	}
	else if(!telephone || telephone.length!=10 || !name || !pass || !passCopy){
	    window.alert("Nooo");
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
	    document.getElementById("restaurants-space"));
    },
    logOut: function(){
	firebase.auth().signOut().then(function() {
	    alert("wuuu");
	    app.page=0;
	    app.makeTransition();  
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
			   return nR("li", null, dishKey);
		       })
		      ));
	    }
	});
	ReactDOM.render(nR(DishesRendering, {dishes: keys}),
			document.getElementById("dishes-space"));
    },
    gimmeTheDishes: function(){
	firebase.database().ref("restaurants/").once("value").then(function(snapshot) {
	    app.loadDishes((snapshot.val() && snapshot.val().dishes) || "Anonymous"); });
    },
    handleBack: function(){
	alert("Yep this works");
	var pg = this.page;
	if(pg === 0){
	    throw new Error("Exit from Logout");
	}
	else if(pg === 1){
	    this.page = 0;
	    makeTransition();
	}
	else if(pg === 3){
	    throw new Error("Exit from main view");
	}
    },
    makeTransition: function(){
	if(app.page===0){ //Load Login
	    this.changeUserInterface(false);
	    this.initialViewSetup();
	}
	else if(app.page===1){ //Load Signup
	    $("#app-content").load("html/signup.html", function(){
		$("#secondary-button-text").html("De vuelta");
	    });
	}
	else if(app.page===2){ //DefaultView,,,,, Let this for a next version :)
	    alert("what you doing here");
	}
	else if(app.page===3){
	    this.changeUserInterface(true);
	    this.loadRestaurantView();
	    $("#modal-content").load("extra_components/modal.html");
	}
    },
    submit: function(){
	switch(app.page){
	case 0:
	    this.authNow.apply(this);
	    break;
	case 1:
	    this.signUpNow.apply(this);
	    break;
	default:
	    console.log("NOOO");
	}
    },
    goBack: function(){
	app.page = ( app.page === 0 ? 1 : 0)
	app.makeTransition();
    },
    changeUserInterface: function(isLoggedIn){
	if(isLoggedIn){
	    $("#app-content-buttons").css("visibility", "hidden");
	    $("#nav-mobile").css("visibility", "visible");
	}
	else{
	    $("#app-content-buttons").css("visibility", "visible");
	    $("#nav-mobile").css("visibility", "hidden");
	}
    },
    initialViewSetup: function(){
    	$("#navigation").load("extra_components/nav.html", function(){
	    $("#app-content").load("html/login.html", function(){
		$("#app-content-buttons").load("extra_components/buttons.html", function() {
		    app.bindRestEvents();
		    $("#secondary-button-text").html("Hacer cuenta");	
		});
	    });
	});	
    },
    loadRestaurantView: function(){
	$("#app-content").load("html/restaurantDishes.html", function(){
	    app.loadRestaurantImages();
	    $("#modal-content").load("extra_components/modal.html", function() {
		app.setModal();
		$("#pay").click(function(){
		    $("#secret_form").load("form/template.html", function(){
			$("#payment").submit();
		    });
		});	
	    });
	});
    },
    loadRestaurantImages: function(){
	var storage = firebase.storage();
	var logoRef = storage.ref("restaurant/cafeteria_logo.png");
	logoRef.getDownloadURL().then().then(function(url) {
	    var img = document.getElementById("logo");
	    img.src = url;
	}).catch(function(error){
	    alert(error);
	});
	    
    },
    
};

app.initialize();

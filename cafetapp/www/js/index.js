var app = {
    userType: "client",
    page: 0,
    amount: 0,
    order: [],
    dishes: {},
    telephone: "",
    name: "",
    userId: "",
    intervalId: "",
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
    setModals: function(){
	// Initial Configuration of footer modal
	$('#choose-drink').modal({
	    dismissible: false,
	    inDuration: 300,
	    outDuration: 200,
	});
	// Initial Configuration of Shopping Car
	$('#shopping-car').modal({
	    dismissible: true,
	    inDuration: 300,
	    outDuration: 200,
	});
	// Initial Configuration of Orders History
	$('#orders-history').modal({
	    dismissible: true,
	    inDuration: 300,
	    outDuration: 200,
	    complete: function(){
		clearInterval(app.intervalId);
		app.intervalId="";
	    }
	});
    },
    authNow: function (){
	var email=document.getElementById("email").value;
	var pass=document.getElementById("pass").value;
	//Log In User
	firebase.auth().signInWithEmailAndPassword(email, pass).
	    then(function(){
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
		    var db = firebase.database();
		    db.ref("users/" + firebase.auth().currentUser.uid).set({
			name: name,
			email: email,
			telephone: tel,
			type: false,
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
	else if(!telephone || telephone.length==0 || !name){
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
    logOut: function(){
	app.cleanAll();
	firebase.auth().signOut().then(function() {
	    app.page=0;
	    app.makeTransition();  
	}, function(error) {
	    console.log(error);
	});
    },
    loadDishes: function(){
	app.dishes["combo1"]=48;app.dishes["combo2"]=52;app.dishes["combo3"]=40;app.dishes["combo4"]=48;
	app.dishes["combo5"]=48;app.dishes["combo6"]=52;app.dishes["combo7"]=55;app.dishes["combo8"]=50;
	app.dishes["combo9"]=42;app.dishes["combo10"]=48;
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
	    var page3Loading = function(){
		if(app.userType==="client"){
		    app.changeUserInterface(true);
		    app.loadRestaurantView();
		    $("#modal-content").load("extra_components/modal.html");
		}
		else{ //Should be a restaurant owner or manager
		    app.changeUserInterface(true);
		    app.loadRestaurantDashboard();
		}
		$("#nav-mobile").css('display', 'inline');
	    };
	    app.definingUser(page3Loading);
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
	    app.loadDishes();
	    $("#modal-content").load("extra_components/modal.html", function() {
		$("#modal-content2").load("extra_components/modal_car.html", function() {
		    $("#modal-content3").load("extra_components/modal_orders.html", function(){
			app.setModals();
		    });
		});
	    });
	});
    },
    paymentMethod: function(){
	if(app.order.length === 0){
	    alert("No has seleccionado ningún platillo");
	    return ;
	}
	$("#secret_form").empty();
	$("#secret_form").load("extra_components/form.html", function(){
	    $("#amount").attr("value", app.amount);
	    $("#items").attr("value", app.order.join("+"));
	    $("#custom_input").attr("value", JSON.stringify({
		userId: app.userId,
		name: app.name,
		telephone: app.telephone
	    }));
	    $("#payment").submit();
	});
    },
    click: function(option){
	app.order.push(option);
	if(typeof app.dishes[option] !== 'undefined'){//Product must be 
	    app.amount += app.dishes[option];
	}
	else {
	    Materialize.toast('Su pedido estará listo en 15 min.', 3000)
	    setTimeout(function() {
		app.setShoppingCarContent();
	    }, 3200);
	}
    },
    setShoppingCarContent: function(){
	var dish = "";
	
	$("#shopping-car-products").empty();
	$("#shopping-total").empty();
	
	app.order.forEach(function(x, i){
	    if(i%2 === 0){ //item is a dish
		dish = x;
	    }
	    else{ //item is a beverage
		$("#shopping-car-products").append("<tr><td><a style='padding: 0 1rem;' class='btn red' onClick='app.deleteProduct("+((i-1)/2)+", "+app.dishes[dish]+")'><i class='material-icons'>cancel</i></a></td><td>"+dish+"</td><td>"+x+"</td><td>$"+app.dishes[dish]+"</td></tr>");
		dish="";
	    }
	});
	$("#shopping-total").append("$"+app.amount);
	$('#shopping-car').modal('open');
    },
    loadRestaurantDashboard: function(){
	var filter = function(){
	    return true;
	};
	$("#app-content").load("html/restaurantView.html", function(){
	    app.updateOrders(filter);
	});
    },
    updateOrders: function(filter){
	var ordersRef = firebase.database().ref('orders/');
	ordersRef.on('value', function(snapshot) {
	    app.loadOrders(snapshot.val(), filter);
	});
    },
    loadOrders: function(orders, filter){
	clearInterval(app.intervalId);
	app.intervalId = setInterval(function(){
	    console.log('intervall');
	    $("#orders").empty();
	    for(var key in orders){
		$("#orders").append(app.buildOrder(key, orders[key], filter));
	    }
	}, 1010);
    },
    buildOrder: function(id, orderInfo, filter){
	return filter(orderInfo.userId) ? '<div class="row"><div class="col s12 m8 offset-m2"><div class="card '+(orderInfo.active ? ('blue lighten-2') : ('grey lighten-2'))+'"><div class="card-content white-text"><span class="card-title"> Orden #'+id+'</span><p>Pedido: '+orderInfo.items+'<br />Cliente: '+orderInfo.name+'.</p><p>Contador: <span>'+app.getTime(orderInfo.time)+'</span><p></div>'+ (app.userType === 'restaurant' ? ('<div class="card-action"><a href="#" class="btn '+(orderInfo.active ? 'red lighten-3' : 'disabled')+'" onClick=app.orderDone("'+id+'")>Terminar</a></div>') : ('<span />') )+'</div></div></div>' : '<span />';
    },
    orderDone: function(id){
	var ordersRef = firebase.database().ref('orders/' + id);
	ordersRef.on('value', function(snapshot) {
	    var update = {};
	    update['/orders/'+id] = snapshot.val();
	    update['/orders/'+id].active = false;
	    firebase.database().ref().update(update);
	});
    },
    getTime: function(time){
	var d = new Date();
	var dfTime = parseInt((d.getTime() - time)/1000);
	if(dfTime >= 900)
	    return "00:00";
	var timer = 900 - dfTime;
	var min = parseInt(timer / 60);
	var seg = timer % 60;
	return (min<10 ? "0"+min : min) + ":"+(seg<10 ? "0"+seg : seg);
    },
    definingUser: function(page3Loading){ // And more
	var userId = firebase.auth().currentUser.uid;
	var userType = "client";
	return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
	    if(snapshot.val()){
		app.telephone = snapshot.val().telephone || "666";
		app.name = snapshot.val().name || "Juan Perez";
		app.userId = userId;
		app.userType = (snapshot.val().type ? "restaurant" : userType);	
	    }
	    page3Loading();
	});
    },
    cleanAll: function(){
	app.userType = "client";
	app.amount = 0;
	app.order = [];
	app.dishes = {};
	app.userId = "";
	app.telephone = "";
	app.name = "";
	clearInterval(app.intervalId);
	app.intervalId = "";
    },
    deleteProduct: function(index, price){
	var indexOrder = index * 2;
	app.order.splice(indexOrder, 2);
	app.amount = app.amount - Number(price);
	$("#shopping-table tr:eq("+(index+2)+")").remove();
	app.setShoppingCarContent();
    },
    loadOrdersUser: function(){
	var id = app.userId;
	var filter = function(id){
	    return function(userId){
		return id === userId;
	    }
	}(id);
	$('#orders-history').modal('open');
	app.updateOrders(filter);
    }
};

app.initialize();

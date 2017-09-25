//https://developer.paypal.com/developer/applications/create

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
	this.setDishes=[];
    },
    
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
    //    document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);

        // start to initialize PayPalMobile library
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
    selectFood: function(){
	alert('Se ha seleccionado la ');
    }
};

app.initialize();

console.log(firebase.auth().currentUser);
firebase.database().ref('restaurants/').once('value').then(function(snapshot) {
    app.loadDishes((snapshot.val() && snapshot.val().dishes) || 'Anonymous'); });

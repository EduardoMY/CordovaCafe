var app = {
    // Application Constructor
    initialize: function() {
        //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	if(!firebase.auth() && !firebase.auth().currentUser)
	    location='index.html';
	
	this.loadRestaurantsReact();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
	
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
	
    },
    
    loadRestaurantsReact: function(){
	var n =React.createElement;
	ReactDOM.render(
	    n('div', {className: 'col-md-6'},
	      n('a', {href: 'restaurantDishes.html'},
		n('img', {className: 'img-responsive', src: 'img/res.jpg'}))),
	    document.getElementById('restaurants-space'));
    }
    
};

app.initialize();


console.log(firebase.auth().currentUser);
firebase.database().ref('restaurants/').once('value').then(function(snapshot) {
    console.log((snapshot.val() && snapshot.val().name) || 'Anonymous'); });

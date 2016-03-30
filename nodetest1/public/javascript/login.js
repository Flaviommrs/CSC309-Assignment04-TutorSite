function facebookLogIn(){
	
	FB.login(function(response){

		if (response.authResponse) {
		    console.log('Welcome!  Fetching your information.... ');
		    FB.api('/me', function(response) {
		    	console.log(response);
		      console.log('Good to see you, ' + response.name + '.');
		      FB.api("/"+response.id, function(index){
		      	console.log(index);
		      });
		    });
	    } else {
	    	console.log('User cancelled login or did not fully authorize.');
	    }

	},{
		scope:'public_profile,email',
		retun_scopes:true
	});

}
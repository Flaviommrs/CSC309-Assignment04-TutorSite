$(document).ready(function(){

	FB.getLoginStatus(function(response){

		if(response.status == 'connected'){

			FB.api('/me', function(response){

				logForm(response);

			});

		}
	});

});

function facebookSignUp(){

	FB.getLoginStatus(function(response){

		if(response.status == 'not_authorized'){
			FB.login(function(response){

				if(response.authResponse){

					FB.api('/me?fields=email,name,location,hometown', function(data){
						console.log(data);
						signUpForm(data);
					});


				}

			},{
				scope:'public_profile,email,user_location,user_hometown',
				retun_scopes:true
			});
		}

	});

}

function facebookLogIn(){
	
	FB.login(function(response){

		if (response.authResponse) {

			if(response.status == "connected"){
				console.log(response);

			    FB.api('/me', function(data) {
			    	console.log(data);
			    	logForm(data);
			    });
			}

	    } else {
	    	console.log('User cancelled login or did not fully authorize.');
	    }

	},{
		scope:'public_profile',
		retun_scopes:true
	});

}

function logForm(response){

	var form = document.createElement('form');
	var username = document.createElement('input');

	form.method = "POST";
	form.action = "/facebookLog";

	username.value = response.name;
	username.name = "username";
	form.appendChild(username);

	document.body.appendChild(form);

	form.submit();
}

function signUpForm(data){

	var form = document.createElement('form');
	var username = document.createElement('input');
	var password = document.createElement('input');
	var email = document.createElement('input');
	var name = document.createElement('input');

	form.method = "POST";
	form.action = "/facebookSignUp";

	username.value = data.name;
	username.name = "username";
	name.value = data.name;
	name.name = "name";
	password.value =  data.id;
	password.name = "password"
	email.value = data.email;
	email.name = "email";

	form.appendChild(username);
	form.appendChild(password);
	form.appendChild(email);
	form.appendChild(name);

	document.body.appendChild(form);

	form.submit();

}
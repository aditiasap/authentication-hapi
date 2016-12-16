const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');
const Blipp = require('blipp');

const routes = require('./routes');

const server = new Hapi.Server();
server.connection({
	port: 1337
});

server.register([
	Basic,
	{
		register: Blipp,
		// To display authentication info for routes
		options: {showAuth: true}
	}
], (err) => {
	const basicConfig = {
		// Object containing validateFunc function which will perform validation of credential
		// callback should be in form of callback(error, isAuthenticated, credentials)
		// error => error while trying to valid the credentials
		// isAuthenticated => User was successfully authenticated from the given credentials
		// credentials => User information. It will accept object and be attached to request.auth.credentials, so can be used later in request life cycle such as handlers and route prerequisites.
		validateFunc: function (request, username, password, callback) {
			if (username !== 'admin' || password !== 'password')
			{
				return callback(null, false);
			}
			return callback(null, true, {username: 'admin'});
		}
	};
	
	server.auth.strategy('simple', 'basic', basicConfig);
	// Set default behavior of all routes to require 'simple' strategy authentication
	server.auth.default('simple');
	
	// Take routes configuration from ./routes
	server.route(routes);
	server.start(() => {});
});

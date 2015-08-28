
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/userController')
, http = require('http')
, path = require('path');

var app = express();
app.use(express.cookieParser());
app.use(express.session({ secret: 'SJSU10100545CMPE273', cookie: { maxAge:600000 }}));
//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());}
app.get('/', routes.index);
app.post('/signup',user.addUser);
app.post('/',user.authValidate);
app.get('/home',user.loadProfile);
app.post('/summary',user.updatesummary);
app.post('/addeducation',user.addEducation);
app.post('/updateeducation',user.updateeducation);
app.post('/education',user.getEducationById);
app.post('/updateeducation',user.updateeducation);
app.post('/addexperience',user.addExperience);
app.post('/updateexperience',user.updateexperience);
app.post('/experience',user.getExperienceById);
app.post('/addSkill',user.addSkill);
app.post('/updateSkill',user.updateSkill);
app.get('/signout', user.signout);
app.get('/connections', user.connections);
app.get('/invitations', user.invitations);
app.post('/accept',user.acceptinvitations);
app.get('/searchconnections',user.showsearch);
app.post('/search',user.searchmember);
app.post('/invite',user.sendinvitation);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Linkedin Server Listening on Port ' + app.get('port'));
});


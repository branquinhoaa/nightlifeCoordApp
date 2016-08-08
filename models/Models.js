var mongoose=require('mongoose');
var url = process.env.URL_MLAB;
var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', function(){
    console.log('There was an error connecting to the database');
});

db.once('open', function() {
    console.log('Successfully connected to database');
});

// Database
mongoose.connect(url);


// User Model

var userSchema = new Schema({
    //identificar quando o user ta logado com a rede social e quando nao está para rotear ele pro login ou computar a presença
})

// Event Model
var eventSchema = new Schema({
    //retorna os locais dos eventos retornados pela api -  nao precisa de bd
})
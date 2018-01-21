var bodyParser = require('body-parser')

var mongoose = require('mongoose')

//Connect to the database
mongoose.connect('mongodb://dbadmin:dbadmin@ds159187.mlab.com:59187/nodetodotest')

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
	item: String
})

var Todo = mongoose.model('Todo', todoSchema)


// var data = [{item: 'get milk'}, {item: 'walk dog'},{item: 'kick some coding ass'}]
var urlencodedParser = bodyParser.urlencoded({extended : false})

module.exports = function(app){
	app.get('/todo', function(request, response){
        Todo.find({}, function(err, data){
            if(err) throw err
            response.render('todo', {todos: data})        
        })
	})    

	app.post('/todo', urlencodedParser, function(request, response){
        //get data from the view and add it to mongodb
        var newTodo = Todo(request.body).save(function(err, data){
            if( err) throw err
            response.json(data)
        })
		// data.push(request.body)
		// response.json(data)
	})    
    
	app.delete('/todo/:item', function(request, response){
        // delete the requested item from mongodb
        Todo.find({item: request.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if( err) throw err
        response.json(data)
        })
	})    
}
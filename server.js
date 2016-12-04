var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }
});

function displayForm(res) {
    fs.readFile('payslip.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(data);
        res.end();
    });
}

function length(obj) {
    return Object.keys(obj).length;
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
		var employees;
		res.writeHead(200, {
            'content-type': 'text/plain'
        });
		fs.readFile("employees.json", 'utf8', function (err, data) {
			//console.log( data );
			employees = JSON.parse( data );
			//console.log( employees );
			for (i=1;i<=length (employees);i++){
				employeeId = 'employee' + i;
				if((fields.name + fields.lastname) == (employees[employeeId].name + employees[employeeId].lastname)) {
					console.log('The employee ' + fields.name + fields.lastname + ' has been already paid.');
					res.end('The employee ' + fields.name + fields.lastname + ' has been already paid.');
					return false;
				} 
			}
			
			newEmployeeId = 'employee' + i;
			employees[newEmployeeId] = {
				  "name" : fields.name,
				  "lastname" : fields.lastname,
				  "annual" : fields.annual,
				  "gross" : fields.gross,
				  "tax" : fields.tax,
				  "net" : fields.net,
				  "super" : fields.super,
				  "pay" : fields.pay,
				  "id": i
			   };
			   
			console.log( employees );
			
			fs.writeFile('employees.json', JSON.stringify(employees), function(err) {
			  if (err) throw err;
			  console.log('The employee ' + fields.name + fields.lastname + ' pay info has been saved successfully.');
			});
			
			res.end('The employee ' + fields.name + fields.lastname + ' has been paid successfully.');
		});
        
    }); 
}

server.listen(8081);
console.log("server listening on 8081");
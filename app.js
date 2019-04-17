let express=require('express')
let bodyParser=require('body-parser')
let cors=require('cors')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    require('./route/routes.js')(app,io)
    console.log('socket connected')
    socket.emit('setID', { socket: socket.id });
  });
  console.log(process.env.NODE_ENV)

app.use(cors({
    origin:['http://localhost:8081','http://localhost:8000','http://localhost:3000','http://albiziapp.reveries-project.fr','https://albiziapp.reveries-project.fr'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}
));
app.use(bodyParser({limit: '50mb'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
server.listen(8081)

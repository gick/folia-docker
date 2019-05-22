let express=require('express')
let bodyParser=require('body-parser')
let morgan=require('morgan')
let cors=require('cors')
let sse=require('./sse')
var app = express();
app.use(sse)
app.use(morgan('combined'))
app.use(cors({
    origin:['http://localhost:8081','http://localhost:7000','http://localhost:8000','http://localhost:3000','http://albiziapp.reveries-project.fr','https://albiziapp.reveries-project.fr'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}
));
app.use(bodyParser({limit: '50mb'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
require('./route/routes')(app)
app.listen(8081)

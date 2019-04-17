module.exports = function(app,io) {
    var fs = require("fs");
    var async = require("async");
    var util=require('util')
    var LineByLineReader = require("line-by-line");

    var childProcess = require("child_process");

    // normal routes ===============================================================
  
    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################
    function sendCSV(csvPath,socketID){
        var resultCSV = [];
        lr = new LineByLineReader(csvPath);
        lr.on("error", function(err) {
          //foliaInstance.resultCSV.
        });
      
        lr.on("line", function(line) {
          resultCSV.push(line);
        });
      
        lr.on("end", function() {
            io.to(socketID.socket).emit('foliaResult',resultCSV)
        })
    }
    function analysis(socketID){
        console.log("analysis")
        let base = "/tmp/";
        let leafPath = base +socketID.socket +'out.jpg';
        let colorPath = base + socketID.socket+'out.png';
        let maskPath = base + socketID.socket+"mask.png";
        let csvPath = base + socketID.socket+"out.mask.csv";
        var spw = childProcess.spawn(process.env.FOLIA_PATH, [
          leafPath,
          colorPath,
          maskPath,
          csvPath
        ],{cwd:process.env.FOLIA_CWD});
        console.log(leafPath + ' ' + colorPath+ ' ' + maskPath + ' '+ csvPath)
        //var spw = process.spawn('ping', ['-c', '5', '127.0.0.1']),
        str = "";
        spw.stdout.on("data", data => {
          str += data.toString();
          console.log(data.toString())
          console.log(socketID)
          io.to(socketID.socket).emit('foliaProgress',data.toString())
          // just so we can see the server is doing something
          // Flush out line by line.
        });
        spw.on("close",(code)=>{
            if(code==0)
            sendCSV(csvPath,socketID)
        })
      
      
    }
    app.get("/id",function(req,res){
        console.log(socket.id)
        res.send(socket.id)
    })
    app.post("/setupImages", function(req, res) {
        const writeFile = util.promisify(fs.writeFile);
        let socketID=req.body.socketID
        let base64Trace=req.body.trace.replace(/^data:image\/png;base64,/, "")
        res.send({success:true}) 
        writeFile('/tmp/'+socketID.socket+'out.png',base64Trace,'base64').then(
            ()=>{
                let base64Leaf=req.body.leaf.replace(/^data:image\/jpeg;base64,/, "") 
                writeFile('/tmp/'+socketID.socket+'out.jpg',base64Leaf,'base64').then(
                    ()=>{analysis(socketID)}
                )
            }
        )

    });
  };
  
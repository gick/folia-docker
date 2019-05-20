module.exports = function(app) {
    var fs = require("fs");
    var async = require("async");
    var util=require('util')
    var LineByLineReader = require("line-by-line");
    var childProcess = require("child_process");

    // normal routes ===============================================================
  
    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################
    function sendCSV(csvPath,res){
        var resultCSV = [];
        lr = new LineByLineReader(csvPath);
        lr.on("error", function(err) {
          //foliaInstance.resultCSV.
        });
      
        lr.on("line", function(line) {
          resultCSV.push(line);
        });
      
        lr.on("end", function() {
            res.sseSend({data:resultCSV},'result')
            res.end()
        })
    }
    function analysis(uid,res){
        console.log("analysis")
        let base = "/tmp/";
        let leafPath = base +uid +'out.jpg';
        let colorPath = base + uid+'out.png';
        let maskPath = base + uid+"mask.png";
        let csvPath = base + uid+"out.mask.csv";
        var spw = childProcess.spawn(process.env.FOLIA_PATH, [
          leafPath,
          colorPath,
          maskPath,
          csvPath
        ],{cwd:process.env.FOLIA_CWD});
        setTimeout(function(){
          spw.kill()
          res.sseSend({error:'timeout'},'result')
          res.end()
        },50000)
        console.log(leafPath + ' ' + colorPath+ ' ' + maskPath + ' '+ csvPath)
        //var spw = process.spawn('ping', ['-c', '5', '127.0.0.1']),
        str = "";
        spw.stdout.on("data", data => {
          console.log(data.toString())
          str += data.toString();
          res.sseSend({info:data.toString()},'progress')
          // just so we can see the server is doing something
          // Flush out line by line.
        });
        spw.on("close",(code)=>{
            if(code==0)
            sendCSV(csvPath,res)
        })
      
      
    }
    app.post("/api/setupImages", function(req, res) {
        console.log("start")
        const writeFile = util.promisify(fs.writeFile);
        let uid=Date.now().toString()
        let base64Trace=req.body.trace.replace(/^data:image\/png;base64,/, "")
        res.sseSetup() 
        writeFile('/tmp/'+uid+'out.png',base64Trace,'base64').then(
            ()=>{
                let base64Leaf=req.body.leaf.replace(/^data:image\/jpeg;base64,/, "") 
                writeFile('/tmp/'+uid+'out.jpg',base64Leaf,'base64').then(
                    ()=>{analysis(uid,res)}
                )
            }
        )

    });
  };
  
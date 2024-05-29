const http = require('http');
const voting = require('./services');
const url = require('url')

const server = http.createServer(function(req, res){
    if(req.method  === 'POST' && req.url === '/create'){
        let body = '';
        req.on('data', function(data){
            body += data.toString();
        });

        req.on('end', function() {
            const result = JSON.parse(body);
            const vote = {
                candidate_name: result.candidate_name,
                vote: result.vote
            
            }
            if(result.candidate_name == "" || result.vote == ""){
                res.writeHead(400, {"Content-Type": "text/plain"});
                res.end("Bad Request : All Fields required");
                return;
            }
            const response = voting.createVote(`${result.name}.json`, JSON.stringify(vote))
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(response)
        })
    }
    else if(req.method === 'GET' && req.url === '/getAllParties'){
        const files = voting.getAllParties();      
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({
            Parties: files
        }))
    }
    else if(req.method === 'GET' && req.url === '/leaderBoard'){
        const files = voting.createLeaderboard();      
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(`LeaderBoard : \r\n ${files}`)
    }
    else if(req.method === 'GET' && req.url === '/'){        
            const files = voting.getAllVotes();      
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify({
                voting: files
            }))
    }


    else if (req.method === 'GET' && req.url.includes('/getOneParty')) { 
            const {query} = url.parse(req.url, true);
            const filename = query.file_name;
            const result = voting.getOneVote(filename);
            res.end(result)
    }

    else if (req.method === 'DELETE' && req.url.includes('/delete')) {                
        const {query} = url.parse(req.url, true);
        const filename = query.file_name;
        const result = voting.deleteOneVote(filename);
        res.end(result)
    }
    else if (req.method === 'PUT' && req.url.includes('/update')) {                
        const {query} = url.parse(req.url, true);
        const filename = query.file_name;
        const result = voting.updateVote(filename);
        res.end(result)
    }
    else {
        res.statusCode = 404
        res.end('Page Not Found')
    }



});

server.listen(5000, () => {
    console.log('listening on port 5000')
})
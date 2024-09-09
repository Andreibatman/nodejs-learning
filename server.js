const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.port || 3500;
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

//custom middleware logger
app.use(logger)


app.use(cors(corsOptions));

///application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}));

app.use(express.json());

///static files like js and css
app.use('/',express.static(path.join(__dirname,'/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));

app.all('*',(req,res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error: "404 not fount"});
    }else {
        res.type('txt').send("404 not found");
    }
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');
const router = express.Router();

app.use(express.json());
app.use(cors());

//read json from json file
const getSymbolData = () => {
    const jsonData = fs.readFileSync('symbols.json');
    return JSON.parse(jsonData);
}
//write json to json file
const saveSymbolData = (json) => {
    const jsonString = JSON.stringify(json);
    fs.writeFileSync('symbols.json', jsonString);
}

//Increment id
const incrementId = () => {
    const symbols = getSymbolData();
    let latestId = 1;
    for (let i = 0; i < symbols.length; i++) {
        latestId = symbols[i].id;
    }
    return latestId += 1;
}

//parse number of type and trade
const parseNum = (data) => {
    let item = data;
    if(item.type == "Forex"){
        item.type = 1;
    }else if(item.type == "Commodity"){
        item.type = 2;
    }else if(item.type == "Index"){
        item.type = 3;
    }else if(item.type == "Test"){
        item.type = 4;
    }else if(item.type == "Stocks"){
        item.type = 5;
    }else{
        item.type = 0;
    }

    if(item.trade == "No") {
        item.trade = 0;
    }else if(item.trade == "Close Only"){
        item.trade = 1;
    }else if(item.trade == "Full"){
        item.trade = 2;
    }else{
        item.trade = 0;
    }
    return item;
}


//GET ALL Symbols
app.get('/symbols',(req, res) => {
    const symbols = getSymbolData();
    res.send(symbols);
})

//GET Symbol by id
app.get('/symbols/:sid',(req, res) => {
    const { sid } = req.params;
    const symbols = getSymbolData();
    const result = symbols.filter(element => element.id == sid);
    res.send(result);
})

//Modify Symbol by id
app.post('/symbols/change/:sid',(req, res) => {
    const { sid } = req.params;
    let symbolData= req.body;
    symbolData = parseNum(symbolData);
    console.log(symbolData);
    const symbols = getSymbolData();
    const filteredSymbol = symbols.filter(element => element.id != sid);
    filteredSymbol.push(symbolData);
    saveSymbolData(filteredSymbol);
    res.send(filteredSymbol);
});

//Add new Symbol
app.post('/symbols/add', (req, res) => {
    const newId = incrementId();
    let data = req.body;
    data = parseNum(data);
    console.log(req.body);
    data = {...data, id: newId, server_id: 3};
    console.log(data);
    const symbols = getSymbolData();
    symbols.push(data);
    saveSymbolData(symbols);
    res.send(symbols);
});

//Delete Symbol
app.post('/symbols/delete/:sid', (req, res) => {
    const { sid } = req.params;
    const symbols = getSymbolData();
    const filteredSymbol = symbols.filter(element => element.id != sid);
    saveSymbolData(filteredSymbol);
    res.send(filteredSymbol);
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(port, ()=> {
    console.log(`Node_demo server is running on port ${port}`);
});


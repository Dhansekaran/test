//importing the dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//defining the express app
const app = express();

//defining an array to work as database (temp)
/*const ads = [
	{title:'Hello world'}
];*/

const {startDatabase} = require('./database/mongo');
const {insertAd, getAds,deleteAd, updateAd} = require('./database/ads');
//adding helmet to enhance API security
app.use(helmet());

// using bodyparser to parse JSON bodies into JS objects
app.use(express.json());

//enabling CORS for all request
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//defining an endpoint to return all ads
app.get('/',async (req,res)=>{
	//res.send(ads);
	res.send(await getAds())
});

app.post('/', async (req, res) => {
  const newAd = req.body;
  await insertAd(newAd);
  res.send({ message: 'New ad inserted.' });
});

// endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  await deleteAd(req.params.id);
  res.send({ message: 'Ad removed.' });
});

// endpoint to update an ad
app.put('/:id', async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({ message: 'Ad updated.' });
});


//starting the server
/*app.listen(3001,()=>{
	console.log("listen port 3001");
});*/

startDatabase().then(async () => {
  //await insertAd({title: 'Hello, now from the in-memory database!'});

  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});

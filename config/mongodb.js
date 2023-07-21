// const mongoose=require('mongoose');

// const url = "mongodb+srv://raxitbambharoliya:raxit08@cluster0.h789rwv.mongodb.net/e__com";

// const db={
//     useNewUrlParser: true,
//     useUnifiedTopology: true 
// }
// mongoose.connect(url,db)
//     .then( () => {
//         console.log('Connected to the database ')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     })

// module.exports=db;

const mongoose = require('mongoose')

const url = `mongodb+srv://kusumakarkoorapati:Kusu503@cluster0.7pyntq7.mongodb.net/ecome`;

mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then( () => {
    console.log('Connected to database')
  })
  .catch( (err) => {
    console.error(`Error connecting to the database.`);
  })
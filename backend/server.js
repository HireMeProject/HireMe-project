require("dotenv").config(); //charger les variables d environements definis dans .env
const mongoose  = require('mongoose');
const express = require ("express");
console.log(process.env.NODE_ENV);
//creer une instance d express
const app = express() 
const connectDB = require("./config/db"); //importer une fonction de connexion a la base de donnée
connectDB();

const PORT = process.env.PORT || 8000;
console.log(PORT);
//importer middleware cookie-parser
const cookieParser = require('cookie-parser'); 
const cors = require('cors');
console.log("avant cors"); 
app.use(cors({          // configurer le cors
    origin: "http://localhost:5173",
    credentials:true
})); 
console.log("cors");
// acceder au cookies de l app
app.use(cookieParser());    
console.log("cookieparser");

// traiter les req json
app.use(express.json()); 
//routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes=require("./routes/adminRoutes");
const recruiterRoutes=require("./routes/recruiterRoutes");
const candidateRoutes=require("./routes/candidateRoutes");

app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", recruiterRoutes);
app.use("/candidate", candidateRoutes);

//assurer que les fonctions ne declenche que si la connection est faite 
mongoose.connection.once('open', ()=>{
console.log('connected to the database');
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
});

})
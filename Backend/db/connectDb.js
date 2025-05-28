import mongoose from "mongoose";

const connetDb= async(dbUrl,dbName)=>{
    try {
      await  mongoose.connect(dbUrl+dbName)
        console.log("connected to data base successfully");
        // console.log(MONGOURL);
    } catch (error) {
        console.log(error.message)
    }
}

export default connetDb;
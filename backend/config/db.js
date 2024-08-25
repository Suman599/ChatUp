const mongoose=require("mongoose");
const connectDB=async() =>{
    try{
        const conn=await mongoose.connect("mongodb+srv://chakrabortysuman599:Mrinalc64@cluster0.nr3i8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Mongodb connected");
    }
    catch (error){
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};
module.exports=connectDB;
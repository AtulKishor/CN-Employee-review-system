import mongoose from 'mongoose';

// creating user schema
const feedbackSchema = new mongoose.Schema(
    {   
        // comment given by reviewer
        comment:{
            type:String,
        },
        // reviewer's id
        reviewer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        // recipient's id
        recipient:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {
        // timestamp
        timestamps:true,
    }
)

// creating a new model from schema
const Feedback = mongoose.model('Feedback',feedbackSchema);

// export schema
export default Feedback;

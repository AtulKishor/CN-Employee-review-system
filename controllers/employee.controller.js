import User from '../models/User.model.js';
import Feedback from '../models/feedback.model.js';

// render the employee's dashboard
// also show review assigned and feedback given to the employee
export const employee = async (req,res) => {

    // for all the reviews assign to employee by admin
    let reviewers = [];
    const assignReviewIds = req.user.reviewAssigned;

    // for all the feedback given to the employee by fellow employee
    let feedbackByOther = [];
    const feedbackIds = req.user.feedbackByOthers;


    // getting list of all the assign reviews
    if(assignReviewIds.length > 0 ){

        for (let index = 0; index < assignReviewIds.length; index++) {
            
            // find employee who's review is assigned
            let employee = await User.findById(assignReviewIds[index]);

            if(employee){
                // store the employee in array
                reviewers.push(employee);
            }
            
        }
    }

    // getting list of all the feedbacks given by others
    if(feedbackIds.length > 0 ){

        for (let index = 0; index < feedbackIds.length; index++) {
            
            // getting feedback given from database { comment and user }
            let feedback = await Feedback.findById(feedbackIds[index]).populate('reviewer','name');

            if(feedback){
                // store the feedback in array
                feedbackByOther.push(feedback);
            }
            
        }
    }


    // render the employee page 
    // list of review assign and feedback given by other
    res.render('employee',{
        title:"Employee | Dashboard",
        assignReviews:reviewers,
        feedbacks:feedbackByOther
    });
}


// for giving feedback to an employee
export const addReview = async(req,res) => {
    try {

        // getting data of reviewer, recipient , and the comment(review)
        const recipient = req.query.id;
        const reviewer = req.user._id;
        const {comment} = req.body;

        // create a new feedback in database
        const feedbackId = await Feedback.create({
            comment,
            reviewer,
            recipient
        });

        // find the recipient in database
        const recipientEmployee = await User.findById(recipient);
        // store the new feedback's id in recipient's data
        recipientEmployee.feedbackByOthers.push(feedbackId);
        // save recipient's data
        await recipientEmployee.save();

        // use $pull operator to remove the recipient from the reviewAssigned array
        await User.findByIdAndUpdate(
            reviewer,
            { $pull: { reviewAssigned: recipient } }
        );
        req.flash('success','Your feedback is added !!!');
        // redirect back 
        return res.redirect('back');

    } catch (error) {

        // if error
        console.log(error);
    }
}
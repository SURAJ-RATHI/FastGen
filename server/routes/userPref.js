import express from "express";
import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";

const router = express.Router();

// upload userPreference to DB
router.post('/', async(req, res) => {
    try{
        const {name, gender, educationStatus, explanation, language} = req.body;
        
        if (!req.user) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const user = await User.findById(req.user._id);
        
        if(!user){
            return res.status(404).json({ success: false, error:"User not found"})
        }

        const userPref = await UserPreference.findOneAndUpdate(
            { user: user._id },
            { 
                name, 
                gender, 
                educationStatus, 
                explanationStyle: explanation, 
                comfortLanguage: language 
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true
            }
        );
        
        res.status(200).json({ success: true, data: userPref});
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err.message});  
    }
})

export default router;
import { Router } from "express";
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import Assignment from "../models/Assignment.js";
import Teacher from "../models/Teacher.js";

const router = Router()


router.post('/add-assignment', async(req,res)=>{
    try{

     const {  title, description,classId,schoolId, teacherId, subjectId } = req.body ;

    if(!classId || !subjectId ){
        return res.status(400).json({status: false, message:'School, Class and Subject is required' })
    }
    
    if(teacherId){
        const teacher = await Teacher.findById(teacherId)
        const isClass = teacher.class.includes(classId)
        if(!isClass){
            res.status(400).json({status: false, message: "You do not have access for this class"})
        }
    }

    const newAssignment =  new Assignment ({
        title, description,classId,schoolId,teacherId, subjectId
    })

    await newAssignment.save();
    res.status(201).json({status: true, message: "Assignment Created SuccessFully"})

    }catch(error){
        console.log(error)
        res.status(500).json({
            status: false,
            error: 'Server Error'
        })
    }
})


router.get('/:classId', async(req,res)=>{
    try{

        const {classId} = req.params;
        const assignments = await Assignment.find({classId}).populate('schoolId subjectId classId');
        res.status(200).json(assignments)
    }catch(error){
        res.status(500).json({ message: 'Error fetching Assignment', error });
    }
})


router.get('/teacher/:teacherId', async(req,res)=>{
    try{

        const {teacherId} = req.params;
        const teacherData = await Teacher.findById(teacherId)
        const assignments = await Assignment.find({classId: {$in: teacherData.class}}).populate('schoolId subjectId classId');
        res.status(200).json(assignments)
    }catch(error){
        res.status(500).json({ message: 'Error fetching Assignment', error });
    }
})

router.get('/school/:schoolId', async(req,res)=>{
    try{

        const {schoolId} = req.params;
        const assignments = await Assignment.find({schoolId}).populate('schoolId subjectId classId');
        res.status(200).json(assignments)
    }catch(error){
        res.status(500).json({ message: 'Error fetching Assignment', error });
    }

})


router.delete('/:id', async(req, res)=>{
    try{

        const {id} = req.params;
        const result = await Assignment.findByIdAndDelete(id);
        if(!result){
            return res.status(404).json({status: false, error: 'Assignment Not Found'});

        }
        res.json({status: true, message: "Assignment Deleted"})

    }catch(error){
        console.log("Error", error)
        res.status.json({status:false, error: 'Server Error'})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedAssign = await Assignment.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedAssign) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.status(200).json({status:true, message: 'Assignment updated successfully', subject: updatedSubject });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Assignment', error });
    }
});



export default router
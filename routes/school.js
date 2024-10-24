import { Router } from 'express';
import School from '../models/School.js';
import authenticateToken from '../middleware/auth.js';

const router = Router();

// Create new School
router.post('/add-school',authenticateToken, async (req, res) => {
    try {
        const { name, email, phone, address, moto } = req.body;
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ error: 'School with this email already exists' });
        }
        const newSchool = new School({
            name,
            email,
            phone,
            address,
            moto,
        });

        await newSchool.save();
        res.status(201).json({status: true, message: 'School created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: false, error: 'Server error' });
    }
});



router.get('/schools', async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
});

// get school by school id


router.get('/schools/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const school = await School.findById(id);
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }
        res.json(school);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch school' }); 
    }
});


// // Update existing school
router.put('/update-school/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, moto } = req.body;

    try {
        const updateData = {
            name,
            email,
            phone,
            address,
            moto,
        };

        const updatedSchool = await School.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedSchool) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.status(200).json({status:true, message: 'School updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({status:false, error: 'Server error' });
    }
});


// // Delete School by ID
router.delete('/delete-school/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await School.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'school not found' });
        }
        res.json({status: true, message: 'school deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({status:false, error: 'Server error' });
    }
});


export default router;

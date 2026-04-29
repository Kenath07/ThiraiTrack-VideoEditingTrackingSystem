require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        console.log('Existing data cleared');

        const salt = await bcrypt.genSalt(10);
        const managerPassword = await bcrypt.hash('Manager@123', salt);
        const headPassword = await bcrypt.hash('Head@123', salt);
        const defaultPassword = await bcrypt.hash('password123', salt);

        // Create Users
        const users = await User.insertMany([
            {
                fullName: 'Project Manager',
                email: 'manager@thiraiterra.com',
                password: managerPassword,
                role: 'Project Manager',
                phone: '+1234567890',
                experienceLevel: 'Experienced',
                primarySkill: 'Video Editing',
                bio: 'Senior project manager with 10+ years of experience in video production.'
            },
            {
                fullName: 'Video Editing Head',
                email: 'head@thiraiterra.com',
                password: headPassword,
                role: 'Video Editing Head',
                phone: '+1234567891',
                experienceLevel: 'Experienced',
                primarySkill: 'Video Editing',
                bio: 'Head of video editing department with expertise in post-production workflows.'
            },
            {
                fullName: 'Senior Video Editor',
                email: 'editor@thiraiterra.com',
                password: defaultPassword,
                role: 'Full-Time Video Editor',
                phone: '+1234567892',
                experienceLevel: 'Experienced',
                primarySkill: 'Color Grading',
                bio: 'Full-time video editor specializing in color grading and visual effects.'
            },
            {
                fullName: 'Video Editing Intern',
                email: 'intern@thiraiterra.com',
                password: defaultPassword,
                role: 'Video Editing Intern',
                phone: '+1234567893',
                experienceLevel: 'Beginner',
                primarySkill: 'Video Editing',
                bio: 'Passionate video editing intern eager to learn and grow.'
            }
        ]);

        console.log('Users created');

        const managerId = users[0]._id;
        const headId = users[1]._id;
        const editorId = users[2]._id;
        const internId = users[3]._id;

        // Create Projects
        const projects = await Project.insertMany([
            {
                title: 'Summer Campaign Video',
                description: 'Promotional video for summer campaign 2026',
                deadline: new Date('2026-06-01'),
                status: 'Active',
                createdBy: managerId
            },
            {
                title: 'Product Launch Teaser',
                description: 'Short teaser for the new smart watch',
                deadline: new Date('2026-05-15'),
                status: 'Planning',
                createdBy: managerId
            },
            {
                title: 'Annual Review Documentary',
                description: 'Full documentary covering last year achievements',
                deadline: new Date('2026-12-01'),
                status: 'Active',
                createdBy: managerId
            }
        ]);

        console.log('Projects created');

        // Create Tasks
        await Task.insertMany([
            {
                title: 'Cut raw footage for Summer Campaign',
                description: 'Initial cut of all B-roll footage',
                assignedTo: internId,
                project: projects[0]._id,
                deadline: new Date('2026-05-01'),
                status: 'In Progress',
                priority: 'High',
                createdBy: headId
            },
            {
                title: 'Add lower thirds to Documentary',
                description: 'Add standard lower thirds for all interviewees',
                assignedTo: internId,
                project: projects[2]._id,
                deadline: new Date('2026-05-10'),
                status: 'Pending',
                priority: 'Medium',
                createdBy: headId
            },
            {
                title: 'Color grading for Teaser',
                description: 'Apply cinematic LUTs to teaser footage',
                assignedTo: editorId,
                project: projects[1]._id,
                deadline: new Date('2026-05-12'),
                status: 'Under Review',
                priority: 'High',
                createdBy: headId
            },
            {
                title: 'Sound mixing for Summer Campaign',
                description: 'Mix voiceover with background track',
                assignedTo: editorId,
                project: projects[0]._id,
                deadline: new Date('2026-05-05'),
                status: 'Completed',
                priority: 'Medium',
                createdBy: headId
            },
            {
                title: 'Draft social media clips',
                description: 'Create 15s clips for Instagram reels',
                assignedTo: internId,
                project: projects[0]._id,
                deadline: new Date('2026-05-20'),
                status: 'Under Review',
                priority: 'Low',
                createdBy: headId,
                comments: [
                    {
                        user: internId,
                        text: 'First draft submitted for review'
                    }
                ],
                driveLink: 'https://drive.google.com/example-link-1'
            }
        ]);

        console.log('Tasks created');
        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();

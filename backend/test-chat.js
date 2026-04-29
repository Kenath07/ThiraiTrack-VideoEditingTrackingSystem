require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Project = require('./models/Project');
const Chat = require('./models/Chat');

async function test() {
    try {
        console.log('1. Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('   MongoDB connected');

        console.log('2. Finding a user...');
        const user = await User.findOne();
        if (!user) {
            console.log('   NO USERS FOUND! Run "npm run seed" first');
            process.exit(1);
        }
        console.log('   User found:', user.email, user.role, user._id);

        console.log('3. Testing Task.find with $or...');
        const tasks = await Task.find({
            $or: [
                { assignedTo: user._id },
                { assignedUser: user._id }
            ]
        });
        console.log('   Tasks found:', tasks.length);

        console.log('4. Testing Project.find...');
        const projects = await Project.find();
        console.log('   Projects found:', projects.length);

        console.log('5. Testing Chat.findOne...');
        const chat = await Chat.findOne({ user: user._id });
        console.log('   Chat found:', chat ? 'yes' : 'no');

        console.log('6. Testing Chat creation...');
        if (!chat) {
            const newChat = new Chat({ user: user._id, messages: [] });
            await newChat.save();
            console.log('   Chat created successfully');
        }

        console.log('7. Testing Groq SDK...');
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Hello, say hi in one word' }],
            max_tokens: 50,
            temperature: 0.7
        });
        console.log('   Groq response:', response.choices[0].message.content);

        console.log('\n=== ALL TESTS PASSED ===');
        process.exit(0);
    } catch (error) {
        console.error('\n=== TEST FAILED ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

test();

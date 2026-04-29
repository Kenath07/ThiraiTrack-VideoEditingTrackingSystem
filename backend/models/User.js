const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Video Editing Intern', 'Full-Time Video Editor', 'Video Editing Head', 'Project Manager'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Experienced'],
        required: true
    },
    primarySkill: {
        type: String,
        enum: ['Video Editing', 'Color Grading', 'Motion Graphics', 'Sound Editing', 'Thumbnail Design'],
        required: true
    },
    bio: {
        type: String,
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('name').get(function() {
    return this.fullName;
});

module.exports = mongoose.model('User', userSchema);

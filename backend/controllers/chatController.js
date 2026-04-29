const Chat = require('../models/Chat');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const OpenAI = require('openai');

// ---------- AI Client Initialization ----------
let aiClient = null;
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';

if (AI_PROVIDER === 'groq' && process.env.GROQ_API_KEY) {
    aiClient = new OpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY,
    });
    console.log('ThiraiTrack Chatbot: Using Groq API');
} else if (process.env.OPENAI_API_KEY) {
    aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('ThiraiTrack Chatbot: Using OpenAI API');
} else {
    console.warn('ThiraiTrack Chatbot: No AI API key found – falling back to keyword responses.');
}

// ---------- Fetch User Context from DB ----------
const getUserContext = async (userId) => {
    try {
        const user = await User.findById(userId).select('fullName email role primarySkill experienceLevel');

        const assignedTasks = await Task.find({ assignedTo: userId })
            .populate('project', 'title status')
            .populate('createdBy', 'fullName role')
            .select('title description status priority deadline driveLink project createdBy')
            .sort({ deadline: 1 });

        const createdTasks = await Task.find({ createdBy: userId })
            .populate('assignedTo', 'fullName role')
            .populate('project', 'title')
            .select('title status priority deadline assignedTo project')
            .sort({ createdAt: -1 })
            .limit(10);

        const projects = await Project.find()
            .populate('createdBy', 'fullName role')
            .select('title description status deadline createdBy')
            .sort({ deadline: 1 });

        const teamMembers = await User.find({ _id: { $ne: userId } })
            .select('fullName role primarySkill')
            .sort({ role: 1 });

        return { user, assignedTasks, createdTasks, projects, teamMembers };
    } catch (err) {
        console.error('[ThiraiTrack Chat] Error fetching user context:', err.message);
        return {
            user: null,
            assignedTasks: [],
            createdTasks: [],
            projects: [],
            teamMembers: []
        };
    }
};

//Implement AI chatbot backend routes
// ---------- Format Context into AI-Readable String ----------
const formatContextForAI = (data) => {
    const { user, assignedTasks, createdTasks, projects, teamMembers } = data;

    let context = `Team Member: ${user?.fullName || 'Unknown'}\n`;
    context += `Role: ${user?.role || 'Unknown'}\n`;
    context += `Primary Skill: ${user?.primarySkill || 'Not specified'}\n`;
    context += `Experience Level: ${user?.experienceLevel || 'Not specified'}\n\n`;

    // Assigned tasks
    context += `--- ASSIGNED TASKS (${assignedTasks.length}) ---\n`;
    if (assignedTasks.length > 0) {
        assignedTasks.forEach(task => {
            const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline';
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Completed';
            context += `- [${task.status}] "${task.title}" | Priority: ${task.priority} | Deadline: ${deadline}${isOverdue ? ' ⚠️ OVERDUE' : ''} | Project: ${task.project?.title || 'N/A'}\n`;
        });
    } else {
        context += '- No tasks assigned.\n';
    }

    // Tasks by status summary
    const statusCounts = {};
    assignedTasks.forEach(t => {
        statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });
    if (Object.keys(statusCounts).length > 0) {
        context += `\nTask Status Summary: ${Object.entries(statusCounts).map(([s, c]) => `${c} ${s}`).join(', ')}\n`;
    }

    // Upcoming deadlines (next 7 days)
    const upcoming = assignedTasks.filter(t => {
        if (!t.deadline || t.status === 'Completed') return false;
        const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 && daysLeft <= 7;
    });
    if (upcoming.length > 0) {
        context += `\n⚠️ UPCOMING DEADLINES (next 7 days):\n`;
        upcoming.forEach(t => {
            const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            context += `- "${t.title}" due in ${daysLeft} day(s) [${t.status}]\n`;
        });
    }

   
    // Created/managed tasks (for Head/Manager)
    if (createdTasks.length > 0) {
        context += `\n--- TASKS YOU ASSIGNED TO OTHERS (${createdTasks.length}) ---\n`;
        createdTasks.slice(0, 5).forEach(task => {
            context += `- "${task.title}" → assigned to ${task.assignedTo?.fullName || 'Unknown'} [${task.status}]\n`;
        });
    }

    // Projects
    context += `\n--- PROJECTS (${projects.length}) ---\n`;
    if (projects.length > 0) {
        projects.forEach(proj => {
            const deadline = proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'No deadline';
            context += `- [${proj.status}] "${proj.title}" | Deadline: ${deadline} | Created by: ${proj.createdBy?.fullName || 'Unknown'}\n`;
        });
    } else {
        context += '- No projects found.\n';
    }

    // Team
    context += `\n--- TEAM MEMBERS (${teamMembers.length}) ---\n`;
    if (teamMembers.length > 0) {
        teamMembers.forEach(m => {
            context += `- ${m.fullName} | ${m.role} | Skill: ${m.primarySkill || 'N/A'}\n`;
        });
    } else {
        context += '- No other team members found.\n';
    }

    return context;
};

// ---------- Keyword-Based Fallback Responses ----------
const getFallbackResponse = (message, data) => {
    const msg = message.toLowerCase().trim();
    const { user, assignedTasks, createdTasks, projects, teamMembers } = data;
    const name = user?.fullName?.split(' ')[0] || 'there';

    // Greetings
    if (msg.match(/^(hi|hello|hey|good morning|good evening|greetings)/)) {
        return `Hello ${name}! 👋 I'm ThiraiTrack Assistant. I can help you with your tasks, projects, deadlines, and team. What would you like to know?`;
    }
    if (msg.match(/how are you|how's it going|how are you doing/)) {
        return `I'm doing great, thanks for asking ${name}! How can I help you with your video editing work today?`;
    }
    if (msg.match(/thank|thanks/)) {
        return `You're welcome, ${name}! Feel free to ask anytime. 😊`;
    }
    if (msg.match(/bye|goodbye|see you/)) {
        return `Goodbye ${name}! Keep up the great editing work! 🎬`;
    }

    // Tasks
    if (msg.includes('my task') || msg.includes('assigned to me') || msg.includes('what task')) {
        if (assignedTasks.length === 0) return `You have no tasks assigned right now, ${name}. Enjoy the break! 🎉`;
        const pending = assignedTasks.filter(t => t.status === 'Pending').length;
        const inProgress = assignedTasks.filter(t => t.status === 'In Progress').length;
        const underReview = assignedTasks.filter(t => t.status === 'Under Review').length;
        return `You have ${assignedTasks.length} task(s) total — ${pending} Pending, ${inProgress} In Progress, ${underReview} Under Review. Check the My Tasks page for full details.`;
    }

    // Deadlines
    if (msg.includes('deadline') || msg.includes('due') || msg.includes('overdue')) {
        const overdue = assignedTasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Completed');
        if (overdue.length > 0) {
            return `⚠️ You have ${overdue.length} overdue task(s): ${overdue.map(t => `"${t.title}"`).join(', ')}. Please update their status or contact your supervisor.`;
        }
        const upcoming = assignedTasks
            .filter(t => t.deadline && new Date(t.deadline) > new Date() && t.status !== 'Completed')
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        if (upcoming.length > 0) {
            const next = upcoming[0];
            return `Your next deadline is "${next.title}" on ${new Date(next.deadline).toLocaleDateString()} [${next.status}].`;
        }
        return `No upcoming deadlines right now. Great job staying on track, ${name}! ✅`;
    }

    // Status / Progress
    if (msg.includes('status') || msg.includes('progress') || msg.includes('pending') || msg.includes('completed')) {
        if (assignedTasks.length === 0) return 'You have no assigned tasks to track progress on.';
        const completed = assignedTasks.filter(t => t.status === 'Completed').length;
        const rate = Math.round((completed / assignedTasks.length) * 100);
        return `Your task progress: ${completed}/${assignedTasks.length} completed (${rate}%). Keep it up, ${name}! 💪`;
    }

    // Projects
    if (msg.includes('project')) {
        if (projects.length === 0) return 'No projects are available in the system yet.';
        const active = projects.filter(p => p.status === 'Active').length;
        return `There are ${projects.length} project(s) in the system — ${active} Active. Visit the Projects page for full details.`;
    }

    // Team
    if (msg.includes('team') || msg.includes('member') || msg.includes('colleague') || msg.includes('who is')) {
        if (teamMembers.length === 0) return 'No other team members found in the system.';
        return `Your team has ${teamMembers.length} member(s). Visit the Team page to see everyone's roles and skills.`;
    }

    // Drive link / file submission
    if (msg.includes('drive') || msg.includes('link') || msg.includes('submit') || msg.includes('upload') || msg.includes('draft')) {
        return `To submit your draft or drive link, go to the Task Details page for the specific task and paste the Google Drive link in the submission form.`;
    }

    // Review / Approval
    if (msg.includes('review') || msg.includes('approval') || msg.includes('approve') || msg.includes('reject')) {
        const underReview = assignedTasks.filter(t => t.status === 'Under Review');
        if (underReview.length > 0) {
            return `You have ${underReview.length} task(s) currently under review. Your supervisor will approve or reject them shortly.`;
        }
        return 'None of your tasks are currently under review. Submit your work from the Task Details page to request a review.';
    }

    // Help
    if (msg.includes('help') || msg.includes('what can you do') || msg.includes('commands')) {
        return `I can help you with:\n• 📋 Your assigned tasks & status\n• ⏰ Upcoming deadlines & overdue tasks\n• 📁 Project overview\n• 👥 Team members\n• 📎 Draft/drive link submission\n• ✅ Task review & approval workflow\n\nJust ask me anything about your work!`;
    }

    return `I'm ThiraiTrack Assistant 🎬. I can help with your tasks, projects, deadlines, and team. Try asking: "What are my tasks?" or "Any upcoming deadlines?" or "Who is on my team?"`;
};

// ---------- Main Handler: Send Message ----------
const sendMessage = async (req, res) => {
    try {
        let { message } = req.body;

        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required and must be a string.' });
        }
        message = message.trim();
        if (message.length === 0) {
            return res.status(400).json({ error: 'Message cannot be empty.' });
        }
        if (message.length > 2000) {
            return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
        }

        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        console.log(`[ThiraiTrack Chat] User ${userId}: "${message}"`);

        // Step 1: Get or create chat session
        let chat = await Chat.findOne({ user: userId });
        if (!chat) {
            chat = new Chat({ user: userId, messages: [] });
            console.log('[ThiraiTrack Chat] New chat session created.');
        }

        // Step 2: Store user message immediately
        chat.messages.push({ role: 'user', content: message });
        await chat.save();

        // Step 3: Fetch user context from DB
        const contextData = await getUserContext(userId);
        const contextString = formatContextForAI(contextData);

        let reply = null;

        // Step 4: Try AI if client is available
        if (aiClient) {
            try {
                const systemPrompt = `You are ThiraiTrack Assistant, a helpful and friendly AI assistant for a video editing team task tracking system called ThiraiTrack.

Your job is to help video editing team members understand their workload, deadlines, project status, and team coordination.

Current user data:
${contextString}

Guidelines:
1. Be warm, friendly, and professional. Use the user's first name when natural.
2. Answer ONLY questions related to the user's tasks, projects, team, and video editing work.
3. For greetings and small talk, respond naturally and briefly.
4. For task questions, use the actual data provided above to give specific answers.
5. Highlight overdue tasks or urgent deadlines clearly with ⚠️.
6. For submitting work/drafts, always direct users to the Task Details page.
7. Never invent data — if something isn't in the context, say you don't have that information.
8. If asked something completely unrelated (politics, sports, etc.), politely redirect to ThiraiTrack topics.
9. Keep responses concise — under 4 sentences unless a list is needed.
10. Use emojis sparingly for a friendly feel 🎬✅⚠️.`;

                // Use last 10 messages for context window
                const recentMessages = chat.messages.slice(-10);
                const aiMessages = [
                    { role: 'system', content: systemPrompt },
                    ...recentMessages.map(m => ({ role: m.role, content: m.content }))
                ];

                const model = AI_PROVIDER === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';

                const completion = await aiClient.chat.completions.create({
                    model,
                    messages: aiMessages,
                    max_tokens: 500,
                    temperature: 0.7,
                });

                reply = completion.choices[0].message.content.trim();
                console.log('[ThiraiTrack Chat] AI response received successfully.');
            } catch (aiError) {
                console.error('[ThiraiTrack Chat] AI API error:', aiError.message);
                reply = getFallbackResponse(message, contextData);
            }
        } else {
            console.log('[ThiraiTrack Chat] No AI client — using fallback response.');
            reply = getFallbackResponse(message, contextData);
        }

        // Step 5: Store assistant reply
        chat.messages.push({ role: 'assistant', content: reply });

        // Trim to last 50 messages to prevent unbounded growth
        if (chat.messages.length > 50) {
            chat.messages = chat.messages.slice(-50);
        }

        await chat.save();

        return res.json({ reply, timestamp: new Date() });

    } catch (error) {
        console.error('[ThiraiTrack Chat] Unhandled error:', error.message);
        console.error(error.stack);
        return res.status(500).json({ error: 'Failed to process your message. Please try again later.' });
    }
};

// ---------- Get Chat History ----------
const getChatHistory = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Not authorized.' });

        const chat = await Chat.findOne({ user: userId });
        return res.json({ messages: chat ? chat.messages : [] });
    } catch (error) {
        console.error('[ThiraiTrack Chat] Error fetching history:', error.message);
        return res.status(500).json({ error: 'Failed to fetch chat history.' });
    }
};

// ---------- Clear Chat History ----------
const clearChatHistory = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Not authorized.' });

        const result = await Chat.findOneAndDelete({ user: userId });
        if (!result) {
            return res.status(404).json({ error: 'No chat history found to clear.' });
        }
        return res.json({ message: 'Chat history cleared successfully.' });
    } catch (error) {
        console.error('[ThiraiTrack Chat] Error clearing history:', error.message);
        return res.status(500).json({ error: 'Failed to clear chat history.' });
    }
};

module.exports = { sendMessage, getChatHistory, clearChatHistory };

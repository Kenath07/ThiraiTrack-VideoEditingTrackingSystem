# Seed Data Guide

This document explains how to seed the database with initial test data.

## Running the Seed Script

To populate the database with test users, projects, and tasks:

```bash
cd backend
npm run seed
```

## What Gets Created

The seed script creates the following:

### Users (4 accounts)

1. **Project Manager**
   - Email: `manager@thiraiterra.com`
   - Password: `Manager@123`
   - Role: Project Manager

2. **Video Editing Head**
   - Email: `head@thiraiterra.com`
   - Password: `Head@123`
   - Role: Video Editing Head

3. **Senior Video Editor**
   - Email: `editor@thiraiterra.com`
   - Password: `password123`
   - Role: Full-Time Video Editor

4. **Video Editing Intern**
   - Email: `intern@thiraiterra.com`
   - Password: `password123`
   - Role: Video Editing Intern

### Projects (3 projects)

1. Summer Campaign Video (Active)
2. Product Launch Teaser (Planning)
3. Annual Review Documentary (Active)

### Tasks (5 tasks)

Various tasks assigned to the editor and intern with different statuses (Pending, In Progress, Under Review, Completed).

## Important Notes

- The seed script **clears all existing data** before seeding
- Make sure MongoDB is running before executing
- Use these test accounts for development and testing
- Modify `seed.js` to customize the test data as needed

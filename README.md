# Email Campaign Builder

A visual, no-code email campaign builder that allows marketers to create multi-step, action-aware, and adaptive email sequences. The application supports real-time collaboration, dynamic layouts, custom widgets, and theme switching.

## Features

### Core Functionality
- **Visual Campaign Builder**: Drag-and-drop interface for creating email sequences
- **Real-Time Collaboration**: Multiple users can work on the same campaign simultaneously
- **Dynamic Theming**: Switch between light and dark modes
- **User Authentication**: Secure login and registration system

### Campaign Components
- **Email Nodes**: Configure email content, subject lines, and templates
- **Condition Nodes**: Set behavior-based triggers (email opened, link clicked, purchase made, idle)
- **Wait Nodes**: Add time delays between campaign steps
- **Action Nodes**: Perform actions like adding tags or triggering webhooks

### Automation Features
- **Behavior-Based Automation**: Trigger actions based on user behavior
- **Time-Based Automation**: Schedule follow-ups after specific time intervals
- **Adaptive Sequences**: Automatically change campaign flow based on user interactions

## Technology Stack

### Frontend
- **React**: UI library for building user interfaces
- **Material-UI**: Component library for responsive design
- **React Flow**: Library for building interactive node-based editors
- **React DnD**: Drag and drop functionality
- **Socket.io**: Real-time communication
- **React Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: Object Data Modeling (ODM) library
- **Socket.io**: Real-time bidirectional event-based communication
- **JWT**: Authentication middleware

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/sainathislavath/Collaborative-Email-Campaign-Engine.git
cd email-campaign-builder/server
```
2. Install dependencies
```bash
npm install
```
3. Create a `.env` file in the root directory
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```
4. Start the server
```bash
npm start
```
The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory
```bash
cd ../client
```
2. Install dependencies
```bash
npm install
```
3. Create a `.env` file in the root directory
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
```
4. Start the React app
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## Usage 
### Getting Started 

1. Register an Account: Create a new user account by clicking "Sign Up" on the login page.
2. Create a Campaign: From the dashboard, click "New Campaign" to create a new email sequence.
3. Build Your Sequence: Drag nodes from the palette onto the canvas to build your email sequence.
4. Configure Nodes: Select a node to configure its properties in the properties panel.
5. Connect Nodes: Connect nodes to define the flow of your campaign.
6. Save Your Campaign: Click "Save" to save your campaign.

### Working with Nodes 
#### Email Nodes 

- <b>Name:</b> Give your email a descriptive name
- <b>Subject:</b> Set the email subject line
- <b>Template:</b> Choose from predefined email templates

#### Condition Nodes 

- <b></b>Name: Give your condition a descriptive name
- <b>Type:</b> Choose between behavior-based or time-based conditions
- <b>Event:</b> Select the trigger event (email opened, link clicked, purchase made, idle)

#### Wait Nodes 

- <b>Name:</b> Give your wait step a descriptive name
- <b>Duration:</b> Set the wait time (e.g., "2d" for 2 days, "12h" for 12 hours)

#### Action Nodes 

- <b>Name:</b> Give your action a descriptive name
- <b>Action Type:</b> Choose the type of action (add tag, add to segment, trigger webhook)

### Real-Time Collaboration 

When multiple users are working on the same campaign: 

- You'll see a badge showing the number of active collaborators
- Changes made by other users will appear in real-time
- Each user's cursor position is visible to others

You can check the website here [![Website](https://img.shields.io/badge/website-visit-blue?style=for-the-badge&logo=vercel)](https://collaborative-email-campaign-engine-roan.vercel.app/)
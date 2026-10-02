# OPSMIND

## AI-Powered Customer Operations Automation Platform

OPSMIND is a full-stack AI-powered platform designed to automate customer complaint investigation and resolution.

Instead of requiring a human support agent to manually check policies, order information, payment details, and risk, OPSMIND processes a customer case through a structured AI workflow.

### How It Works

```text
Customer Complaint
        ↓
Intake Agent
        ↓
Understanding Agent
        ↓
Knowledge Retrieval (RAG)
        ↓
Investigation + Tool Calling
        ↓
Decision Agent
        ↓
Risk Check
        ↓
Human Approval (for high-risk cases)
        ↓
Customer Communication
        ↓
Audit Trail
```

## Example

A customer reports:

> "My order was cancelled but the payment was deducted."

OPSMIND can:

1. Understand the customer's complaint.
2. Identify the intent and relevant entities.
3. Retrieve the applicable company policy using RAG.
4. Verify order and payment information using tools.
5. Combine the available evidence.
6. Generate a recommended resolution.
7. Check the financial/risk level.
8. Send high-risk cases for human approval.
9. Generate a customer-facing resolution message.
10. Record the workflow in the audit trail.

## Key Features

* AI-powered customer case processing
* Multi-stage AI agent workflow
* Retrieval Augmented Generation (RAG)
* Tool/function calling
* Evidence-based decision making
* Human-in-the-loop approval
* Risk assessment
* JWT authentication
* Role-based access control
* MongoDB database
* Audit trail and workflow tracking
* React-based dashboard
* REST APIs using Node.js and Express

## AI Architecture

OPSMIND uses specialized stages instead of asking a single AI model to perform the entire workflow.

### 1. Intake

Receives and categorizes the customer case.

### 2. Understanding

Extracts important information such as intent, sentiment, and entities.

### 3. Knowledge Retrieval

Retrieves relevant company policies and knowledge using RAG.

### 4. Investigation

Uses tools to verify information from external systems such as order and payment services.

### 5. Decision

Combines the complaint, policy information, and verified evidence to recommend an action.

### 6. Risk Check

Evaluates the risk associated with the proposed action.

### 7. Human Approval

High-risk actions are routed to an authorized human instead of being executed automatically.

### 8. Communication

Generates a grounded response for the customer.

## Tech Stack

### Frontend

* React 18
* Vite
* React Router
* Tailwind CSS
* Axios
* Lucide React
* Context API

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* Role-Based Access Control

### Database

* MongoDB
* Mongoose

### AI

* Multi-agent workflow
* RAG
* Tool Calling
* Grounded decision making
* Human-in-the-loop workflow

## Authentication

OPSMIND uses JWT-based authentication.

```text
User Login
    ↓
JWT Token
    ↓
Token stored on client
    ↓
Authorization header
    ↓
Backend authentication middleware
    ↓
Protected API
```

Role-based access control is used to restrict sensitive actions such as approval workflows.

## Project Structure

```text
OPSMIND/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── context/
│
├── server/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       ├── services/
│       └── middleware/
│
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## Why OPSMIND?

Traditional customer support often requires agents to manually:

* Understand the complaint
* Search company policies
* Check order information
* Verify payment status
* Decide the appropriate resolution
* Obtain approval for sensitive actions
* Communicate the result
* Maintain records

OPSMIND brings these steps into one automated workflow while keeping humans involved when the risk is high.

## Security & Reliability

The platform is designed around several safeguards:

* JWT authentication
* Role-based authorization
* Policy-based grounding
* Verified tool data
* Human approval for high-risk actions
* Audit logging of workflow activity

## Future Improvements

* Integration with real payment and order APIs
* More domain-specific AI agents
* Advanced case analytics
* Automated SLA monitoring
* Production-grade observability
* More comprehensive evaluation of AI decisions

## Author

**Prerna Singh**

B.Tech Computer Science & Engineering
Galgotias University

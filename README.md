# Fact-Finding and Classification Web Application

This web application is designed to assist users in submitting questions along with related documents, to then display and classify facts found within those documents. It is built with React and utilizes a server-side API to process and classify facts.

## Features

- **Question Submission**: Users can submit their questions through the web interface.
- **Document Upload**: Documents related to the questions can be uploaded for processing.
- **Fact Display**: Facts extracted from the documents are displayed to the user.
- **Fact Classification**: Extracted facts are classified into categories such as new facts, modified facts, and facts to be removed.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. The application was built with the following versions:

- Node.js version: 14.x or higher
- npm version: 6.x or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd <project-directory>
```

Install the dependencies:
```bash
npm install
```

Add ENV Variable in .env file:

if using a local web server:
```bash
REACT_APP_SERVER_URL=http://127.0.0.1:5000
```
if using the deployed server:
```bash
REACT_APP_SERVER_URL=https://cleric.bhagavadgita.tech
```

Start the development server:
```bash
npm start
```

The application should now be running on http://localhost:3000.

The application is also deployed on netlify at - https://tubular-llama-6689e2.netlify.app

## Structure

The application's structure is as follows:

1. App.js: The main component that sets up the router and application context.
2. index.js: Entry point for the React application. Renders the App component.
3. index.css: Global styles for the application.
4. Components
    1. AddDocuments: Handles the uploading of documents.
    2. QuestionAnswer: Displays the question input interface.
    3. Facts.jsx: Responsible for displaying the extracted facts.
    4. ClassifiedFacts.jsx: Displays the classified facts after processing.

## API Integration

The application communicates with a backend server for processing and classifying facts. It uses Axios for making HTTP requests to the server endpoints.

1. Get Questions and Facts: Fetches questions and their corresponding facts.
2. Submit Question and Documents: Submits a question along with associated documents for processing.
3. Classify Facts: Requests classification of facts based on their relevance and content.
4. Submit Approvals: Submits user approvals for added, modified, or removed facts.

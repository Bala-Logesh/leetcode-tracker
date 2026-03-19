# Leetcode Tracker

A simple Leetcode Problem tracker built using VueJS and Express

## Technologies used
- VueJS
- Vue Router
- ExpressJS
- Mongoose

## Features

- Tags
    - Create tags for the problems

- Problems
    - Create problems with the following
        - Solution
        - Tags
        - Recursive and Base case for DP problems
        - Points to remember

- Search & Filter
    - Problems can be searched by Problem number or problem name
    - Problems can be filtered based on the tag

- Pagination
    - By default 10 problems are displayed
    - Limits for the count can be configured

## Installation

- Make sure MongoDB is installed and add the MongoDB URI to the .env file

### Frontend
```
cd frontend
npm i
npm run dev
```

### Backend
```
cd backend
npm i
npm run dev
```

### Additional Notes

- This application has error handling
- Errors are displayed as a toast in frontend
- Logging is added in the backend
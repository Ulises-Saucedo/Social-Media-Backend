# Social Network API

## Description
This is an API for a social network platform. It provides endpoints to manage user profiles, posts, comments, and more.

## Features
- User authentication and authorization.
- CRUD operations for user profiles, posts, comments, and likes.
- Image uploads for user avatars and post publications.

## Configuration
- Import documentation into Postman:
  - Import the doc.json file into Postman to view the different endpoints.
- Set up directories for uploads:
  - Create the following directories within the project root: 
  ```
      root
      │
      └───uploads
      │   │
      │   └───avatars
      │   │   │   (avatar-images)
      │   │
      │   └───publications
      │   │   │   (publication-images)
    ```
- Configure environment variables:
    - Rename the .env.dist file to .env.
    - Open the .env file and configure the SECRET_KEY variable.
      

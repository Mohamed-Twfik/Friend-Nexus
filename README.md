# FriendNexus REST API

A dynamic social messaging platform designed to bring people closer together. With FriendNexus, communication becomes effortless and engaging, offering a myriad of features tailored to enhance your social connectivity experience.

## Features:

- **User Authentication and Account Creation**: Users can create accounts with valid email addresses for secure and authentic access to the platform.
- **Friend Requests**: Seamless sending and receiving of friend requests to connect with other users.
- **Private Messaging**: Engage in private conversations with friends, exchanging text messages and files.
- **Profile Customization**: Personalize user profiles to showcase personality and interests.
- **Password Management**: Control account security by changing passwords and resetting them via email verification.
- **Group Creation and Management**: Create groups and invite friends to join, fostering vibrant communities.
- **Status Updates**: Share updates with friends through customizable status messages.
- **Real-Time Communication with Socket.IO**: Enable real-time messaging and notifications for instant updates on activities.

<!-- ## API Documentation

- Detailed API documentation can be found in the [API Documentation](./API_DOCUMENTATION.md) file. -->

## Technologies Used:

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js, used for building the API endpoints.
- **MongoDB**: Non-Relational database management system for data storage.
- **Mongoose**: ODM (Object-Document Mapper) for interacting with the MongoDB.
- **JWT**: JSON Web Tokens for secure authentication.
- **Socket.IO**: Real-Time connection between clients. 
- **Postman**: Testing and debugging tool for API endpoints.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Mohamed-Twfik/Friend-Nexus.git
   ```

2. Install dependencies:

   ```bash
   cd Friend-Nexus/server
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
    DB_URI = database url
    PORT = 5000
    MAIL_HOST = mail host
    MAIL_PORT = 587
    MAIL_SERVICE = mail service
    MAIL_USER = mail user
    MAIL_PASS = mail password
    JWT_SECRET = secret key for jwt
    MAX_DEVICES_ALLOWED = the max number of devices that user can login
   ```
4. Build the server:

   ```bash
   npm run build
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Access the API endpoints at `http://localhost:5000`.


## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

## License:
This project is licensed under the [MIT License](LICENSE).
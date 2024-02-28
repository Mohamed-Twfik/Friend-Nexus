# Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Mongoose to be used as an ODM for MongoDB.

## Auth

For v1, a simple JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database. OAuth is to be added initially or later
for Google + Facebook and maybe others (Github?).

## API

**Auth**:

```
/auth/signin  [POST]
/auth/signup  [POST]
/auth/code    [POST]
/auth/signout [POST]
```

**Users**:

```
/users/list     [GET]
/users/:userId  [GET]
/users/new      [POST]
/users/:userId  [PATCH]
/users/:userId  [DELETE]
```

**Friend Ship**:

```
/friends/list           [GET]
/friends/send/list      [GET]
/friends/receive/list   [GET]
/friends/send/:userId   [POST]
/friends/accept/:userId [PATCH]
/friends/reject/:userId [PATCH]
/friends/:userId [DELETE]
```

**Chats**:

```
/chats/list           [GET]
/chats/:chatId        [GET]
/chats/new            [POST]
/chats/:chatId        [PATCH]
/chats/:chatId        [DELETE]

/chats/users/list/:chatId           [GET]
/chats/users/add                    [POST]
/chats/users/role/:userId/:chatId   [PATCH]
/chats/users/remove/:userId/:chatId [DELETE]
/chats/users/leave/:chatId          [DELETE]

/chats/messages/list/:chatId [GET]
```

**Messages**:

```
/messages/list/:chatId  [GET]
/messages/new           [POST]
/messages/:messageId    [PATCH]
/messages/:messageId    [DELETE]
```

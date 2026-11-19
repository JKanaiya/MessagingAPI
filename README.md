# Messaging API

Messaging API provides the backend API for this project: 
https://github.com/JKanaiya/MessagingApp

## Usage

### Setup

1. Clone the repo
```bash
git clone https://github.com/JKanaiya/MessagingApi
cd MessagingApi
```
2. Install dependencies
```bash
pnpm i
```
3. Create and configure .env
```bash
echo "DATABASE_URL=<your_database_url>\nSECRET=<your_secret>\nAPI_KEY=<supabase_api_key>">> .env

```
4. Run the development server
```bash
node --run dev
```

--------
## Features

- User authentication with JWT.
- Guest account creation to bypass login requirement.
- Guest User spectating selected chatroooms.
- Error handling and validation.
- Bidirectional real-time communication between users using [SocketIO](https://socket.io/).
- Update user's profile details: 
    - Profile Image
    - User Name
- Update messages if they were sent within the last few minutes.


## API Endpoints
### GET
|  Endpoint      |     Purpose   |
| ------------- | ------------- |
|   `/chatrooms` | *attempts to obtain all chatrooms that the user is in*|
|   `/auth-check` | *checks if the users is authenticated*|
|   `/users` | *gets all users*|


### POST
|  Endpoint      |     Purpose   |
| ------------- | ------------- |
|   `/profile-image` | *sets the user's profile image*|
|   `/chatroom` | *creates chatroom between the user and the targeted user*|
|   `/log-in` | *attempts to login the user with their email and password*|
|   `/sign-up` | *attempts to register the user with a provided email and password*|


### PATCH
|  Endpoint      |     Purpose   |
| ------------- | ------------- |
|   `/name` | *attempts to change a user's displayed name*|

License
-------

The project is licensed under the BSD license.

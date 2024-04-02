# IEEE GEMS ROUND 1 TASK

A simple API project for user invitation, sign up, login, logout, and user details editing.

## Table of Contents

- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

- Invite users by entering their details
- Sign up using an invitation ID and set a password
- Log in with email and password
- Log out from the session
- Edit user details (password, name, phone, alternate email)

## API Endpoints

- POST /invitation: Invite a user by providing their details.
- POST /signup: Sign up using an invitation ID and set a password.
- POST /login: Log in with email and password.
- POST /logout: Log out from the session.
- PUT /edit-user: Edit user details (password, name, phone, alternate email).


## Usage
1. Invitation
```
curl -X POST \
  http://localhost:3000/invitation \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Ajay Suresh SJ",
    "email": "ajay@example.com",
    "phone": "1234567890",
    "alternate_email": "ajay.alt@example.com",
    "organizations": {
        "organization_name": "ABC Company",
        "role_in_organization": "Manager",
        "valid_till": "2024-12-31"
    }
}'
```

2. Sign up
```
curl -X POST \
  http://localhost:3000/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "6035ea7a-0d03-4cca-88f3-2bf79717a908",
    "password": "my_secure_password"
}'
```

3. Login
```
curl -X POST \
  http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "ajay@example.com",
    "password": "my_secure_password"
}'
```
4. Edit User
```
curl -X PUT \
  http://localhost:3000/edit-user \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "ajay@example.com",
    "newPassword": "new_secure_password",
    "newDetails": {
        "name": "Ajay Suresh SJ",
        "phone": "9876543210",
        "alternate_email": "ajay.suresh@example.com"
    }
}'
```

5. Logout
```
curl -X POST \
  http://localhost:3000/logout
```
 
## Technologies

- Node.js
- Express.js
- SQLite

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).


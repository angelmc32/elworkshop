# El Workshop

El Workshop is a marketplace for freelance immigrants who can offer services by the hour.

## Installation

Use git to clone repository

```bash
https://github.com/angelmc32/elworkshop.git
```

Navigate to each folder, elworkshop-backend and elworkshop-web, and install packages from package.json

```bash
npm install
```

You will have to add the following environment variables to your .env file:

Back-end variables

PORT=3000

CLIENT_URL=http://localhost:3001

CLOUD_KEY=(enter your own key for cloudinary)

CLOUD_NAME=(enter your own key for cloudinary)

CLOUD_SECRET=(enter your own key for cloudinary)

DB=(enter your DB link or path, accordingly)

SECRET=(your own, used for bcrypt and token generation)


Front-end variables

.env provided

## Usage

Run start scripts with your preferred command

For API requests on live db, use the following endpoints:

https://elworkshop.herokuapp.com/api/jobs/all
Responds with a 200 status code and a JSON with all current available jobs

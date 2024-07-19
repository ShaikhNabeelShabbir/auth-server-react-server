```
npm install
npm run dev
```

```
open http://localhost:5000
```

An auth-Server was build using the following technologies:
Hono an alternative to express
the index is the entry point of the program which in context of express works
like app and server of express
the authroutes define the routes
which are controlled and served using
authController and authservices respectively

You will need to configure the env file in your project directory
PORT
JWT_SECRET
DATABASE_FILENAME

Refer to .env.example file for more information

# Log

### Date

2024-01-09

## What I've done

Today I've spent the day incorporating login functionality using next-auth and the google provider. It proved to be trickier than expected but now I can log in with a set test user. I will have to look into how this works if the projects is deployed, whether I have to do any changes or not in the google console.

I have set up a component called UserBtn that handles the login functionality, as well as added the api route expected for nextauth in the api folder and set a session provider in the layout file.

I installed the zod package in order to set up a type for the env files since the nextauth route was getting errors from the process.env without it.

## What I will do tomorow

Tomorow I will have a look at how I can add the credentials provider with next-auth so that a user can register an account and log in.

## Thoughts

## Others

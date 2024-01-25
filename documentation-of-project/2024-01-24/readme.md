# Log

### Date

2024-01-24

## What I've done

Today I spent the day reading docs on the the auth.js.dev page and and stackoverflow in order to understand how role based access control works with next-auth. I managed to create role based authentication by putting an enum that defaults to user in my database. Admin role has to be set by hand in the database.

I had difficulties passing extra attributes to the session and token callbacks in the next-auth config in [...next-auth]/route.ts so throughout my code I have had to resort to fetching a user with the base information that the session provides to me. Better would have been if I couldve extended sessions with the id value from my users because I need it when I look for and fetch related data.

See my stripeActions.ts file to understand this better.

The extension of session most likely boils down to me not fully understanding to do augmentation in nextauth.d.ts to pass further info to tokens and session pass the base information.

## What I will do tomorow

Tomorow I will implement adding review-functionality for products, and if I have time over before I cut the coding process on Friday night, implement crud operations to the userdashboard and admin dashboards. beyond what I have now.

## Thoughts

Reading docs is diffuclt.

## Others

Sources I used today:

https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role

https://www.prisma.io/docs/orm/prisma-schema/data-model/models

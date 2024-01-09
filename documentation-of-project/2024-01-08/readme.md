# Log

### Date

2024-01-08

## What I've done

Today I have added logic for retrieving a cart and its cartItems, and for creating a cart. The function for creating a cart works currently without having to have a user logged in, but will be tied to a user when I implement next-auth into the application. For now, I just store the cart as a cookie in localStorage since I want a user to be able to have a cart without being logged in, but be able to retrieve it when they do log in.

Currently, the logic is only retrieving a product but I need it to be able to retrieve the correct variant that a user picks.

I have also added a checkout page, a navbar which contain logic and components for keeping track of the amount of items in your cart, as well as total price.

I have added placeholder styling so it is not so ugly to look at but this styling will change most likely when I create my figma designs later on.

## What I will do tomorow

Tomorow I will work on the checkout checkout page, as well as the authentication because I need that set before I can implement Stripe.

## Thoughts

I forsee that I might run in to trouble handling the selecting of a specific variant and passing it correctly to the cart. There will be some logic that has to be changed and or added for quantity of that variant when a user adds it to the cart. I then need a function that can decrease the amount of products of that variant from the database when it goes into the user's cart.

I feel like I'm a bit behind due to being sick during the last day. I will have to work during weekends to catch up.

## Others

# Log

### Date

2024-01-18

## What I've done

Today I implemented logic for adding orders to the database after a payment has gone through. I ran into difficulties however when stripe checkout transitions to my confirmation page due to how I fetch/require my functions for retrieving a checkout session from stripe and saving the orders from the lineitems. Upon rendering the page an order is created twice and every time the page is refetched.

I will have to look over fetching and rendering between server and client components since I've made my confirmation off successfulp payment a client component due to retrieving the params from the url, requring javascript to do.

## What I will do tomorow

Tomorow I will focus on further logic for the payment confirmation page since I need to empty the cart upon completion as well. There's also a bit of fixing with passing the correct variants of a product left to do.

Tomorow I'll look into creating

## Thoughts

If I don't manage with my current setup I might look into a different solution using webhooks from Stripe.

## Others

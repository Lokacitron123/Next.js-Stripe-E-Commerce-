# Log

### Date

2024-01-23

## What I've done

Today I spent adding functionality to the cart page for increasing and decreasing items in cart, as well as deleting the item completely from the cart and restoring the "taken" products and putting them back to the stock quantity of the variant.

## What I will do tomorow

Tomorow I will add a bit of user crud operations to a settings dashboard for the user and try setting protected routes based on roles.

## Thoughts

As much as I would like to, I wont have time to design the UI of my application.

I had some issues with the rerendering of components when decreased, increased and deleted items since most of my items are rendered server side. Even if client side components are used in order to use javascript to make user interactivity available the data needs to rerender. Usually done with the use of state, but my architecture is done so that everything is saved server side. I solved it however with the usage of next/navigation useTransition and the usage of isPending to set a state of loading together with revalidatePath hook in my server functions to rerender.

I looked into other ways of removing the casche but to no avail. In next.js page router you can tell your fetch functions to have a revalidate of 0, meaning that it never casches the data and thus updates when changes are made. I couldn't figure out how that is done in the app router, specially with server functions instead of fetch calls to API endpoints.

## Others

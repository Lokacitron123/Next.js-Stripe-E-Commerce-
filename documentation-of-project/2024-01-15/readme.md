# Log

### Date

YYYY-MM-DD

## What I've done

Today I followed up on the cartItem issue. I've managed to add logic to my single product page with a new component that lets me select a variant and pass it to my addToCartBtn component which now takes into consideration the variant and not only the product. I still have a few things to fix before the logic is complete before I begin adding stripe checkout functionality.

I will have to add a function to my cartActions.ts that is responsible for reducing the quantity of a variant when it is selected and stored as a cartItem with it's relative product.

## What I will do tomorow

Tomorow I will work on the quantity logic of a variant.

## Thoughts

I will have to consider logic for adding the quantity back if a a product and its selected variant is removed from the cart as well.

## Others

# Log

### Date

2024-01-26

## What I've done

Today I've further worked on some of the layout for responsiveness. I added a new table to the admindashboard with the daisyUI component.
I had trouble making it responsive in the way I want it to work however, so currently I have a scrollbar for the component instead of colums on mobile screens.

I added CRUD functions for the reviews model. I realized that I have done a mistake when it comes to my ordermodels and orderedproducts model. Because, when a user writes a review, I want to pass the ID of the product the user is writing the review for, but I also want to pass the ID of the targeted product by the user.

Why? Because I want to make sure that the user has actually bought this product prior to adding a review, which is a good way I think to make sure there are no fake reviews, spam etc. This will make the reviews more trustworthy.

But when I save a orderedProduct when I create an order, I dont have the productId saved, so instead I have to go by the product name to find if there exists a product with that name in the user's order history. I'd rather use product IDs.

## What I will do tomorow

Tomorow I will work on the frontend logic for writing reviews and rendering reviews to the product cards.

## Thoughts

## Others

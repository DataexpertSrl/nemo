![](https://reshark.eu/wp-content/uploads/2023/02/Reshark_black_headless.png)

# Nemo
Reshark headless e-commerce

## Headless API Documentation
https://app.reshark.eu/headless-developers


# Introduction

If you require a tailored solution, Reshark offers APIs to support your headless architecture.

This is a comprehensive guide for developers on utilizing Reshark as an e-commerce backend for headless storefronts.

# Applications

To use Reshark API you need to get a valid access token.
The permissions you're granted authenticating with that token are determined by the type of API client you used to get it.
Two different types of applications are currently available in order to get your credentials: **head channel** and **server integration.**
Which one to use will depend on the specific use case and requirements.

### **Head channel**

**Head channel** applications are used to build any customer storefront with a fully-functional shopping cart and checkout flow.

Head channel tokens grant *not confidential* (public) API credentials. They can authenticate by providing just a **client ID** and their permissions are restricted so that they can be safely used client-side and their tokens exposed to the public without any risks. For example, they can access only one shopping cart at a time (the one associated with the authenticated user), identified by a not guessable, unique hashID, and respond with a `401 Unauthorized` error if you try to request a list of carts.

Head channels require a **brand** associated with the given client ID when requesting their access tokens. This way all the API call results are automatically filtered based on the specified brand. In particular:

- Only the **Products** that are *sellable* for that brand are returned (to be sellable a product must not be a draft).
- In checkout fase, only **Shipping** and **Payment methods** associated with the brand are returned
- Only **Orders** associated to the e-commerce logged in user are returned

Using a head channel is the most straightforward way to build your customer frontend e-commerce. Anyway, if you want to have complete control over the grants brought to the access tokens, you can always use a *server integration*. Just make sure not to expose the secret on the client, by building a dedicated *backend for frontend* (BFF), or properly leveraging serverless functions.

### **Server integration**

**Server integration** applications are used to develop backend integrations with any 3rd-party system.
Server integrations provide *confidential* API credentials. They need a **client ID** and a **client secret** to authenticate.

Head channels require a **brand** associated with the given client ID and client secret when requesting their access tokens. This way all the API call results are automatically filtered based on the specified brand

# Authentication

All API requests must be authenticated. To get authorized, you must include a valid access token in the Authorization header.

To get a valid access token you need to send a `POST` request to the `/oauth/token` endpoint. The payload to be sent with the request differs based on the kind of application and grant type you're requesting the access token for.

The API call returns the following: an access token (JWT token), the grant type, a refresh token (only for *password* grant type) and the expiration time (in seconds) of the access token.

<aside>
⚠️ Please note that the `/GetAuthorizationToken` endpoint is subject to a rate limit of **max 50 reqs / 5 mins**.

</aside>

## How to execute the authorization flow and get your access token.

Below are described the ways in which an access token can be obtained. Each one differs by the grant type, which implies a different type of access and visibility to resources.

### Client credentials

The client credentials grant type can be used for both type of available applications.

- **Sales channels** use the `client_credentials` grant type to get a "guest" access token.
- **Integrations** use the `client_credentials` grant type to get an access token for themselves

### Password

The `password` grant type is used by **sales channels** to exchange a customer credentials for a "logged" access token.

### ****Refresh token****

The `refresh_token` grant type is used by clients to exchange a refresh token for an expired access token.

To get an access token using the `refresh_token` grant type, send a `POST` request to the `/GetAuthorizationToken` endpoint, passing the previously received refresh_token in the request body

### Documentation

[https://app.reshark.eu/headless-developers#tag/AUTH/operation/GetAuthorizationToken](https://app.reshark.eu/headless-developers#tag/AUTH/operation/GetAuthorizationToken)

# How-tos

This collection of guides features how-tos, handy examples, and best practices for the most common scenarios for a frontend e-commerce development.

## Product listing page

How to display a list of products

### Problem

You want to create a product listing page that displays the title and price of each product. Optionally, restricting the products to a specified category or collection.

### Solution

To obtain a list of *sellable* products, send a `GET` request to the `/GetProducts` endpoint. Optionally, include a filter parameter to restrict the results to a specific category.

<aside>
💡 To be *sellable* in a market a product must not be a draft.
Out-of-stock products are still considered *sellable*
</aside>

## Product page

How to retrieve information of a specific product

### Problem

You want to created a product page and display the price and the availability of the selected product.

### Solution

To retrieve details of a product, send a `GET` request to the `/GetProductDetails/{productId}` endpoint.

## Shopping cart

How to add a shopping cart to your website

When creating an online store, the shopping cart feature is one of the most critical components. It acts as a link between the browsing and buying experience, guiding customers towards the final checkout process.

In this comprehensive guide, we will delve into the various steps involved in adding a shopping cart to your website, covering everything from inserting new items into the cart, updating quantities, to presenting a concise summary of the cart's contents to the customer. 

As a guest user, it is not possible to save the shopping cart on the Reshark side. This responsibility falls on the storefront. However, once a user logs in, the shopping cart can be saved in Reshark, allowing it to be shared across multiple devices.

## Adding products to cart

### Problem

You want to implement the "add to cart" function on a product page.

### Solution

Adding a product to a shopping cart means creating a new line item for an existing cart or create a new cart. To do that, you'll need to maintain a cart object locally with all of your line items and then add the new item to it.
If you have a “logged” access token, you can save the entire cart to the backend sending a `POST` request to `/SaveShoppingCarts`, specifying the cart content. This will ensure that your cart is saved and accessible the next time you log in.

### Notes

If you use a "guest" access token and call the `/SaveShoppingCarts` API, an Unauthorized exception will be returned.

## Removing products from cart

### Problem

You have some items in your shopping cart and you want to remove one of them.

### Solution

To remove an item from your shopping cart, you'll need to locate the line item for the product you want to remove within your cart object. Once you've identified the line item, you can delete it to remove the item from your cart.

If you have a "logged" access token, you can update the contents of your cart on the backend by sending a `POST` request to `/SaveShoppingCarts` with the updated cart contents. This will ensure that your cart is updated and accessible the next time you log in.

### Notes

If you use a "guest" access token and call the `/SaveShoppingCarts` API, an Unauthorized exception will be returned.

## Display the cart summary

### Problem

You want to display an order summary to your customer, including the order line items and totals

### Solution

If you have a "logged" access token, you can retrieve the list of line items that compose a cart summary, sending a `GET` request to the `/GetShoppingCarts` endpoint.


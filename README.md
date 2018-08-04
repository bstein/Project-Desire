# Project-Desire
A smarter way to ship packages

Web App is <a href="https://www.baileystein.com/Project-Desire/">here</a>.

Here's what I'm thinking for this web app..

1. User visits the site

2. Site asks the user where they're shipping from and where they're shipping to (ZIP codes or quick city lookup by using some external API)

3. Site asks the user when they want their package to arrive, and the tolerable amount of possible delay

4. Some logic will be used here to determine how much more information is needed (for example, USPS First Class doesn't require sharing package dimensions, only the weight)

5. User enters any remaining information as determined by the logic

6. Site offers a suggested shipping method and price, along with one higher-tier and one lower-tier service for flexibility

7. Once an option is selected, the user will purchase the shipping through the selected third party

Some other thoughts..
1. Since we'll be getting copies of the tracking numbers, we can use them to track delivery times and eventually improve time estimates and recommendations beyond what the shipping carriers are doing

2. Shipping prices will be significantly less than retail since quotes will be under large business accounts that allow anyone to access.

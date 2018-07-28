# Project-Desire
A smarter way to ship packages

Here's what I'm thinking for this web app..
-User visits the site
-Site asks the user where they're shipping from and where they're shipping to (ZIP codes or quick city lookup by using some external API)
-Site asks the user when they want their package to arrive, and the tolerable amount of possible delay
-Some logic will be used here to determine how much more information is needed (for example, USPS First Class doesn't require sharing package dimensions, only the weight)
-User enters any remaining information as determined by the logic
-Site offers a suggested shipping method and price, along with one higher-tier and one lower-tier service for flexibility
-Site helps the user get a shipping label and schedule a pickup if needed

Some other thoughts..
-Since we'll be getting copies of the tracking numbers, we can use them to track delivery times and eventually improve time estimates and recommendations beyond what the shipping carriers are doing
-It will be difficult to actually create shipments at volume discounts without direct access to special accounts. HTML scraping and hidden execution are probably the best way to get started.
-Payments for shipping can be collected via a third party processor. A small markup of about 5-10% will be needed to cover processing fees, chargeback disputes, and to maintain the service. It's possible the markup could be reduced if P2P alternatives are used rather than credit cards.

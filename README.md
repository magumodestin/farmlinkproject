# FarmLink

**Farmers. Buyers. Connected.**

FarmLink is a web platform that connects farmers directly with buyers. It removes the middlemen so farmers earn fairer prices and buyers get fresher products. Sellers list what they grow or offer, buyers browse and order, and local drivers handle delivery.

**Live site:** https://farmlinkproject.vercel.app/

## Features

- **Browse products as a guest.** Anyone can look around without an account.
- **Category filters.** Vegetables, fruits, grains and cereals, eggs and poultry, meat, dairy, herbs and spices, honey and bee products, nuts and seeds, plants and seedlings, farm inputs, animal feed, farm goods, flowers, farm services and farm experiences.
- **Three user roles.** Buyer, seller and driver, each sent to their own page after login.
  - Buyers browse and order farm-direct products.
  - Sellers list products, farm goods and services.
  - Drivers accept local deliveries.
- **Authentication.** Sign up and log in with Supabase Auth. A logged-in user visiting the home page is redirected to the page for their role.
- **Light and dark theme** support.
- **Admin area** with its own login page.
- **Responsive layout** with a collapsible menu for smaller screens.

## How It Works

1. Farmers upload their products.
2. Buyers find fresh products near them.
3. Buyers order and pay through the platform.
4. Products are picked up, or delivered by a local driver.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend and database | Supabase (Postgres, Auth) |
| Maps | Leaflet |
| Hosting | Vercel |

The project does not use PHP. All backend work goes through Supabase.

## Project Structure

```
.
|-- home.html              Landing page for visitors
|-- browse-Product.html    Product browsing with category filters
|-- login_register.html    Login and sign-up
|-- dashboard.html         Buyer dashboard
|-- sell-products.html     Seller page
|-- driver-dashboard.html  Driver page
|-- admin/                 Admin login and pages
|-- imgs/                  Images
|-- home.css               Main styles
|-- home.js                Main page logic
|-- supabaseClient.js      Supabase client setup
|-- farmlink-api.js        Data access helpers
|-- local-store.js         Local storage helpers
|-- nav-auth.js            Navigation and login state
|-- account-panel.js       Account panel
|-- theme.js               Theme switching
|-- reveal.js              Scroll animations
|-- sound-fx.js            Interface sounds
`-- vercel.json            Hosting configuration
```

Some files may sit inside the project folder in the repository.

## Running Locally

1. Clone the repository:

   ```
   git clone https://github.com/magumodestin/farmlinkproject.git
   ```

2. Open the project folder.
3. Add your own Supabase project URL and anon key in `supabaseClient.js`.
4. Start a simple local server from the project folder, for example:

   ```
   npx serve
   ```

   Or use the Live Server extension in VS Code. Open `home.html` to begin.

Opening the files directly from disk can break login and data loading, so a local server is recommended.

## Deployment

The site is deployed on Vercel. Set the Root Directory to the folder that contains `home.html`, and keep `vercel.json` in that same folder.

## Contact

- Email: magumodestiny@gmail.com
- GitHub: https://github.com/magumodestin

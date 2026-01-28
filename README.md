# AS Gadget Store

A premium e-commerce platform for phones and gadgets featuring real-time pricelists, trade-ins, and repair services. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Pricelist**: Filterable data table for products and variants mimicking "Excel-like" views.
- **Product Catalog**: Visual grid with filtering by brand and price.
- **Admin Dashboard**: Comprehensive analytics, product management, order tracking, and user management.
- **Bulk Import**: Admin feature to import products via CSV.
- **WhatsApp Checkout**: Direct integration to send formatted orders to WhatsApp.
- **Responsive Design**: Mobile-first UI/UX with specific mobile navigation.

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended)

This project includes a `vercel.json` configuration file, making it optimized for Vercel deployment.

1. **Push to Git**: Push your code to a repository on GitHub, GitLab, or Bitbucket.
2. **Login to Vercel**: Go to [Vercel.com](https://vercel.com) and log in.
3. **Import Project**: 
   - Click "Add New..." > "Project".
   - Select your repository.
4. **Configure Settings**:
   - **Framework Preset**: Vercel should detect the settings automatically. If not, ensure:
     - **Build Command**: `npm run build` (or `vite build`)
     - **Output Directory**: `dist`
5. **Deploy**: Click "Deploy". Vercel will build the app and provide a live URL.

### Option 2: Netlify

1. **Login to Netlify**: Go to [Netlify.com](https://netlify.com).
2. **New Site from Git**: Connect your Git provider and select the repository.
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Deploy Site**: Click "Deploy Site".

### Option 3: Static Hosting (Apache/Nginx)

1. Run the build command locally:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist` folder to your web server's public directory (e.g., `public_html` or `/var/www/html`).
3. **Important**: Since this is a Single Page Application (SPA), ensure your server is configured to rewrite all 404 requests to `index.html` so that React Router can handle the routing.

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   # or
   npm start
   ```

3. **Open Browser**: Navigate to `http://localhost:3000` (or the port shown in your terminal).

## 🛠 Project Structure

- **`/pages`**: Main page components (Home, Catalog, Pricelist, Admin pages).
- **`/components`**: Reusable UI components (Layout, ProductCard, Charts).
- **`/services`**: Context API providers for global state (StoreContext, CartContext).
- **`/types`**: TypeScript definitions.
- **`/constants`**: Dummy data and configuration constants.

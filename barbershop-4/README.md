# The Crown Cut — Barbershop Website

## 📁 Project Structure

```
barbershop/
├── index.html          ← Login / Signup page (entry point)
├── netlify.toml        ← Netlify deployment config
├── css/
│   ├── auth.css        ← Styles for login/signup
│   └── main.css        ← Styles for main site
├── js/
│   ├── auth.js         ← Auth logic (login, signup, email verification)
│   └── main.js         ← Site logic (navigation, booking, animations)
└── pages/
    └── home.html       ← Main site (Home, Services, About, Testimonials, Contact)
```

## 🚀 Deploy to Netlify

1. Drag the entire `barbershop/` folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Your site will be live instantly!

## 📧 Enable Real Email Verification

By default, the site runs in **DEV MODE** — the verification code is shown in a toast notification and in the browser console (so you can test).

To send real emails:

1. Sign up free at [emailjs.com](https://www.emailjs.com/)
2. Create an **Email Service** (Gmail, Outlook, etc.)
3. Create an **Email Template** with these variables:
   - `{{to_email}}` — recipient email
   - `{{to_name}}` — recipient name  
   - `{{code}}` — 6-digit verification code
4. Open `js/auth.js` and replace:
   ```js
   const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // from Account > API Keys
   const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // from Email Services
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // from Email Templates
   ```

### Sample Email Template (EmailJS)
**Subject:** Your Crown Cut verification code  
**Body:**
```
Hi {{to_name}},

Your verification code is: {{code}}

This code expires in 10 minutes.

— The Crown Cut Team
```

## 🎨 Customization

- **Barbershop name**: Search & replace "The Crown Cut" across all files
- **Address/phone**: Update in `pages/home.html` (footer + contact sections)
- **Colors**: Edit CSS variables at top of `css/main.css` and `css/auth.css`
- **Services & prices**: Edit the `SERVICES` array in `js/main.js`
- **Testimonials**: Edit the `TESTIMONIALS` array in `js/main.js`
- **Images**: Replace Unsplash URLs with your own photos

## 💡 Notes

- User accounts are stored in `localStorage` (browser-based)
- Sessions are stored in `sessionStorage` (cleared when browser closes)
- For production, replace localStorage with a real backend (Supabase, Firebase, etc.)
- The Google Sign-In button is a UI stub — needs Google OAuth integration for full functionality

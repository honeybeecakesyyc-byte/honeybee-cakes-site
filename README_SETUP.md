# Honey Bee Cakes website — setup + editing guide

This site was built as a lightweight static website with a browser-based CMS. The website itself can be hosted for $0 on Cloudflare Pages, while **Pages CMS** gives you a simple visual editing interface for photos, flavours, prices, FAQ and site text.

## What is already built

- Full-height landing page with logo + hero photo
- Fixed desktop side navigation + mobile slide-out menu
- Manageable gallery with categories, filters and image lightbox
- Editable flavour menu
- Editable price + size guide with cake illustrations
- Youform embed area
- Contact section
- Separate FAQ page with accordion answers
- Mobile responsive layout
- Your Honey Bee colour palette already applied

## The easy editing workflow

Once the site is live, your normal workflow is:

1. Go to **https://app.pagescms.org/**
2. Sign in with the GitHub account that owns the website repository.
3. Open the Honey Bee Cakes repository.
4. Choose **Gallery**, **Flavours**, **Price + size guide**, **FAQ**, or **Site settings**.
5. Make the change and save.
6. Cloudflare automatically republishes the website from GitHub.

You do **not** need to edit HTML or CSS for normal updates.

### Adding a cake photo

Open **Gallery** in Pages CMS → add another list item → enter a short title → select a category → upload the photo → save.

### Removing a cake from the gallery

Open **Gallery** → remove that gallery item → save. The photo stops displaying on the site. You can also remove unused media from the Pages CMS media area.

### Updating prices

Open **Price + size guide** → change the size, serving range or starting price → save.

### Adding/changing flavours

Open **Flavours** → add, remove, reorder or edit items → save.

### Updating FAQ

Open **FAQ** → add or edit questions and answers → save.

### Connecting your Youform

In Youform, get the public embed URL for your form. In Pages CMS open **Site settings** → paste it into **Youform embed URL** → save. The website automatically replaces the placeholder with your form.

## First-time publishing (one-time setup)

### 1. Create a GitHub repository

Create a free GitHub account if you do not have one. Create a repository such as `honeybee-cakes-site` and upload every file in this folder, including `.pages.yml`.

### 2. Connect Pages CMS

Go to **https://app.pagescms.org/** → sign in with GitHub → install/authorize the Pages CMS GitHub App for this repository. Pages CMS reads the included `.pages.yml` automatically.

### 3. Publish on Cloudflare Pages

In Cloudflare:

- Workers & Pages → Create → Pages → connect to Git
- Select the GitHub repository
- Framework preset: **None**
- Build command: `bash build.sh`
- Build output directory: `dist`
- Deploy

### 4. Connect honeybeecakesyyc.ca

In the Cloudflare Pages project: **Custom domains → Set up a domain** and enter `honeybeecakesyyc.ca` (and optionally `www.honeybeecakesyyc.ca`).

If your domain DNS is already in Cloudflare, setup is especially simple. If not, Cloudflare will tell you what DNS/nameserver change is required.

## Photos

The current cake illustrations are intentional placeholders. Replace them with your own cake photography in the CMS. For best results:

- Hero photo: portrait, roughly 4:5 or 3:4
- Gallery: use the original portrait or square crops; the masonry grid accepts mixed aspect ratios
- Export images around 1600–2200 px on the long edge for a good quality/file-size balance

## Fonts

The live site currently uses free web fonts (Cormorant Garamond + DM Sans) so there are no font licensing/deployment issues. Your Canva fonts can still be used for graphics. If you own webfont licenses for your exact brand fonts, those can be installed later without changing the layout.

## Files you will usually NOT touch

- `index.html`
- `faq.html`
- `assets/css/styles.css`
- `assets/js/site.js`

Pages CMS edits the JSON files in `content/` for you.

## Important note about the sample serving counts

The starting prices are pre-filled as design examples. Review the serving ranges before publishing because serving counts depend on your cake height and cutting method.

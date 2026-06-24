# Cloudinary Setup Instructions

This project now uses Cloudinary for image hosting. Follow these steps to set it up:

## 1. Create a Cloudinary Account

- Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
- Verify your email

## 2. Get Your Credentials

- In the Cloudinary Dashboard, locate your credentials at the top of the page
- You'll need three values:
  - **Cloud Name** - Your unique cloud identifier
  - **API Key** - For authentication
  - **API Secret** - For backend authentication (keep this secret!)

## 3. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Replace:
- `your-cloud-name` with your Cloudinary Cloud Name
- `your-api-key` with your API Key
- `your-api-secret` with your API Secret

## 4. How It Works

### Admin Upload Flow:
1. Admin selects/captures an image on the product form
2. Image is sent to `/api/admin/upload` endpoint
3. Endpoint uploads to Cloudinary's `paktech/products` folder
4. Cloudinary URL is stored in the database and displayed in the form

### User View Flow:
1. Users see product images loaded from Cloudinary URLs
2. Images are automatically optimized and cached by Cloudinary
3. Better performance and lower bandwidth usage

## 5. Image Optimization

- Images are automatically optimized by Cloudinary
- Format is auto-negotiated (WebP for modern browsers)
- Quality is set to "auto:good" for optimal balance

## 6. Alternative: URLs

You can still paste image URLs directly into the URL field - they don't have to be from Cloudinary.

## Testing

Try uploading an image in the admin product form. You should see:
1. File selected via device or camera
2. "Uploading..." message
3. Preview of the uploaded image
4. Cloudinary URL in the text field
5. Image persists when saved to database

## Security Notes

- API Secret is server-side only (never exposed to frontend)
- Only admins can upload via the admin endpoint
- Images are stored in the `paktech/products` folder on Cloudinary

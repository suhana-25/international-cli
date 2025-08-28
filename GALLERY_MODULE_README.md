# Gallery Management System

A comprehensive image gallery system with admin management and user viewing capabilities.

## Features

### Admin Side (`/admin/gallery`)
- **CRUD Operations**: Create, Read, Update, Delete gallery images
- **File Upload**: Secure image upload using UploadThing
- **Image Management**: Edit titles, descriptions, and manage all uploaded images
- **Responsive Design**: Mobile-friendly admin interface

### User Side (`/gallery`)
- **Image Grid**: Clean, responsive grid layout of all admin-uploaded images
- **Fullscreen Viewer**: Click any image to open in fullscreen modal
- **Advanced Controls**: Zoom in/out, rotate, reset view
- **Navigation**: Arrow keys, swipe, or click arrows to navigate between images
- **Dark Mode**: Optimized for dark theme

## Technical Implementation

### Database Schema
```sql
-- Gallery table structure
CREATE TABLE gallery (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by VARCHAR(255) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `GET /api/gallery` - Fetch all gallery images
- `POST /api/gallery` - Upload new image (admin only)
- `PUT /api/gallery/[id]` - Update image (admin only)
- `DELETE /api/gallery/[id]` - Delete image (admin only)

### File Upload
- Uses UploadThing for secure file handling
- Supports image files up to 4MB
- Automatic file type validation
- Secure admin-only access

### Components
- **AdminGalleryPage**: Full CRUD management interface
- **GalleryPage**: User-facing image grid and viewer
- **Image Modal**: Fullscreen viewer with zoom/rotate controls

## Usage

### For Admins
1. Navigate to `/admin/gallery`
2. Click "Upload Image" to add new images
3. Use edit/delete buttons on image cards
4. Optional: Add titles and descriptions

### For Users
1. Navigate to `/gallery` from main menu
2. Click any image to view fullscreen
3. Use zoom controls, arrow keys, or swipe to navigate
4. Press Escape or click X to close viewer

## Navigation Integration

The gallery is accessible from:
- **Admin Panel**: Added to main navigation menu
- **User Menu**: Added to hamburger menu under "Gallery"

## Responsive Design

- **Mobile**: Single column grid, touch-friendly controls
- **Tablet**: 2-3 column grid
- **Desktop**: 4-5 column grid with hover effects

## Performance Features

- **Lazy Loading**: Images load as needed
- **Optimized Transforms**: Smooth zoom/rotate animations
- **Efficient Navigation**: Keyboard shortcuts and touch gestures
- **Loading States**: Visual feedback during operations

## Security

- **Admin Authentication**: All admin operations require authentication
- **File Validation**: Server-side file type and size validation
- **Access Control**: Gallery viewing is public, management is admin-only

## Dependencies

- **UploadThing**: File upload handling
- **Drizzle ORM**: Database operations
- **Next.js 14**: App router and API routes
- **Tailwind CSS**: Styling and responsive design
- **Radix UI**: Accessible UI components

## Setup

1. **Database**: Run migrations to create gallery table
2. **UploadThing**: Configure environment variables
3. **Permissions**: Ensure admin role access
4. **Navigation**: Gallery links are automatically added

## Customization

- **Grid Layout**: Modify CSS grid classes in gallery page
- **Upload Limits**: Adjust file size and type restrictions
- **Image Quality**: Configure compression and optimization
- **Theming**: Customize colors and styling via Tailwind

## Future Enhancements

- **Categories**: Organize images by themes
- **Search**: Find images by title/description
- **Bulk Operations**: Select multiple images for actions
- **Image Optimization**: Automatic resizing and compression
- **Analytics**: Track popular images and usage

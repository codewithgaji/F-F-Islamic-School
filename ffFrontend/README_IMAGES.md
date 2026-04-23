# Image Assets Guide

Place images in `src/assets/images/` using the structure below. The `<SchoolImage>`
component automatically falls back to inline Islamic-pattern SVG placeholders when
a file is missing or an API URL fails to load. API-provided URLs always take precedence.

## Folder structure

```
src/assets/images/
├── logo.png              (240x80) school logo
├── favicon.ico
├── hero/                 (1920x1080) hero-1.jpg ... hero-5.jpg
├── about/                (800x1000) about-main.jpg, about-secondary.jpg
├── classes/              (800x600) class-1..3.jpg
├── team/                 (400x400) teacher-1..4.jpg
├── gallery/              (800x800) gallery-1..6.jpg
├── blog/                 (800x500) blog-1..3.jpg
├── testimonials/         (200x200) parent-1..4.jpg
└── placeholder/          inline SVG placeholders are generated automatically
```

## Recommended dimensions

| Type        | Aspect | Suggested size |
| ----------- | ------ | -------------- |
| Hero        | 16:9   | 1920×1080      |
| About       | 4:5    | 800×1000       |
| Class card  | 4:3    | 800×600        |
| Teacher     | 1:1    | 400×400        |
| Gallery     | 1:1    | 800×800        |
| Blog        | 16:10  | 800×500        |
| Testimonial | 1:1    | 200×200        |

Replace placeholder SVGs with actual JPG/PNG files. API images will override local fallbacks automatically.

## API endpoints used by the frontend

Public:
- `GET /hero-slides`
- `GET /facilities`
- `GET /about-preview`, `GET /about`
- `GET /classes` (`?featured=true&limit=N` or `?limit=all`)
- `GET /teachers` (`?limit=N`)
- `GET /testimonials`
- `GET /blog-posts` (`?page=N&limit=6&sort=newest&search=&category=&tag=`)
- `GET /blog-posts/:id`, `GET /blog-posts/:id/related`, `GET /blog-posts/:id/comments`
- `POST /blog-posts/:id/comments`
- `GET /blog-categories`, `GET /blog-tags`
- `GET /gallery/categories`, `GET /gallery?category=:key`
- `GET /site-settings`
- `POST /bookings`
- `POST /contact`
- `POST /newsletter/subscribe`

Admin (require `Authorization: Bearer <token>`):
- `POST /auth/admin/login`
- `GET /admin/stats/{students|teachers|classes|messages}`
- `GET|POST /admin/hero-slides`, `PUT|DELETE /admin/hero-slides/:id`, `PATCH /admin/hero-slides/reorder`
- `GET|PUT /admin/site-settings`, `POST /admin/site-settings/logo`
- `GET|POST /admin/classes`, `PUT|DELETE /admin/classes/:id`
- `GET|POST /admin/teachers`, `PUT|DELETE /admin/teachers/:id`
- `GET|POST /admin/gallery`, `DELETE /admin/gallery/:id`
- `GET|POST /admin/facilities`, `PUT|DELETE /admin/facilities/:id`
- `GET|POST /admin/testimonials`, `PUT|DELETE /admin/testimonials/:id`
- `GET|PUT /admin/about`
- `GET|POST /admin/blog-posts`, `PUT|DELETE /admin/blog-posts/:id`
- `GET /admin/contact-messages`, `PATCH /admin/contact-messages/:id/read`
- `GET /admin/bookings`, `PATCH /admin/bookings/:id/status`
- `GET /admin/newsletter/subscribers`
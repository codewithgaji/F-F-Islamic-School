export interface HeroSlide {
  id: number;
  image_url: string;
  caption: string;
  subtitle: string;
}

export interface Facility {
  id: number;
  icon_name: string;
  title: string;
  description: string;
}

export interface AboutContent {
  main_image_url?: string;
  secondary_image_url?: string;
  image_url?: string;
  title: string;
  description: string;
  bullet_points: string[];
}

export interface SchoolClass {
  id: number;
  title: string;
  description: string;
  image_url: string;
  age_range: string;
  total_seats: number;
  class_time: string;
  monthly_fee: string;
  is_featured?: boolean;
}

export interface Teacher {
  id: number;
  name: string;
  role: string;
  image_url: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  parent_name: string;
  profession: string;
  image_url: string;
}

export interface BlogPost {
  id: number;
  title: string;
  image_url: string;
  author: string;
  category: string;
  comments_count: number;
  excerpt: string;
  created_at: string;
  content_html?: string;
  author_bio?: string;
  author_image_url?: string;
  tags?: string[];
}

export interface BlogComment {
  id: number;
  author_name: string;
  created_at: string;
  content: string;
  replies?: BlogComment[];
}

export interface GalleryCategory {
  id: number;
  label: string;
  filter_key: string;
}

export interface GalleryImage {
  id: number;
  image_url: string;
  category: string;
}

export interface SiteSettings {
  school_name?: string;
  tagline?: string;
  address: string;
  email: string;
  phone: string;
  opening_hours: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  class_id: number;
  class_title?: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AdminStats {
  count: number;
}
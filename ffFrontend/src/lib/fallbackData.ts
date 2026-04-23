import type {
  HeroSlide,
  Facility,
  SchoolClass,
  Teacher,
  Testimonial,
  BlogPost,
  GalleryCategory,
  GalleryImage,
  AboutContent,
  SiteSettings,
} from "@/types/api";

export const fallbackHero: HeroSlide[] = [
  { id: 1, image_url: "", caption: "Nurturing Faith & Knowledge", subtitle: "Quality Islamic education for tomorrow's leaders" },
  { id: 2, image_url: "", caption: "A Safe Place to Learn & Grow", subtitle: "Modern facilities, dedicated teachers, joyful children" },
  { id: 3, image_url: "", caption: "Rooted in Faith, Built for the Future", subtitle: "Where character, curiosity and confidence thrive" },
  { id: 4, image_url: "", caption: "Every Child is a Star", subtitle: "Discover, create and shine with us" },
  { id: 5, image_url: "", caption: "Learning Beyond the Classroom", subtitle: "Arts, sciences, sports and the love of Allah" },
];

export const fallbackFacilities: Facility[] = [
  { id: 1, icon_name: "Gamepad2", title: "Playground", description: "Safe and engaging play areas designed for young minds and bodies." },
  { id: 2, icon_name: "Music", title: "Music & Dance", description: "Creative movement and rhythm classes that build confidence." },
  { id: 3, icon_name: "Palette", title: "Arts & Crafts", description: "Hands-on creative learning that sparks imagination." },
  { id: 4, icon_name: "Bus", title: "Safe Transportation", description: "Reliable, supervised pick-up and drop-off services." },
  { id: 5, icon_name: "Apple", title: "Healthy Food", description: "Nutritious halal meals prepared with care every day." },
  { id: 6, icon_name: "MapPin", title: "Educational Tours", description: "Field trips that turn curiosity into discovery." },
];

export const fallbackClasses: SchoolClass[] = [
  { id: 1, title: "Drawing Class", description: "Spark creativity through colors and shapes.", image_url: "", age_range: "4 - 6 yrs", total_seats: 25, class_time: "9:00 - 10:00 AM", monthly_fee: "$45", is_featured: true },
  { id: 2, title: "Language Learning", description: "Arabic, English & local language fundamentals.", image_url: "", age_range: "5 - 7 yrs", total_seats: 30, class_time: "10:30 - 11:30 AM", monthly_fee: "$55", is_featured: true },
  { id: 3, title: "Basic Science", description: "Discover the wonders of Allah's creation through play.", image_url: "", age_range: "6 - 8 yrs", total_seats: 28, class_time: "1:00 - 2:00 PM", monthly_fee: "$50", is_featured: true },
  { id: 4, title: "Quran Recitation", description: "Foundational tajweed and memorization with care.", image_url: "", age_range: "5 - 8 yrs", total_seats: 20, class_time: "8:00 - 9:00 AM", monthly_fee: "$40" },
  { id: 5, title: "Mathematics Fun", description: "Numbers come alive with games and puzzles.", image_url: "", age_range: "5 - 7 yrs", total_seats: 25, class_time: "11:00 - 12:00 PM", monthly_fee: "$45" },
  { id: 6, title: "Storytelling", description: "Tales of the Prophets and beautiful Islamic morals.", image_url: "", age_range: "4 - 7 yrs", total_seats: 30, class_time: "2:00 - 3:00 PM", monthly_fee: "$35" },
];

export const fallbackTeachers: Teacher[] = [
  { id: 1, name: "Ustadha Aisha Rahman", role: "Head Teacher", image_url: "", twitter: "#", facebook: "#", linkedin: "#" },
  { id: 2, name: "Ustadh Yusuf Ali", role: "Quran Instructor", image_url: "", twitter: "#", facebook: "#", linkedin: "#" },
  { id: 3, name: "Ms. Khadija Hassan", role: "Arts & Crafts", image_url: "", twitter: "#", facebook: "#", linkedin: "#" },
  { id: 4, name: "Mr. Ibrahim Khan", role: "Science & Math", image_url: "", twitter: "#", facebook: "#", linkedin: "#" },
];

export const fallbackTestimonials: Testimonial[] = [
  { id: 1, quote: "My daughter has blossomed since joining. The teachers truly care about each child's growth.", parent_name: "Fatima Bello", profession: "Parent", image_url: "" },
  { id: 2, quote: "A wonderful environment that balances faith, fun and serious learning. Highly recommended.", parent_name: "Ahmed Suleiman", profession: "Parent", image_url: "" },
  { id: 3, quote: "The facilities are excellent and the staff are dedicated. My son loves coming to school.", parent_name: "Maryam Yusuf", profession: "Parent", image_url: "" },
  { id: 4, quote: "Beautiful Islamic values combined with quality education — exactly what we wanted.", parent_name: "Hassan Mohammed", profession: "Parent", image_url: "" },
];

export const fallbackBlog: BlogPost[] = [
  { id: 1, title: "5 Tips to Help Your Child Love Learning", image_url: "", author: "Ustadha Aisha", category: "Parenting", comments_count: 8, excerpt: "Curiosity is a gift — here's how to nurture it at home and in school.", created_at: "2025-03-12" },
  { id: 2, title: "The Beauty of Early Quran Memorization", image_url: "", author: "Ustadh Yusuf", category: "Faith", comments_count: 12, excerpt: "Why starting young plants seeds that bloom for a lifetime.", created_at: "2025-02-28" },
  { id: 3, title: "Healthy Snacks Kids Will Actually Eat", image_url: "", author: "Ms. Khadija", category: "Wellness", comments_count: 5, excerpt: "Simple, nutritious recipes your little ones will love.", created_at: "2025-02-10" },
  { id: 4, title: "Building Character Through Stories", image_url: "", author: "Mr. Ibrahim", category: "Education", comments_count: 4, excerpt: "How tales of the Prophets shape young hearts.", created_at: "2025-01-22" },
  { id: 5, title: "Why Play Matters in Early Education", image_url: "", author: "Ustadha Aisha", category: "Education", comments_count: 7, excerpt: "Play is serious learning — here's the science.", created_at: "2025-01-08" },
  { id: 6, title: "A Day in the Life at F&F Centre", image_url: "", author: "School Team", category: "School Life", comments_count: 10, excerpt: "Take a peek inside our joyful classrooms.", created_at: "2024-12-18" },
];

export const fallbackGalleryCategories: GalleryCategory[] = [
  { id: 0, label: "All", filter_key: "all" },
  { id: 1, label: "Playing", filter_key: "playing" },
  { id: 2, label: "Drawing", filter_key: "drawing" },
  { id: 3, label: "Reading", filter_key: "reading" },
];

export const fallbackGallery: GalleryImage[] = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  image_url: "",
  category: ["playing", "drawing", "reading"][i % 3],
}));

export const fallbackAbout: AboutContent = {
  main_image_url: "",
  secondary_image_url: "",
  image_url: "",
  title: "A loving home where children grow in faith and knowledge",
  description:
    "F&F Islamic Super Kiddies Centre is a primary school dedicated to nurturing the heart, mind and spirit of every child. We blend authentic Islamic teaching with a modern, joyful learning experience.",
  bullet_points: [
    "Qualified, caring teachers who know each child by name",
    "Balanced curriculum: faith, academics, arts and play",
    "Safe, modern facilities and supervised transport",
    "Active parent community and regular family events",
  ],
};

export const fallbackSiteSettings: SiteSettings = {
  school_name: "F&F Islamic Super Kiddies Centre",
  tagline: "Nurturing faith, knowledge and character.",
  address: "12 Knowledge Avenue, Lagos, Nigeria",
  email: "hello@ffsuperkiddies.school",
  phone: "+234 800 123 4567",
  opening_hours: "Mon - Fri: 7:30 AM – 4:00 PM",
  facebook: "#",
  twitter: "#",
  instagram: "#",
  linkedin: "#",
  whatsapp: "#",
};
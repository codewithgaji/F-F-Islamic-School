from fastapi import FastAPI
from sqlalchemy import text
from core.init_db import lifespan
from fastapi.middleware.cors import CORSMiddleware
from db.models.authmodels import AdminUserModel
from db.models.blogmodels import BlogCategoryModel, BlogCommentModel, BlogPostModel, BlogPostTagModel, BlogTagModel
from db.models.contentmodels import ClassModel, GalleryCategoryModel
from db.models.settingsmodels import  SiteSettingsModel
from db.models.submissionModels import NewsletterSubscriberModel, BookingModel, ContactMessageModel
from routers.auth import authRouter
from routers.admin.hero_slides import adminHeroRouter
from routers.admin.classes import adminClassRouter
from routers.admin.settings import adminSettingsRouter
from fastapi.staticfiles import StaticFiles
from routers.admin.gallery import adminGalleryRouter
from routers.admin.blog import adminBlogRouter
from routers.admin.submissions import adminSubmissionsRouter
from routers.admin.teachers import adminTeacherRouter
from routers.about import AboutRouter
from routers.admin.about import adminAboutRouter
from routers.blog import blogRouter
from routers.classes import classesRouter
from routers.facilities import facilitiesRouter
from routers.admin.facilities import adminFacilitiesRouter
from routers.gallery import galleryRouter
from routers.hero_slides import heroSlidesRouter
from routers.settings import settingsRouter
from routers.submissions import submissionsRouter
from routers.submissions import submissionsRouter
from routers.teachers import teachersRouter
from routers.testimonials import testimonialsRouter
from routers.admin.testimonials import adminTestimonialsRouter
from routers.admin.stats import adminStatsRouter




app = FastAPI(
    title="F&F Islamic School API ENDPOINTS",
    lifespan=lifespan,
    redirect_slashes=False
)

# origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080")
# ALLOWED_ORIGINS = [o.strip() for o in origins_raw.split(",")]

# This it to Block X-CrossSite scripting.
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response





app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"], 
)
 


app.include_router(authRouter, tags=["Auth"], prefix="/auth")
app.include_router(adminHeroRouter, prefix="/admin/hero-slides", tags=["Admin - Hero Slides"])
app.include_router(adminClassRouter, prefix="/admin/classes", tags=["Admin - Classes"])
app.include_router(adminSettingsRouter, prefix="/admin/settings", tags=["Admin - Settings"])
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(adminGalleryRouter, prefix="/admin/gallery", tags=["Admin - Gallery"])
app.include_router(adminBlogRouter, prefix="/admin/blog", tags=["Admin - Blog"])
app.include_router(adminSubmissionsRouter, prefix="/admin/submissions", tags=["Admin - Submissions"])
app.include_router(adminTeacherRouter, prefix="/admin/teachers", tags=["Admin - Teachers"])
app.include_router(AboutRouter, prefix="/about", tags=["Public - About"])
app.include_router(adminAboutRouter, prefix="/admin/about", tags=["Admin - About"])
app.include_router(blogRouter, prefix="/blog", tags=["Blog"])
app.include_router(classesRouter, prefix="/classes", tags=["Classes"])
app.include_router(facilitiesRouter, prefix="/facilities", tags=["Facilities"])
app.include_router(adminFacilitiesRouter, prefix="/admin/facilities", tags=["Admin - Facilities"])
app.include_router(galleryRouter, prefix="/gallery", tags=["Gallery"])
app.include_router(heroSlidesRouter, prefix="/hero-slides", tags=["Hero Slides"])
app.include_router(settingsRouter, prefix="/site-settings", tags=["Site Settings"])
app.include_router(submissionsRouter, prefix="/submissions", tags=["Submissions"])
app.include_router(submissionsRouter, prefix="/submissions", tags=["Submissions"])
app.include_router(teachersRouter, prefix="/teachers", tags=["Teachers"])
app.include_router(testimonialsRouter, prefix="/testimonials", tags=["Testimonials"])
app.include_router(adminTestimonialsRouter, prefix="/admin/testimonials", tags=["Admin - Testimonials"])
app.include_router(adminStatsRouter, prefix="/admin/stats", tags=["Admin - Stats"])





@app.get("/")
def fandfbackend():
    return {
        "F And F Backend is Officially active 😊"
    }



@app.get("/health")
def health_check():
    return {"status": "F and F API is running..."}

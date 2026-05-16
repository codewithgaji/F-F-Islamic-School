from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from schemas.blog_schemas import (
    BlogPostResponse,
    BlogCategoryCreate,
    BlogCategoryResponse,
    BlogTagCreate,
    BlogTagResponse,
    BlogCommentResponse
)
from services.blog_service import (
    get_all_posts,
    get_post_by_id,
    get_related_posts,
    create_post,
    update_post,
    delete_post,
    get_all_categories,
    create_category,
    delete_category,
    get_all_tags,
    create_tag,
    delete_tag,
    attach_tag_to_post,
    detach_tag_from_post,
    get_comments_by_post,
    delete_comment
)
from core.security.dependencies import get_current_admin
from utils.cloudinary_helper import CloudinaryHelper
from pydantic import BaseModel

adminBlogRouter = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]


class AttachTagRequest(BaseModel):
    tag_id: int


# --- POST ROUTES ---

@adminBlogRouter.get("/posts", response_model=list[BlogPostResponse])
def get_posts(
    page: int = 1,
    limit: int = 6,
    search: str = None,
    sort: str = "newest",
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_posts(db, page=page, limit=limit, search=search, sort=sort)


@adminBlogRouter.get("/posts/{post_id}", response_model=BlogPostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@adminBlogRouter.get("/posts/{post_id}/related", response_model=list[BlogPostResponse])
def get_related(
    post_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_related_posts(db, post_id)


@adminBlogRouter.post("/posts", response_model=BlogPostResponse, status_code=201)
def add_post(
    title: str = Form(...),
    content_html: str = Form(...),
    excerpt: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    author_bio: Optional[str] = Form(None),
    author_image_url: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    image_url = None
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/blog")

    from schemas.blog_schemas import BlogPostCreate
    data = BlogPostCreate(
        title=title,
        content_html=content_html,
        excerpt=excerpt,
        author=author,
        author_bio=author_bio,
        author_image_url=author_image_url,
        category_id=category_id,
        image_url=image_url
    )
    return create_post(db, data)


@adminBlogRouter.put("/posts/{post_id}", response_model=BlogPostResponse)
def edit_post(
    post_id: int,
    title: Optional[str] = Form(None),
    content_html: Optional[str] = Form(None),
    excerpt: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    author_bio: Optional[str] = Form(None),
    author_image_url: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_post_by_id(db, post_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    image_url = existing.image_url
    if image and image.filename:
        if image.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP allowed")
        if existing.image_url:
            old_public_id = CloudinaryHelper.extract_public_id(existing.image_url)
            if old_public_id:
                CloudinaryHelper.delete_image(old_public_id)
        image_url = CloudinaryHelper.upload_image(image.file, folder="fandf/blog")

    from schemas.blog_schemas import BlogPostUpdate
    data = BlogPostUpdate(
        title=title,
        content_html=content_html,
        excerpt=excerpt,
        author=author,
        author_bio=author_bio,
        author_image_url=author_image_url,
        category_id=category_id,
        image_url=image_url
    )
    post = update_post(db, post_id, data)
    return post


@adminBlogRouter.delete("/posts/{post_id}", status_code=204)
def remove_post(
    post_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = get_post_by_id(db, post_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    if existing.image_url:
        public_id = CloudinaryHelper.extract_public_id(existing.image_url)
        if public_id:
            CloudinaryHelper.delete_image(public_id)
    delete_post(db, post_id)


# --- CATEGORY ROUTES ---

@adminBlogRouter.get("/categories", response_model=list[BlogCategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_categories(db)


@adminBlogRouter.post("/categories", response_model=BlogCategoryResponse, status_code=201)
def add_category(
    data: BlogCategoryCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return create_category(db, data.name)


@adminBlogRouter.delete("/categories/{category_id}", status_code=204)
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    category = delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")


# --- TAG ROUTES ---

@adminBlogRouter.get("/tags", response_model=list[BlogTagResponse])
def get_tags(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_all_tags(db)


@adminBlogRouter.post("/tags", response_model=BlogTagResponse, status_code=201)
def add_tag(
    data: BlogTagCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return create_tag(db, data.name)


@adminBlogRouter.delete("/tags/{tag_id}", status_code=204)
def remove_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    tag = delete_tag(db, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")


@adminBlogRouter.post("/posts/{post_id}/tags", status_code=201)
def attach_tag(
    post_id: int,
    data: AttachTagRequest,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return attach_tag_to_post(db, post_id, data.tag_id)


@adminBlogRouter.delete("/posts/{post_id}/tags/{tag_id}", status_code=204)
def detach_tag(
    post_id: int,
    tag_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = detach_tag_from_post(db, post_id, tag_id)
    if not result:
        raise HTTPException(status_code=404, detail="Tag not attached to this post")


# --- COMMENT ROUTES ---

@adminBlogRouter.get("/posts/{post_id}/comments", response_model=list[BlogCommentResponse])
def get_comments(
    post_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return get_comments_by_post(db, post_id)


@adminBlogRouter.delete("/comments/{comment_id}", status_code=204)
def remove_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    comment = delete_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.blog_schemas import (
    BlogPostResponse,
    BlogCategoryResponse,
    BlogTagResponse,
    BlogCommentCreate,
    BlogCommentResponse
)
from services.blog_service import (
    get_all_posts,
    get_post_by_id,
    get_related_posts,
    get_all_categories,
    get_all_tags,
    get_comments_by_post,
    create_comment
)

blogRouter = APIRouter()


# --- POST ROUTES ---

@blogRouter.get("/posts", response_model=list[BlogPostResponse])
def get_posts(
    page: int = 1,
    limit: int = 6,
    search: str = None,
    sort: str = "newest",
    db: Session = Depends(get_db)
):
    return get_all_posts(db, page=page, limit=limit, search=search, sort=sort)


@blogRouter.get("/posts/{post_id}", response_model=BlogPostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@blogRouter.get("/posts/{post_id}/related", response_model=list[BlogPostResponse])
def get_related(
    post_id: int,
    db: Session = Depends(get_db)
):
    return get_related_posts(db, post_id)


# --- COMMENT ROUTES ---

@blogRouter.get("/posts/{post_id}/comments", response_model=list[BlogCommentResponse])
def get_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    return get_comments_by_post(db, post_id)


@blogRouter.post("/posts/{post_id}/comments", response_model=BlogCommentResponse, status_code=201)
def add_comment(
    post_id: int,
    data: BlogCommentCreate,
    db: Session = Depends(get_db)
):
    if data.post_id != post_id:
        raise HTTPException(status_code=400, detail="post_id in body does not match URL")
    return create_comment(db, data)


# --- CATEGORY ROUTES ---

@blogRouter.get("/categories", response_model=list[BlogCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return get_all_categories(db)


# --- TAG ROUTES ---

@blogRouter.get("/tags", response_model=list[BlogTagResponse])
def get_tags(db: Session = Depends(get_db)):
    return get_all_tags(db)
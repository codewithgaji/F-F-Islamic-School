from sqlalchemy.orm import Session
from db.models.blogmodels import (
    BlogPostModel,
    BlogCategoryModel,
    BlogTagModel,
    BlogPostTagModel,
    BlogCommentModel
)
from schemas.blog_schemas import (
    BlogPostCreate,
    BlogPostUpdate,
    BlogCommentCreate
)


# --- POST SERVICES ---

def get_all_posts(db: Session, page: int = 1, limit: int = 6, search: str = None, sort: str = "newest"):
    query = db.query(BlogPostModel)
    if search:
        query = query.filter(BlogPostModel.title.ilike(f"%{search}%"))
    if sort == "newest":
        query = query.order_by(BlogPostModel.created_at.desc())
    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()


def get_post_by_id(db: Session, post_id: int):
    return db.query(BlogPostModel).filter(BlogPostModel.id == post_id).first()


def get_related_posts(db: Session, post_id: int, limit: int = 3):
    post = get_post_by_id(db, post_id)
    if not post:
        return []
    return db.query(BlogPostModel).filter(
        BlogPostModel.category == post.category,
        BlogPostModel.id != post_id
    ).limit(limit).all()


def create_post(db: Session, data: BlogPostCreate):
    post = BlogPostModel(
        title=data.title,
        excerpt=data.excerpt,
        content_html=data.content_html,
        image_url=data.image_url,
        author=data.author,
        author_bio=data.author_bio,
        author_image_url=data.author_image_url,
        category=data.category_id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_post(db: Session, post_id: int, data: BlogPostUpdate):
    post = get_post_by_id(db, post_id)
    if not post:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(post, key, value)
    db.commit()
    db.refresh(post)
    return post


def delete_post(db: Session, post_id: int):
    post = get_post_by_id(db, post_id)
    if not post:
        return None
    db.delete(post)
    db.commit()
    return post


# --- CATEGORY SERVICES ---

def get_all_categories(db: Session):
    return db.query(BlogCategoryModel).all()


def create_category(db: Session, name: str):
    category = BlogCategoryModel(name=name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int):
    category = db.query(BlogCategoryModel).filter(
        BlogCategoryModel.id == category_id
    ).first()
    if not category:
        return None
    db.delete(category)
    db.commit()
    return category


# --- TAG SERVICES ---

def get_all_tags(db: Session):
    return db.query(BlogTagModel).all()


def create_tag(db: Session, name: str):
    tag = BlogTagModel(name=name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def delete_tag(db: Session, tag_id: int):
    tag = db.query(BlogTagModel).filter(BlogTagModel.id == tag_id).first()
    if not tag:
        return None
    db.delete(tag)
    db.commit()
    return tag


def attach_tag_to_post(db: Session, post_id: int, tag_id: int):
    existing = db.query(BlogPostTagModel).filter(
        BlogPostTagModel.post_id == post_id,
        BlogPostTagModel.tag_id == tag_id
    ).first()
    if existing:
        return existing
    post_tag = BlogPostTagModel(post_id=post_id, tag_id=tag_id)
    db.add(post_tag)
    db.commit()
    return post_tag


def detach_tag_from_post(db: Session, post_id: int, tag_id: int):
    post_tag = db.query(BlogPostTagModel).filter(
        BlogPostTagModel.post_id == post_id,
        BlogPostTagModel.tag_id == tag_id
    ).first()
    if not post_tag:
        return None
    db.delete(post_tag)
    db.commit()
    return post_tag


# --- COMMENT SERVICES ---

def get_comments_by_post(db: Session, post_id: int):
    return db.query(BlogCommentModel).filter(
        BlogCommentModel.post_id == post_id,
        BlogCommentModel.parent_id == None
    ).all()


def create_comment(db: Session, data: BlogCommentCreate):
    comment = BlogCommentModel(
        post_id=data.post_id,
        author_name=data.author_name,
        email=data.email,
        website=data.website,
        content=data.content,
        parent_id=data.parent_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def delete_comment(db: Session, comment_id: int):
    comment = db.query(BlogCommentModel).filter(
        BlogCommentModel.id == comment_id
    ).first()
    if not comment:
        return None
    db.delete(comment)
    db.commit()
    return comment
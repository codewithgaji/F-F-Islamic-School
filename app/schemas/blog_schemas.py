from pydantic import BaseModel, ConfigDict,  Field
from typing import Optional
from datetime import datetime

# BLOG SCHEMAS
class BlogPostBase(BaseModel):
  title: str
  excerpt: Optional[str] = None
  image_url: Optional[str] = None
  author: Optional[str] = None
  author_bio: Optional[str] = None
  author_image_url: Optional[str] = None
  category_id: int
  content_html: Optional[str] = None



class BlogPostCreate(BlogPostBase):
  pass


# Setting every field to optional for the update schema, so that we can do partial updates
class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    author: Optional[str] = None
    author_bio: Optional[str] = None
    author_image_url: Optional[str] = None
    category_id: Optional[int] = None
    content_html: Optional[str] = None



class BlogPostResponse(BlogPostBase):
  id: int
  created_at: datetime

  model_config = ConfigDict(
    from_attributes = True
  )


#CATEGORY SCHEMAS
class BlogCategoryCreate(BaseModel):
  name: str

class BlogCategoryResponse(BaseModel):
  id: int
  name: str

  model_config = ConfigDict(
    from_attributes = True
  )




#TAG SCHEMAS
class BlogTagCreate(BaseModel):
  name: str

class BlogTagResponse(BaseModel):
  id: int
  name: str

  model_config = ConfigDict(
    from_attributes = True
  )




class BlogCommentCreate(BaseModel):
  post_id: int
  author_name: str
  email: str
  website: Optional[str] = None
  content: str
  parent_id: Optional[int] = None



class BlogCommentResponse(BaseModel):
  id: int
  post_id: int
  author_name: str
  email: str
  website: Optional[str] = None
  content: str
  created_at: datetime
  parent_id: Optional[int] = None
  replies: Optional[list['BlogCommentResponse']] = None # This is for nested comments, it will contain the replies to this comment

  model_config = ConfigDict(
    from_attributes = True
  )
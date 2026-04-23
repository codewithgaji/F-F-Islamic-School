from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base
from sqlalchemy import DateTime
from datetime import datetime

class BlogPostModel(Base):
  __tablename__ = "blog_posts"
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False)
  excerpt = Column(String, nullable=True)
  content_html = Column(Text, nullable=False)
  image_url = Column(String, nullable=True)
  author = Column(String, nullable=True)
  author_bio = Column(Text, nullable=True)
  author_image_url = Column(String, nullable=True)
  category = Column(Integer, ForeignKey('blog_categories.id', ondelete='CASCADE'), nullable=False) # This is the foreign key to the blog category
  created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class BlogCategoryModel(Base):
  __tablename__="blog_categories"
  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)


class BlogTagModel(Base):
  __tablename__ = "blog_tags"
  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)



class BlogPostTagModel(Base):
  __tablename__ = "blog_post_tags"
  post_id = Column(Integer, ForeignKey('blog_posts.id', ondelete='CASCADE'), primary_key=True)
  tag_id = Column(Integer, ForeignKey('blog_tags.id', ondelete='CASCADE'), primary_key=True)


class BlogCommentModel(Base):
  __tablename__="blog_comments"
  id = Column(Integer, primary_key=True, index=True)
  post_id = Column(Integer, ForeignKey('blog_posts.id', ondelete='CASCADE'), nullable=False) # This is the foreign key to the blog post
  author_name = Column(String, nullable=False)
  email = Column(String, nullable=False)
  website = Column(String, nullable=True)
  content = Column(Text, nullable=False)
  created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
  parent_id = Column(Integer, ForeignKey('blog_comments.id', ondelete='CASCADE'), nullable=True) # This is the foreign key to the parent comment for nested comments

  

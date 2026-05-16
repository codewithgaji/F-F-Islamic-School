from sqlalchemy import Boolean, Column, Integer, String, Text, JSON, ForeignKey
from db.database import Base

# This is for the public contents
class HeroSlidesModel(Base):
  __tablename__= 'hero_slides'
  id = Column(Integer, primary_key=True, index=True)
  image_url = Column(String, nullable=False)
  caption = Column(String, nullable=True)
  subtitle = Column(String, nullable=True)
  order = Column(Integer, nullable=False)
  is_active = Column(Boolean, nullable=False, default=1)




# These are the facilities model.
class FacilityModel(Base):
  __tablename__ = "facilities"
  id = Column(Integer, primary_key=True, index=True)
  icon_name = Column(String, nullable=False)
  title = Column(String, nullable=False)
  description = Column(Text, nullable=False)


class AboutModel(Base):
  __tablename__="about"
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False)
  description = Column(Text, nullable=False)
  main_image_url = Column(String, nullable=False)
  secondary_image_url = Column(String, nullable=True)
  bullet_points = Column(JSON, nullable=True)



class TeacherModel(Base):
  __tablename__ = "teachers"
  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  role = Column(String, nullable=False)
  bio = Column(Text, nullable=True)
  image_url = Column(String, nullable=True)
  twitter = Column(String, nullable=True)
  facebook = Column(String, nullable=True)
  linkedin = Column(String, nullable=True)



class ClassModel(Base):
  __tablename__= "classes"
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False)
  description = Column(Text, nullable=True)
  image_url = Column(String, nullable=True)
  age_range = Column(String, nullable=True)
  total_seats = Column(Integer, nullable=True)
  class_time = Column(String, nullable=True)
  monthly_fee = Column(String, nullable=True) # This is stored like this to avoid currency formatting
  is_featured = Column(Boolean, default=False, nullable=False)



class TestimonialModel(Base):
  __tablename__ = "testimonials"
  id = Column(Integer, primary_key=True, index=True)
  quote = Column(Text, nullable=False)
  parent_name = Column(String, nullable=False)
  profession = Column(String, nullable=True)
  image_url = Column(String, nullable=True)




class GalleryCategoryModel(Base):
  __tablename__ = "gallery_categories"
  id = Column(Integer, primary_key=True, index=True)
  label = Column(String, nullable=False)
  filter_key = Column(String, nullable=False)



class GalleryModel(Base):
  __tablename__ = "gallery"
  id = Column(Integer, primary_key=True, index=True)
  image_url = Column(String, nullable=False)
  category = Column(Integer, ForeignKey('gallery_categories.id', ondelete='CASCADE'), nullable=False) # This is the foreign key to the gallery category


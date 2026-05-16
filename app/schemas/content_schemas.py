from pydantic import BaseModel, ConfigDict
from typing import Optional


# HERO SLIDE SCHEMAS
class HeroSlideBase(BaseModel):
  image_url: str
  caption: str
  subtitle: str
  order: int
  is_active: bool = True


class HeroSlideCreate(HeroSlideBase):
  pass


class HeroSlideUpdate(BaseModel):
  image_url: Optional[str] = None
  caption: Optional[str] = None
  subtitle: Optional[str] = None
  order: Optional[int] = None
  is_active: Optional[bool] = None


class HeroSlideResponse(HeroSlideBase):
  id: int

  model_config = ConfigDict(
    from_attributes = True
  )



# FACILITY SCHEMAS
class FacilityCreate(BaseModel):
  icon_name: str
  title: str
  descriptions: str


class FacilityUpdate(BaseModel):
  icon_name: Optional[str] = None
  title: Optional[str] = None
  descriptions: Optional[str] = None  


class FacilityResponse(BaseModel):
  id: int
  icon_name: str
  title: str
  descriptions: str

  model_config = ConfigDict(
    from_attributes = True
  )



# ABOUT SCHEMAS
class AboutCreate(BaseModel):
  title: str
  description: str
  main_image_url: str
  secondary_image_url: Optional[str] = None
  bullet_points: Optional[list] = None


class AboutUpdate(BaseModel):
  title: Optional[str] = None
  description: Optional[str] = None
  main_image_url: Optional[str] = None
  secondary_image_url: Optional[str] = None
  bullet_points: Optional[list] = None


class AboutResponse(BaseModel):
    id: int
    title: str
    description: str
    main_image_url: str
    secondary_image_url: Optional[str] = None
    bullet_points: Optional[list] = None

    model_config = ConfigDict(from_attributes=True)




class TeacherCreate(BaseModel):
  name: str
  role: str
  bio: Optional[str] = None
  image_url: Optional[str] = None
  twitter: Optional[str] = None
  facebook: Optional[str] = None
  linkedin: Optional[str] = None


class TeacherUpdate(BaseModel):
  name: Optional[str] = None
  role: Optional[str] = None
  bio: Optional[str] = None
  image_url: Optional[str] = None
  twitter: Optional[str] = None
  facebook: Optional[str] = None
  linkedin: Optional[str] = None

class TeacherResponse(BaseModel):
  id: int
  name: str
  role: str
  bio: Optional[str] = None
  image_url: Optional[str] = None
  twitter: Optional[str] = None
  facebook: Optional[str] = None
  linkedin: Optional[str] = None

  model_config = ConfigDict(
    from_attributes = True
  )


class ClassCreate(BaseModel):
  title: str
  description: Optional[str] = None
  image_url: Optional[str] = None
  age_range: Optional[str] = None
  total_seats: Optional[int] = None
  class_time: Optional[str] = None
  monthly_fee: Optional[str] = None # This is stored like this to avoid currency formatting
  is_featured: bool = False


class ClassUpdate(BaseModel):
  title: Optional[str] = None
  description: Optional[str] = None
  image_url: Optional[str] = None
  age_range: Optional[str] = None
  total_seats: Optional[int] = None
  class_time: Optional[str] = None
  monthly_fee: Optional[str] = None # This is stored like this to avoid currency formatting
  is_featured: Optional[bool] = None


class ClassResponse(BaseModel):
  id: int
  title: str
  description: Optional[str] = None
  image_url: Optional[str] = None
  age_range: Optional[str] = None
  total_seats: Optional[int] = None
  class_time: Optional[str] = None
  monthly_fee: Optional[str] = None # This is stored like this to avoid currency formatting
  is_featured: bool

  model_config = ConfigDict(
    from_attributes = True
  )



class TestimonialCreate(BaseModel):
  quote: str
  parent_name: str
  profession: Optional[str] = None
  image_url: Optional[str] = None

class TestimonialUpdate(BaseModel):
  quote: Optional[str] = None
  parent_name: Optional[str] = None
  profession: Optional[str] = None
  image_url: Optional[str] = None

class TestimonialResponse(BaseModel):
  id: int
  quote: str
  parent_name: str
  profession: Optional[str] = None
  image_url: Optional[str] = None

  model_config = ConfigDict(
    from_attributes = True
  )


class GalleryCategoryCreate(BaseModel):
  label: str
  filter_key: str


class GalleryCategoryResponse(BaseModel):
  id: int
  label: str
  filter_key: str

  model_config = ConfigDict(
    from_attributes = True
  )

class GalleryCreate(BaseModel):
  image_url: str
  category_id: int

class GalleryResponse(BaseModel):
  id: int
  image_url: str
  category_id: int

  model_config = ConfigDict(
    from_attributes = True
  )

class GalleryUpdate(BaseModel):
  image_url: Optional[str] = None
  category_id: Optional[int] = None



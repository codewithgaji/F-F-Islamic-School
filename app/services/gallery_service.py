from sqlalchemy.orm import Session
from db.models.contentmodels import GalleryModel, GalleryCategoryModel
from schemas.content_schemas import GalleryCreate, GalleryUpdate


def get_all_images(db: Session, category_filter_key: str = None):
    query = db.query(GalleryModel)
    if category_filter_key:
        category = db.query(GalleryCategoryModel).filter(
            GalleryCategoryModel.filter_key == category_filter_key
        ).first()
        if category:
            query = query.filter(GalleryModel.category == category.id)
    return query.all()


def get_image_by_id(db: Session, image_id: int):
    return db.query(GalleryModel).filter(GalleryModel.id == image_id).first()


def create_image(db: Session, data: GalleryCreate):
    image = GalleryModel(
        image_url=data.image_url,
        category=data.category_id
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


def update_image(db: Session, image_id: int, data: GalleryUpdate):
    image = get_image_by_id(db, image_id)
    if not image:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(image, key, value)
    db.commit()
    db.refresh(image)
    return image


def delete_image(db: Session, image_id: int):
    image = get_image_by_id(db, image_id)
    if not image:
        return None
    db.delete(image)
    db.commit()
    return image


def get_all_categories(db: Session):
    return db.query(GalleryCategoryModel).all()


def create_category(db: Session, label: str, filter_key: str):
    category = GalleryCategoryModel(
        label=label,
        filter_key=filter_key
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int):
    category = db.query(GalleryCategoryModel).filter(
        GalleryCategoryModel.id == category_id
    ).first()
    if not category:
        return None
    db.delete(category)
    db.commit()
    return category
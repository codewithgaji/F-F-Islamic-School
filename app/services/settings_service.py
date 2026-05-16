from sqlalchemy.orm import Session
from db.models.settingsmodels import SiteSettingsModel
from schemas.settings_schemas import SiteSettingsUpdate


def get_settings(db: Session):
    return db.query(SiteSettingsModel).filter(SiteSettingsModel.id == 1).first()


def update_settings(db: Session, data: SiteSettingsUpdate):
    settings = get_settings(db)
    if not settings:
        # Create the single row if it doesn't exist yet
        settings = SiteSettingsModel(id=1)
        db.add(settings)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings


def update_logo(db: Session, logo_url: str):
    settings = get_settings(db)
    if not settings:
        settings = SiteSettingsModel(id=1)
        db.add(settings)
    settings.logo_url = logo_url
    db.commit()
    db.refresh(settings)
    return settings
from logging.config import fileConfig
from sqlalchemy import pool
from alembic import context
from db.database import Base, DATABASE_URL, engine
from db.models.authmodels import AdminUserModel
from db.models.blogmodels import BlogPostModel, BlogCategoryModel, BlogTagModel, BlogPostTagModel, BlogCommentModel
from db.models.contentmodels import HeroSlidesModel, FacilityModel, AboutModel, TeacherModel, ClassModel, TestimonialModel, GalleryCategoryModel, GalleryModel
from db.models.settingsmodels import SiteSettingsModel
from db.models.submissionModels import ContactMessageModel, BookingModel, NewsletterSubscriberModel

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
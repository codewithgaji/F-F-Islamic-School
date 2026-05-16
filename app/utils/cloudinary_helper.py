import cloudinary
import cloudinary.uploader
from decouple import config

cloudinary.config(
    cloud_name=config("CLOUDINARY_CLOUD_NAME"),
    api_key=config("CLOUDINARY_API_KEY"),
    api_secret=config("CLOUDINARY_API_SECRET"),
    secure=True
)


class CloudinaryHelper:

    @staticmethod
    def upload_image(file, folder: str = "fandf") -> str:
        """
        Uploads an image to Cloudinary and returns the secure URL.
        folder: organizes uploads into subfolders e.g. 'fandf/hero', 'fandf/teachers'
        """
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image"
        )
        return result["secure_url"]

    @staticmethod
    def delete_image(public_id: str) -> dict:
        """
        Deletes an image from Cloudinary by its public_id.
        """
        result = cloudinary.uploader.destroy(public_id)
        return result

    @staticmethod
    def extract_public_id(image_url: str) -> str:
        """
        Extracts the public_id from a Cloudinary URL so you can delete it later.
        Example URL: https://res.cloudinary.com/demo/image/upload/v123/fandf/hero/abc.jpg
        Returns: fandf/hero/abc
        """
        parts = image_url.split("/upload/")
        if len(parts) < 2:
            return ""
        path = parts[1]
        # Remove version prefix if present e.g. v1234567/
        if path.startswith("v") and "/" in path:
            path = path.split("/", 1)[1]
        # Remove file extension
        public_id = path.rsplit(".", 1)[0]
        return public_id
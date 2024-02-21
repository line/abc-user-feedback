# ABC User Feedback Guide

## Image Storage Integration

ABC User Feedback supports the integration of image storage solutions to handle images submitted as part of user feedback. We currently support AWS S3 and S3-compatible storage services.

### Uploading Images

There are two methods for uploading images associated with feedback:

1. **Multipart Upload API**: This method requires setting up the [image configuration](#configuration). Once configured, you can use the multipart upload API to securely upload images directly to your storage service.

2. **Feedback Creation API with Image URLs**: Alternatively, users can submit feedback with image URLs. This method does not require the image configuration setup; however, the image URLs must come from the whitelisted domains.

**Note**: For detailed instructions on using these methods, please refer to the API documentation. You can see the documentation by accessing to `{API server host}/docs` or `{API server host}/docs/redoc`.

### Configuration

To enable image uploads directly to the server, you must configure the image storage settings. The service uses the following configuration parameters and you can set them in the setting menu.

- `accessKeyId`: Your storage service access key ID.
- `secretAccessKey`: Your storage service secret access key.
- `endpoint`: The endpoint URL for the storage service.
- `region`: The region your storage service is located in.
- `bucket`: The name of the bucket where images will be stored.

Depending on your use case and the desired level of access, you may need to adjust the permissions of your S3 bucket. If your application requires that the images be publicly accessible, configure your S3 bucket's policy to allow public reads.

### Domain Whitelist

Users can specify a whitelist of domains for image URLs. This ensures that only images from trusted sources are accepted and managed by User Feedback API server.

**Note**: The domain whitelist is enforced at the time of posting feedback with images. This means that validation against the whitelist occurs only during the submission of new feedback. Once an image URL has been uploaded to the database and accepted, it will be accessible through the web admin interface regardless of its current status on the whitelist. It is important to ensure that image URLs are from trusted sources before they are uploaded, as subsequent changes to the whitelist will not retroactively affect previously stored image URLs.

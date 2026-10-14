# Media Index Settings - API Interface Definitions

## Get Thumbnail Settings

- **Path**: `/v2/mediaIndex/MediaThumbnail`
- **Method**: GET
- **Response Body**:

```json
{
  "code": "boolean",
  "data": {
    "enable_thumbnail": "number - legacy field, not effective",
    "photo_conversion_level": "number - photo thumbnail quality, 0=standard, 1=high quality",
    "video_conversion_level": "number - video thumbnail quality, 0=standard, 1=high quality"
  }
}
```

## Set Thumbnail Configuration

- **Path**: `/v2/mediaIndex/MediaThumbnail`
- **Method**: POST
- **Request Body**:

```json
{
  "enable_thumbnail": "number - unused field, thumbnails are always generated",
  "photo_conversion_level": "number - photo quality, 0=standard, 1=high quality, required",
  "video_conversion_level": "number - video quality, 0=standard, 1=high quality, required"
}
```

- **Response Body**:

```json
{
  "code": "boolean",
  "data": "boolean - true=success",
  "msg": "string"
}
```

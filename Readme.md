## User API

### Base URL

```
/api/v1/users
```

### Endpoints

1. **Register User**

   - **URL**: `/register`
   - **Method**: `POST`
   - **Description**: Registers a new user with an avatar and cover image.
   - **Body**: Form-data with `avatar` (optional) and `coverImage` (optional) files, and other required user registration details.
   - **Response**: User details upon successful registration.

2. **Login User**

   - **URL**: `/login`
   - **Method**: `POST`
   - **Description**: Logs in a user.
   - **Body**: `{ "email": "string", "password": "string" }`
   - **Response**: Access token and refresh token.

3. **Refresh Access Token**

   - **URL**: `/refresh-token`
   - **Method**: `POST`
   - **Description**: Refreshes the access token using a refresh token.
   - **Response**: New access token.

4. **Logout User**

   - **URL**: `/logout`
   - **Method**: `POST`
   - **Description**: Logs out the user.
   - **Authorization**: Requires JWT.
   - **Response**: Success message.

5. **Change Password**

   - **URL**: `/change-password`
   - **Method**: `POST`
   - **Description**: Changes the current user's password.
   - **Authorization**: Requires JWT.
   - **Body**: `{ "oldPassword": "string", "newPassword": "string" }`
   - **Response**: Success message.

6. **Get Current User**

   - **URL**: `/current-user`
   - **Method**: `GET`
   - **Description**: Fetches details of the currently logged-in user.
   - **Authorization**: Requires JWT.
   - **Response**: User details.

7. **Update Account Details**

   - **URL**: `/update-account`
   - **Method**: `PATCH`
   - **Description**: Updates the user’s account details.
   - **Authorization**: Requires JWT.
   - **Body**: JSON object with fields to update.
   - **Response**: Updated user details.

8. **Update User Avatar**

   - **URL**: `/avatar`
   - **Method**: `PATCH`
   - **Description**: Updates the user’s avatar.
   - **Authorization**: Requires JWT.
   - **Body**: Form-data with `avatar` file.
   - **Response**: Updated user avatar URL.

9. **Update Cover Image**

   - **URL**: `/cover-image`
   - **Method**: `PATCH`
   - **Description**: Updates the user’s cover image.
   - **Authorization**: Requires JWT.
   - **Body**: Form-data with `coverImage` file.
   - **Response**: Updated cover image URL.

10. **Get User Channel Profile**

    - **URL**: `/c/:username`
    - **Method**: `GET`
    - **Description**: Fetches a user’s channel profile by username.
    - **Authorization**: Requires JWT.
    - **Response**: User channel profile details.

11. **Get Watch History**

    - **URL**: `/history`
    - **Method**: `GET`
    - **Description**: Fetches the watch history of the current user.
    - **Authorization**: Requires JWT.
    - **Response**: List of watched videos.

---

## Video API

### Base URL

```
/api/v1/videos
```

### Endpoints

1. **Get All Videos**

   - **URL**: `/`
   - **Method**: `GET`
   - **Description**: Retrieves a list of all videos.
   - **Authorization**: Requires JWT.
   - **Response**: Array of video details.

2. **Publish a Video**

   - **URL**: `/`
   - **Method**: `POST`
   - **Description**: Publishes a new video with a thumbnail and video file.
   - **Authorization**: Requires JWT.
   - **Body**: Form-data with `videoFile` and `thumbnail` files, and other required video details.
   - **Response**: Video details upon successful publishing.

3. **Get Video by ID**

   - **URL**: `/:videoId`
   - **Method**: `GET`
   - **Description**: Fetches video details by ID.
   - **Authorization**: Requires JWT.
   - **Response**: Video details.

4. **Delete Video**

   - **URL**: `/:videoId`
   - **Method**: `DELETE`
   - **Description**: Deletes a video by ID.
   - **Authorization**: Requires JWT.
   - **Response**: Success message.

5. **Update Video**

   - **URL**: `/:videoId`
   - **Method**: `PATCH`
   - **Description**: Updates video details and optionally updates the thumbnail.
   - **Authorization**: Requires JWT.
   - **Body**: Form-data with `thumbnail` (optional) and other fields to update.
   - **Response**: Updated video details.

6. **Toggle Publish Status**

   - **URL**: `/toggle/publish/:videoId`
   - **Method**: `PATCH`
   - **Description**: Toggles the publish status of a video by ID.
   - **Authorization**: Requires JWT.
   - **Response**: Updated publish status of the video.

---

This documentation provides the details for each endpoint, including URL paths, HTTP methods, descriptions, authorization requirements, request body, and responses.

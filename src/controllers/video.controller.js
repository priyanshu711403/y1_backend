import mongoose, { Types, isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  page = parseInt(page);
  const sortTypeValue = parseInt(sortType);
  limit = parseInt(limit);

  //TODO: get all videos based on query, sort, pagination
  const skip = (page - 1) * limit;
  const videos = await Video.aggregate([
    {
      $match: {
        owner: userId,
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $sort: {
        [sortBy]: sortTypeValue,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limitValue,
    },
  ]);
  if (!videos) throw new ApiError(500, "videos not fetched");
  Video.aggregatePaginate(videos, { page, limitValue })
    .then(function (result) {
      return res
        .status(200)
        .json(new ApiResponse(200, { result }, "Fetched videos successfully"));
    })
    .catch(function (error) {
      throw error;
    });
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  // check title, desc
  // save local path from req.files
  // check video and thumbnail
  //upload on cloudinary
  //get video duration
  // create user
  if (!title || !description)
    throw new ApiError(400, "title and desc is mandatory");

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath)
    throw new ApiError(409, "thumbnail and video files are required");

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile || !thumbnail)
    throw new ApiError(
      400,
      "videoFIle and thumbnail are not uploaded on cloudinary"
    );
  const videoDuration = videoFile?.duration;
  if (!videoDuration)
    throw new ApiError(400, "duration of the file is not found");
  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoDuration,
    owner: req.user?._id,
  });
  if (!video) throw new ApiError(400, "video not published");
  return res
    .status(201)
    .json(new ApiResponse(201, video, "video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  //check videoId
  //find video in db
  //check isPublished status and owner
  //return
  if (!videoId) throw new ApiError(400, "videoId is mandatory");
  const video = await Video.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!video[0]) throw new ApiError(404, "No video with given videoId");
  // console.log(video.owner);

  if (!video[0].isPublished && !video[0].owner._id.equals(req.user._id))
    // when video in not removed from published and user is not the owner
    throw new ApiError(400, "unauthorized access");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video found successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!videoId) throw new ApiError(400, "videoId is mandatory");

  const video = await Video.findById(videoId);
  if (!video.owner.equals(req.user._id))
    throw new ApiError(400, " unauthorized request:video not owned by user");

  const { title = video.title, description = video.description } = req.body;
  const thumbnailLocalPath = req.file?.path;
  //only if a new thumbnail is given
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail)
      throw new ApiError(400, "thumbnail was not uploaded on cloudinary");
    //delete old thumbnail
    const oldThumbnail = video.thumbnail;
    const isOldThumbnailDeleted = await deleteFromCloudinary(oldThumbnail);
    if (!isOldThumbnailDeleted)
      throw new ApiError(400, "old thumbnail was not deleted");
    video.thumbnail = thumbnail.url;
  }

  video.title = title;
  video.description = description;
  const updatedVideo = await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "video details updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) throw new ApiError(400, "videoId is mandatory");
  const video = await Video.findById(videoId);

  if (!video.owner.equals(req.user._id))
    throw new ApiError(400, " unauthorized request:video not owned by user");

  const { videoFile, thumbnail } = video;
  const deleteThumbnail = await deleteFromCloudinary(thumbnail);
  const deleteVideo = await deleteFromCloudinary(videoFile);
  if (!deleteThumbnail || !deleteVideo)
    throw new ApiError(400, "video and thumbnail not deleted from cloudinary");
  const deleteResponse = await video.deleteOne({ videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deleteResponse, video },
        "video was deleted successfully"
      )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new ApiError(400, "videoId is mandatory");

  const video = await Video.findById(videoId);
  if (!video.owner.equals(req.user._id))
    throw new ApiError(400, " unauthorized request:video not owned by user");

  video.isPublished = !video.isPublished;

  const updatedVideo = await video.save(
    { validateBeforeSave: false },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "isPublished toggled successfully")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

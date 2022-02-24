package timelines

import "github.com/gin-gonic/gin"

func TweetRouter(router *gin.RouterGroup) {
	router.POST("/", CreateTweet)
	router.POST("/:id/imageUpload", UploadTweetImage)
	router.GET("/:id", RetriveTweetById)
	router.DELETE("/:id", DeleteTweetById)
	router.GET("/user/:id", GetTweetsByUserId)
	router.GET("/all", GetAllTweets)
}

func TweetLikeRouter(router *gin.RouterGroup) {
	router.POST("/", CreateLike)
	router.DELETE("/:id", DeleteLikeById)
}

func TweetReplyRouter(router *gin.RouterGroup) {
	router.POST("/", CreateTweetReply)
	router.DELETE("/:id", DeleteReplyById)
	router.GET("/tweet/:tweetId", GetRepliesByTweetId)
}

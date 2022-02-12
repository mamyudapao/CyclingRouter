package timelines

import "github.com/gin-gonic/gin"

func TweetRouter(router *gin.RouterGroup) {
	router.POST("/", CreateTweet)
	router.GET("/:id", RetriveTweet)
	router.DELETE("/:id", DeleteTweet)
	router.GET("/user/:id", GetTweets)
	router.GET("/all", GetAllTweets)
}

func TweetLikeRouter(router *gin.RouterGroup) {
	router.POST("/", CreateLike)
	router.DELETE("/:id", DeleteLike)
}

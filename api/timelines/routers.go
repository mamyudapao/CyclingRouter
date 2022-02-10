package timelines

import "github.com/gin-gonic/gin"

func TimelineRouter(router *gin.RouterGroup) {
	router.POST("/", CreateTweet)
	router.GET("/:id", RetriveTweet)
	router.DELETE("/:id", DeleteTweet)
	router.GET("/user/:id", GetTweets)
	router.GET("/all", GetAllTweets)
}

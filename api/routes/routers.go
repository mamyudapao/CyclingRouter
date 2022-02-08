package routes

import "github.com/gin-gonic/gin"

func RoutersRouter(router *gin.RouterGroup) {
	//単体コース
	router.POST("/", CreateRoute)
	router.GET("/:id", RetriveRoute)
	router.PUT("/:id", UpdateRoute)
	router.DELETE("/:id", DeleteRoute)
	//複数コース
	router.GET("/user/:id", GetRoutes)

	//テスト
	router.POST("/test", testFunc)
}

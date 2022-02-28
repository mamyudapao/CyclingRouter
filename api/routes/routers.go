package routes

import "github.com/gin-gonic/gin"

func RoutersRouter(router *gin.RouterGroup) {
	//単体コース
	router.POST("/", CreateRoute)
	router.GET("/:id", RetriveRouteById)
	router.DELETE("/:id", DeleteRouteById)
	router.PUT("/:id", UpdateRouteById)
	//複数コース
	router.GET("/user/:id", GetRoutesByUserId)

	//テスト
	router.POST("/test", testFunc)
}

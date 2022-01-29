package users

import (
	"github.com/gin-gonic/gin"
)

func AuthRouter(router *gin.RouterGroup) {
	router.POST("/registration", UsersRegistration)
	router.POST("/login", UsersLogin)
	router.POST("/refresh", RefreshTokens)
}

func UsersRouter(router *gin.RouterGroup) {
	router.GET("/:id", RetriveUser)
	router.PUT("/:id", UpdateUser)
	router.POST("/:id/image", UploadUserImage)
	router.DELETE("/:id", DeleteUser)
}

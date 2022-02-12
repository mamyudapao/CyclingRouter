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
	router.GET("/:id", RetriveUserById)
	router.PUT("/:id", UpdateUserById)
	router.POST("/:id/image", UploadUserImageById)
	router.DELETE("/:id", DeleteUserById)
}

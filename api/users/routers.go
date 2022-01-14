package users

import (
	"github.com/gin-gonic/gin"
)

func UsersRegister(router *gin.RouterGroup) {
	router.POST("/register", UsersRegistration)
	router.POST("/login", UsersLogin)
	router.POST("/refresh", RefreshTokens)
	router.GET("/:id", GetUserInformation)
}

func UsersInformation(router *gin.RouterGroup) {
	router.GET("/:id", GetUserInformation)
}

package users

import (
	"github.com/gin-gonic/gin"
)

func UsersRegister(router *gin.RouterGroup) {
	router.POST("/registration", UsersRegistration)
	router.POST("/login", UsersLogin)
	router.POST("/refresh", RefreshTokens)
	router.GET("/:id", RetriveUser)
	router.PUT("/:id", UpdateUser)
	router.DELETE("/:id", DeleteUser)
}

// func UsersInformation(router *gin.RouterGroup) {
// 	router.GET("/:id", GetUserInformation)
// }

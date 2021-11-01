package users

import (
	"github.com/gin-gonic/gin"
)

//TODO: refresh token と それを使ったtokenの更新を実装！
func UsersRegister(router *gin.RouterGroup) {
	router.POST("/", UsersRegistration)
	router.POST("/login", UsersLogin)
	router.POST("/refresh", RefreshTokens)
}

package users

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
	"golang.org/x/crypto/bcrypt"
)

func UsersRegister(router *gin.RouterGroup) {
	router.POST("/", UsersRegistration)
	// router.POST("/login", UsersLogin)
}

func UsersRegistration(c *gin.Context) {
	var userValidation User
	err := c.ShouldBindJSON(&userValidation)
	if err != nil {
		fmt.Println(err)
		return
	}
	// psswordをハッシュ化する
	password := []byte(userValidation.Password)
	hashedPassword, _ := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	//gormを使ってDBに保存する
	user := UserModel{Username: userValidation.Username, Email: userValidation.Email, PasswordHash: hashedPassword, Bio: userValidation.Bio}
	db := common.GetDB()

	db.Create(&user)
}

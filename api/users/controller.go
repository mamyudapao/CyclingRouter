package users

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/auth"
	"github.com/mamyudapao/CyclingRouter/common"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

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

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func UsersLogin(c *gin.Context) {
	var payload LoginPayload
	var user UserModel

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.JSON(
			400, gin.H{
				"msg": "invalid json",
			})
		c.Abort()
		return
	}

	result := common.DB.Where("email = ?", payload.Email).First(&user)

	fmt.Println(user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}

	err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(payload.Password))

	if err != nil {
		log.Println(err)
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}

	jwtWrapper := auth.JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(user.Email)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": "error signing token",
		})
		c.Abort()
		return
	}

	tokenResponse := LoginResponse{
		Token: signedToken,
	}

	c.JSON(200, tokenResponse)

	return

}

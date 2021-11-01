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
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
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
		Issuer:          "CyclingRouter",
		ExpirationHours: 24,
	}

	signedToken, refreshSignedToken := jwtWrapper.GenerateToken(user.Email)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": "error signing token",
		})
		c.Abort()
		return
	}

	tokenResponse := LoginResponse{
		Token:        signedToken,
		RefreshToken: refreshSignedToken,
	}

	c.JSON(200, tokenResponse)

	return

}

func RefreshTokens(c *gin.Context) {
	var oldRefreshToken RefreshRequest
	c.BindJSON(&oldRefreshToken)
	jwtWrapper := auth.JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "CyclingRouter",
		ExpirationHours: 24,
	}
	// refresh tokenをvalidateする
	claims, err := jwtWrapper.ValidateToken(oldRefreshToken.RefreshToken)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": "error refresh token",
		})
		c.Abort()
		return
	}
	accessToken := jwtWrapper.GenerateAccessToken(claims.Email)
	refreshToken := jwtWrapper.GenerateRefreshToken(claims.Email)
	tokenResponse := LoginResponse{
		Token:        accessToken,
		RefreshToken: refreshToken,
	}

	c.JSON(200, tokenResponse)

	return

}

package users

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/auth"
	"github.com/mamyudapao/CyclingRouter/common"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AccountRegister Actions

func UsersRegistration(c *gin.Context) {
	var userValidation UserValidator
	err := c.ShouldBindJSON(&userValidation)
	if err != nil {
		fmt.Println(err)
		return
	}
	// psswordをハッシュ化する
	password := []byte(userValidation.Password)
	hashedPassword, _ := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	// gormを使ってDBに保存する
	user := User{Username: userValidation.Username, Email: userValidation.Email, PasswordHash: hashedPassword}
	result := common.DB.Create(&user)
	fmt.Println("ちんちん")
	fmt.Println(result)
	fmt.Println(user.ID)

	// Emailを基にJWTレスポンスを発行
	jwtWrapper := auth.JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "CyclingRouter",
		ExpirationHours: 24,
	}

	signedToken, refreshToken := jwtWrapper.GenerateToken(userValidation.Email)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": "error signing token",
		})
		c.Abort()
		return
	}

	//TODO: データベースを検索してレスポンスを受け取る, それからレスポンスに加える.
	response := SignUpResponse{
		Username:     user.Username,
		Email:        user.Email,
		Biography:    user.Biography,
		Token:        signedToken,
		RefreshToken: refreshToken,
		Location:     user.Location,
		Birthday:     user.Birthday,
		ID:           user.ID,
	}

	defer c.JSON(200, response)

}

type SignUpResponse struct {
	ID           uint
	Username     string
	Email        string
	Biography    string
	UserImage    string
	Birthday     string
	Location     string
	CreatedAt    time.Time
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
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
	var user User

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

}

// UserInformation Actions

type UserInformationType struct {
	Username  string
	Email     string
	Biography string
	UserImage string
	ID        uint
	CreatedAt time.Time
}

func GetUserInformation(c *gin.Context) {
	// common.DB.Where()
	var userInfo *User
	// db.Find(&User{}, 1).First(&userInfo)
	responseObject := &UserInformationType{
		Username:  userInfo.Username,
		Email:     userInfo.Email,
		Biography: userInfo.Biography,
		UserImage: userInfo.UserImage,
		ID:        userInfo.ID,
		CreatedAt: userInfo.CreatedAt,
	}
	c.JSON(200, responseObject)
}

func updateUserInfo(c *gin.Context) {

}

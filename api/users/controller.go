package users

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/auth"
	"github.com/mamyudapao/CyclingRouter/common"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AccountRegister Actions

func UsersRegistration(c *gin.Context) {
	var userValidation UserRegistrationValidator
	err := c.ShouldBindJSON(&userValidation)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "Validation Error",
			"detail": err.Error(),
		})
		return
	}
	// psswordをハッシュ化する
	password := []byte(userValidation.Password)
	hashedPassword, _ := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	// gormを使ってDBに保存する
	user := User{Username: userValidation.Username, Email: userValidation.Email, PasswordHash: hashedPassword}
	err = common.DB.Create(&user).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "Error creating user",
		})
		return
	}

	// Emailを基にJWTレスポンスを発行
	jwtWrapper := auth.JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "CyclingRouter",
		ExpirationHours: 24,
	}

	signedToken, refreshToken := jwtWrapper.GenerateToken(userValidation.Email)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "error signing token",
		})
		c.Abort()
		return
	}

	response := UserResponse{
		Username:     user.Username,
		Email:        user.Email,
		Biography:    user.Biography,
		AccessToken:  signedToken,
		RefreshToken: refreshToken,
		Location:     user.Location,
		Birthday:     user.Birthday,
		ID:           user.ID,
	}

	c.JSON(http.StatusOK, response)

}

func UsersLogin(c *gin.Context) {
	var payload LoginPayload
	var user User

	err := c.ShouldBindJSON(&payload)
	if err != nil {
		c.JSON(
			http.StatusBadRequest, gin.H{
				"msg": "invalid json",
			})
		c.Abort()
		return
	}

	result := common.DB.Where("email = ?", payload.Email).First(&user)

	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "not found instance",
		})
		c.Abort()
		return
	}

	err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(payload.Password))

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "failed generate token",
		})
		c.Abort()
		return
	}

	tokenResponse := UserResponse{
		Username:     user.Username,
		Email:        user.Email,
		Biography:    user.Biography,
		AccessToken:  signedToken,
		RefreshToken: refreshSignedToken,
		Location:     user.Location,
		Birthday:     user.Birthday,
		ID:           user.ID,
	}

	c.JSON(http.StatusOK, tokenResponse)
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "error refresh token",
		})
		c.Abort()
		return
	}
	accessToken := jwtWrapper.GenerateAccessToken(claims.Email)
	refreshToken := jwtWrapper.GenerateRefreshToken(claims.Email)
	tokenResponse := RefreshResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	c.JSON(http.StatusOK, tokenResponse)
}

// UserInformation Actions

func RetriveUser(c *gin.Context) {
	var user *User
	err := common.DB.Where("id = ?", c.Param("id")).First(&user).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "User not found",
		})
		return
	}
	responseObject := &UserInformation{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Biography: user.Biography,
		UserImage: user.UserImage,
		Location:  user.Location,
	}
	c.JSON(200, responseObject)

}

func UpdateUser(c *gin.Context) {
	var user User
	var userValidation UserUpdateValidator
	err := c.ShouldBindJSON(&userValidation)
	fmt.Println(userValidation)
	if err != nil {
		fmt.Println(err)
	}
	result := common.DB.Model(user).Where("id = ?", c.Param("id")).First(&user).Updates(userValidation)
	fmt.Println(user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "failed to update",
		})
		return
	}
	c.JSON(http.StatusOK, UserInformation{
		ID:        user.ID,
		Username:  userValidation.Username,
		Email:     user.Email,
		Biography: userValidation.Biography,
		UserImage: userValidation.UserImage,
		Birthday:  userValidation.Birthday,
		Location:  userValidation.Location,
	})
}

//TODO: Userのデータを返すようなfunctionを作る

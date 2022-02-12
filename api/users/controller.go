package users

import (
	"context"
	"fmt"
	"log"
	"net/http"

	amazon "github.com/mamyudapao/CyclingRouter/aws"

	"github.com/aws/aws-sdk-go-v2/service/s3"
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
	user := User{
		Username: userValidation.Username,
		Email:    userValidation.Email}
	password := userValidation.Password
	user.setPassword(password)
	// gormを使ってDBに保存する
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
	c.JSON(http.StatusOK, gin.H{
		"user":         user,
		"accessToken":  signedToken,
		"refreshToken": refreshToken,
	})

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

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))

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

	c.JSON(http.StatusOK, gin.H{
		"user":         user,
		"accessToken":  signedToken,
		"refreshToken": refreshSignedToken,
	})
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

func RetriveUserById(c *gin.Context) {
	var user *User
	err := common.DB.Where("id = ?", c.Param("id")).First(&user).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, user)

}

func UpdateUserById(c *gin.Context) {
	var user User
	var userValidation UserUpdateValidator
	err := c.ShouldBindJSON(&userValidation)
	fmt.Println(userValidation)
	if err != nil {
		fmt.Println(err)
	}
	result := common.DB.Model(user).Where("id = ?", c.Param("id")).First(&user).Updates(userValidation).First(&user)
	fmt.Println(user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "failed to update",
		})
		return
	}
	c.JSON(http.StatusOK, user)
}

func DeleteUserById(c *gin.Context) {
	result := common.DB.Delete(&User{}, c.Param("id"))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": result.Error,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "done delete user",
	})
}

func UploadUserImageById(c *gin.Context) {
	bucketName := "cycling-router-bucket"

	form, _ := c.MultipartForm()
	files := form.File["image"]
	open, err := files[0].Open()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	awsInstance, err := amazon.InitAWS()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	client := s3.NewFromConfig(awsInstance)
	key := files[0].Filename
	input := &s3.PutObjectInput{
		Bucket: &bucketName,
		Key:    &key,
		Body:   open,
	}
	_, err = amazon.PutFile(context.TODO(), client, input)
	if err != nil {
		fmt.Print("Got error uploading file:")
		fmt.Println(err)
		return
	}

	// ここから画像のファイル名をDBに保存する
	var user User
	err = common.DB.Where("id = ?", c.Param("id")).First(&user).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "User not found",
		})
		return
	}
	user.UserImage = key
	err = common.DB.Save(&user).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"userImage": key,
	})
}

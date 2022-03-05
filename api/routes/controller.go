package routes

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	amazon "github.com/mamyudapao/CyclingRouter/aws"
	"github.com/mamyudapao/CyclingRouter/common"
)

func CreateRoute(c *gin.Context) {
	var routeValidation RouteCreationValidator
	err := c.ShouldBindJSON(&routeValidation)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "Validation Error",
			"detail": err.Error(),
		})
		return
	}
	route := Route{
		UserId:      routeValidation.UserId,
		Direction:   routeValidation.Direction,
		Title:       routeValidation.Title,
		Description: routeValidation.Description,
		Image:       routeValidation.Image,
	}
	err = common.DB.Create(&route).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "Error creating user",
		})
		return
	}
	common.DB.Model(&route).Association("User").Find(&route.User)
	c.JSON(http.StatusOK, route)
}

func RetriveRouteById(c *gin.Context) {
	var route *Route
	err := common.DB.Where("id = ?", c.Param("id")).First(&route).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	common.DB.Model(&route).Association("User").Find(&route.User)
	c.JSON(http.StatusOK, route)
}

func UpdateRouteById(c *gin.Context) {
	var route Route
	var routeValidation RouteUpdateValidator
	err := c.ShouldBindJSON(&routeValidation)
	if err != nil {
		fmt.Println(err)
	}
	result := common.DB.Model(route).Where("id = ?", c.Param("id")).First(&route).Updates(routeValidation).First(&route)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "failed to update",
		})
		return
	}
	c.JSON(http.StatusOK, route)
}

func DeleteRouteById(c *gin.Context) {
	result := common.DB.Delete(&Route{}, c.Param("id"))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": result.Error,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "done delete route",
	})
}

func GetRoutesByUserId(c *gin.Context) {
	var routes []Route
	err := common.DB.Where("user_id = ?", c.Param("id")).Find(&routes).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	for i := range routes {
		common.DB.Model(&routes[i]).Association("User").Find(&routes[i].User)
	}
	c.JSON(http.StatusOK, routes)
}

func GetAllRoutes(c *gin.Context) {
	var routes []Route
	err := common.DB.Find(&routes).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	for i := range routes {
		common.DB.Model(&routes[i]).Association("User").Find(&routes[i].User)
	}
	c.JSON(http.StatusOK, routes)
}

func UploadRouteImage(c *gin.Context) {
	bucketName := "cycling-router-bucket"
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		fmt.Println(err)
	}
	awsInstance, err := amazon.InitAWS()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	client := s3.NewFromConfig(awsInstance)
	key := header.Filename
	input := &s3.PutObjectInput{
		Bucket: &bucketName,
		Key:    &key,
		Body:   file,
	}
	_, err = amazon.PutFile(context.TODO(), client, input)
	if err != nil {
		fmt.Print("Got error uploading file:")
		fmt.Println(err)
		return
	}

	//ここから画像のファイル名をDBに保存する
	var router Route
	err = common.DB.Where("id = ?", c.Param("id")).First(&router).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	router.Image = key
	err = common.DB.Save(&router).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"Image": key,
	})
}

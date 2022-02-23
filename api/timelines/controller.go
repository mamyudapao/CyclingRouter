package timelines

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	amazon "github.com/mamyudapao/CyclingRouter/aws"
	"github.com/mamyudapao/CyclingRouter/common"
)

func CreateTweet(c *gin.Context) {
	var tweetValidation TweetCreationValidator
	// var user users.User
	err := c.ShouldBindJSON(&tweetValidation)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "Validation Error",
			"detail": err.Error(),
		})
		return
	}
	tweet := Tweet{
		UserId:  tweetValidation.UserId,
		Content: tweetValidation.Content,
	}
	err = common.DB.Create(&tweet).Error
	common.DB.Model(&tweet).Association("User").Find(&tweet.User)
	common.DB.Model(&tweet).Association("Likes").Find(&tweet.Likes)
	common.DB.Model(&tweet).Association("Replies").Find(&tweet.Replies)
	if err != nil {
		fmt.Println(err)
	}
	c.JSON(http.StatusOK, tweet)
}

func UploadTweetImage(c *gin.Context) {
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

	var tweet Tweet
	err = common.DB.Where("id = ?", c.Param("id")).First(&tweet).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "User not found",
		})
		return
	}
	tweet.Image = key
	err = common.DB.Save(&tweet).Error
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

func RetriveTweetById(c *gin.Context) {
	var tweet Tweet
	err := common.DB.Where("id = ?", c.Param("id")).First(&tweet).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	common.DB.Model(&tweet).Association("User").Find(&tweet.User)
	common.DB.Model(&tweet).Association("Likes").Find(&tweet.Likes)
	common.DB.Model(&tweet).Association("Replies").Find(&tweet.Replies)
	for i := range tweet.Replies {
		common.DB.Model(&tweet.Replies[i]).Association("User").Find(&tweet.Replies[i].User)
	}
	c.JSON(http.StatusOK, tweet)
}

func DeleteTweetById(c *gin.Context) {
	result := common.DB.Delete(&Tweet{}, c.Param("id"))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": result.Error,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "done delete tweet",
	})
}

func GetTweetsByUserId(c *gin.Context) {
	var tweets []Tweet
	err := common.DB.Where("user_id = ?", c.Param("id")).Find(&tweets).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Tweets not found",
		})
		return
	}
	for i := range tweets {
		common.DB.Model(&tweets[i]).Association("User").Find(&tweets[i].User)
		common.DB.Model(&tweets[i]).Association("Likes").Find(&tweets[i].Likes)
		common.DB.Model(&tweets[i]).Association("Replies").Find(&tweets[i].Replies)
	}
	c.JSON(http.StatusOK, tweets)
}

func GetAllTweets(c *gin.Context) {
	var tweets []Tweet

	err := common.DB.Order("created_at desc").Find(&tweets).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	for i := range tweets {
		common.DB.Model(&tweets[i]).Association("User").Find(&tweets[i].User)
		common.DB.Model(&tweets[i]).Association("Likes").Find(&tweets[i].Likes)
		common.DB.Model(&tweets[i]).Association("Replies").Find(&tweets[i].Replies)
	}

	c.JSON(http.StatusOK, tweets)
}

func CreateLike(c *gin.Context) {
	var likeValidation LikeCreationsValidator

	err := c.ShouldBindJSON(&likeValidation)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "Validation Error",
			"detail": err.Error(),
		})
		return
	}
	like := TweetLike{
		TweetId: likeValidation.TweetId,
		UserId:  likeValidation.UserId,
	}
	err = common.DB.Create(&like).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "can not create",
			"detail": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, like)
}

func DeleteLikeById(c *gin.Context) {
	result := common.DB.Unscoped().Delete(&TweetLike{}, c.Param("id"))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": result.Error,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "done delete tweet like",
	})
}

func CreateTweetReply(c *gin.Context) {
	var tweetReplyValidation TweetReplyCreationValidator
	err := c.ShouldBindJSON(&tweetReplyValidation)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "Validation Error",
			"detail": err.Error(),
		})
		return
	}
	tweetReply := TweetReply{
		TweetId: tweetReplyValidation.TweetId,
		UserId:  tweetReplyValidation.UserId,
		Content: tweetReplyValidation.Content,
	}
	err = common.DB.Create(&tweetReply).Error
	if err != nil {
		fmt.Println(err)
	}
	common.DB.Model(&tweetReply).Association("User").Find(&tweetReply.User)
	c.JSON(http.StatusOK, tweetReply)
}

func DeleteReplyById(c *gin.Context) {
	result := common.DB.Delete(&TweetReply{}, c.Param("id"))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": result.Error,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "done delete reply",
	})
}

func GetRepliesByTweetId(c *gin.Context) {
	var replies []TweetReply
	err := common.DB.Where("tweet_id = ?", c.Param("tweetId")).Find(&replies).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Tweets not found",
		})
		return
	}
	for i := range replies {
		common.DB.Model(&replies[i]).Association("User").Find(&replies[i].User)
	}
	c.JSON(http.StatusOK, replies)
}

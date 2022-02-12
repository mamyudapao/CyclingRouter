package timelines

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
	"github.com/mamyudapao/CyclingRouter/users"
)

func CreateTweet(c *gin.Context) {
	var tweetValidation TweetCreationValidator
	var user users.User
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
	common.DB.Model(&tweet).Association("User").Find(&user)
	if err != nil {
		fmt.Println(err)
	}
	tweet.User = user
	c.JSON(http.StatusOK, tweet)
}

func RetriveTweet(c *gin.Context) {
	var tweet Tweet
	var user users.User
	err := common.DB.Where("id = ?", c.Param("id")).First(&tweet).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	common.DB.Model(&tweet).Association("User").Find(&user)
	tweet.User = user
	c.JSON(http.StatusOK, tweet)
}

func DeleteTweet(c *gin.Context) {
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

func GetTweets(c *gin.Context) {
	var tweets []Tweet
	var user users.User
	err := common.DB.Where("user_id = ?", c.Param("id")).Find(&tweets).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Tweets not found",
		})
		return
	}
	for i := range tweets {
		common.DB.Model(&tweets[i]).Association("User").Find(&user)
		tweets[i].User = user
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
		var user users.User
		common.DB.Where("id = ?", tweets[i].UserId).Find(&user)
		tweets[i].User = user
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

func DeleteLike(c *gin.Context) {
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

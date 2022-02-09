package timelines

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
)

func CreateTweet(c *gin.Context) {
	var tweetValidation TweetCreationValidator
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
	if err != nil {
		fmt.Println(err)
	}
	c.JSON(http.StatusOK, tweet)
}

func RetriveTweet(c *gin.Context) {
	var tweet *Tweet
	err := common.DB.Where("id = ?", c.Param("id")).First(&tweet).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
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
		"msg": "done delete route",
	})
}

func GetTweets(c *gin.Context) {
	var tweets *[]Tweet
	err := common.DB.Where("user_id = ?", c.Param("id")).Find(&tweets).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"tweets": tweets,
	})
}

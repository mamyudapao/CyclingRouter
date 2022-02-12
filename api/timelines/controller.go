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

func RetriveTweetById(c *gin.Context) {
	var tweet Tweet
	var user users.User
	var likes []TweetLike
	err := common.DB.Where("id = ?", c.Param("id")).First(&tweet).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	common.DB.Model(&tweet).Association("User").Find(&user)   //TODO: Likesを追加する
	common.DB.Model(&tweet).Association("Likes").Find(&likes) //TODO: Likesを追加する
	tweet.User = user
	tweet.Likes = likes
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
	var likes []TweetLike
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
		common.DB.Model(&tweets[i]).Association("Likes").Find(&likes)
		tweets[i].User = user
		tweets[i].Likes = likes
	}
	c.JSON(http.StatusOK, tweets)
}

func GetAllTweets(c *gin.Context) {
	var tweets []Tweet
	var user users.User
	var likes []TweetLike

	err := common.DB.Order("created_at desc").Find(&tweets).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	for i := range tweets {
		common.DB.Model(&tweets[i]).Association("User").Find(&user)
		common.DB.Model(&tweets[i]).Association("Likes").Find(&likes)
		tweets[i].User = user
		tweets[i].Likes = likes
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

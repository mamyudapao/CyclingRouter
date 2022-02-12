package timelines

import (
	"fmt"

	"github.com/mamyudapao/CyclingRouter/common"
	"github.com/mamyudapao/CyclingRouter/users"
)

type Tweet struct {
	UserId  uint         `json:"userId"`
	User    users.User   `gorm:"foreignKey:UserId" json:"user"`
	Content string       `gorm:"column:content" json:"content"`
	Replies []TweetReply `gorm:"foreignKey:ID" json:"replies"`
	Likes   []TweetLike  `gorm:"foreignKey:TweetId" json:"likes"`
	common.GormModel
}

type TweetLike struct {
	UserId  uint `gorm:"column:user_id;uniqueIndex:unique_a" json:"userId"`
	TweetId uint `gorm:"column:tweet_id;uniqueIndex:unique_a" json:"tweetId"`
	common.GormModel
}

type TweetReply struct {
	TweetId uint   `gorm:"column:tweet_id" json:"tweetId"`
	UserId  uint   `gorm:"column:user_id" json:"userId"`
	Content string `gorm:"column:content" json:"content"`
	common.GormModel
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&Tweet{}, TweetLike{})
	if err != nil {
		fmt.Println(err)
	}
}

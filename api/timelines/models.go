package timelines

import (
	"fmt"

	"github.com/mamyudapao/CyclingRouter/common"
)

type Tweet struct {
	UserId  uint         `gorm:"column:user_id" json:"userId"`
	Content string       `gorm:"column:content" json:"content"`
	Replies []TweetReply `gorm:"foreignKey:ID" json:"replies"`
	Likes   []TweetLike  `gorm:"foreignKey:ID" json:"likes"`
	common.GormModel
}

type TweetLike struct {
	TweetId uint `gorm:"column:tweet_id" json:"tweetId"`
	UserId  uint `gorm:"column:user_id" json:"userId"`
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
	err := db.AutoMigrate(&Tweet{}, &TweetLike{}, &TweetReply{})
	if err != nil {
		fmt.Println(err)
	}
}

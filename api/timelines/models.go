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
	Likes   []TweetLike  `gorm:"foreignKey:TweetId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"likes"`
	Replies []TweetReply `gorm:"foreignKey:TweetId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"replies"`
	common.GormModel
}

type TweetLike struct {
	UserId  uint `gorm:"column:user_id;uniqueIndex:unique_a" json:"userId"`
	TweetId uint `gorm:"column:tweet_id;uniqueIndex:unique_a" json:"tweetId"`
	common.GormModel
}

type TweetReply struct {
	TweetId uint       `gorm:"column:tweet_id" json:"tweetId"`
	UserId  uint       `gorm:"column:user_id" json:"userId"`
	User    users.User `gorm:"foreignKey:UserId" json:"user"`
	Content string     `gorm:"column:content" json:"content"`
	common.GormModel
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&Tweet{}, &TweetReply{}, TweetLike{})
	if err != nil {
		fmt.Println(err)
	}
}

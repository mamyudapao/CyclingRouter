package timelines

// Tweet Create時
type TweetCreationValidator struct {
	UserId  uint   `form:"user_id" json:"userId" binding:"required,number"`
	Content string `form:"content" json:"content" binding:"required"`
	Image   string `form:"image" json:"image"`
}

type LikeCreationsValidator struct {
	TweetId uint `form:"tweet_id" json:"tweetId"`
	UserId  uint `form:"user_id" json:"userId"`
}

type TweetReplyCreationValidator struct {
	TweetId uint   `form:"tweet_id" json:"tweetId"`
	UserId  uint   `form:"user_id" json:"userId"`
	Content string `form:"content" json:"content"`
}

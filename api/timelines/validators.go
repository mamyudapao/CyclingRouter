package timelines

// Tweet Create時
type TweetCreationValidator struct {
	UserId  uint   `form:"user_id" json:"userId" binding:"required,number"`
	Content string `form:"content" json:"content" binding:"required"`
}

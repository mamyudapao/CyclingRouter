package users

type UserValidator struct {
	Username  string `form:"username" json:"username" binding:"required,alphanum,min=4,max=255"`
	Email     string `form:"email" json:"email" binding:"required,email"`
	Password  string `form:"password" json:"password" binding:"required,min=8,max=255"`
	Biography string `form:"biography" json:"biography" binding:"max=255"`
	UserImage string `form:"user_image" json:"user_image"`
}

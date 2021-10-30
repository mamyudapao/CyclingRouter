package users

type User struct {
	Username string `form:"username" json:"username" binding:"required,alphanum,min=4,max=255"`
	Email    string `form:"email" json:"email" binding:"required,email"`
	Password string `form:"password" json:"password" binding:"required,min=8,max=255"`
	Bio      string `form:"bio" json:"bio" binding:"max=1024"`
}

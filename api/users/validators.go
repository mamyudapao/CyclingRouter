package users

type UserRegistrationValidator struct {
	Username string `form:"username" json:"username" binding:"required,alphanum,min=4,max=50"`
	Email    string `form:"email" json:"email" binding:"required,email"`
	Password string `form:"password" json:"password" binding:"required,min=8,max=255"`
}

type UserUpdateValidator struct {
	Username  string `form:"username" json:"username" binding:"required,alphanum,min=4,max=50"`
	Biography string `form:"biography" json:"biography"`
	UserImage string `form:"user_mage" json:"userImage"`
	Birthday  string `form:"birthday" json:"birthday"`
	Location  string `form:"location" json:"location"`
}

package users

type UserResponse struct {
	ID           uint   `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Biography    string `json:"biography"`
	UserImage    string `json:"userImage"`
	Birthday     string `json:"birthday"`
	Location     string `json:"location"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type RefreshResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type UserInformation struct {
	ID        uint   `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Biography string `json:"biography"`
	UserImage string `json:"userImage"`
	Birthday  string `json:"birthday"`
	Location  string `json:"location"`
}

package routes

type RouteCreationValidator struct {
	UserId      int    `form:"user_id" json:"user_id" binding:"required,number"`
	Title       string `form:"title" json:"title" binding:"required,min=4,max=50"`
	Description string `form:"description" json:"description" binding:"max=300"`
	Direction   string `form:"direction" json:"direction" binding:"required"`
}
type RouteUpdateValidator struct {
	UserId      int    `form:"user_id" json:"user_id" binding:"required,number"`
	Title       string `form:"title" json:"title" binding:"required,min=4,max=50"`
	Description string `form:"description" json:"description" binding:"max=300"`
	Direction   string `form:"direction" json:"direction" binding:"required"`
}

package routes

type ResponseRoute struct {
	ID          uint   `json:"id"`
	UserId      int    `json:"userId"`
	Direction   string `json:"direction"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

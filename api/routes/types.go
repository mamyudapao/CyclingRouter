package routes

type ResponseRoute struct {
	ID          uint   `json:"id"`
	UserId      int    `json:"user_id"`
	Direction   string `json:"direction"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

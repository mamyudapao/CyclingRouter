package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
	"github.com/mamyudapao/CyclingRouter/middleware"
	"github.com/mamyudapao/CyclingRouter/routes"
	"github.com/mamyudapao/CyclingRouter/timelines"
	"github.com/mamyudapao/CyclingRouter/users"
)

// モデルをマイグレートする
func Migrate() {
	users.AutoMigrate()
	routes.AutoMigrate()
	timelines.AutoMigrate()
}

func GetSomething(c *gin.Context) {
	c.JSON(
		http.StatusOK, gin.H{
			"msg": "auth!!",
		},
	)

}

func main() {

	common.InitDB() //DBに接続
	Migrate()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods: []string{
			"GET", "POST", "PUT", "OPTIONS", "DELETE",
		},
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
		},
		// cookieなどの情報を必要とするかどうか
		AllowCredentials: true,
		// preflightリクエストの結果をキャッシュする時間
	}))

	openGroup := r.Group("/api")
	authGroup := r.Group("/api", middleware.Authz())
	users.AuthRouter(openGroup.Group("/auth"))
	users.UsersRouter(authGroup.Group("/users"))
	users.FollowRouter(authGroup.Group("/follow"))
	routes.RoutersRouter(authGroup.Group("/routes"))
	timelines.TweetRouter(authGroup.Group("/tweets"))
	timelines.TweetLikeRouter(authGroup.Group("/likes"))
	timelines.TweetReplyRouter(authGroup.Group("/reply"))
	v2 := r.Group("/authTest").Use(middleware.Authz())

	v2.GET("/", GetSomething)
	r.Run()
}

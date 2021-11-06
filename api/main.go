package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
	"github.com/mamyudapao/CyclingRouter/middleware"
	"github.com/mamyudapao/CyclingRouter/users"
	"gorm.io/gorm"
)

// モデルをマイグレートする
func Migrate(db *gorm.DB) {
	users.AutoMigrate()
}

func GetSomething(c *gin.Context) {
	c.JSON(
		200, gin.H{
			"msg": "auth!!",
		},
	)

}

func main() {

	db := common.InitDB() //DBに接続
	Migrate(db)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods: []string{
			"GET", "POST", "PUT", "OPTIONS",
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

	v1 := r.Group("/api")
	users.UsersRegister(v1.Group("users/"))
	v2 := r.Group("/authTest").Use(middleware.Authz())

	v2.GET("/", GetSomething)
	r.Run()
}

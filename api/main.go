package main

import (
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

	v1 := r.Group("/api")
	users.UsersRegister(v1.Group("users/"))
	v2 := r.Group("/authTest").Use(middleware.Authz())

	v2.GET("/", GetSomething)
	r.Run()
}

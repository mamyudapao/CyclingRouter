package main

import (
	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
	"github.com/mamyudapao/CyclingRouter/users"
	"gorm.io/gorm"
)

// モデルをマイグレートする
func Migrate(db *gorm.DB) {
	users.AutoMigrate()
}

func main() {

	db := common.Init() //DBに接続
	Migrate(db)

	r := gin.Default()

	v1 := r.Group("/api")
	users.UsersRegister(v1.Group("users/"))
	r.Run()
}

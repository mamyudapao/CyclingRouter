package routes

import (
	"log"

	"github.com/mamyudapao/CyclingRouter/common"
	"gorm.io/gorm"
)

type Route struct {
	UserId      int    `gorm:"column:user_id; not null"`
	Direction   string `gorm:"column:direction; not null"`
	Title       string `gorm:"column:title; not null"`
	Description string `gorm:"column:description;"`
	gorm.Model
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&Route{})
	if err != nil {
		log.Println(err)
	}
}

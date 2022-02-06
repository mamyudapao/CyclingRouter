package routes

import (
	"log"

	"github.com/mamyudapao/CyclingRouter/common"
)

type Route struct {
	UserId      int    `json:"userId" gorm:"column:user_id; not null"`
	Direction   string `json:"direction" gorm:"column:direction; not null"`
	Title       string `json:"title" gorm:"column:title; not null"`
	Description string `json:"description" gorm:"column:description;"`
	common.GormModel
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&Route{})
	if err != nil {
		log.Println(err)
	}
}

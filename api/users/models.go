package users

import (
	"log"

	"github.com/mamyudapao/CyclingRouter/common"
)

type User struct {
	Username     string `gorm:"column:username; not null"`
	Email        string `gorm:"column:email;unique; not null"`
	PasswordHash []byte `gorm:"column:password;not null"`
	Biography    string `gorm:"column:biography;"`
	UserImage    string `gorm:"column:user_image;"`
	Location     string `gorm:"column:location"`
	Birthday     string `gorm:"column:birthday"`
	common.GormModel
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&User{})
	if err != nil {
		log.Println(err)
	}
}

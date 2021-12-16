package users

import (
	"log"

	"github.com/mamyudapao/CyclingRouter/common"
	"gorm.io/gorm"
)

type User struct {
	Username     string `gorm:"column:username;unique"`
	Email        string `gorm:"column:email;unique"`
	PasswordHash []byte `gorm:"column:password;not null"`
	Biography    string `gorm:"column:biography;"`
	UserImage    string `gorm:"column:user_image;"`
	gorm.Model
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&User{})
	if err != nil {
		log.Println(err)
	}
}

package users

import (
	"github.com/mamyudapao/CyclingRouter/common"
	"gorm.io/gorm"
)

type User struct {
	Username     string `gorm:"column:username;unique"`
	Email        string `gorm:"column:email;unique"`
	PasswordHash []byte `gorm:"column:password;not null"`
	gorm.Model
}

func AutoMigrate() {
	db := common.GetDB()

	db.AutoMigrate(&User{})
}

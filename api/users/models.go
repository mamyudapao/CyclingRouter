package users

import (
	"github.com/mamyudapao/CyclingRouter/common"
	"gorm.io/gorm"
)

type UserModel struct {
	Username     string `gorm:"column:username;unique"`
	Email        string `gorm:"column:email;unique"`
	Bio          string `gorm:"column:bio;size:1024"`
	PasswordHash []byte `gorm:"column:password;not null"`
	gorm.Model
}

func AutoMigrate() {
	db := common.GetDB()

	db.AutoMigrate(&UserModel{})
}

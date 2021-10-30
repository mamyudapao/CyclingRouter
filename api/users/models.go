package users

import (
	"github.com/mamyudapao/CyclingRouter/common"
	"golang.org/x/crypto/bcrypt"
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

func (userModel *UserModel) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword(userModel.PasswordHash, []byte(providedPassword))
	if err != nil {
		return err
	}

	return nil
}

package users

import (
	"errors"
	"log"

	"github.com/mamyudapao/CyclingRouter/common"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Username  string `gorm:"column:username; not null" json:"username"`
	Email     string `gorm:"column:email;unique; not null" json:"email"`
	Password  string `gorm:"column:password;not null;" json:"-"`
	Biography string `gorm:"column:biography;" json:"biography"`
	UserImage string `gorm:"column:user_image;" json:"userImage"`
	Location  string `gorm:"column:location" json:"location"`
	Birthday  string `gorm:"column:birthday" json:"birthday"`
	Height    uint8  `gorm:"column:height" json:"height"`
	Weight    uint8  `gorm:"column:weight" json:"weight"`
	common.GormModel
}

func (user *User) setPassword(password string) error {
	if len(password) == 0 {
		return errors.New("password should not be empty")
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	return nil
}

func (user *User) checkPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&User{})
	if err != nil {
		log.Println(err)
	}
}

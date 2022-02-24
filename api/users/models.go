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
	Weight    uint8  `gorm:"column:weight" json:"weight"`
	Height    uint8  `gorm:"column:height" json:"height"`
	common.GormModel
}

type Follow struct {
	UserId   int  `gorm:"column:user_id; not null; uniqueIndex:unique_follow" json:"userId"`
	FollowId int  `gorm:"column:follow_id; not null; uniqueIndex:unique_follow" json:"followId"`
	User     User `gorm:"foreignKey:UserId" json:"user"`
	Follow   User `gorm:"foreignKey:FollowId" json:"follow"`
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

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&User{}, &Follow{})
	if err != nil {
		log.Println(err)
	}
}

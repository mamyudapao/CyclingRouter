package users

import (
	"log"

	"github.com/mamyudapao/CyclingRouter/common"
)

type User struct {
	Username  string `gorm:"column:username; not null" json:"username"`
	Email     string `gorm:"column:email;unique; not null" json:"email"`
	Password  []byte `gorm:"column:password;not null;" json:"-"`
	Biography string `gorm:"column:biography;" json:"biography"`
	UserImage string `gorm:"column:user_image;" json:"userImage"`
	Location  string `gorm:"column:location" json:"location"`
	Birthday  string `gorm:"column:birthday" json:"birthday"`
	common.GormModel
}

func AutoMigrate() {
	db := common.GetDB()
	err := db.AutoMigrate(&User{})
	if err != nil {
		log.Println(err)
	}
}

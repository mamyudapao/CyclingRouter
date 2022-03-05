package common

import (
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database struct {
	*gorm.DB
}

type GormModel struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

var DB *gorm.DB

func InitDB() {
	dsn := "docker:51015101Ab!@tcp(mysql-container:3306)/cycling_router?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("db err: (Init) ", err)
		panic("Cannot Connect DB")
	}
	fmt.Println("Success init")
	DB = db
}

func GetDB() *gorm.DB {
	return DB
}

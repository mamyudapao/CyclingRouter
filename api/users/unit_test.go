package users

import (
	"github.com/bxcodec/faker/v3"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var image_url = "9784299022110.jpg"
var test_db *gorm.DB

func newUserModel() User {
	return User{
		Username:  "i am god",
		Email:     "test@gmail.com",
		Biography: "fffff",
		UserImage: image_url,
		Password:  "",
	}
}

func userModelMocker(n int) []User {
	var ret []User
	for i := 0; i < n; i++ {
		userModel := User{
			Username:  faker.Name(),
			Email:     faker.Email(),
			Biography: faker.Paragraph(),
			UserImage: image_url,
		}
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456789"), bcrypt.DefaultCost)
		userModel.Password = string(hashedPassword)
		test_db.Create(&userModel)
		ret = append(ret, userModel)
	}
	return ret
}

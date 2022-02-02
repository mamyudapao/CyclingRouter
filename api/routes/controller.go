package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mamyudapao/CyclingRouter/common"
)

func CreateRoute(c *gin.Context) {
	var routeValidation RouteCreationValidator
	err := c.ShouldBindJSON(&routeValidation)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":    "Validation Error",
			"detail": err.Error(),
		})
		return
	}
	route := Route{
		UserId:      routeValidation.UserId,
		Direction:   routeValidation.Direction,
		Title:       routeValidation.Title,
		Description: routeValidation.Description,
	}
	err = common.DB.Create(&route).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "Error creating user",
		})
		return
	}
	response := ResponseRoute{
		ID:          route.ID,
		UserId:      route.UserId,
		Description: route.Description,
		Title:       route.Title,
		Direction:   route.Direction,
	}
	c.JSON(http.StatusOK, response)
}

func RetriveRoute(c *gin.Context) {
	var route *Route
	err := common.DB.Where("id = ?", c.Param("id")).First(&route).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	response := ResponseRoute{
		ID:          route.ID,
		UserId:      route.UserId,
		Description: route.Description,
		Title:       route.Title,
		Direction:   route.Direction,
	}
	c.JSON(http.StatusOK, response)
}

func UpdateRoute(c *gin.Context) {
	var route Route
	var routeValidation RouteUpdateValidator
	err := c.ShouldBindJSON(&routeValidation)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(routeValidation)
	result := common.DB.Model(route).Where("id = ?", c.Param("id")).First(&route).Updates(routeValidation)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "failed to update",
		})
		return
	}
	c.JSON(http.StatusOK, ResponseRoute{
		ID:          route.ID,
		UserId:      route.UserId,
		Description: routeValidation.Description,
		Title:       routeValidation.Title,
		Direction:   routeValidation.Direction,
	})
}

func DeleteRoute(c *gin.Context) {
	result := common.DB.Delete(&Route{}, c.Param("id"))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": result.Error,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "done delete route",
	})
}

func GetRoutes(c *gin.Context) {
	var routes *[]Route
	err := common.DB.Where("user_id = ?", c.Param("id")).Find(&routes).Error
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"msg": "Route not found",
		})
		return
	}
	fmt.Println(routes)
	c.JSON(http.StatusOK, gin.H{
		"routes": routes,
	})
}

func testFunc(c *gin.Context) {

}

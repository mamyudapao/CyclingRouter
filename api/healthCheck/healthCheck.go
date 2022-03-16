package healthCheck

import "github.com/gin-gonic/gin"

func HealthCheckRouter(router *gin.RouterGroup) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, nil)
	})
}

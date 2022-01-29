package aws

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
)

func InitAWS() (aws.Config, error) {
	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
	) //awsのdefault設定を読み込む
	fmt.Println(cfg.Credentials.Retrieve(context.TODO()))
	return cfg, err
}

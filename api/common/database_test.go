package common

import (
	"testing"
)

func TestInitDB(t *testing.T) {
	got := InitDB()
	t.Log(got)
	if got == nil {
		t.Errorf("got nil, expected DB instance")
	}
}

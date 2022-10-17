package main

import (
	"fmt"
	route2 "github.com/pedrosfigueiredo/m-delivery/go-simulator/application/route"
)

func main() {
	route := route2.Route{
		ID:       "1",
		ClientID: "1",
	}

	err := route.LoadPositions()
	if err != nil {
		return
	}
	stringJson, _ := route.ExportJsonPositions()
	fmt.Println(stringJson[0])
}

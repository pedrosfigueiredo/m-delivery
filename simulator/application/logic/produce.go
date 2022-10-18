package logic

import (
	"encoding/json"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	rt "github.com/pedrosfigueiredo/m-delivery/go-simulator/application/route"
	"github.com/pedrosfigueiredo/m-delivery/go-simulator/infra/kafka"
	"log"
	"os"
	"time"
)

// Produce is responsible to publish the positions of each request
// Example of a json request:
// {"clientId":"1","routeId":"1"}
// {"clientId":"2","routeId":"2"}
// {"clientId":"3","routeId":"3"}
func Produce(msg *ckafka.Message) {
	producer := kafka.NewKafkaProducer()
	route := rt.NewRoute()
	err := json.Unmarshal(msg.Value, &route)
	if err != nil {
		log.Fatal("Invalid json format.")
	}
	route.LoadPositions()
	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Println(err.Error())
	}
	for _, p := range positions {
		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)
		time.Sleep(time.Millisecond * 500)
	}
}

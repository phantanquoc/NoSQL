#include "DHT.h"
#include <WiFi.h>
#include <HTTPClient.h>

const char* SSID = "VNPT";
const char* PASSWORD = "012345678@";

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht (DHTPIN, DHTTYPE);

void setup(){
  Serial.begin(115200);
// ket noi wifi:
  WiFi.begin(SSID, PASSWORD);
  Serial.print("\n Conneting to wifi.");
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to the WiFi network");

   dht.begin();
}

// ham gui du lieu
void sendRequest(float temperature, float humidity){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    http.begin("http://192.168.43.75:3000/dht11?temperature=" + String(temperature) +"&humidity="+String(humidity));
    http.addHeader("Content-Type", "text/plant");
    
    int httpResponseCode = http.POST("request create dht11 data");
      Serial.println("Sen DHT11 Data to server\n");
  }
}
void loop()
{
  delay(5000);
  float h= dht.readHumidity();
  float t = dht.readTemperature();

  if(isnan(h) || isnan(t)){
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  Serial.print(F("Temperature: "));
  Serial.print(t);
  Serial.print(F(" C "));
  Serial.print(F("\tHumidity: "));
  Serial.print(h);
  Serial.print(F("%"));
  
  sendRequest(t,h);
  
}

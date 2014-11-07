#include <Servo.h>

Servo leftLeg;
Servo rightLeg;
void forward() {
leftLeg.write(80);
delay(250);
rightLeg.write(40);
delay(250);
leftLeg.write(110);
delay(250);
rightLeg.write(60);
delay(250);
}

void backward() {
leftLeg.write(140);
delay(250);
rightLeg.write(90);
delay(250);
leftLeg.write(110);
delay(250);
rightLeg.write(60);
delay(250);
}

void red() {
analogWrite(9, 0);
analogWrite(10, 255);
analogWrite(11, 255);
}

void green() {
analogWrite(9, 255);
analogWrite(10, 0);
analogWrite(11, 255);
}

void blue() {
analogWrite(9, 255);
analogWrite(10, 255);
analogWrite(11, 0);
}

void setup() {
leftLeg.attach(5);
rightLeg.attach(6);
leftLeg.write(110);
rightLeg.write(40);
}
void loop() {
  red();

  backward();

  delay(2000);

}

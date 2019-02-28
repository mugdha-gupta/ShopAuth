#!/usr/bin/python

#Control relay using gpio 4

import RPi.GPIO as GPIO
import time

pin = 4 #gpio 4

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
GPIO.output(pin, GPIO.HIGH)
time.sleep(2)

while True:
  print("turning on")
  GPIO.output(pin, GPIO.LOW)
  time.sleep(2)
  print("turning off")
  GPIO.output(pin, GPIO.HIGH)
  time.sleep(3)



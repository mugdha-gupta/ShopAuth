#!/usr/bin/python

#Monitor 4 GPIO headers and print when activity detected
#Assumes that the headers are inserted into the specific GPIO pins

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(6, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(19, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(26, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
  gpin13=GPIO.input(13)
  gpin6=GPIO.input(6)
  gpin19=GPIO.input(19)
  gpin26=GPIO.input(26)
  if gpin13 == False:
    print("Button 4 pressed.")
    time.sleep(0.25)
  elif gpin6 == False:
    print("Button 3 pressed.")
    time.sleep(0.25)
  elif gpin19 == False:
    print("Button 1 pressed.")
    time.sleep(0.25)
  elif gpin26 == False:
    print("Button 2 pressed.")
    time.sleep(0.25)

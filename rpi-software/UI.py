import sys
import os
os.environ['KIVY_GL_BACKEND'] = 'gl'
import kivy
from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen, CardTransition
from kivy.properties import StringProperty
from kivy.clock import Clock
import pexpect
import threading
import requests
import json
import time as sleep
from datetime import datetime, date
from datetime import time, timedelta
import signal

#Control relay using gpio 4

import RPi.GPIO as GPIO
relay_pin = 4 #gpio 4

GPIO.setmode(GPIO.BCM)
GPIO.setup(relay_pin, GPIO.OUT)
GPIO.output(relay_pin, GPIO.LOW)


b4_pin=13
b3_pin=6
b1_pin=19
b2_pin=26
GPIO.setup(b1_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(b2_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(b3_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(b4_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
lastb1press_time = datetime.now()
lastb2press_time = datetime.now()
lastb3press_time = datetime.now()
lastb4press_time = datetime.now()

user_card = ""
f = open('/home/pi/MachineId.txt', "r")
machine_id = f.read()
f.close()
API_ENDPOINT = "http://192.168.0.10:8080/login/auth"
LOGOUT_ENDPOINT = "http://192.168.0.10:8080/login/logout"
apiResponse = {}
witness = ""
witnessTimeout = False
shutdown = False

global scancard


def scancard(timeout):
    # TODO: make sure this subprocess dies at end of function
    try:
        p = pexpect.spawn('pcsc_scan')
        p.expect("ATR:",timeout)
        p.expect("ATR:",timeout)
        scanString = p.before.replace(" ", "").replace("\n", "").replace("\r", "").replace("\x1b","").replace("[35m","").replace("[0m","")
        print(scanString)
        return scanString
        p.kill(0)
    except pexpect.exceptions.TIMEOUT:
        return "Timeout"
    except pexpect.exceptions.EOF:
        return "Timeout"


# Create both screens. Please note the root.manager.current: this is how
# you can control the ScreenManager from kv. Each screen has by default a
# property manager that gives you the instance of the ScreenManager used.
Builder.load_string("""
<UserScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: 'Please tap your comet card =>'
            font_size: '50sp'

<WitnessScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size    
    BoxLayout:
        Label:
            text: 'Please tap witness comet card =>'
            font_size: '50sp'

<NoAuthScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: 'You are not authenticated\\nfor this machine :('
            font_size: '50sp'
            halign: 'center'

<NoUserScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: 'You are not in the system.\\n\\nSee the machine shop supervisor'
            font_size: '50sp'
            halign: 'center'
            
<ApiOffline>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: 'Api is offline'
            font_size: '50sp'
            halign: 'center'

<Error>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: 'Error'
            font_size: '50sp'
            halign: 'center'


<InvalidWitnessScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: 'Witness must be a different person'
            font_size: '50sp'

<TimerScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPiTimer.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            text: "%s" % (root.timeLeft)
            font_size: '50sp'

""")


# Declare both screens
class UserScreen(Screen):
    def on_enter(self):
        self.t1 = threading.Thread(target=self.scanAndAuth)
        self.t1.start()

    def scanAndAuth(self):
        global user_card
        global apiResponse
        global witness
        user_card = scancard(None)
        data = json.dumps({"machine_id": machine_id,
                           "scan_string": user_card})
        headers = {'content-type': 'application/json'}
	try:
            r = requests.post(url=API_ENDPOINT, data=data, headers=headers)
            apiResponse = r.json()
            print(apiResponse)
            if r.status_code != 200:
                if r.status_code == 404:
                    sm.current = 'noUser'
            elif apiResponse["authenticated"]:
                if apiResponse["needWitness"]:
                    sm.current = 'witness'
                else:
                    witness = "None"
                    sm.current = 'timer'
            else:
                sm.current = 'noAuth'

        except requests.exceptions.ConnectionError:
            sm.current = 'apiOffline'
        except:
            sm.current = 'error'

class WitnessScreen(Screen):
    def on_enter(self):
        global witnessTimeout
        witnessTimeout = False
        sleep.sleep(1)
        t1 = threading.Thread(target=self.scanWitnessOrTimeout)
        t1.start()

    def scanWitnessOrTimeout(self):
        global witnessTimeout
        scanWitness = threading.Thread(target=self.scanWitness)
        scanWitness.start()
        scanWitness.join(timeout=10)
        if scanWitness.is_alive():
            witnessTimeout = True
            sm.current = 'user'

    def scanWitness(self):
        global witness
        witness = scancard(12)
        if witnessTimeout:
            pass
        elif witness == user_card:
            sm.current = 'invalidWitness'
        else:
            sm.current = 'timer'


class InvalidWitnessScreen(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'witness'


class NoAuthScreen(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'user'


class NoUserScreen(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'user'


class Error(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'user'


class ApiOffline(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'user'


class TimerScreen(Screen):
    timeLeft = StringProperty()

    def on_pre_enter(self):
        global relay_pin
        print("turning relay on")
        GPIO.output(relay_pin, GPIO.HIGH)
        self.startTime = datetime.now()
        timeInit = time(hour=int(apiResponse["time"].split(":")[0]), minute=int(apiResponse["time"].split(":")[1]),
                        second=int(apiResponse["time"].split(":")[2]))
        self.timeLeftObject = datetime.combine(date.min, timeInit)
        self.timeLeft = str(self.timeLeftObject.time()).split(".")[0]
        Clock.schedule_interval(self.timer, 0.01)

    def timer(self, dt):
        currTimeLeft = self.timeLeftObject - (datetime.now() - self.startTime)
	b1=GPIO.input(b1_pin)
	b2=GPIO.input(b2_pin)
	b3=GPIO.input(b3_pin)
	b4=GPIO.input(b4_pin)
        done = False
        global lastb1press_time
        global lastb4press_time
        if b4 == False and b3 == False:
            done = True
        elif b1 == False:
            
            lagperiod = lastb1press_time + timedelta(seconds=1)
            if datetime.now() > lagperiod:
                lastb1press_time = datetime.now() 
                self.timeLeftObject += timedelta(seconds=10)
        if done or (currTimeLeft.hour == 0 and currTimeLeft.minute == 0 and currTimeLeft.second == 0):
	    global relay_pin
	    print("turning relay off")
	    GPIO.output(relay_pin, GPIO.LOW)
            sm.current = 'user'
	    data = json.dumps({"machine_id": machine_id,
                               "scan_string": user_card,
                               "witness": witness})
            headers = {'content-type': 'application/json'}
            try:
                r = requests.post(url=LOGOUT_ENDPOINT, data=data, headers=headers)
                print(r.json())
                sm.current = 'user'
                if r.status_code != 200:
                    sm.current = 'error'
            except:
                sm.current = 'error'
        self.timeLeft = str(currTimeLeft.time()).split(".")[0]

    def on_pre_leave(self):
        Clock.unschedule(self.timer)


# Create the screen manager
sm = ScreenManager(transition=CardTransition())
sm.add_widget(UserScreen(name='user'))
sm.add_widget(WitnessScreen(name='witness'))
sm.add_widget(NoAuthScreen(name='noAuth'))
sm.add_widget(NoUserScreen(name='noUser'))
sm.add_widget(ApiOffline(name='apiOffline'))
sm.add_widget(Error(name='error'))
sm.add_widget(InvalidWitnessScreen(name='invalidWitness'))
sm.add_widget(TimerScreen(name='timer'))


class TestApp(App):
    def build(self):
        return sm


if __name__ == '__main__':
    TestApp().run()

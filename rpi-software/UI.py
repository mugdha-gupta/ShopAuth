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
import socket

#Control relay using gpio 4
import RPi.GPIO as GPIO
relay_pin = 4 #gpio 4

GPIO.setmode(GPIO.BCM)
GPIO.setup(relay_pin, GPIO.OUT)
GPIO.output(relay_pin, GPIO.LOW)

#Control buttons using gpio 29, 26, 6, and 13
b4_pin=13
b3_pin=6
b1_pin=19
b2_pin=26
GPIO.setup(b1_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(b2_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(b3_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(b4_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

#Store the last time a button was recorded to avoid counting one button click as multiple
lastb1press_time = datetime.now()
lastb2press_time = datetime.now()
lastb3press_time = datetime.now()
lastb4press_time = datetime.now()

#Init variables
user_card = ""
f = open('/home/pi/MachineId.txt', "r")
machine_id = f.read()
f.close()
API_ENDPOINT = "http://192.168.0.10:8080/login/auth"
LOGOUT_ENDPOINT = "http://192.168.0.10:8080/login/logout"
apiResponse = {}
witness = ""
p = None

#Function to retrieve a comet card scan, Returns "Timeout" if error occurs or timeout
global scancard
def scancard(timeout):
    global p
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
    except:
        return "Timeout"


# Create all screens. Please note the root.manager.current: this is how
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

<HiddenScreen>:
    canvas.before:
        BorderImage:
            border: 0, 0, 0, 0
            source: './BackgroundPi.png'
            pos: self.pos
            size: self.size
    BoxLayout:
        Label:
            font_size: '50sp'
            text: "%s" % (root.hiddenMessage)
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

<ErrorScreen>:
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


# Home Screen
class UserScreen(Screen):
    def on_enter(self):
        # Start scanning for card
        self.t1 = threading.Thread(target=self.scanAndAuth)
        self.t1.start()
        #While scanning for card continue to check for button clicks to trigger hidden screen
        Clock.schedule_interval(self.hiddenScreen, 0.01)

    def hiddenScreen(self,dt):
        # Open hidden sceen if all buttons clicked at once
        b1=GPIO.input(b1_pin)
        b2=GPIO.input(b2_pin)
        b3=GPIO.input(b3_pin)
        b4=GPIO.input(b4_pin)
        if not b1 and not b2 and not b3 and not b4:
            # Stop the card scan thread before opening hidden screen
            p.terminate(force=True)
            sm.current = 'hidden'

    def scanAndAuth(self):
        global user_card
        global apiResponse
        global witness
        
        # Scan card
        card = scancard(None)
        
        # If error or timeout, do nothing
        if card == "Timeout":
            return
        user_card = card
        
        # Check if user that scanned is authorized for the machine
        data = json.dumps({"machine_id": machine_id,
                           "scan_string": user_card})
        headers = {'content-type': 'application/json'}
        try:
            r = requests.post(url=API_ENDPOINT, data=data, headers=headers)
            apiResponse = r.json()
            print(apiResponse)
            
            # If user not found error then tell the user to see Gene
            if r.status_code != 200:
                if r.status_code == 404:
                    sm.current = 'noUser'
            # If authenticated
            elif apiResponse["authenticated"]:
                # If witness required go to witness screen
                if apiResponse["needWitness"]:
                    sm.current = 'witness'
                # If witness not required set witness to none and go to timer
                else:
                    witness = "None"
                    sm.current = 'timer'
            else:
                # If not authenticated, let the user know
                sm.current = 'noAuth'
        
        # If connection error exception then inform the user
        except requests.exceptions.ConnectionError:
            sm.current = 'apiOffline'
        # If any other error just show general error message
        except Exception as e:
            print(e)
            print("Unkown error")
            sm.current = 'error'
    
    def on_pre_leave(self):
        # Before leaving stop checking for hidden screen
        Clock.unschedule(self.hiddenScreen)


class WitnessScreen(Screen):
    def on_enter(self):
        global witness
        # Avoid scanning first card a second time
        sleep.sleep(0.5)
        
        # Scan the witness card
        witness = scancard(10)
        
        # If more than 10 seconds, go back to main screen
        if witness == "Timeout":
            sm.current = 'user'
        # If witness is same as user show error message
        elif witness == user_card:
            sm.current = 'invalidWitness'
        # Else go to timer screen
        else:
            sm.current = 'timer'
    

# Define all error screens to display for 3 seconds then go back to previous screen
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


class ErrorScreen(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'user'


class ApiOffline(Screen):
    def on_enter(self):
        sleep.sleep(3)
        sm.current = 'user'

class HiddenScreen(Screen):
    # The message displayed to the user
    hiddenMessage = StringProperty()

    def on_pre_enter(self):
        # Retrieve the ip address of the pi
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        
        # Generate message
        self.hiddenMessage = "IP: " + ip + "\nMachine ID: " + machine_id + "\n\nPress any button to exit"
        
    def on_enter(self):
        # Avoid counting the same press that triggered the screen
        sleep.sleep(0.5)
        
        # Start checking for any button click to leave
        Clock.schedule_interval(self.button, 0.01)
    
    def button(self,dt):
        # Check if any button is clicked and if so go back to user screen
        b1=GPIO.input(b1_pin)
        b2=GPIO.input(b2_pin)
        b3=GPIO.input(b3_pin)
        b4=GPIO.input(b4_pin)
        if not b1 or not b2 or not b3 or not b4:
            sm.current = 'user'

    def on_pre_leave(self):
        #Stop checking for button click after leaving
        Clock.unschedule(self.button)



class TimerScreen(Screen):
    # Time displayed on screen
    timeLeft = StringProperty()

    def on_pre_enter(self):
        # Turn the relay on
        global relay_pin
        print("turning relay on")
        GPIO.output(relay_pin, GPIO.HIGH)
        
        # Get current time to see how much time from starting
        self.startTime = datetime.now()
        timeInit = time(hour=int(apiResponse["time"].split(":")[0]), minute=int(apiResponse["time"].split(":")[1]),second=int(apiResponse["time"].split(":")[2]))
        self.timeLeftObject = datetime.combine(date.min, timeInit)
        self.timeLeft = str(self.timeLeftObject.time()).split(".")[0]
        
        # Start updating timer and checking for button clicks
        Clock.schedule_interval(self.timer, 0.01)

    def timer(self, dt):
        # Recalculate the time to be displayed
        currTimeLeft = self.timeLeftObject - (datetime.now() - self.startTime)

        #Check buttons for presses
        b1=GPIO.input(b1_pin)
        b2=GPIO.input(b2_pin)
        b3=GPIO.input(b3_pin)
        b4=GPIO.input(b4_pin)
        done = False
        global lastb1press_time
        global lastb4press_time
        # If bottom two buttons are click, logout immediatley
        if b1 == False:
            lagperiod = lastb1press_time + timedelta(seconds=1)
            if datetime.now() > lagperiod:
                lastb1press_time = datetime.now() 
                self.timeLeftObject += timedelta(seconds=300)
        # If bottom two buttons are clicked or time is out, logout immediatley
        if (b4 == False and b3 == False) or (currTimeLeft.hour == 0 and currTimeLeft.minute == 0 and currTimeLeft.second == 0):
            # Turn off relay  return to user screen and save to logs
            global relay_pin
            print("turning relay off")
            GPIO.output(relay_pin, GPIO.LOW)
            
            # Save use to log
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
            
            # Return to main screen
            sm.current = 'user'
        # Display new time
        self.timeLeft = str(currTimeLeft.time()).split(".")[0]

    def on_pre_leave(self):
        # Stop updating clock when leaving screen
        Clock.unschedule(self.timer)


# Create the screen manager
sm = ScreenManager(transition=CardTransition())
sm.add_widget(UserScreen(name='user'))
sm.add_widget(WitnessScreen(name='witness'))
sm.add_widget(NoAuthScreen(name='noAuth'))
sm.add_widget(NoUserScreen(name='noUser'))
sm.add_widget(ApiOffline(name='apiOffline'))
sm.add_widget(ErrorScreen(name='error'))
sm.add_widget(InvalidWitnessScreen(name='invalidWitness'))
sm.add_widget(TimerScreen(name='timer'))
sm.add_widget(HiddenScreen(name='hidden'))

class TestApp(App):
    def build(self):
        return sm


if __name__ == '__main__':
    try:
        TestApp().run()
    # Handle keyboard interupt if card is being scanned
    except KeyboardInterrupt:
        print('Interrupted')
            try:
                p.terminate(force=True)
                GPIO.cleanup()
                sys.exit(0)
            except SystemExit:
                os._exit(0)

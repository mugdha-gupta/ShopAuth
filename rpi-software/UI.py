from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.properties import StringProperty
from kivy.clock import Clock
import pexpect
import threading
import requests
import json
import time as sleep
from datetime import datetime, date
from datetime import time
from kivy.core.window import Window


user_card = ""
machine_id = 2
API_ENDPOINT = "http://localhost:8080/login/auth"
apiResponse = {}

global scancard


def scancard():
    # TODO: make sure this subprocess dies at end of function
    try:
        p = pexpect.spawn('pcsctest', encoding='utf-8')
        p.expect("Enter the reader number          : ")
        p.sendline("1")
        p.expect('Current Reader ATR Value         : ', None)
        p.expect('Testing SCardDisconnect          : Command successful.')
        return p.before.replace(" ", "").replace("\n", "").replace("\r", "")
    except pexpect.exceptions.TIMEOUT:
        return "Timeout"
    except pexpect.exceptions.EOF:
        return "Timeout"


# Create both screens. Please note the root.manager.current: this is how
# you can control the ScreenManager from kv. Each screen has by default a
# property manager that gives you the instance of the ScreenManager used.
Builder.load_string("""
<UserScreen>:
    BoxLayout:
        Label:
            text: 'Please tap your comet card =>'
            font_size: '50sp'

<WitnessScreen>:
    BoxLayout:
        Label:
            text: 'Please tap witness comet card =>'
            font_size: '50sp'

<NoAuthScreen>:
    BoxLayout:
        Label:
            text: 'You are not authenticated for this machine :('
            font_size: '50sp'

<InvalidWitnessScreen>:
    BoxLayout:
        Label:
            text: 'Witness must be a different person'
            font_size: '50sp'

<TimerScreen>:
    BoxLayout:
        Label:
            text: "%s" % (root.timeLeft)
            font_size: '50sp'

""")


# Declare both screens
class UserScreen(Screen):
    def on_enter(self):
        t1 = threading.Thread(target=self.scanAndAuth)
        t1.start()

    def scanAndAuth(self):
        global user_card
        global apiResponse
        user_card = scancard()
        data = json.dumps({"machine_id": machine_id,
                           "scan_string": user_card})
        headers = {'content-type': 'application/json'}
        r = requests.post(url=API_ENDPOINT, data=data, headers=headers)
        apiResponse = r.json()
        print(apiResponse)
        # TODO: Handle response errors
        if apiResponse["authenticated"]:
            if apiResponse["needWitness"]:
                sm.current = 'witness'
            else:
                sm.current = 'timer'
        else:
            sm.current = 'noAuth'


class WitnessScreen(Screen):
    def on_enter(self):
        sleep.sleep(1)
        t1 = threading.Thread(target=self.scanWitnessOrTimeout)
        t1.start()

    def scanWitnessOrTimeout(self):
        scanWitness = threading.Thread(target=self.scanWitness)
        scanWitness.start()
        scanWitness.join(timeout=10)
        if scanWitness.is_alive():
            sm.current = 'user'

    def scanWitness(self):
        witness = scancard()
        if witness == user_card:
            sm.current = 'invalidWitness'
        else:
            sm.current = 'timer'


class InvalidWitnessScreen(Screen):
    def on_enter(self):
        t1 = threading.Thread(target=self.sleep)
        t1.start()

    def sleep(self):
        sleep.sleep(3)
        sm.current = 'witness'


class NoAuthScreen(Screen):
    def on_enter(self):
        t1 = threading.Thread(target=self.sleep)
        t1.start()

    def sleep(self):
        sleep.sleep(3)
        sm.current = 'user'


class TimerScreen(Screen):
    timeLeft = StringProperty()

    def on_pre_enter(self):
        # TODO: Turn on relay
        print("here")
        self.startTime = datetime.now()
        timeInit = time(hour=int(apiResponse["time"].split(":")[0]), minute=int(apiResponse["time"].split(":")[1]),
                        second=int(apiResponse["time"].split(":")[2]))
        self.timeLeftObject = datetime.combine(date.min, timeInit)
        self.timeLeft = str(self.timeLeftObject.time()).split(".")[0]
        Clock.schedule_interval(self.timer, 0.01)
        # TODO: Add Button code

    def timer(self, dt):
        currTimeLeft = self.timeLeftObject - (datetime.now() - self.startTime)
        if currTimeLeft.hour == 0 and currTimeLeft.minute == 0 and currTimeLeft.second == 0:
            # TODO: Logout
            sm.current = 'user'
        else:
            self.timeLeft = str(currTimeLeft.time()).split(".")[0]

    def on_pre_leave(self):
        Clock.unschedule(self.timer)


# Create the screen manager
sm = ScreenManager()
sm.add_widget(UserScreen(name='user'))
sm.add_widget(WitnessScreen(name='witness'))




sm.add_widget(NoAuthScreen(name='noAuth'))
sm.add_widget(InvalidWitnessScreen(name='invalidWitness'))
sm.add_widget(TimerScreen(name='timer'))


class TestApp(App):
    def build(self):
        return sm


if __name__ == '__main__':
    Window.fullscreen = 'auto'
    TestApp().run()

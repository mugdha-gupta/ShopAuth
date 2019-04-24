import pexpect

def main():
    while True:
        print(getATR())

def getATR(): 
    try:
        p = pexpect.spawn('pcsc_scan')
        p.expect('ATR:',None)
        p.expect('ATR:',None)
        return p.before.replace(" ","").replace("\n","")
        p.kill(0)
    except pexpect.exceptions.TIMEOUT:
        return "Timeout"
    except pexpect.exceptions.EOF:
        return "EOF"

if __name__ == "__main__":
    main()


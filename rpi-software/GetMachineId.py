import os
import requests


def main():
    exists = os.path.isfile('/home/pi/MachineId.txt')
    if exists:
        f = open('/home/pi/MachineId.txt', "r")
        print(f.read())
        f.close()
    else:
        f = open('/home/pi/MachineId.txt', "w+")
        API_ENDPOINT = "http://192.168.0.10:8080/machine/blank"
        headers = {'content-type': 'application/json'}
        r = requests.post(url=API_ENDPOINT, headers=headers)
        apiResponse = r.json()
        print(apiResponse["id"])
        f.write(str(apiResponse["id"]))
        f.close()


if __name__ == "__main__":
    main()

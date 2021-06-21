

from PersonAgent import * 
from airConditioningAgent import *
import json
import random

from time import sleep

room_area = 109
p = PersonAgent("Fernando", [0.6,0.6,0.6,0.4,0.4,0.,0.])
air = airConditioningAgent(room_area)


def heatPerception(temp):
    """
    Simulates heat perception and decides what temperature to set the air conditioner to.
    :param temp: Room temperature
    :return: returns new air conditioning temperature.
    """
    v = random.randint(1,100)
    if temp < 20:
        if v < 30:
            air_temp = 25
        elif v >= 30 and v < 50:
            air_temp = 26
        elif v>= 50 and v < 80:
            air_temp = 27
        else:
            air_temp = 28
    elif temp >= 20 and temp < 30:
        if v > 80:
            air_temp = 25
        else:
            air_temp = None
    else:
        if v < 30:
            air_temp = 25
        elif v >= 30 and v < 50:
            air_temp = 24
        elif v>=50 and v < 80:
            air_temp = 23
        else:
            air_temp = 22
    return air_temp

def scenary(degree, num_hours):
    """
    Simulates a scenario where the air conditioning is turned on NUM_HOURS a day at  DEGREES degrees.
    """
    total_consumption = 0
    air.changeTemperature(degree)

    for i in range(0,num_hours):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    return "{} hours - {} degrees".format(num_hours,degree), total_consumption



  

if __name__ == "__main__":
    dic = dict()
    degrees = [25,26,27,28]
    hours = [9,24]
    for hour in hours:
        for temp in degrees:
            k, v = scenary(temp,hour)
            dic[k] = v
    print (json.dumps(dic, indent=2, default=str))


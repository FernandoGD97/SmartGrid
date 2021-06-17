

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


def scenary1():
    """
    Simulates a scenario where the air conditioning is turned on 24 hours a day at 25 degrees.
    :consumption per hour 16350 | Total : 392400.0
    """
    total_consumption = 0
    air.changeTemperature(25)

    for i in range(0,24):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "24 hours - 25 degrees", total_consumption



def scenary2():
    """
    Simulates a scenario where the air conditioning is turned on 24 hours a day at 26 degrees.
    :consumption per hour 17658 | Total : 423792.0
    """
    total_consumption = 0
    air.changeTemperature(26)

    for i in range(0,24):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "24 hours - 26 degrees", total_consumption


def scenary3():
    """
    Simulates a scenario where the air conditioning is turned on 24 hours a day at 27 degrees.
    :consumption per hour 18966 | Total : 455184.0
    """
    total_consumption = 0
    air.changeTemperature(27)

    for i in range(0,24):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "24 hours - 27 degrees", total_consumption


def scenary4():
    """
    Simulates a scenario where the air conditioning is turned on 24 hours a day at 28 degrees.
    :consumption per hour 20274 | Total : 486576.0
    """
    total_consumption = 0
    air.changeTemperature(28)

    for i in range(0,24):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "24 hours - 28 degrees", total_consumption


def scenary5():
    """
    Simulates a scenario where the air conditioning is turned on 8 hours a day at 25 degrees.
    :consumption per hour 16350 | Total : 147150.0
    """
    total_consumption = 0
    air.changeTemperature(25)

    for i in range(0,9):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "8 hours - 25 degrees", total_consumption

def scenary6():
    """
    Simulates a scenario where the air conditioning is turned on 8 hours a day at 26 degrees.
    :consumption per hour 17658 | Total : 158922.0
    """
    total_consumption = 0
    air.changeTemperature(26)

    for i in range(0,9):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "8 hours - 26 degrees", total_consumption

def scenary7():
    """
    Simulates a scenario where the air conditioning is turned on 8 hours a day at 27 degrees.
    :consumption per hour 18966 | Total : 170964.0
    """
    total_consumption = 0
    air.changeTemperature(27)

    for i in range(0,9):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "8 hours - 27 degrees", total_consumption

def scenary8():
    """
    Simulates a scenario where the air conditioning is turned on 8 hours a day at 28 degrees.
    :consumption per hour 20274 | Total : 486576.0
    """
    total_consumption = 0
    air.changeTemperature(28)

    for i in range(0,9):
        total_consumption += air.actualConsumption()
        print(air.actualConsumption(), " ", i)
        print(air.printStatus())
        sleep(0.5)
        
    print("Total consumption: ", total_consumption)
    return "8 hours - 28 degrees", total_consumption
  

if __name__ == "__main__":
    dic = dict()
    k, v = scenary1()
    dic[k] = v
    k, v = scenary2()
    dic[k] = v
    k, v = scenary3()
    dic[k] = v
    k, v = scenary4()
    dic[k] = v
    k, v = scenary5()
    dic[k] = v
    k, v = scenary6()
    dic[k] = v
    k, v = scenary7()
    dic[k] = v
    k, v = scenary8()
    dic[k] = v
    print (json.dumps(dic, indent=2, default=str))


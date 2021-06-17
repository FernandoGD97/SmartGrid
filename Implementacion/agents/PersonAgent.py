#IMPORTS
import random
import time
import math


class PersonAgent () :
    def __init__(self, name, policy, state = "Not Working"):
        """
        Initialise a person agent

        :param name: person name/identifier
        :param policy: work attendance policy
        :return: returns nothing
        """
        self.name = name
        self.policy = policy
        self.state = state

    def work(self, dayW):
        """
        Decide to telework or come to the office depeding a random value and policy.

        :param dayW: Day of the week (0 - Monday / 6 - Sunday)
        :return: returns 0 - Office / 1 - Home
        """
        v = random.randint(1,100)
        if v < self.policy[dayW] * 100:
            self.state = "Working in the office"
            self.policy[dayW] += 0.001
            return 0
        else:
            self.state = "Working at Home"
            self.policy[dayW] -= 0.001
            return 1

    def airConditioning(self, temp, air_state, air_temp):
        """
        Decide whether to turn the air conditioning on or off.

        :param temp: Room temperature
        :param air_state: 0 - switched off / 1 - switched on
        :return: returns 0 - switched off / 1 - switched on 
        """
        v = random.randint(1,100)
        if self.state == "Working in the office":
            if air_state == 0:
                air_temp = self.heatPerception(temp)       
                if air_temp != None:
                    air_state = 1          
            else:
                if (abs(air_temp-temp)>= 3 and v < 80) or (abs(air_temp-temp)== 2 and v < 60) or (abs(air_temp-temp)<= 2 and v < 50):
                    air_state = 0
                    air_temp = None         
        else:
            return air_state, air_temp
    
    def heatPerception(self, temp):
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
            elif v>=50 and v < 80:
                air_temp = 27
            else:
                air_temp = 28
        elif temp >= 20 and temp < 30:
            if v > 60:
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
    
    def endWorkDay(self):
        """
        Simulates the end of the work day
        """
        self.state = "Not Working"
    
    def printStatus(self):
        """
        Return the actual person status
        """
        return "{} is {}, policy {}".format(self.name, self.state, self.policy)
    
            

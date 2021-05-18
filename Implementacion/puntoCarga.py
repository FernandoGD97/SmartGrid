#IMPORTS
import random
import time
import math

#VARS


class Charger():
    
    def __init__(self,model_charger):
        self.model_charger = model_charger
        self.busy = 0
        print("Model charger: " + str(self.model_charger))

    def timeTable(self,hour):
        #Time slots according to occupancy
        if hour >= 9 and hour <= 17:
            return 2
        elif hour >= 18 and hour <= 21:
            return 3
        else:
            return 1

    def randomGenerator(self):
        #Generate a random number between 1 and 100
        return random.randint(1,100)
    
    def timeCharging(self, hour):
        if self.model_charger == 0 or self.model_charger == 1:
            v = min(23-hour,8)
        elif self.model_charger == 2:
            v = min(23-hour,2)
        else:
            v = min(23-hour,1)
        return v
    def printState(self):
        return "Model charger: " + str(self.model_charger)+ ", Busy: "+str(self.busy)




def main():
    model_charger = 0 # 0 - Slow model (3,6 Kw), 1 - Normal model (7,4 Kw), 2 - Fast model (11 - 22 Kw) and 3 Fastest model (more than 100 Kw)
    c = Charger(model_charger)
    hour = 0
    will_be_free = 0 # Define when will be free the charger again
    hours_busy=0
    while True:
        if c.busy == 0:
            random = c.randomGenerator() 
            timeTable = c.timeTable(hour%24)
            if timeTable==1 and random < 5:
                c.busy=1
                will_be_free = hour+c.timeCharging(hour%24)
            elif timeTable==2 and random < 35:
                c.busy=1
                will_be_free = hour+c.timeCharging(hour%24)
            elif timeTable==3 and random < 15:
                c.busy=1
                will_be_free = hour+c.timeCharging(hour%24)
        else:
            if hour == will_be_free or hour%24==0:
                c.busy=0
            hours_busy+=1
        if hours_busy == 0:
            average = 0
        else:
            average = round(hours_busy/hour, 2)
        print("Day: {}, Hour: {}, State: {}, Total_Busy: {}% ".format(str(math.floor(hour/24)), str(hour%24), c.printState(), average ))
        hour+=1
        time.sleep(1)


if __name__ == "__main__":
    main()


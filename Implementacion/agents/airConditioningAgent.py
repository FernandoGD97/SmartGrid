class airConditioningAgent():
    def __init__(self, room_area, consumption_pm2 = 150):
        """
        Initialise an air conditioning agent

        :param room area: area of the room (m^2) 
        :param consumption_pm2: Define consumption per square metre
        :return: returns nothing
        """
        self.consumption_per_hour = room_area * consumption_pm2
        self.air_temp = None

    def changeTemperature(self, air_temp = 25):
        """
        Simulate the action of changing the air conditioning temperature 
        """
        self.air_temp = air_temp


    def actualConsumption(self):
        """
        Return the air conditioning consumption 
        """
        if self.air_temp!= None:
            return self.consumption_per_hour * (1+(abs(self.air_temp - 25)*0.08))
        else:
            return 0


    def printStatus(self):
        """
        Return the actual air conditioning status
        """
        return "Air conditioning with {} base consumption per hour is {}".format(self.consumption_per_hour, self.air_temp)


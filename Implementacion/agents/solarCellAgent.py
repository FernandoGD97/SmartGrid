
class solarCellAgent():
    def __init__(self, num_cells = 162, power_supply = 400, capacity = 36000):
        """
        Initialise a solar cell agent

        :param num_cells: Num of unit in the solar cell. 
        :param state: available battery percentage
        :param power_supply
        :return: returns nothing
        """
        self.state = capacity
        self.power_supply = power_supply * num_cells
        self.capacity = capacity

    def charge(self):
        """
            Charge the battery, energy produced by solar cells is stored in a battery.
        """
        self.state = min(self.capacity, self.state + self.power_supply)

    def discharge(self, supply):
        """
            Discharge the battery, consumes the energy stored in the battery
            @param supply: Amount of supply which is consumed
            @return supply
        """
        if self.state >= supply:
            self.state -= supply
            return supply
        else:
            v = self.state
            self.state = 0.0
            return v

    def printStatus(self):
        """
        Return the actual solar cell status
        """
        return "Solar cell is {} battery supplying {}".format(round((self.state/self.capacity)*100, 2), self.power_supply)


            



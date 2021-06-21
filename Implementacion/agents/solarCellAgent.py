
class solarCellAgent():
    def __init__(self, num_cells = 162, power_supply = 413, state = 100.0):
        """
        Initialise a solar cell agent

        :param num_cells: Num of unit in the solar cell. 
        :param state: available battery percentage
        :param power_supply
        :return: returns nothing
        """
        self.state = state
        self.power_supply = power_supply * num_cells

    def charge(self):
        """
            Charge the battery, 10% per hour.
        """
        self.state = min(100.0, self.state + 10.0)

    def discharge(self):
        """
            Discharge the battery, 10% per battery. If battery has not enough power to supply, it takes the % corresponding.
            :return % of the power supply in an hour.

        """
        v = min(0.0, self.state - 10.0)
        p = 1.00
        if self.state - v != 10.0:
            p = 10.0 - (self.state - v)
        return p * self.power_supply

    def printStatus(self):
        """
        Return the actual solar cell status
        """
        return "Solar cell is {} battery supplying {}".format(self.state, self.power_supply)


            



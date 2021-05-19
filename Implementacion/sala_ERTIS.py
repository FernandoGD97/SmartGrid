#IMPORTS
import random
import time
import math

#VARS



class Sala():
    
    def __init__(self, employees):
        self.employees = employees

    def addWorker(self, name, days):
        self.employees[name] = days
    def listOfemployees(self):
        return self.employees
    def air_conditioning(self, temp, air_temp):
        v = random.randint(1,100)
        val = 0
        
        ventilation_consumption=16350
        if air_temp == -1:
            if temp > 30.0:
                # High temp
                if v > 80:
                    val+= ventilation_consumption*1.24
                    air_temp = 3
                    print("Air conditioning is ON working +-", air_temp, "ªC")
                elif v > 60 and  v <= 80:
                    air_temp = 2
                    val+= ventilation_consumption*1.16
                    print("Air conditioning is ON working +-", air_temp, "ªC")
                elif v > 40 and v <= 60:
                    val+= ventilation_consumption*1.08
                    air_temp = 1
                    print("Air conditioning is ON working +-", air_temp, "ªC")
                elif v > 20 and v <= 40:
                    print("Air conditioning is ON working")
                    val+= ventilation_consumption
                    air_temp = 0
                
                else:
                    print("Air conditioning carry on off")
                    air_temp = -1

            elif temp < 15.0:
                # Low temp
                
                if v > 80:
            
                    val+= ventilation_consumption*1.24
                    air_temp = 3
                    print("Air conditioning is ON working +-", air_temp, "ªC")
                elif v > 60 and  v <= 80:
                    
                    val+= ventilation_consumption*1.16
                    air_temp= 2
                    print("Air conditioning is ON working +-", air_temp, "ªC")
                elif v > 40 and v <= 60:
                    
                    val+= ventilation_consumption*1.08
                    air_temp = 1
                    print("Air conditioning is ON working +-", air_temp, "ªC")

                elif v > 20 and v <= 40:
                    print("Air conditioning is ON working")
                    val+= ventilation_consumption
                    air_temp = 0

                else:
                    print("Air conditioning carry on off")
                    air_temp=-1

            else:
                if v > 90:
                    air_temp = 1
                    print("Air conditioning is ON working +-", air_temp, "ªC")
                    val+= ventilation_consumption*1.08
                    
                elif v > 75 and v <= 90:
                    print("Air conditioning is ON working")
                    val += ventilation_consumption
                    air_temp = 0
                else:
                    print("Air conditioning carry on off")
                    air_temp = -1
        else:
            if air_temp == 3:
                if v < 90:
                    air_temp = -1
                    print("Air conditioning is off")
                else:
                    print("Air conditioning carry on working +-", air_temp, "ªC")
            elif air_temp == 2:
                if v < 80:
                    air_temp = -1
                    print("Air conditioning is off")
                else:
                    print("Air conditioning carry on working +-", air_temp, "ªC")
            elif air_temp == 1:
                if v < 70:
                    air_temp = -1
                    print("Air conditioning is off")
                else:
                    print("Air conditioning carry on working +-", air_temp, "ªC")


            
            print("Air conditioning is off")
        return val, air_temp

    def updateDate(self,hour, day, month, year, month_consumption):
        month_days=[31,28,31,30,31,30,31,31,30,31,30,31]
        if hour%24 == 0:
            day+=1

        if day == month_days[month%12]:
            print("Month consumption: ", month_consumption)
            month_consumption = 0
            month += 1
            day = 0
            if month%12 == 0:
                year+=1
                month=0
        return hour,day, month,year,month_consumption
            
            




    def loop(self):
        hour = 0
        month = 0
        day = 0
        year = 2020
        temp_air_conditioning = -1
        occupancy = 0
        print(self.listOfemployees())
        workers = []
        month_consumption=0
        computer_consumption=200
       
        temp = random.uniform(10.0,35.0)
        
        while True:
            
            print("Year: {}, Month: {}, Day: {}, Hour: {}, Temp: {}".format(str(year), str(month+1),str(day+1), str(hour%24), str(round(temp,2))))
            if (day%7)<5:
                if hour%24==9:
                    for employee in self.employees:
                        v = random.randint(1,100)
                     
                        p = self.employees[employee][day%7]
                        if v < p*100:
                            occupancy+=1
                            workers.append(employee)
                            self.employees[employee][day%7]+=0.005
                            print("{} decide to go today, v = {}".format(employee, v), occupancy)
                        else:
                            self.employees[employee][day%7]-=0.005
                            print("{} did not to go today, , v = {}".format(employee,v), occupancy)
                    
                    month_consumption += occupancy*computer_consumption

                if occupancy>=1:
                    inc,temp_air_conditioning=self.air_conditioning(temp, temp_air_conditioning)
                    month_consumption+=inc             

                    if hour%24>=13:
                    
                        if hour%24==18:
                            occupancy = 0
                            workers = []
                            print("The work day is over", occupancy)
                        for worker in workers:
                            v = random.randint(1,100)
                            if(v >= 60):
                                occupancy-=1
                                workers.remove(worker)
                                print("{} has finished his working day".format(worker), occupancy)
                        

            
            hour+=1
            temp = random.uniform(10.0,35.0)
            hour, day,month, year, month_consumption = self.updateDate(hour, day, month, year, month_consumption)
            time.sleep(0.25)

def main():
    s = Sala(dict())
    s.addWorker("Fernando", [0.6,0.6,0.6,0.4,0.4,0.,0.])
    s.addWorker("Dani", [0.6,0.6,0.6,0.4,0.4,0.,0.])
    s.addWorker("Cristian", [0.6,0.4,0.4,0.6,0.6,0.,0.])
    s.addWorker("Alejandro", [0.4,0.6,0.4,0.6,0.6,0.,0.])
    s.addWorker("Javier", [0.2,0.2,0.2,0.2,0.6,0.,0.])
    s.addWorker("Antonio", [0.4,0.6,0.6,0.6,0.4,0.,0.])
    s.addWorker("Pilar", [0.6,0.6,0.4,0.6,0.6,0.,0.])
    s.loop()
    

if __name__ == "__main__":
    main()

        
    


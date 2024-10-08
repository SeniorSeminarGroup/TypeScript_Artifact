/* TimeInterval type to specify a length of time */
type TimeInterval = {
    hours: number;
    minutes: number;
    seconds: number;
};

class Timer {
    intervalID: number = -1;
    workTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
    breakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
    isWorkTime: boolean = true;
    currentInterval: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
    clock = document.querySelector<HTMLSpanElement>('#clock-time')

    constructor(workTime: TimeInterval, breakTime: TimeInterval) {
        this.workTime = workTime;
        this.breakTime = breakTime;
    }

    start(){
        this.intervalID = setInterval(() => this.clockCountDown(), 1000); // 
        this.clockCountDown();
    }

    stop() {
        clearInterval(this.intervalID);
        this.intervalID = -1
    }

    reset() {

    }

    switchInterval() {
        if (this.isWorkTime) {
            this.isWorkTime = false
            this.currentInterval = this.breakTime
        } else {
            this.isWorkTime = true
            this.currentInterval = this.workTime
        }
    }

    getTime(): TimeInterval {
        return this.currentInterval
    }

    /* 
    Functionally this is a countDown timer.
    It needs a timer interval which is a TimeInterval type to countdown from.
    MUST INCLUDE an intervalID which points back to the setInterval that is calling it
    */
    clockCountDown() {
        this.clock!.innerHTML = this.formatTime(this.currentInterval)
        if (this.currentInterval.seconds > 0) {
            this.currentInterval.seconds = this.currentInterval.seconds - 1
        } else if (this.currentInterval.minutes > 0) {
            this.currentInterval.minutes = this.currentInterval.minutes - 1
            this.currentInterval.seconds = 59
        } else if (this.currentInterval.hours > 0) {
            this.currentInterval.hours = this.currentInterval.hours - 1
            this.currentInterval.minutes = 59
            this.currentInterval.seconds = 59
        } else { // current time interval finished 
            // end the timer interval
            this.stop()
            // switch time interval type
            this.switchInterval()
        }
    }

    /* 
    Formats time into a string, accepts the TimeInterval type. 
    Please use this when you want to display the time
    */
    formatTime(time: TimeInterval): string {
        const hourString: string = (time.hours > 9) ? String(time.hours) : '0' + time.hours
        const minutesString: string = (time.minutes > 9) ? String(time.minutes) : '0' + time.minutes
        const secondsString: string = (time.seconds > 9) ? String(time.seconds) : '0' + time.seconds

        return hourString + ":" + minutesString + ":" + secondsString
    }
}

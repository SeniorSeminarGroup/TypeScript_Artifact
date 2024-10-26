/* 
Formats time into a string, accepts the TimeInterval type. 
Please use this when you want to display the time
*/
/* Timeinterval type to specify a length of time */
export type TimeInterval = {
    hours: number,
    minutes: number,
    seconds: number
  }
  
export function formatTime(time: TimeInterval): string
{
const hourString: string = (time.hours > 9)? String(time.hours): '0'+time.hours
const minutesString: string = (time.minutes > 9)? String(time.minutes): '0'+time.minutes
const secondsString: string = (time.seconds > 9)? String(time.seconds): '0'+time.seconds

return hourString + ":" + minutesString + ":" + secondsString
}

export function toSeconds(time: TimeInterval): number {
  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

export function fromSeconds(totalSeconds: number): TimeInterval {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}


import fs from 'fs'
import path from 'path'
import axios, { AxiosResponse } from 'axios'

const LOGS_DIRECTORY: string = 'logs';
const ERROR_LOG_FILE: string = 'error-log.txt';
const TIME_API_ENDPOINT: string = 'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta';

type TimeResponse = {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    seconds: number
}

/**
 * Retrieve Indonesia time from timeapi.io
 * @return {Promise<string>}
 */
const retrieveIndonesiaTime = async (): Promise<string> => {
    try {
        const response: AxiosResponse = await axios.get(TIME_API_ENDPOINT);
        const time: TimeResponse = response.data;

        return `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}:${time.seconds}`;
    } catch (error) {
        return `NO_ESTABLISHED_TIME`;
    }
}

/**
 * Log the error message to the file
 * @param message The error message to be logged
 */
const logError = async (message: string) => {
    const dateTime = await retrieveIndonesiaTime();
    message = `[${dateTime}] - ${message}\n`

    fs.appendFile(path.join(LOGS_DIRECTORY, ERROR_LOG_FILE), message, _ => { });
}

/**
 * Get the log
 * @param logFile Log file, take from available log files exported from logger
 * @return {string}
 */
const fetchLog = (logFile: string): string => {
    return fs.readFileSync(path.join(LOGS_DIRECTORY, logFile), 'utf-8');
}

/**
 * Clear the reserved log file data  
 * @param logFile Log file, take from available log files exported from logger
 */
const clearLog = (logFile: string) => {
    return fs.writeFileSync(path.join(LOGS_DIRECTORY, logFile), '', 'utf-8');
}

export {
    logError,
    fetchLog,
    clearLog,
    ERROR_LOG_FILE
}
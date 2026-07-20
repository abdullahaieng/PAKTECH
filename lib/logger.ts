enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

class Logger {
  private isDev = process.env.NODE_ENV === "development";
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, service, message, details } = entry;
    const detailsStr = details ? ` ${JSON.stringify(details)}` : "";
    return `[${timestamp}] ${level} [${service}] ${message}${detailsStr}`;
  }

  private createEntry(
    level: LogLevel,
    service: string,
    message: string,
    details?: Record<string, unknown>,
    stack?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service,
      message,
      details,
      stack,
    };
  }

  debug(service: string, message: string, details?: Record<string, unknown>) {
    const entry = this.createEntry(LogLevel.DEBUG, service, message, details);
    if (this.isDev) console.debug(this.formatLog(entry));
    this.addLog(entry);
  }

  info(service: string, message: string, details?: Record<string, unknown>) {
    const entry = this.createEntry(LogLevel.INFO, service, message, details);
    console.log(this.formatLog(entry));
    this.addLog(entry);
  }

  warn(service: string, message: string, details?: Record<string, unknown>) {
    const entry = this.createEntry(LogLevel.WARN, service, message, details);
    console.warn(this.formatLog(entry));
    this.addLog(entry);
  }

  error(service: string, message: string, error?: Error, details?: Record<string, unknown>) {
    const entry = this.createEntry(LogLevel.ERROR, service, message, details, error?.stack);
    console.error(this.formatLog(entry));
    if (error) console.error(error);
    this.addLog(entry);
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getLogs(filter?: { level?: LogLevel; service?: string }): LogEntry[] {
    return this.logs.filter((log) => {
      if (filter?.level && log.level !== filter.level) return false;
      if (filter?.service && log.service !== filter.service) return false;
      return true;
    });
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

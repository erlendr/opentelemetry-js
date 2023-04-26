import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogsExporter } from '@opentelemetry/exporter-logs-otlp-http';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>
<h1>Example of using logs with OTLP Logs Exporter</h1>
<button>Log</button>
</div>
`;

// Optional and only needed to see the internal diagnostic logging (during development)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()));
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new OTLPLogsExporter()));

logs.setGlobalLoggerProvider(loggerProvider);

const logger = logs.getLogger('example', '1.0.0');

const button = document.querySelector('button');
button!.addEventListener('click', ()=> {
  // emit a log record
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: `this is a log record body - ${new Date()}`,
    attributes: { 'log.type': 'custom' },
  });
});

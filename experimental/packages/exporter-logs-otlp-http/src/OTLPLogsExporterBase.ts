/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ExportResult } from '@opentelemetry/core';
import { OTLPExporterBase } from '@opentelemetry/otlp-exporter-base';
import { ReadableLogRecord } from '@opentelemetry/sdk-logs';

import { IExportLogsServiceRequest } from 'otlp-transformer';

import { OTLPLogsExporterOptions } from './OTLPLogsExporterOptions';

export class OTLPLogsExporterBase<
  T extends OTLPExporterBase<
    OTLPLogsExporterOptions,
    ReadableLogRecord,
    IExportLogsServiceRequest
  >
> {
  public _otlpExporter: T;

  constructor(exporter: T, config?: OTLPLogsExporterOptions) {
    this._otlpExporter = exporter;
  }

  export(
    logs: ReadableLogRecord[],
    resultCallback: (result: ExportResult) => void
  ): void {
    this._otlpExporter.export(logs, resultCallback);
  }

  async shutdown(): Promise<void> {
    await this._otlpExporter.shutdown();
  }

  forceFlush(): Promise<void> {
    return Promise.resolve();
  }
}

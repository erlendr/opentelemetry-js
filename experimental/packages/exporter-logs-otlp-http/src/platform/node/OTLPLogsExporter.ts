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

import { getEnv, baggageUtils } from '@opentelemetry/core';
import {
  OTLPExporterNodeBase,
  OTLPExporterNodeConfigBase,
  appendResourcePathToUrl,
  appendRootPathToUrlIfNeeded,
} from '@opentelemetry/otlp-exporter-base';
import { ReadableLogRecord } from '@opentelemetry/sdk-logs';

import {
  createExportLogsServiceRequest,
  IExportLogsServiceRequest,
} from '@opentelemetry/otlp-transformer';

import { OTLPLogsExporterOptions } from '../../OTLPLogsExporterOptions';
import { OTLPLogsExporterBase } from '../../OTLPLogsExporterBase';

const DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/logs';
const DEFAULT_COLLECTOR_URL = `http://localhost:4318/${DEFAULT_COLLECTOR_RESOURCE_PATH}`;

class OTLPExporterNodeProxy extends OTLPExporterNodeBase<
  ReadableLogRecord,
  IExportLogsServiceRequest
> {
  constructor(config?: OTLPExporterNodeConfigBase & OTLPLogsExporterOptions) {
    super(config);
    this.headers = Object.assign(
      this.headers,
      baggageUtils.parseKeyPairsIntoRecord(
        getEnv().OTEL_EXPORTER_OTLP_LOGS_HEADERS
      )
    );
  }

  convert(logs: ReadableLogRecord[]): IExportLogsServiceRequest {
    return createExportLogsServiceRequest(logs);
  }

  getDefaultUrl(config: OTLPExporterNodeConfigBase): string {
    return typeof config.url === 'string'
      ? config.url
      : getEnv().OTEL_EXPORTER_OTLP_LOGS_ENDPOINT.length > 0
      ? appendRootPathToUrlIfNeeded(getEnv().OTEL_EXPORTER_OTLP_LOGS_ENDPOINT)
      : getEnv().OTEL_EXPORTER_OTLP_ENDPOINT.length > 0
      ? appendResourcePathToUrl(
          getEnv().OTEL_EXPORTER_OTLP_ENDPOINT,
          DEFAULT_COLLECTOR_RESOURCE_PATH
        )
      : DEFAULT_COLLECTOR_URL;
  }
}

/**
 * Collector Logs Exporter for Node
 */
export class OTLPLogsExporter extends OTLPLogsExporterBase<OTLPExporterNodeProxy> {
  constructor(config?: OTLPExporterNodeConfigBase & OTLPLogsExporterOptions) {
    super(new OTLPExporterNodeProxy(config), config);
  }
}

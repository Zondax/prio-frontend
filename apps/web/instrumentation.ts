// Server-side instrumentation using @zondax/otel-web
// This file runs ONLY on the server (Node.js), never in the browser

import { registerOTel, getOTelServerConfig, DiagConsoleLogger, diag, getLogLevel } from '@zondax/otel-web/server'

diag.setLogger(new DiagConsoleLogger(), getLogLevel())

export function register() {
  registerOTel(getOTelServerConfig())
}

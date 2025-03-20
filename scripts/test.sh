#!/bin/bash

set -e

pnpm -F react-example install
pnpm -F react-example exec playwright install
pnpm -F react-example test

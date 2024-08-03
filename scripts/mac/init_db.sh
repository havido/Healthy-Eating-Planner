#!/bin/bash

# Load environment variables from .env file
cd $(dirname $0)
source ../../.env

# Run the SQL script using the loaded variables
sqlplus $ORACLE_USER/$ORACLE_PASS@//$ORACLE_HOST:$ORACLE_PORT/$ORACLE_DBNAME @../../scriptFinal.sql


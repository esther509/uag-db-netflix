@echo off
set PGPASSWORD=admin
psql -d uag-db-netflix -w -f scripts\create.sql

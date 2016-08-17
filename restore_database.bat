@echo off
set PGPASSWORD=admin
psql -d uag-db-netflix -w -f scripts\remove.sql
pg_restore -d uag-db-netflix e310d5c3-b725-49a8-beb5-7def1dd0ecda

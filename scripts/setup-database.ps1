# Shukla Industrial — PostgreSQL setup script (Windows)
# Usage: powershell -ExecutionPolicy Bypass -File scripts\setup-database.ps1
#
# Requires PostgreSQL installed and psql in PATH.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

$DbUser = "shukla_user"
$DbPass = "shukla_pass"
$DbName = "shukla_industrial"
$PostgresUser = "postgres"

Write-Host "Shukla Industrial — Database Setup" -ForegroundColor Cyan

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: psql not found. Install PostgreSQL and add bin folder to PATH." -ForegroundColor Red
    Write-Host "Example: C:\Program Files\PostgreSQL\16\bin"
    exit 1
}

Write-Host "Creating user and database (if not exists)..."
$env:PGPASSWORD = Read-Host "Enter PostgreSQL superuser ($PostgresUser) password"

psql -U $PostgresUser -c "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbUser') THEN CREATE USER $DbUser WITH PASSWORD '$DbPass'; END IF; END `$`$;"
psql -U $PostgresUser -tc "SELECT 1 FROM pg_database WHERE datname = '$DbName'" | findstr /C:"1" > $null
if ($LASTEXITCODE -ne 0) {
    psql -U $PostgresUser -c "CREATE DATABASE $DbName OWNER $DbUser;"
}

Write-Host "Running schema.sql..."
$env:PGPASSWORD = $DbPass
psql -U $DbUser -d $DbName -f "$Root\database\schema.sql"

Write-Host "Running seed.sql..."
psql -U $DbUser -d $DbName -f "$Root\database\seed.sql"

Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "Connection: postgresql://${DbUser}:${DbPass}@localhost:5432/${DbName}"

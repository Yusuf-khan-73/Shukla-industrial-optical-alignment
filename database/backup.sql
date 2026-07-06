-- ============================================================
-- Shukla Industrial — Database Backup Reference
-- Location: database/backup.sql
-- ============================================================

-- Create a full backup:
--   pg_dump -U shukla_user -h localhost -d shukla_industrial -F c -f database\backups\shukla_backup.dump
--
-- Restore from backup:
--   pg_restore -U shukla_user -h localhost -d shukla_industrial --clean --if-exists database\backups\shukla_backup.dump

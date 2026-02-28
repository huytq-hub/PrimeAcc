@echo off
echo Running Prisma Migration for Referral System...
echo.

cd /d "%~dp0"

echo Step 1: Running migration...
call npm run prisma:migrate

echo.
echo Step 2: Generating Prisma Client...
call npm run prisma:generate

echo.
echo Migration completed!
echo.
echo Next steps:
echo 1. Restart your backend server
echo 2. Test the /referral endpoints
echo 3. Check the Partnership page in frontend
echo.
pause

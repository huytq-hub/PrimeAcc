@echo off
echo Generating Prisma Client...
call npx prisma generate
echo.
echo Done! Prisma client has been generated.
pause

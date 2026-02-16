@echo off
REM Diagnostic Script for Memory Issues
REM Run this to get memory information about running processes

echo.
echo ===============================================
echo   MEMORY DIAGNOSTIC REPORT
echo ===============================================
echo.

echo [1] Checking for running Node processes...
echo.
wmic process where name="node.exe" get name,ProcessId,WorkingSetSize /format:list

echo.
echo [2] Top 5 memory-consuming processes...
echo.
wmic process list brief /format:list | findstr "WorkingSetSize" | sort /r | findstr /N .

echo.
echo [3] Chrome instances...
echo.
tasklist | findstr chrome

echo.
echo [4] Virtual Memory Usage...
echo.
wmic OS get TotalVirtualMemorySize,TotalVisibleMemorySize,FreePhysicalMemory /format:list

echo.
echo ===============================================
echo   RECOMMENDED NEXT STEPS:
echo ===============================================
echo.
echo 1. If you see multiple "node.exe" processes:
echo    Run: taskkill /F /IM node.exe
echo.
echo 2. Then restart dev server:
echo    cd c:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean
echo    npm run dev
echo.
echo 3. Open Task Manager (Ctrl+Shift+Esc) and monitor node.exe memory
echo.
echo 4. Open http://localhost:8080/ and test memory usage
echo.
echo ===============================================

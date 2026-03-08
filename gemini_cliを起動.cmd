@echo off
setlocal
:: 文字化けを防ぐためにUTF-8モードに設定
chcp 65001 > nul

echo Gemini CLI を起動しています (日本語モード)...
echo.

:: geminiコマンドを実行（もしパスが通っていない場合は npx @google/gemini-cli）
call gemini

pause

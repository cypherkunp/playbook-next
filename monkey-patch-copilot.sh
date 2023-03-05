_VSCODEDIR="$HOME/.vscode/extensions"
_COPILOTDIR=$(ls "${_VSCODEDIR}" | grep -E "github.copilot-[1-9].*" | sort -V | tail -n1) # For copilot
_EXTENSIONFILEPATH="${_VSCODEDIR}/${_COPILOTDIR}/dist/extension.js"
_DEVEXTENSIONFILEPATH="${_VSCODEDIR}/${_COPILOTDEVDIR}/dist/extension.js"
if [[ -f "$_EXTENSIONFILEPATH" ]]; then
    echo "Found Copilot Extension, applying 'rejectUnauthorized' patches to '$_EXTENSIONFILEPATH'..."
    perl -pi -e 's/,rejectUnauthorized:[a-z]}(?!})/,rejectUnauthorized:false}/g' ${_EXTENSIONFILEPATH}
    sed -i.bak 's/d={...l,/d={...l,rejectUnauthorized:false,/g' ${_EXTENSIONFILEPATH}
else
    echo "Couldn't find the extension.js file for Copilot, please verify paths and try again or ignore if you don't have Copilot..."
fi

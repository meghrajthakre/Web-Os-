const output = document.getElementById("terminalOutput");

// Function to create a new input line
function createNewInput() {
    const inputLine = document.createElement("div");
    inputLine.className = "terminal-input-line";

    const promptSpan = document.createElement("span");
    promptSpan.className = "prompt";
    promptSpan.textContent = "guest@webos:~$";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.autofocus = true;
    input.style.background = "transparent";
    input.style.border = "none";
    input.style.color = "#00ff00";
    input.style.outline = "none";
    input.style.width = "100%";
    input.style.fontSize = "16px";
    input.style.caretColor = "#00ff00";
    input.style.fontFamily = "monospace";

    inputLine.appendChild(promptSpan);
    inputLine.appendChild(input);
    output.appendChild(inputLine);

    input.focus();

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const command = input.value.trim();
            runCommand(command, inputLine);
        }
    });

    output.scrollTop = output.scrollHeight;
}

// Updated runCommand to support multiple lines
function runCommand(cmd, inputLine) {
    // Disable the old input
    const input = inputLine.querySelector("input");
    input.disabled = true;

    let result = "";

    if (cmd === "help") {
        result = "Available commands: help, clear, about, echo";
    } else if (cmd === "clear") {
        output.innerHTML = "";
        createNewInput();
        return;
    } else if (cmd === "about") {
        result = "WebOS Terminal v1.0 by Meghraj Thakre";
    } else if (cmd.startsWith("echo ")) {
        result = cmd.slice(5);
    } else if (cmd === "") {
        result = "";
    } else {
        result = `Command not found: ${cmd}`;
    }

    if (result !== "") {
        const resultDiv = document.createElement("div");
        resultDiv.textContent = result;
        output.appendChild(resultDiv);
    }

    createNewInput(); // 👈 Creates next input at bottom
}
